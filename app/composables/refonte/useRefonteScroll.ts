import type { InjectionKey } from 'vue'
import type LocomotiveScroll from 'locomotive-scroll'
import type { Controller, Scene } from 'scrollmagic'

export interface RefonteScrollApi {
  scroll: Ref<LocomotiveScroll | null>
  controller: Ref<Controller | null>
  ready: Ref<boolean>
  addScene: (options: RefonteSceneOptions) => void
  refresh: () => void
  scrollTo: (target: string | number | HTMLElement) => void
  destroy: () => void
}

export interface RefonteSceneOptions {
  trigger: Ref<HTMLElement | null>
  onEnter?: () => void
  onProgress?: (progress: number) => void
  duration?: string | number
  pin?: boolean
}

export const REFONTE_SCROLL_KEY: InjectionKey<RefonteScrollApi> = Symbol('refonte-scroll')

const INERT: RefonteScrollApi = {
  scroll: ref(null),
  controller: ref(null),
  ready: ref(false),
  addScene: () => {},
  refresh: () => {},
  scrollTo: () => {},
  destroy: () => {}
}

export function provideRefonteScroll(): RefonteScrollApi {
  const scroll = ref<LocomotiveScroll | null>(null)
  const controller = ref<Controller | null>(null)
  const ready = ref(false)
  const pendingScenes: RefonteSceneOptions[] = []
  const mountedScenes: Scene[] = []
  let SceneCtor: typeof Scene | null = null

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

  async function init() {
    if (!import.meta.client) return

    SceneCtor = (await import('scrollmagic')).Scene
    controller.value = new (await import('scrollmagic')).Controller()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready.value = true
      pendingScenes.splice(0).forEach(mountScene)
      return
    }

    const { default: LocomotiveScrollCtor } = await import('locomotive-scroll')

    scroll.value = new LocomotiveScrollCtor({
      lenisOptions: {
        smoothWheel: true,
        lerp: 0.1,
        duration: 1.1
      },
      autoStart: true
    })

    const lenis = scroll.value.lenisInstance
    lenis.on('scroll', ({ scroll: pos }) => {
      controller.value?.scrollPos(pos)
      controller.value?.update(true)
    })

    pendingScenes.splice(0).forEach(mountScene)
    ready.value = true

    requestAnimationFrame(() => scroll.value?.resize())
  }

  const api: RefonteScrollApi = {
    scroll,
    controller,
    ready,
    addScene: (opts) => {
      if (ready.value) mountScene(opts)
      else pendingScenes.push(opts)
    },
    refresh: () => {
      scroll.value?.resize()
      controller.value?.update(true)
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
    destroy: () => {
      mountedScenes.forEach((scene) => scene.destroy(true))
      mountedScenes.length = 0
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
