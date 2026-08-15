<script setup lang="ts">
import { provideRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const pageRef = ref<HTMLElement | null>(null)
const isTransitioning = useState('refonte-transitioning', () => false)

provide('refonte-page', pageRef)
const { scrollTo, refresh } = provideRefonteScroll()

const route = useRoute()
watch(() => route.path, async () => {
  await nextTick()
  scrollTo(0)
  setTimeout(() => refresh(), 150)
})
</script>

<template>
  <div class="refonte-root" data-barba="wrapper">
    <div class="refonte-grain" aria-hidden="true" />
    <RefonteNav />

    <main
      ref="pageRef"
      class="refonte-main"
      :class="{ 'refonte-main--transitioning': isTransitioning }"
      data-barba="container"
    >
      <slot />
      <RefonteFooter />
    </main>
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
}
</style>

<style>
@import '@/assets/css/refonte/tokens.css';
@import 'locomotive-scroll/dist/locomotive-scroll.css';
</style>
