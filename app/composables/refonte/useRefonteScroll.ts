import type { InjectionKey } from 'vue'
import type LocomotiveScroll from 'locomotive-scroll'
import type { Controller, Scene } from 'scrollmagic'

export interface RefonteScrollApi {
  scroll: Ref<LocomotiveScroll | null>
  controller: Ref<Controller | null>
  ready: Ref<boolean>
  scrollProgress: Ref<number>
  activeChapter: Ref<string>
  cursor: Ref<{ x: number; y: number }>
  addScene: (options: RefonteSceneOptions) => void
  bindScrollScrub: (options: RefonteScrubOptions) => () => void
  refresh: () => void
  scrollTo: (target: string | number | HTMLElement) => void
  scrollToTop: (immediate?: boolean) => void
  destroy: () => void
}

export interface RefonteSceneOptions {
  trigger: Ref<HTMLElement | null>
  onEnter?: () => void
  onProgress?: (progress: number) => void
  duration?: string | number
  pin?: boolean
}

export interface RefonteScrubOptions {
  trigger: HTMLElement
  targets: Element | Element[]
  from?: Record<string, unknown>
  to: Record<string, unknown>
  start?: string
  end?: string
}

export const REFONTE_SCROLL_KEY: InjectionKey<RefonteScrollApi> = Symbol('refonte-scroll')

const INERT: RefonteScrollApi = {
  scroll: ref(null),
  controller: ref(null),
  ready: ref(false),
  scrollProgress: ref(0),
  activeChapter: ref('Intro'),
  cursor: ref({ x: 0, y: 0 }),
  addScene: () => {},
  bindScrollScrub: () => () => {},
  refresh: () => {},
  scrollTo: () => {},
  scrollToTop: () => {},
  destroy: () => {}
}

export function provideRefonteScroll(): RefonteScrollApi {
  const scroll = ref<LocomotiveScroll | null>(null)
  const controller = ref<Controller | null>(null)
  const ready = ref(false)
  const scrollProgress = ref(0)
  const activeChapter = ref('Intro')
  const cursor = ref({ x: 0, y: 0 })

  const pendingScenes: RefonteSceneOptions[] = []
  const mountedScenes: Scene[] = []
  const scrubCleanups: Array<() => void> = []
  let SceneCtor: typeof Scene | null = null
  let chapterObserver: IntersectionObserver | null = null
  let scrollTriggerModule: typeof import('gsap/ScrollTrigger') | null = null
  let lenisProxyReady = false
  let onMouseMove: ((e: MouseEvent) => void) | null = null
  let onResizeChapters: (() => void) | null = null

  function updateScrollProgress(pos: number) {
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    scrollProgress.value = Math.min(Math.max(pos / max, 0), 1)
  }

  function mountScene(opts: RefonteSceneOptions) {
    if (!opts.trigger.value || !controller.value || !SceneCtor) return

    const scene = new SceneCtor({
      triggerElement: opts.trigger.value,
      triggerHook: 0.12,
      duration: opts.duration ?? '70%',
      pin: opts.pin ?? false
    })

    if (opts.onEnter) scene.on('enter', opts.onEnter)
    if (opts.onProgress) {
      scene.on('progress', (e: unknown) => {
        const event = e as { progress: number }
        opts.onProgress?.(event.progress)
      })
    }

    scene.addTo(controller.value)
    mountedScenes.push(scene)
  }

  function bindChapterObserver() {
    chapterObserver?.disconnect()

    const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-rf-chapter]'))
    if (!chapters.length) return

    chapterObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const top = visible[0]?.target as HTMLElement | undefined
        if (top?.dataset.rfChapter) activeChapter.value = top.dataset.rfChapter
      },
      { threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: '-20% 0px -45% 0px' }
    )

    chapters.forEach((el) => chapterObserver!.observe(el))
  }

  async function initScrollTrigger() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (!scrollTriggerModule) {
      scrollTriggerModule = await import('gsap/ScrollTrigger')
      const { gsap } = await import('gsap')
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger)
    }

    const lenis = scroll.value?.lenisInstance
    const { ScrollTrigger } = scrollTriggerModule

    if (lenis && !lenisProxyReady) {
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value, { immediate: true })
          }
          return lenis.scroll
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      })

      ScrollTrigger.defaults({ scroller: document.documentElement })
      lenisProxyReady = true
    }
  }

  async function bindScrollScrub(options: RefonteScrubOptions): Promise<() => void> {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

    if (!scrollTriggerModule) await initScrollTrigger()
    if (!scrollTriggerModule) return () => {}

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = scrollTriggerModule
    const targets = Array.isArray(options.targets) ? options.targets : [options.targets]

    const tween = gsap.fromTo(
      targets,
      options.from ?? {},
      {
        ...options.to,
        ease: 'none',
        scrollTrigger: {
          trigger: options.trigger,
          start: options.start ?? 'top 80%',
          end: options.end ?? 'bottom 20%',
          scrub: 0.65
        }
      }
    )

    const cleanup = () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
    scrubCleanups.push(cleanup)
    return cleanup
  }

  async function init() {
    if (!import.meta.client) return

    SceneCtor = (await import('scrollmagic')).Scene
    controller.value = new (await import('scrollmagic')).Controller()

    onMouseMove = (e: MouseEvent) => {
      cursor.value = {
        x: Math.round(e.clientX),
        y: Math.round(e.clientY)
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready.value = true
      pendingScenes.splice(0).forEach(mountScene)
      nextTick(() => bindChapterObserver())
      return
    }

    const { default: LocomotiveScrollCtor } = await import('locomotive-scroll')

    scroll.value = new LocomotiveScrollCtor({
      lenisOptions: {
        smoothWheel: true,
        lerp: 0.16,
        duration: 0.65
      },
      autoStart: true
    })

    const lenis = scroll.value.lenisInstance
    lenis.on('scroll', ({ scroll: pos }) => {
      controller.value?.scrollPos(pos)
      controller.value?.update(true)
      updateScrollProgress(pos)
      scrollTriggerModule?.ScrollTrigger.update()
    })

    await initScrollTrigger()
    pendingScenes.splice(0).forEach(mountScene)
    ready.value = true

    nextTick(() => {
      bindChapterObserver()
      onResizeChapters = () => bindChapterObserver()
      window.addEventListener('resize', onResizeChapters, { passive: true })
    })

    requestAnimationFrame(() => scroll.value?.resize())
  }

  const api: RefonteScrollApi = {
    scroll,
    controller,
    ready,
    scrollProgress,
    activeChapter,
    cursor,
    addScene: (opts) => {
      if (ready.value) mountScene(opts)
      else pendingScenes.push(opts)
    },
    bindScrollScrub: (opts) => {
      let cleanup: (() => void) | null = null
      bindScrollScrub(opts).then((fn) => { cleanup = fn })
      return () => cleanup?.()
    },
    refresh: () => {
      scroll.value?.resize()
      controller.value?.update(true)
      scrollTriggerModule?.ScrollTrigger.refresh()
      bindChapterObserver()
    },
    scrollTo: (target) => {
      if (scroll.value) {
        scroll.value.scrollTo(target, { duration: 900 })
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else if (typeof target === 'string') {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    },
    scrollToTop: (immediate = true) => {
      try {
        if (scroll.value) {
          scroll.value.scrollTo(0, { duration: immediate ? 0 : 900 })
        }
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        scrollProgress.value = 0
        controller.value?.scrollPos(0)
        controller.value?.update(true)
      } catch {
        window.scrollTo(0, 0)
        scrollProgress.value = 0
      }
    },
    destroy: () => {
      mountedScenes.forEach((scene) => scene.destroy(true))
      mountedScenes.length = 0
      scrubCleanups.splice(0).forEach((fn) => fn())
      chapterObserver?.disconnect()
      chapterObserver = null
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
      if (onResizeChapters) window.removeEventListener('resize', onResizeChapters)
      scrollTriggerModule?.ScrollTrigger.getAll().forEach((st) => st.kill())
      scroll.value?.destroy()
      controller.value?.destroy(true)
      scroll.value = null
      controller.value = null
      ready.value = false
    }
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => api.destroy())

  provide(REFONTE_SCROLL_KEY, api)
  return api
}

export function useRefonteScroll(): RefonteScrollApi {
  return inject(REFONTE_SCROLL_KEY, INERT)
}
