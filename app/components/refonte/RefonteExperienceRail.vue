<script setup lang="ts">
import { useRefonteExperienceScroll } from '@/composables/refonte/useRefonteExperienceScroll'

const { sections } = useContent()

const scrollerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const railViewportRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isDesktop = ref(false)

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
  goToIndex(index)
}

function selectMobileTab(index: number) {
  setActive(index)
  nextTick(() => {
    const tab = tabListRef.value?.querySelector(`[data-tab-index="${index}"]`) as HTMLElement | null
    tab?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  })
}

const tabListRef = ref<HTMLElement | null>(null)

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

/** Barre timeline alignée sur les cartes (1/N chacune), pas sur count-1. */
const timelineProgress = computed(() => {
  if (total.value <= 0) return 0
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
  if (!isDesktop.value) return 'Détails'
  if (detailStep.value >= 3) return '03 — Stack'
  if (detailStep.value >= 2) return '02 — Missions'
  if (detailStep.value >= 1) return '01 — Contexte'
  return '00 — Intro'
})

const visibleMissions = computed(() => {
  const list = activeExperience.value?.missions ?? []
  return isDesktop.value ? list.slice(0, 4) : list
})

const visibleStack = computed(() => {
  const list = activeExperience.value?.stack ?? []
  return isDesktop.value ? list.slice(0, 8) : list
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

onMounted(() => {
  updateBreakpoint()
  window.addEventListener('resize', updateBreakpoint, { passive: true })

  nextTick(() => {
    remeasure()
    setTimeout(remeasure, 900)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateBreakpoint)
})

watch(isDesktop, () => {
  nextTick(remeasure)
})
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
          v-if="isDesktop"
          class="refonte-xp__progress"
          role="progressbar"
          :aria-valuenow="progressPercent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`Progression du parcours ${progressPercent}%`"
        >
          <div class="refonte-xp__progress-fill" :style="{ width: `${progressPercent}%` }" />
        </div>

        <div class="refonte-container refonte-xp__head">
          <div class="refonte-xp__head-copy">
            <p class="rf-movement__num">05 — Expériences</p>
            <h2 class="refonte-display refonte-xp__title">Expériences</h2>
            <p class="refonte-xp__lead">
              <template v-if="isDesktop && !isComplete">
                Scrollez — les détails de chaque mission se dévoilent au fil du scroll.
              </template>
              <template v-else-if="isDesktop">
                Parcours complet — continuez vers le bas.
              </template>
              <template v-else>
                Sélectionnez une entreprise pour explorer la mission.
              </template>
            </p>
          </div>
          <div v-if="isDesktop" class="refonte-xp__counter" aria-live="polite">
            <span class="refonte-xp__counter-current">{{ pad(activeIndex) }}</span>
            <span class="refonte-xp__counter-sep">/</span>
            <span class="refonte-xp__counter-total">{{ String(total).padStart(2, '0') }}</span>
          </div>
        </div>

        <template v-if="isDesktop">
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
                          v-for="(mission, mi) in visibleMissions"
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
                          v-for="(tech, ti) in visibleStack"
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
              class="refonte-xp__track-viewport refonte-xp__track-viewport--desktop"
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
        </template>

        <div v-else class="refonte-container refonte-xp__mobile-tabs">
          <div
            ref="tabListRef"
            class="refonte-xp__tabs"
            role="tablist"
            aria-label="Missions"
          >
            <button
              v-for="(xp, index) in experiences"
              :key="`${xp.company}-tab`"
              type="button"
              role="tab"
              class="refonte-xp__tab"
              :class="{ 'is-active': index === activeIndex }"
              :aria-selected="index === activeIndex"
              :data-tab-index="index"
              @click="selectMobileTab(index)"
            >
              <span class="refonte-xp__tab-label">{{ xp.company }}</span>
            </button>
          </div>

          <Transition name="xp-switch" mode="out-in">
            <article
              v-if="activeExperience"
              :key="activeIndex"
              class="refonte-xp__mission refonte-xp__mission--mobile"
            >
              <aside class="refonte-xp__mission-lead">
                <h3 class="refonte-xp__mission-role">{{ activeExperience.role }}</h3>
                <p class="refonte-xp__mission-place">{{ activeExperience.location }}</p>
                <p class="refonte-xp__mission-period">{{ activeExperience.period }}</p>
              </aside>

              <div class="refonte-xp__mission-body">
                <section class="refonte-xp__beat">
                  <p class="refonte-xp__beat-num">01</p>
                  <div class="refonte-xp__beat-content">
                    <h4 class="refonte-xp__beat-title">Contexte</h4>
                    <p class="refonte-xp__beat-text">{{ activeExperience.summary }}</p>
                  </div>
                </section>

                <section class="refonte-xp__beat">
                  <p class="refonte-xp__beat-num">02</p>
                  <div class="refonte-xp__beat-content">
                    <h4 class="refonte-xp__beat-title">Missions</h4>
                    <ol class="refonte-xp__beat-list">
                      <li v-for="(mission, mi) in activeExperience.missions" :key="mission">
                        <span class="refonte-xp__beat-list-idx">{{ String(mi + 1).padStart(2, '0') }}</span>
                        <span>{{ mission }}</span>
                      </li>
                    </ol>
                  </div>
                </section>

                <section class="refonte-xp__beat">
                  <p class="refonte-xp__beat-num">03</p>
                  <div class="refonte-xp__beat-content">
                    <h4 class="refonte-xp__beat-title">Stack</h4>
                    <div class="refonte-xp__beat-stack">
                      <span v-for="tech in activeExperience.stack" :key="tech">{{ tech }}</span>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </Transition>
        </div>
      </div>
    </div>
  </RefonteSection>
</template>

<style scoped>
.refonte-xp {
  padding-block: clamp(3rem, 8vw, 5rem) 0;
}

@media (max-width: 767px) {
  .refonte-xp {
    padding-block: 2.25rem 1.5rem;
  }

  .refonte-xp__pin {
    gap: 1.15rem;
    padding-bottom: 1.25rem;
  }
}

.refonte-xp__scroller {
  position: relative;
}

.refonte-xp__pin {
  position: sticky;
  top: var(--rf-nav-h);
  min-height: calc(100dvh - var(--rf-nav-h));
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: var(--rf-section-stack-gap);
  padding-top: var(--rf-section-pin-pad);
  padding-bottom: clamp(1rem, 2.5vw, 1.75rem);
  overflow: hidden;
  box-sizing: border-box;
}

.refonte-xp__pin.is-locked {
  z-index: 25;
}

.refonte-xp__progress {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.12);
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
  font-size: var(--rf-section-title-size);
  margin: 0.35rem 0 0.5rem;
  letter-spacing: -0.03em;
}

.refonte-xp__lead {
  max-width: 46ch;
  margin: 0;
  font-size: clamp(0.82rem, 1.5vh, 0.95rem);
  line-height: 1.5;
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
  font-size: clamp(2.25rem, 5.5vw, 5rem);
  color: var(--rf-accent);
}

.refonte-xp__counter-sep,
.refonte-xp__counter-total {
  font-size: clamp(1.25rem, 3vw, 2rem);
  color: var(--rf-text-muted);
}

.refonte-xp__stage {
  min-height: 0;
}

.refonte-xp__mission {
  display: grid;
  grid-template-columns: minmax(12rem, 0.9fr) minmax(0, 1.4fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
  min-height: 0;
  height: 100%;
  padding-block: clamp(0.65rem, 1.5vw, 1.15rem);
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
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--rf-text-soft);
}

.refonte-xp__mission-company {
  margin: 0.45rem 0 0;
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.12;
  color: var(--rf-accent);
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
  gap: var(--rf-section-stack-gap);
  align-content: start;
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
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.35rem 0.7rem;
  border: 1px solid rgba(var(--rf-accent-rgb), 0.45);
  border-radius: 999px;
  color: var(--rf-accent);
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
  overflow-x: auto;
  scrollbar-width: none;
}

.refonte-xp__timeline::-webkit-scrollbar {
  display: none;
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
  overflow: hidden;
  min-width: 0;
  width: 100%;
  touch-action: pan-y;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}

.refonte-xp__track-viewport--desktop {
  overflow: hidden;
  cursor: default;
  user-select: auto;
  -webkit-user-select: auto;
  touch-action: auto;
}

.refonte-xp__track-viewport:active {
  cursor: grabbing;
}

.refonte-xp__track-viewport--desktop:active {
  cursor: default;
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
  cursor: pointer;
  border-color: rgba(11, 26, 58, 0.18);
  display: grid;
  gap: 0.35rem;
  padding: clamp(0.85rem, 1.8vw, 1.2rem);
  transition: border-color 0.3s var(--rf-ease), box-shadow 0.3s var(--rf-ease), transform 0.3s var(--rf-ease);
}

.refonte-xp__card.is-active {
  border-color: var(--rf-accent);
  box-shadow: 3px 3px 0 rgba(11, 26, 58, 0.35);
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
    grid-template-rows: none;
    gap: 1.15rem;
    padding-top: var(--rf-section-pin-pad);
    padding-bottom: 1.25rem;
    overflow: visible;
  }

  .refonte-xp__mobile-tabs {
    display: grid;
    gap: 0.85rem;
  }

  .refonte-xp__tabs {
    display: flex;
    gap: 0.45rem;
    overflow-x: auto;
    padding-bottom: 0.65rem;
    border-bottom: 1px solid var(--rf-line);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .refonte-xp__tabs::-webkit-scrollbar {
    display: none;
  }

  .refonte-xp__tab {
    flex: 0 0 auto;
    padding: 0.55rem 0.9rem;
    border: 1px solid var(--rf-line);
    border-radius: 999px;
    background: transparent;
    color: var(--rf-text);
    cursor: pointer;
    text-align: left;
    transition:
      border-color 0.25s var(--rf-ease),
      color 0.25s var(--rf-ease),
      background 0.25s var(--rf-ease);
  }

  .refonte-xp__tab.is-active {
    border-color: var(--rf-accent);
    background: rgba(var(--rf-accent-rgb), 0.12);
    color: var(--rf-accent);
    box-shadow: 2px 2px 0 rgba(11, 26, 58, 0.28);
  }

  .refonte-xp__tab-label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    white-space: nowrap;
    color: inherit;
  }

  .refonte-xp__mission--mobile .refonte-xp__mission-role {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.25;
    color: var(--rf-text);
  }

  .refonte-xp__mission--mobile {
    border-top: none;
    border-bottom: none;
    padding-block: 0.35rem 0.5rem;
  }

  .refonte-xp__mission--mobile .refonte-xp__mission-lead {
    border-bottom: none;
    padding-bottom: 0.35rem;
  }

  .refonte-xp__mission,
  .refonte-xp__mission--mobile {
    grid-template-columns: 1fr;
    min-height: 0;
    height: auto;
    gap: 1.35rem;
    align-items: stretch;
    padding-block: 1.15rem 1.35rem;
  }

  .refonte-xp__mission-lead {
    border-right: none;
    padding-right: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--rf-line);
    align-content: start;
  }

  .refonte-xp__mission-body {
    align-content: start;
    gap: 1.35rem;
    width: 100%;
  }

  .refonte-xp__beat,
  .refonte-xp__beat-list li,
  .refonte-xp__beat-stack span {
    opacity: 1 !important;
    transform: none !important;
  }
}

@media (max-height: 900px) and (min-width: 960px) {
  .refonte-xp__head {
    gap: 0.75rem;
  }

  .refonte-xp__lead {
    font-size: 0.86rem;
    line-height: 1.45;
  }

  .refonte-xp__stage {
    display: flex;
    align-items: center;
    height: 100%;
    min-height: 0;
  }

  .refonte-xp__stage > * {
    width: 100%;
  }

  .refonte-xp__mission {
    align-items: center;
    gap: clamp(1.1rem, 2.4vh, 1.65rem);
    padding-block: clamp(0.5rem, 1.5vh, 1rem);
  }

  .refonte-xp__mission-lead {
    align-content: center;
  }

  .refonte-xp__mission-body {
    align-content: center;
    gap: clamp(0.7rem, 1.45vh, 1rem);
  }

  .refonte-xp__mission-index {
    margin: 0 0 0.2rem;
    font-size: clamp(2rem, 5vh, 2.85rem);
  }

  .refonte-xp__mission-role {
    font-size: clamp(0.88rem, 1.55vh, 1rem);
  }

  .refonte-xp__mission-company {
    margin-top: 0.3rem;
    font-size: clamp(1.12rem, 2.35vh, 1.45rem);
  }

  .refonte-xp__mission-place {
    font-size: clamp(0.76rem, 1.3vh, 0.82rem);
  }

  .refonte-xp__mission-period {
    margin-top: 0.5rem;
    font-size: 0.66rem;
  }

  .refonte-xp__mission-steps {
    margin-top: 0.65rem;
  }

  .refonte-xp__beat {
    grid-template-columns: 1.65rem minmax(0, 1fr);
    gap: 0.65rem;
  }

  .refonte-xp__beat-num {
    margin-top: 0.05rem;
    font-size: clamp(0.9rem, 1.55vh, 1rem);
  }

  .refonte-xp__beat-content {
    gap: 0.35rem;
  }

  .refonte-xp__beat-text {
    font-size: clamp(0.86rem, 1.55vh, 0.94rem);
    line-height: 1.5;
  }

  .refonte-xp__beat-list {
    gap: 0.42rem;
  }

  .refonte-xp__beat-list li {
    grid-template-columns: 1.35rem minmax(0, 1fr);
    gap: 0.42rem;
    font-size: clamp(0.82rem, 1.45vh, 0.9rem);
    line-height: 1.4;
  }

  .refonte-xp__beat-list-idx {
    font-size: 0.82rem;
  }

  .refonte-xp__beat-stack {
    gap: 0.35rem;
  }

  .refonte-xp__beat-stack span {
    font-size: clamp(0.68rem, 1.2vh, 0.74rem);
    padding: 0.28rem 0.58rem;
  }

  .refonte-xp__pin {
    padding-bottom: 0.65rem;
  }

  .refonte-xp__rail-area {
    gap: 0.4rem;
  }

  .refonte-xp__timeline {
    padding-bottom: 0.35rem;
  }

  .refonte-xp__timeline-dot {
    padding: 0.15rem 0;
    font-size: 0.55rem;
    letter-spacing: 0.08em;
  }

  .refonte-xp__track {
    gap: 0.45rem;
    padding: 0.1rem 0 0.2rem;
  }

  .refonte-xp__card {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    column-gap: 0.55rem;
    row-gap: 0.12rem;
    padding: 0.5rem 0.65rem;
  }

  .refonte-xp__card-num {
    grid-row: 1 / span 2;
    font-size: clamp(0.95rem, 1.8vh, 1.15rem);
  }

  .refonte-xp__card-company {
    font-size: clamp(0.76rem, 1.35vh, 0.88rem);
    line-height: 1.1;
  }

  .refonte-xp__card-role {
    font-size: 0.65rem;
    line-height: 1.2;
  }

  .refonte-xp__card-period,
  .refonte-xp__card-location {
    display: none;
  }

  .refonte-xp__card.is-active {
    transform: none;
    box-shadow: 2px 2px 0 rgba(11, 26, 58, 0.3);
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
