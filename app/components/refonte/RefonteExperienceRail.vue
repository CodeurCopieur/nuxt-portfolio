<script setup lang="ts">
import { useRefonteExperienceScroll } from '@/composables/refonte/useRefonteExperienceScroll'

const { sections } = useContent()

const scrollerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const railViewportRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isDesktop = ref(import.meta.client ? window.innerWidth >= 960 : true)

const experiences = computed(() => sections.value.experiences)
const activeExperience = computed(() => experiences.value[activeIndex.value] ?? null)
const total = computed(() => experiences.value.length)

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}

function setActive(index: number) {
  activeIndex.value = Math.max(0, Math.min(index, total.value - 1))
}

function focusIndex(index: number) {
  if (isDesktop.value) {
    goToIndex(index)
  } else {
    scrollMobileTo(index)
  }
}

const {
  segmentFrac,
  progressPercent,
  isPinned,
  isComplete,
  scrollerHeight,
  goToIndex,
  remeasure
} = useRefonteExperienceScroll({
  scrollerRef,
  trackRef,
  itemCount: total,
  enabled: isDesktop,
  onIndexChange: setActive
})

const mobileProgress = ref(0)
const displayProgress = computed(() =>
  isDesktop.value ? progressPercent.value : mobileProgress.value
)

/** Barre timeline alignée sur les cartes (1/N chacune), pas sur count-1. */
const timelineProgress = computed(() => {
  if (total.value <= 0) return 0
  if (!isDesktop.value) {
    return ((activeIndex.value + 1) / total.value) * 100
  }
  return Math.min(((activeIndex.value + segmentFrac.value) / total.value) * 100, 100)
})

const detailStep = computed(() => {
  if (!isDesktop.value) return 3
  const f = segmentFrac.value
  // Tout est affiché bien avant la fin du segment (~¾)
  if (f >= 0.55) return 3
  if (f >= 0.28) return 2
  if (f >= 0.08) return 1
  return 0
})

const detailActLabel = computed(() => {
  if (detailStep.value >= 3) return '03 — Stack'
  if (detailStep.value >= 2) return '02 — Missions'
  if (detailStep.value >= 1) return '01 — Contexte'
  return '00 — Intro'
})

function blockStyle(step: number) {
  if (!isDesktop.value) return { opacity: 1, transform: 'none' }
  const f = segmentFrac.value
  // 4 temps : intro → contexte → missions → stack, terminé vers ~0.72
  const starts = [0.06, 0.22, 0.42]
  const start = starts[step - 1] ?? 0
  const t = Math.min(Math.max((f - start) / 0.18, 0), 1)
  return {
    opacity: t,
    transform: t >= 1 ? 'none' : `translateY(${(1 - t) * 18}px)`
  }
}

function missionStyle(index: number) {
  if (!isDesktop.value) return { opacity: 1, transform: 'none' }
  const threshold = 0.24 + index * 0.05
  const t = Math.min(Math.max((segmentFrac.value - threshold) / 0.12, 0), 1)
  return {
    opacity: t,
    transform: `translateX(${(1 - t) * -12}px)`
  }
}

function stackStyle(index: number) {
  if (!isDesktop.value) return { opacity: 1, transform: 'none' }
  const threshold = 0.45 + index * 0.03
  const t = Math.min(Math.max((segmentFrac.value - threshold) / 0.1, 0), 1)
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 8}px) scale(${0.94 + t * 0.06})`
  }
}

function updateBreakpoint() {
  isDesktop.value = window.innerWidth >= 960
}

function scrollMobileTo(index: number) {
  const viewport = railViewportRef.value
  if (!viewport) return
  const card = viewport.querySelectorAll('.refonte-xp__card')[index] as HTMLElement | undefined
  if (!card) return
  const gutter = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rf-gutter')) || 16
  viewport.scrollTo({ left: Math.max(card.offsetLeft - gutter, 0), behavior: 'smooth' })
  setActive(index)
}

function updateMobileProgress() {
  const viewport = railViewportRef.value
  if (!viewport || isDesktop.value || total.value <= 1) {
    mobileProgress.value = total.value <= 1 ? 100 : 0
    return
  }

  const max = viewport.scrollWidth - viewport.clientWidth
  if (max <= 0) {
    mobileProgress.value = 100
    return
  }

  const ratio = viewport.scrollLeft / max
  mobileProgress.value = Math.round(ratio * 100)
  const idx = Math.min(total.value - 1, Math.round(ratio * (total.value - 1)))
  if (idx !== activeIndex.value) setActive(idx)
}

let mobileHandler: (() => void) | null = null

onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint, { passive: true })

  nextTick(() => {
    remeasure()
    const viewport = railViewportRef.value
    if (viewport) {
      mobileHandler = () => updateMobileProgress()
      viewport.addEventListener('scroll', mobileHandler, { passive: true })
    }
    setTimeout(() => remeasure(), 900)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBreakpoint)
  if (railViewportRef.value && mobileHandler) {
    railViewportRef.value.removeEventListener('scroll', mobileHandler)
  }
})

watch(isDesktop, () => nextTick(() => remeasure()))
</script>

<template>
  <RefonteSection chapter="Expériences" :scroll-section="false" class="refonte-xp">
    <div
      ref="scrollerRef"
      class="refonte-xp__scroller"
      :style="isDesktop ? { height: scrollerHeight } : undefined"
    >
      <div class="refonte-xp__pin" :class="{ 'is-locked': isPinned }">
        <div
          class="refonte-xp__progress"
          role="progressbar"
          :aria-valuenow="displayProgress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Progression du parcours ${displayProgress}%`"
        >
          <div class="refonte-xp__progress-fill" :style="{ width: `${displayProgress}%` }" />
        </div>

        <div class="refonte-container refonte-xp__head">
          <div class="refonte-xp__head-copy">
            <p class="rf-movement__num">005 — Expériences</p>
            <h2 class="refonte-display refonte-xp__title">Expériences</h2>
            <p class="refonte-xp__lead">
              <template v-if="isDesktop && !isComplete">
                Scrollez — les détails de chaque mission se dévoilent au fil du scroll.
              </template>
              <template v-else-if="isDesktop">
                Parcours complet — continuez vers le bas.
              </template>
              <template v-else>
                Glissez le rail pour parcourir les missions.
              </template>
            </p>
          </div>
          <div class="refonte-xp__counter" aria-live="polite">
            <span class="refonte-xp__counter-current">{{ pad(activeIndex) }}</span>
            <span class="refonte-xp__counter-sep">/</span>
            <span class="refonte-xp__counter-total">{{ String(total).padStart(2, '0') }}</span>
          </div>
        </div>

        <div class="refonte-container refonte-xp__stage">
          <Transition name="xp-switch" mode="out-in">
            <article
              v-if="activeExperience"
              :key="activeIndex"
              class="refonte-xp__mission"
            >
              <aside class="refonte-xp__mission-lead">
                <p class="refonte-xp__mission-kicker">Mission</p>
                <p class="refonte-xp__mission-index refonte-serif">{{ pad(activeIndex) }}</p>
                <h3 class="refonte-xp__mission-role">{{ activeExperience.role }}</h3>
                <p class="refonte-xp__mission-company">
                  {{ activeExperience.company }}
                </p>
                <p class="refonte-xp__mission-place">
                  {{ activeExperience.location }}
                </p>
                <p class="refonte-xp__mission-period">{{ activeExperience.period }}</p>

                <div class="refonte-xp__mission-steps" aria-hidden="true">
                  <span
                    v-for="step in 3"
                    :key="step"
                    class="refonte-xp__mission-step"
                    :class="{ 'is-active': detailStep >= step }"
                  >
                    {{ String(step).padStart(2, '0') }}
                  </span>
                </div>
                <p class="refonte-xp__mission-act">{{ detailActLabel }}</p>
              </aside>

              <div class="refonte-xp__mission-body">
                <section
                  class="refonte-xp__beat"
                  :style="blockStyle(1)"
                  :class="{ 'is-on': detailStep >= 1 }"
                >
                  <p class="refonte-xp__beat-num">01</p>
                  <div class="refonte-xp__beat-content">
                    <h4 class="refonte-xp__beat-title">Contexte</h4>
                    <p class="refonte-xp__beat-text">{{ activeExperience.summary }}</p>
                  </div>
                </section>

                <section
                  class="refonte-xp__beat"
                  :style="blockStyle(2)"
                  :class="{ 'is-on': detailStep >= 2 }"
                >
                  <p class="refonte-xp__beat-num">02</p>
                  <div class="refonte-xp__beat-content">
                    <h4 class="refonte-xp__beat-title">Missions</h4>
                    <ol class="refonte-xp__beat-list">
                      <li
                        v-for="(mission, mi) in activeExperience.missions.slice(0, 4)"
                        :key="mission"
                        :style="missionStyle(mi)"
                      >
                        <span class="refonte-xp__beat-list-idx">{{ String(mi + 1).padStart(2, '0') }}</span>
                        <span>{{ mission }}</span>
                      </li>
                    </ol>
                  </div>
                </section>

                <section
                  class="refonte-xp__beat"
                  :style="blockStyle(3)"
                  :class="{ 'is-on': detailStep >= 3 }"
                >
                  <p class="refonte-xp__beat-num">03</p>
                  <div class="refonte-xp__beat-content">
                    <h4 class="refonte-xp__beat-title">Stack</h4>
                    <div class="refonte-xp__beat-stack">
                      <span
                        v-for="(tech, ti) in activeExperience.stack.slice(0, 8)"
                        :key="tech"
                        :style="stackStyle(ti)"
                      >{{ tech }}</span>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </Transition>
        </div>

        <div class="refonte-container refonte-xp__rail-area">
          <div class="refonte-xp__timeline" role="tablist" aria-label="Chronologie">
            <button
              v-for="(xp, index) in experiences"
              :key="`${xp.company}-dot`"
              type="button"
              role="tab"
              class="refonte-xp__timeline-dot"
              :class="{ 'is-active': index === activeIndex, 'is-past': index < activeIndex }"
              :aria-selected="index === activeIndex"
              @click="focusIndex(index)"
            >
              <span class="refonte-xp__timeline-year">{{ xp.period.split('–')[0]?.trim() }}</span>
            </button>
            <div class="refonte-xp__timeline-progress" :style="{ width: `${timelineProgress}%` }" />
          </div>

          <div
            ref="railViewportRef"
            class="refonte-xp__track-viewport"
            :class="{ 'refonte-xp__track-viewport--desktop': isDesktop }"
          >
            <div
              ref="trackRef"
              class="refonte-xp__track"
              :style="{ '--xp-count': Math.max(total, 1) }"
            >
              <article
                v-for="(xp, index) in experiences"
                :key="`${xp.company}-${xp.period}`"
                class="refonte-xp__card refonte-card"
                :class="{ 'is-active': index === activeIndex }"
                tabindex="0"
                role="tab"
                :aria-selected="index === activeIndex"
                @click="focusIndex(index)"
                @keydown.enter="focusIndex(index)"
              >
                <span class="refonte-xp__card-num">{{ pad(index) }}</span>
                <h4 class="refonte-xp__card-company">{{ xp.company }}</h4>
                <p class="refonte-xp__card-role">{{ xp.role }}</p>
                <p class="refonte-xp__card-period">{{ xp.period }}</p>
                <p class="refonte-xp__card-location">{{ xp.location }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RefonteSection>
</template>

<style scoped>
.refonte-xp {
  padding-block: clamp(3rem, 8vw, 5rem) 0;
}

.refonte-xp__scroller {
  position: relative;
}

.refonte-xp__pin {
  position: sticky;
  top: var(--rf-nav-h);
  min-height: calc(100dvh - var(--rf-nav-h));
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.75rem);
  padding-bottom: clamp(1.5rem, 4vw, 2.5rem);
  overflow: hidden;
}

.refonte-xp__pin.is-locked {
  z-index: 25;
}

.refonte-xp__progress {
  position: relative;
  height: 4px;
  background: rgba(243, 237, 228, 0.12);
  overflow: hidden;
}

.refonte-xp__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rf-accent), var(--rf-gold));
  will-change: width;
}

.refonte-xp__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.refonte-xp__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0.35rem 0 0.5rem;
  letter-spacing: -0.03em;
}

.refonte-xp__lead {
  max-width: 46ch;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--rf-text-soft);
}

.refonte-xp__counter {
  display: flex;
  align-items: baseline;
  gap: 0.15rem;
  font-family: var(--rf-sans);
  font-weight: 700;
  line-height: 1;
}

.refonte-xp__counter-current {
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--rf-accent);
}

.refonte-xp__counter-sep,
.refonte-xp__counter-total {
  font-size: clamp(1.25rem, 3vw, 2rem);
  color: var(--rf-text-muted);
}

.refonte-xp__stage {
  min-height: clamp(380px, 48vh, 480px);
}

.refonte-xp__mission {
  display: grid;
  grid-template-columns: minmax(12rem, 0.9fr) minmax(0, 1.4fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
  min-height: clamp(380px, 48vh, 480px);
  padding-block: clamp(1rem, 2.5vw, 1.5rem);
  border-top: 1px solid var(--rf-line);
  border-bottom: 1px solid var(--rf-line);
}

.refonte-xp__mission-lead {
  display: grid;
  align-content: center;
  gap: 0.35rem;
  padding-right: clamp(0.5rem, 2vw, 1.25rem);
  border-right: 1px solid var(--rf-line);
}

.refonte-xp__mission-kicker {
  margin: 0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.refonte-xp__mission-index {
  margin: 0.15rem 0 0.35rem;
  font-size: clamp(3rem, 8vw, 5rem);
  line-height: 0.9;
  color: var(--rf-accent);
}

.refonte-xp__mission-role {
  margin: 0;
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--rf-text);
}

.refonte-xp__mission-company {
  margin: 0.55rem 0 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--rf-text-soft);
}

.refonte-xp__mission-place {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: var(--rf-text-muted);
}

.refonte-xp__mission-period {
  margin: 0.85rem 0 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rf-accent);
}

.refonte-xp__mission-steps {
  display: flex;
  gap: 0.55rem;
  margin-top: 1.5rem;
}

.refonte-xp__mission-step {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--rf-text-muted);
  opacity: 0.45;
  transition: color 0.3s var(--rf-ease), opacity 0.3s var(--rf-ease);
}

.refonte-xp__mission-step.is-active {
  color: var(--rf-accent);
  opacity: 1;
}

.refonte-xp__mission-act {
  margin: 0.45rem 0 0;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.refonte-xp__mission-body {
  display: grid;
  gap: clamp(1.15rem, 2.5vw, 1.65rem);
  align-content: center;
  min-width: 0;
}

.refonte-xp__beat {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.85rem;
  will-change: opacity, transform;
}

.refonte-xp__beat-num {
  margin: 0.15rem 0 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--rf-text-muted);
}

.refonte-xp__beat-content {
  display: grid;
  gap: 0.45rem;
  min-width: 0;
}

.refonte-xp__beat-title {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rf-accent);
}

.refonte-xp__beat-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--rf-text-soft);
}

.refonte-xp__beat-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}

.refonte-xp__beat-list li {
  display: grid;
  grid-template-columns: 1.6rem minmax(0, 1fr);
  gap: 0.55rem;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--rf-text-soft);
  will-change: opacity, transform;
}

.refonte-xp__beat-list-idx {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--rf-text-muted);
}

.refonte-xp__beat-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.refonte-xp__beat-stack span {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
  color: var(--rf-text-muted);
  will-change: opacity, transform;
}

.xp-switch-enter-active,
.xp-switch-leave-active {
  transition: opacity 0.35s var(--rf-ease), transform 0.35s var(--rf-ease);
}

.xp-switch-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.xp-switch-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.refonte-xp__rail-area {
  display: grid;
  gap: 0.85rem;
  min-width: 0;
}

.refonte-xp__timeline {
  position: relative;
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--rf-line);
}

.refonte-xp__timeline-progress {
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 2px;
  background: var(--rf-accent);
  pointer-events: none;
}

.refonte-xp__timeline-dot {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.35rem 0;
  cursor: pointer;
  color: var(--rf-text-muted);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.refonte-xp__timeline-dot.is-active .refonte-xp__timeline-year {
  color: var(--rf-accent);
}

.refonte-xp__track-viewport {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  min-width: 0;
}

.refonte-xp__track-viewport--desktop {
  overflow: hidden;
  scroll-snap-type: none;
}

.refonte-xp__track-viewport::-webkit-scrollbar {
  display: none;
}

/* Desktop : toutes les cartes dans le container, rien ne dépasse */
.refonte-xp__track {
  display: grid;
  grid-template-columns: repeat(var(--xp-count, 5), minmax(0, 1fr));
  gap: clamp(0.65rem, 1.5vw, 1rem);
  width: 100%;
  padding: 0.25rem 0 0.5rem;
}

.refonte-xp__card {
  min-width: 0;
  width: 100%;
  scroll-snap-align: start;
  cursor: pointer;
  border-color: rgba(31, 29, 26, 0.2);
  display: grid;
  gap: 0.35rem;
  padding: clamp(0.85rem, 1.8vw, 1.2rem);
  transition: border-color 0.3s var(--rf-ease), box-shadow 0.3s var(--rf-ease), transform 0.3s var(--rf-ease);
}

.refonte-xp__card.is-active {
  border-color: var(--rf-accent);
  box-shadow: 3px 3px 0 rgba(31, 29, 26, 0.45);
  transform: translateY(-2px);
}

.refonte-xp__card-num {
  font-family: var(--rf-sans);
  font-weight: 700;
  font-size: clamp(1.35rem, 2.5vw, 1.85rem);
  line-height: 1;
  color: var(--rf-accent);
  opacity: 0.35;
}

.refonte-xp__card.is-active .refonte-xp__card-num {
  opacity: 1;
}

.refonte-xp__card-company {
  margin: 0;
  font-family: var(--rf-sans);
  font-size: clamp(0.9rem, 1.6vw, 1.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.refonte-xp__card-role {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--rf-ink-soft);
}

.refonte-xp__card-period,
.refonte-xp__card-location {
  margin: 0;
  font-size: 0.7rem;
  color: var(--rf-muted-ink);
}

@media (max-width: 959px) {
  .refonte-xp__pin {
    position: relative;
    top: auto;
    min-height: auto;
  }

  .refonte-xp__mission {
    grid-template-columns: 1fr;
    min-height: 0;
    gap: 1.25rem;
  }

  .refonte-xp__mission-lead {
    border-right: none;
    padding-right: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--rf-line);
  }

  .refonte-xp__track {
    display: flex;
    width: max-content;
    gap: 0.85rem;
    padding-inline: 0;
  }

  .refonte-xp__card {
    flex: 0 0 clamp(220px, 72vw, 260px);
    width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .refonte-xp__beat,
  .refonte-xp__beat-list li,
  .refonte-xp__beat-stack span {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
