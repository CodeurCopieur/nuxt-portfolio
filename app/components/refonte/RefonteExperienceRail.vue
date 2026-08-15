<script setup lang="ts">
import CareerMap from '@/components/univers/CareerMap.client.vue'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'
import { buildMapPins, type MapPin } from '~/utils/experience-map'

const { sections } = useContent()
const { scroll, ready, scrollTo } = useRefonteScroll()

const mapRef = ref<{ invalidate: () => void } | null>(null)
const activeIndex = ref(0)
const selectedPinId = ref<string | null>(null)
const isScrollingToPin = ref(false)
const itemEls = ref<(HTMLElement | null)[]>([])

const pins = computed(() => buildMapPins(sections.value.experiences))
const experiences = computed(() => pins.value.map((pin) => pin.experience))

const activeExperience = computed(() => experiences.value[activeIndex.value] ?? null)

function setItemRef(el: Element | null, index: number) {
  itemEls.value[index] = el instanceof HTMLElement ? el : null
}

function syncMapToIndex(index: number) {
  selectedPinId.value = pins.value[index]?.id ?? null
}

function updateActiveFromViewport() {
  if (isScrollingToPin.value) return

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

  if (closestIdx !== activeIndex.value) {
    activeIndex.value = closestIdx
    syncMapToIndex(closestIdx)
  }
}

function scrollToExperience(index: number) {
  const el = itemEls.value[index]
  if (!el) return
  scrollTo(el)
}

function focusExperience(index: number) {
  isScrollingToPin.value = true
  activeIndex.value = index
  syncMapToIndex(index)
  scrollToExperience(index)
  window.setTimeout(() => {
    isScrollingToPin.value = false
    updateActiveFromViewport()
  }, 950)
}

function onPinSelect(pin: MapPin) {
  const index = pins.value.findIndex((item) => item.id === pin.id)
  if (index >= 0) focusExperience(index)
}

let lenisHandler: ((args: { scroll: number }) => void) | null = null

function bindScrollTracking() {
  unbindScrollTracking()
  updateActiveFromViewport()
  syncMapToIndex(activeIndex.value)

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
    if (isReady) {
      nextTick(() => {
        bindScrollTracking()
        mapRef.value?.invalidate()
      })
    }
  },
  { immediate: true }
)

watch(
  () => pins.value.length,
  () => {
    nextTick(() => {
      activeIndex.value = 0
      syncMapToIndex(0)
      updateActiveFromViewport()
      mapRef.value?.invalidate()
    })
  }
)

onUnmounted(() => unbindScrollTracking())
</script>

<template>
  <section class="refonte-xp" data-scroll-section>
    <div class="refonte-container refonte-xp__layout">
      <aside class="refonte-xp__aside">
        <div class="refonte-xp__intro">
          <p class="refonte-label">Parcours</p>
          <h2 class="refonte-display refonte-xp__title">Expériences qui forgent le craft</h2>
          <p class="refonte-xp__hint">
            Faites défiler les missions — la carte se positionne sur chaque lieu.
          </p>
        </div>

        <div class="refonte-xp__map refonte-card">
          <ClientOnly>
            <CareerMap
              ref="mapRef"
              variant="refonte"
              class="refonte-xp__map-inner"
              :pins="pins"
              :selected-pin-id="selectedPinId"
              @select="onPinSelect"
            />
          </ClientOnly>
        </div>

        <div v-if="activeExperience" class="refonte-xp__map-meta refonte-card">
          <p class="refonte-label">{{ activeExperience.period }}</p>
          <p class="refonte-xp__map-meta-title">{{ activeExperience.role }}</p>
          <p class="refonte-xp__map-meta-company">{{ activeExperience.company }} · {{ activeExperience.location }}</p>
        </div>
      </aside>

      <div class="refonte-xp__list">
        <article
          v-for="(xp, index) in experiences"
          :key="`${xp.company}-${xp.period}`"
          :ref="(el) => setItemRef(el, index)"
          class="refonte-xp__item refonte-card"
          :class="{ 'is-active': index === activeIndex }"
          tabindex="0"
          @click="focusExperience(index)"
          @keydown.enter="focusExperience(index)"
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
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 2.5rem;
    align-items: start;
  }

  .refonte-xp__aside {
    position: sticky;
    top: calc(var(--rf-nav-h) + 1.5rem);
  }
}

.refonte-xp__title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.35rem 0 0.75rem;
}

.refonte-xp__hint {
  font-size: 0.82rem;
  color: var(--rf-muted);
  line-height: 1.55;
  margin: 0;
}

.refonte-xp__aside {
  display: grid;
  gap: 1rem;
}

.refonte-xp__map {
  overflow: hidden;
  padding: 0;
  min-height: 380px;
}

.refonte-xp__map :deep(.refonte-xp__map-inner),
.refonte-xp__map :deep(.career-map) {
  min-height: 380px;
  height: 100%;
  border: none;
  border-radius: inherit;
  box-shadow: none;
}

.refonte-xp__map :deep(.career-map__canvas) {
  min-height: 380px;
}

.refonte-xp__map-meta {
  padding: 0.85rem 1rem;
  border-left: 3px solid var(--rf-accent);
}

.refonte-xp__map-meta-title {
  margin: 0.2rem 0 0;
  font-weight: 700;
  color: var(--rf-ink);
}

.refonte-xp__map-meta-company {
  margin: 0.15rem 0 0;
  font-size: 0.78rem;
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
  cursor: pointer;
  transition:
    opacity 0.35s var(--rf-ease),
    transform 0.35s var(--rf-ease),
    border-color 0.35s var(--rf-ease);
}

.refonte-xp__item.is-active {
  opacity: 1;
  transform: scale(1);
  border-color: rgba(184, 67, 47, 0.35);
}

.refonte-xp__item:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 2px;
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
