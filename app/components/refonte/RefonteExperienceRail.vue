<script setup lang="ts">
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const { sections } = useContent()
const { scroll, ready } = useRefonteScroll()

const activeIndex = ref(0)
const itemEls = ref<(HTMLElement | null)[]>([])

const experiences = computed(() => sections.value.experiences)

function setItemRef(el: Element | null, index: number) {
  itemEls.value[index] = el instanceof HTMLElement ? el : null
}

function updateActiveFromViewport() {
  const items = itemEls.value.filter(Boolean) as HTMLElement[]
  if (!items.length) return

  const viewportCenter = window.innerHeight * 0.5
  let closestIdx = 0
  let closestDistance = Infinity

  items.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
    const cardCenter = rect.top + rect.height / 2
    const distance = Math.abs(cardCenter - viewportCenter)

    if (distance < closestDistance) {
      closestDistance = distance
      closestIdx = index
    }
  })

  activeIndex.value = closestIdx
}

let lenisHandler: ((args: { scroll: number }) => void) | null = null

function bindScrollTracking() {
  unbindScrollTracking()
  updateActiveFromViewport()

  const lenis = scroll.value?.lenisInstance
  if (lenis && !lenisHandler) {
    lenisHandler = () => updateActiveFromViewport()
    lenis.on('scroll', lenisHandler)
    return
  }

  window.addEventListener('scroll', updateActiveFromViewport, { passive: true })
  window.addEventListener('resize', updateActiveFromViewport, { passive: true })
}

function unbindScrollTracking() {
  const lenis = scroll.value?.lenisInstance
  if (lenis && lenisHandler) {
    lenis.off('scroll', lenisHandler)
    lenisHandler = null
  }
  window.removeEventListener('scroll', updateActiveFromViewport)
  window.removeEventListener('resize', updateActiveFromViewport)
}

watch(
  ready,
  (isReady) => {
    if (isReady) nextTick(() => bindScrollTracking())
  },
  { immediate: true }
)

watch(
  () => experiences.value.length,
  () => nextTick(() => updateActiveFromViewport())
)

onUnmounted(() => unbindScrollTracking())
</script>

<template>
  <section class="refonte-xp" data-scroll-section>
    <div class="refonte-container refonte-xp__layout">
      <div class="refonte-xp__sticky">
        <p class="refonte-label">Parcours</p>
        <h2 class="refonte-display refonte-xp__title">Expériences qui forgent le craft</h2>
        <p class="refonte-xp__hint">Scroll pour parcourir les missions</p>
      </div>

      <div class="refonte-xp__list">
        <article
          v-for="(xp, index) in experiences"
          :key="`${xp.company}-${xp.period}`"
          :ref="(el) => setItemRef(el, index)"
          class="refonte-xp__item refonte-card"
          :class="{ 'is-active': index === activeIndex }"
        >
          <header>
            <span class="refonte-label">{{ xp.period }}</span>
            <h3>{{ xp.role }} · {{ xp.company }}</h3>
            <p>{{ xp.location }}</p>
          </header>
          <p class="refonte-xp__summary">{{ xp.summary }}</p>
          <ul class="refonte-xp__missions">
            <li v-for="mission in xp.missions.slice(0, 4)" :key="mission">{{ mission }}</li>
          </ul>
          <div class="refonte-xp__stack">
            <span v-for="tech in xp.stack.slice(0, 8)" :key="tech">{{ tech }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.refonte-xp {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.refonte-xp__layout {
  display: grid;
  gap: 2rem;
}

@media (min-width: 960px) {
  .refonte-xp__layout {
    grid-template-columns: 0.8fr 1.2fr;
    gap: 3rem;
  }

  .refonte-xp__sticky {
    position: sticky;
    top: calc(var(--rf-nav-h) + 2rem);
    align-self: start;
  }
}

.refonte-xp__title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.35rem 0 0.75rem;
}

.refonte-xp__hint {
  font-size: 0.82rem;
  color: var(--rf-muted);
}

.refonte-xp__list {
  display: grid;
  gap: 1rem;
}

.refonte-xp__item {
  padding: 1.35rem;
  opacity: 0.55;
  transform: scale(0.98);
  transition: opacity 0.35s var(--rf-ease), transform 0.35s var(--rf-ease), border-color 0.35s var(--rf-ease);
}

.refonte-xp__item.is-active {
  opacity: 1;
  transform: scale(1);
  border-color: rgba(184, 67, 47, 0.35);
}

.refonte-xp__item header h3 {
  font-size: 1.15rem;
  margin: 0.35rem 0 0.15rem;
}

.refonte-xp__item header p {
  font-size: 0.82rem;
  color: var(--rf-muted);
}

.refonte-xp__summary {
  margin: 0.85rem 0;
  line-height: 1.6;
  color: var(--rf-ink-soft);
}

.refonte-xp__missions {
  margin: 0 0 1rem;
  padding-left: 1.1rem;
  color: var(--rf-ink-soft);
  font-size: 0.88rem;
  display: grid;
  gap: 0.35rem;
}

.refonte-xp__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.refonte-xp__stack span {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.28rem 0.5rem;
  border-radius: 999px;
  background: rgba(74, 107, 93, 0.12);
  color: var(--rf-sage);
}
</style>
