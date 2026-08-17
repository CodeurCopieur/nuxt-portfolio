<script setup lang="ts">
import { provideRefonteScroll } from '@/composables/refonte/useRefonteScroll'
import { provideRefonteTransition } from '@/composables/refonte/useRefonteTransition'

const pageRef = ref<HTMLElement | null>(null)

provide('refonte-page', pageRef)
const { scrollToTop, refresh, scroll, ready } = provideRefonteScroll()

function resetPageScroll() {
  scrollToTop(true)
}

const { isTransitioning } = provideRefonteTransition(pageRef, {
  onBeforeEnter: resetPageScroll,
  onAfterEnter: () => {
    refresh()
    updateCustomScrollbar()
  }
})

const trackRef = ref<HTMLElement | null>(null)
const thumbHeight = ref(18)
const thumbOffset = ref(0)

function updateCustomScrollbar() {
  const track = trackRef.value
  if (!track) return

  const doc = document.documentElement
  const scrollHeight = doc.scrollHeight
  const viewHeight = window.innerHeight
  const maxScroll = Math.max(scrollHeight - viewHeight, 1)
  const trackHeight = track.clientHeight

  const lenis = scroll.value?.lenisInstance
  const scrollTop = lenis?.scroll ?? window.scrollY

  const ratio = viewHeight / scrollHeight
  const thumbH = Math.max(ratio * trackHeight, 22)
  thumbHeight.value = thumbH

  const maxThumbTravel = Math.max(trackHeight - thumbH, 0)
  thumbOffset.value = (scrollTop / maxScroll) * maxThumbTravel
}

let lenisScrollHandler: (() => void) | null = null
let windowScrollHandler: (() => void) | null = null
let docResizeObserver: ResizeObserver | null = null

function bindScrollbar() {
  unbindScrollbar()
  updateCustomScrollbar()

  const lenis = scroll.value?.lenisInstance
  if (lenis) {
    lenisScrollHandler = () => updateCustomScrollbar()
    lenis.on('scroll', lenisScrollHandler)
  } else {
    windowScrollHandler = () => updateCustomScrollbar()
    window.addEventListener('scroll', windowScrollHandler, { passive: true })
  }

  window.addEventListener('resize', updateCustomScrollbar, { passive: true })

  if (typeof ResizeObserver !== 'undefined') {
    docResizeObserver = new ResizeObserver(() => updateCustomScrollbar())
    docResizeObserver.observe(document.documentElement)
  }
}

function unbindScrollbar() {
  const lenis = scroll.value?.lenisInstance
  if (lenis && lenisScrollHandler) {
    lenis.off('scroll', lenisScrollHandler)
    lenisScrollHandler = null
  }
  if (windowScrollHandler) {
    window.removeEventListener('scroll', windowScrollHandler)
    windowScrollHandler = null
  }
  window.removeEventListener('resize', updateCustomScrollbar)
  docResizeObserver?.disconnect()
  docResizeObserver = null
}

watch(ready, (isReady) => {
  if (isReady) nextTick(() => bindScrollbar())
}, { immediate: true })

onUnmounted(() => unbindScrollbar())
</script>

<template>
  <div class="refonte-root" data-barba="wrapper">
    <RefonteNav />
    <RefonteHud />

    <main
      ref="pageRef"
      class="refonte-main"
      :class="{ 'refonte-main--transitioning': isTransitioning }"
      data-barba="container"
    >
      <slot />
      <RefonteFooter />
    </main>

    <aside class="refonte-scroll-rail" aria-hidden="true">
      <div ref="trackRef" class="refonte-scrollbar">
        <div
          class="refonte-scrollbar__thumb"
          :style="{ height: `${thumbHeight}px`, transform: `translateY(${thumbOffset}px)` }"
        />
      </div>
    </aside>
  </div>
</template>

<style scoped>
.refonte-main {
  padding-top: var(--rf-nav-h);
  min-height: 100dvh;
  will-change: transform;
}

.refonte-main--transitioning {
  pointer-events: none;
  user-select: none;
  overflow: hidden;
}

.refonte-scroll-rail {
  position: fixed;
  top: 50%;
  right: max(0.75rem, env(safe-area-inset-right));
  transform: translateY(-50%);
  z-index: 120;
  pointer-events: none;
}

.refonte-scrollbar {
  position: relative;
  height: min(24vh, 180px);
  width: 3px;
  border-radius: 999px;
  background: var(--rf-scroll-track);
  overflow: hidden;
}

.refonte-scrollbar__thumb {
  width: 100%;
  border-radius: 999px;
  background: var(--rf-scroll-thumb);
  will-change: transform;
}

@media (max-width: 639px) {
  .refonte-scroll-rail {
    right: max(0.5rem, env(safe-area-inset-right));
  }

  .refonte-scrollbar {
    height: min(20vh, 140px);
    width: 2px;
  }

  .refonte-scroll-rail__pct {
    font-size: 0.58rem;
  }
}
</style>

<style>
@import '@/assets/css/refonte/tokens.css';
@import 'locomotive-scroll/dist/locomotive-scroll.css';
</style>
