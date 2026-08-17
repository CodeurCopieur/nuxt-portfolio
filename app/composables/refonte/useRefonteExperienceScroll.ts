import type { MaybeRefOrGetter } from 'vue'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

export interface RefonteExperienceScrollOptions {
  scrollerRef: MaybeRefOrGetter<HTMLElement | null>
  trackRef: MaybeRefOrGetter<HTMLElement | null>
  itemCount: MaybeRefOrGetter<number>
  onIndexChange?: (index: number) => void
  enabled?: MaybeRefOrGetter<boolean>
}

/** Pixels de scroll vertical par expérience (~4 “temps” de lecture) */
const SCROLL_PER_XP = 640

function getNavOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--rf-nav-h').trim()
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 72
}

function getOffsetTop(el: HTMLElement) {
  let top = 0
  let node: HTMLElement | null = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

/**
 * Chaque expérience occupe 1/count du scroll — aligné avec les N cartes égales.
 * (Avant : p * (count-1) → la barre passait sur la carte 2 alors que le détail restait sur 1.)
 */
function getSegment(p: number, count: number) {
  if (count <= 1) return { index: 0, frac: p }
  if (p >= 0.999) return { index: count - 1, frac: 1 }
  const scaled = Math.min(Math.max(p, 0), 1) * count
  const index = Math.min(count - 1, Math.floor(scaled))
  const frac = Math.min(Math.max(scaled - index, 0), 1)
  return { index, frac }
}

export function useRefonteExperienceScroll(options: RefonteExperienceScrollOptions) {
  const { scroll, ready, refresh } = useRefonteScroll()

  const trackX = ref(0)
  const progress = ref(0)
  const segmentFrac = ref(0)
  const scrollTravel = ref(0)
  const horizontalTravel = ref(0)
  const isPinned = ref(false)

  const progressPercent = computed(() => Math.round(progress.value * 100))
  const isComplete = computed(() => progress.value >= 0.999)

  let lastIndex = -1
  let scrollHandler: ((...args: unknown[]) => void) | null = null
  let resizeHandler: (() => void) | null = null
  let scrollerObserver: ResizeObserver | null = null
  let trackObserver: ResizeObserver | null = null

  function getLenis() {
    return scroll.value?.lenisInstance ?? null
  }

  function measure() {
    const track = toValue(options.trackRef)
    const count = toValue(options.itemCount)

    if (!track || count <= 1) {
      horizontalTravel.value = 0
    } else {
      // Desktop : cartes figées dans le container — pas de translation hors cadre
      horizontalTravel.value = 0
    }

    const steps = count > 1 ? count * SCROLL_PER_XP : 0
    scrollTravel.value = Math.max(steps, 1)
  }

  function getViewportHeight() {
    return window.innerHeight - getNavOffset()
  }

  function readStickyProgress(scroller: HTMLElement) {
    const nav = getNavOffset()
    const viewportH = getViewportHeight()
    const scrolledInto = Math.max(0, nav - scroller.getBoundingClientRect().top)
    const maxScroll = Math.max(scroller.offsetHeight - viewportH, 1)
    return {
      progress: Math.min(scrolledInto / maxScroll, 1),
      maxScroll,
      nav,
      viewportH
    }
  }

  function setIndex(index: number) {
    if (index !== lastIndex) {
      lastIndex = index
      options.onIndexChange?.(index)
    }
  }

  function applyProgress(p: number) {
    const clamped = Math.min(Math.max(p, 0), 1)
    const count = toValue(options.itemCount)
    const { index, frac } = getSegment(clamped, count)

    progress.value = clamped
    segmentFrac.value = frac
    trackX.value = -clamped * horizontalTravel.value
    setIndex(index)
  }

  function update() {
    if (!import.meta.client || !toValue(options.enabled ?? true)) return

    const scroller = toValue(options.scrollerRef)
    const count = toValue(options.itemCount)
    if (!scroller || count <= 0) return

    const { progress: p, nav, viewportH } = readStickyProgress(scroller)
    const rect = scroller.getBoundingClientRect()

    isPinned.value = rect.top <= nav + 4 && rect.bottom > nav + viewportH + 4 && p < 0.999
    applyProgress(p)
  }

  /** Atterrit vers ~¾ du segment : détails déjà bien affichés. */
  function goToIndex(index: number) {
    const scroller = toValue(options.scrollerRef)
    const count = toValue(options.itemCount)
    const lenis = getLenis()
    if (!lenis || !scroller || count <= 1) return

    measure()
    const target = Math.min(Math.max(index, 0), count - 1)
    // Même échelle que getSegment (p * count)
    const p = Math.min((target + 0.72) / count, 0.999)
    const nav = getNavOffset()
    const maxScroll = Math.max(scroller.offsetHeight - getViewportHeight(), scrollTravel.value, 1)
    const scrollerTop = getOffsetTop(scroller)
    lenis.scrollTo(scrollerTop - nav + p * maxScroll, { duration: 0.75 })
  }

  function observeScroller() {
    scrollerObserver?.disconnect()
    const scroller = toValue(options.scrollerRef)
    if (!scroller || typeof ResizeObserver === 'undefined') return

    scrollerObserver = new ResizeObserver(() => {
      measure()
      update()
      refresh()
    })
    scrollerObserver.observe(scroller)
  }

  function observeTrack() {
    trackObserver?.disconnect()
    const track = toValue(options.trackRef)
    if (!track || typeof ResizeObserver === 'undefined') return

    trackObserver = new ResizeObserver(() => {
      measure()
      update()
      refresh()
    })
    trackObserver.observe(track)
  }

  function bind() {
    unbind()
    if (!import.meta.client || !toValue(options.enabled ?? true)) return

    measure()
    applyProgress(0)
    observeScroller()
    observeTrack()
    update()

    scrollHandler = () => update()
    const lenis = getLenis()
    if (lenis && scrollHandler) {
      lenis.on('scroll', scrollHandler)
    } else if (scrollHandler) {
      window.addEventListener('scroll', scrollHandler, { passive: true })
    }

    resizeHandler = () => {
      measure()
      update()
      refresh()
    }
    window.addEventListener('resize', resizeHandler, { passive: true })
  }

  function unbind() {
    const lenis = getLenis()
    if (lenis && scrollHandler) {
      lenis.off('scroll', scrollHandler)
    }
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
    }
    scrollHandler = null

    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }

    scrollerObserver?.disconnect()
    scrollerObserver = null

    trackObserver?.disconnect()
    trackObserver = null
  }

  const scrollerHeight = computed(() => {
    if (!import.meta.client || !toValue(options.enabled ?? true)) return 'auto'
    const travel = scrollTravel.value
    if (travel <= 1) return 'auto'
    return `calc(100dvh - var(--rf-nav-h) + ${travel}px)`
  })

  watch(
    [ready, () => toValue(options.enabled), () => toValue(options.scrollerRef), () => toValue(options.trackRef)],
    async () => {
      if (!import.meta.client || !ready.value) return
      await nextTick()
      requestAnimationFrame(() => {
        bind()
        setTimeout(() => {
          measure()
          update()
          refresh()
        }, 200)
        setTimeout(() => {
          measure()
          update()
          refresh()
        }, 800)
      })
    },
    { immediate: true }
  )

  watch(
    () => toValue(options.itemCount),
    () => nextTick(() => {
      measure()
      update()
      refresh()
    })
  )

  watch(scrollerHeight, () => {
    if (!import.meta.client) return
    nextTick(() => {
      measure()
      update()
      refresh()
    })
  })

  onUnmounted(() => unbind())

  return {
    trackX,
    progress,
    segmentFrac,
    progressPercent,
    isPinned,
    isComplete,
    scrollerHeight,
    goToIndex,
    remeasure: () => {
      measure()
      update()
      refresh()
    }
  }
}
