<script setup lang="ts">
import { sortProjectsByYear } from '~/utils/sort-projects'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const { sections } = useContent()
const { scroll, ready, refresh } = useRefonteScroll()

const scrollerRef = ref<HTMLElement | null>(null)
const smooth = ref(0)
const isDesktop = ref(false)

const FOCUS_START = 0.16
const FOCUS_END = 0.72
const LIST_START = 0.7

let rafId = 0
let targetP = 0

const projects = computed(() => sortProjectsByYear(sections.value.projets).slice(0, 6))
const total = computed(() => projects.value.length)

/** Course adaptée au nombre de projets (assez de dwell par focus). */
const SCROLL_TRAVEL = computed(() => 720 + Math.max(total.value, 1) * 640)

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}

function span(p: number, start: number, end: number) {
  if (end <= start) return p >= end ? 1 : 0
  return Math.min(Math.max((p - start) / (end - start), 0), 1)
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2
}

const p = computed(() => smooth.value)

/*
 * ACTE 01 — Manifeste (0–0.18)
 * ACTE 02 — Focus : chaque projet un par un (0.16–0.72)
 * ACTE 03 — Index liste (0.70–1)
 */

const countT = computed(() => easeOut(span(p.value, 0.02, 0.14)))
const liveCount = computed(() => String(Math.round(total.value * countT.value)).padStart(2, '0'))

const manifestoOpacity = computed(() => {
  if (!isDesktop.value) return 0
  const enter = easeOut(span(p.value, 0, 0.06))
  const exit = 1 - easeInOut(span(p.value, 0.12, 0.2))
  return Math.round(enter * exit * 40) / 40
})

const manifestoScale = computed(() => {
  const grow = 0.94 + easeOut(span(p.value, 0.02, 0.12)) * 0.06
  const exit = 1 - easeInOut(span(p.value, 0.12, 0.2)) * 0.18
  return Math.round(grow * exit * 50) / 50
})

/** Progression 0→1 dans la zone focus multi-projets. */
const focusRail = computed(() => span(p.value, FOCUS_START, FOCUS_END))

/** Index scroll brut (peut osciller près des seuils). */
const focusIndexRaw = computed(() => {
  const n = total.value
  if (n <= 0) return 0
  if (focusRail.value >= 0.999) return n - 1
  return Math.min(n - 1, Math.floor(focusRail.value * n))
})

/** Index stabilisé : évite les bascules saccadées au bord d’un segment. */
const focusIndex = ref(0)
watch(
  focusIndexRaw,
  (next) => {
    const n = total.value
    if (n <= 0) {
      focusIndex.value = 0
      return
    }
    const clamped = Math.min(Math.max(next, 0), n - 1)
    if (clamped === focusIndex.value) return

    const scaled = focusRail.value * n
    const center = focusIndex.value + 0.5
    // Ne change que si on a clairement dépassé le milieu du segment courant.
    if (clamped > focusIndex.value && scaled >= focusIndex.value + 0.55) {
      focusIndex.value = clamped
    } else if (clamped < focusIndex.value && scaled <= focusIndex.value + 0.45) {
      focusIndex.value = clamped
    } else if (Math.abs(clamped - focusIndex.value) > 1) {
      focusIndex.value = clamped
    }
  },
  { immediate: true }
)

watch(total, (n) => {
  if (focusIndex.value > Math.max(n - 1, 0)) focusIndex.value = Math.max(n - 1, 0)
})

const activeProject = computed(() => projects.value[focusIndex.value] ?? null)

const inFocusAct = computed(() => p.value >= FOCUS_START - 0.02 && p.value < LIST_START + 0.02)

const focusShellOpacity = computed(() => {
  if (!isDesktop.value) return 0
  const enter = easeOut(span(p.value, FOCUS_START - 0.02, FOCUS_START + 0.06))
  const exit = 1 - easeInOut(span(p.value, LIST_START - 0.04, LIST_START + 0.08))
  return Math.round(enter * exit * 40) / 40
})

const listOpacity = computed(() => {
  if (!isDesktop.value) return 1
  return Math.round(easeOut(span(p.value, LIST_START, LIST_START + 0.1)) * 40) / 40
})

const listVisible = computed(() => listOpacity.value > 0.02 || !isDesktop.value)

const headCompact = computed(() => easeInOut(span(p.value, 0.1, 0.2)))

const actLabel = computed(() => {
  if (p.value < FOCUS_START) return '01 — Projets'
  if (p.value < LIST_START) {
    return `02 — Focus ${pad(focusIndex.value)}/${pad(Math.max(total.value - 1, 0))}`
  }
  return '03 — Liste'
})

function rowStyle(index: number) {
  if (!isDesktop.value) return { opacity: 1, transform: 'none' }
  const start = LIST_START + 0.02 + index * 0.04
  const t = easeOut(span(p.value, start, start + 0.08))
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 28}px)`
  }
}

const scrollerHeight = computed(() =>
  isDesktop.value ? `calc(100dvh - var(--rf-nav-h) + ${SCROLL_TRAVEL.value}px)` : 'auto'
)

function getNavOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--rf-nav-h').trim()
  const parsed = Number.parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 72
}

function tickSmooth() {
  const diff = targetP - smooth.value
  if (Math.abs(diff) < 0.0008) {
    smooth.value = targetP
    rafId = 0
    return
  }
  smooth.value += diff * 0.2
  rafId = requestAnimationFrame(tickSmooth)
}

function updateProgress() {
  if (!import.meta.client || !isDesktop.value) {
    targetP = 1
    smooth.value = 1
    return
  }
  const el = scrollerRef.value
  if (!el) return
  const nav = getNavOffset()
  const viewportH = window.innerHeight - nav
  const scrolledInto = Math.max(0, nav - el.getBoundingClientRect().top)
  const maxScroll = Math.max(el.offsetHeight - viewportH, 1)
  targetP = Math.min(scrolledInto / maxScroll, 1)
  if (!rafId) rafId = requestAnimationFrame(tickSmooth)
}

let scrollHandler: (() => void) | null = null
let resizeHandler: (() => void) | null = null

function bind() {
  unbind()
  updateProgress()
  scrollHandler = () => updateProgress()
  const lenis = scroll.value?.lenisInstance
  if (lenis) lenis.on('scroll', scrollHandler)
  else window.addEventListener('scroll', scrollHandler, { passive: true })

  resizeHandler = () => {
    isDesktop.value = window.innerWidth >= 768
    updateProgress()
    refresh()
  }
  window.addEventListener('resize', resizeHandler, { passive: true })
}

function unbind() {
  const lenis = scroll.value?.lenisInstance
  if (lenis && scrollHandler) lenis.off('scroll', scrollHandler)
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  scrollHandler = null
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

watch(ready, (ok) => {
  if (ok) nextTick(() => {
    bind()
    refresh()
  })
}, { immediate: true })

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768
  if (!isDesktop.value) {
    smooth.value = 1
    targetP = 1
  }
  nextTick(() => {
    bind()
    setTimeout(() => {
      updateProgress()
      refresh()
    }, 300)
  })
})

onUnmounted(() => unbind())
</script>

<template>
  <RefonteSection chapter="Réalisations" :scroll-section="false" flush class="rf-works">
    <div
      ref="scrollerRef"
      class="rf-works__scroller"
      :style="isDesktop ? { height: scrollerHeight } : undefined"
    >
      <div class="rf-works__pin">
        <div class="refonte-container rf-works__frame">
          <header
            class="rf-works__head"
            :style="{ '--rf-compact': headCompact }"
          >
            <div class="rf-works__head-main">
              <p class="refonte-label">03 — Réalisations</p>
              <h2 class="refonte-display rf-works__title">
                Travaux
                <span class="refonte-serif rf-works__title-serif">sélectionnés</span>
              </h2>
            </div>
            <div class="rf-works__head-side">
              <p class="rf-works__act" aria-hidden="true">{{ actLabel }}</p>
              <RefonteLink to="/refonte/projets" class="refonte-link rf-works__all">
                Archives →
              </RefonteLink>
            </div>
          </header>

          <div class="rf-works__stage">
            <!-- ACTE 01 — Manifeste -->
            <div
              class="rf-works__manifesto"
              aria-hidden="true"
              :style="{
                opacity: manifestoOpacity,
                transform: `scale(${manifestoScale})`,
                visibility: manifestoOpacity < 0.02 ? 'hidden' : 'visible'
              }"
            >
              <p class="rf-works__manifesto-kicker">Sélection</p>
              <p class="rf-works__manifesto-count refonte-serif">{{ liveCount }}</p>
              <p class="rf-works__manifesto-label">projets mis en avant</p>
              <p class="rf-works__manifesto-lead">
                Des interfaces pensées pour tenir la charge — du brief à la prod.
              </p>
            </div>

            <!-- ACTE 02 — Focus desktop only (liste seule en mobile) -->
            <div
              v-if="isDesktop"
              class="rf-works__focus-shell"
              :style="{
                opacity: focusShellOpacity,
                visibility: focusShellOpacity < 0.02 ? 'hidden' : 'visible'
              }"
            >
              <Transition name="rf-works-focus" mode="out-in">
                <div
                  v-if="activeProject && inFocusAct"
                  :key="activeProject.slug"
                  class="rf-works__focus"
                >
                  <p class="rf-works__focus-num">{{ pad(focusIndex) }}</p>
                  <h3 class="rf-works__focus-title">{{ activeProject.title }}</h3>
                  <p class="rf-works__focus-meta">
                    {{ activeProject.org }} · {{ activeProject.year }}
                  </p>
                  <p class="rf-works__focus-summary">{{ activeProject.summary }}</p>
                  <div class="rf-works__focus-stack">
                    <span
                      v-for="tech in activeProject.stack.slice(0, 5)"
                      :key="tech"
                    >{{ tech }}</span>
                  </div>
                  <RefonteLink
                    :to="`/refonte/projets/${activeProject.slug}`"
                    class="rf-works__focus-cta"
                  >
                    Voir le projet →
                  </RefonteLink>
                </div>
              </Transition>
            </div>

            <!-- ACTE 03 — Index (même place) -->
            <ul
              class="rf-works__list"
              :style="{
                opacity: listOpacity,
                visibility: listVisible ? 'visible' : 'hidden',
                pointerEvents: listOpacity > 0.2 ? 'auto' : 'none'
              }"
            >
              <li
                v-for="(project, index) in projects"
                :key="project.slug"
                class="rf-works__row"
                :style="rowStyle(index)"
              >
                <RefonteLink :to="`/refonte/projets/${project.slug}`" class="rf-works__link">
                  <span class="rf-works__num">{{ pad(index) }}</span>
                  <span class="rf-works__body">
                    <span class="rf-works__name">{{ project.title }}</span>
                    <span class="rf-works__stack">{{ project.stack.slice(0, 3).join(' · ') }}</span>
                    <span class="rf-works__meta">{{ project.org }} · {{ project.year }}</span>
                  </span>
                  <span class="rf-works__arrow" aria-hidden="true">→</span>
                </RefonteLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </RefonteSection>
</template>

<style scoped>
.rf-works__scroller {
  position: relative;
}

.rf-works__pin {
  position: sticky;
  top: var(--rf-nav-h);
  height: calc(100dvh - var(--rf-nav-h));
  min-height: calc(100dvh - var(--rf-nav-h));
  box-sizing: border-box;
  overflow: hidden;
  /* Respire sous la nav au moment où la chorégraphie démarre */
  padding-top: var(--rf-section-pin-pad);
}

.rf-works__frame {
  --rf-works-num: clamp(1.75rem, 3vw, 2.5rem);
  --rf-works-gap: clamp(0.75rem, 2vw, 1.15rem);
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0;
  padding-block: 0 0.75rem;
  box-sizing: border-box;
}

.rf-works__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-bottom: calc(0.85rem + (1 - var(--rf-compact, 0)) * 0.4rem);
  border-bottom: 1px solid var(--rf-line);
}

.rf-works__head-main {
  min-width: 0;
}

.rf-works__title {
  margin: 0.35rem 0 0;
  font-size: calc(
    (1 - var(--rf-compact, 0)) * var(--rf-section-title-size)
    + var(--rf-compact, 0) * clamp(1.65rem, 3.5vw, 2.35rem)
  );
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.rf-works__title-serif {
  color: var(--rf-accent);
}

.rf-works__head-side {
  display: grid;
  gap: 0.45rem;
  justify-items: end;
  flex-shrink: 0;
}

.rf-works__act {
  margin: 0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rf-accent);
  opacity: 0.75;
}

.rf-works__all {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--rf-text-soft);
  white-space: nowrap;
}

.rf-works__stage {
  position: relative;
  min-height: 0;
  margin-top: clamp(1.25rem, 3vw, 2rem);
  overflow: hidden;
}

/* ACTE 01 */
.rf-works__manifesto {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 0.35rem;
  transform-origin: left center;
  will-change: opacity, transform;
}

.rf-works__manifesto-kicker {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-works__manifesto-count {
  margin: 0;
  font-size: clamp(5.5rem, 18vw, 11rem);
  line-height: 0.85;
  color: var(--rf-accent);
  font-variant-numeric: tabular-nums;
}

.rf-works__manifesto-label {
  margin: 0;
  font-size: clamp(1rem, 2.4vw, 1.35rem);
  font-weight: 600;
  color: var(--rf-accent);
}

.rf-works__manifesto-lead {
  margin: 1rem 0 0;
  max-width: 34ch;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--rf-text-muted);
}

/* ACTE 02 */
.rf-works__focus-shell {
  position: absolute;
  inset: 0;
  z-index: 2;
  will-change: opacity;
}

.rf-works__focus {
  position: absolute;
  inset: 0;
  display: grid;
  align-content: center;
  gap: 0.55rem;
}

.rf-works-focus-enter-active {
  transition: opacity 0.45s var(--rf-ease), transform 0.45s var(--rf-ease);
}

.rf-works-focus-leave-active {
  transition: opacity 0.28s var(--rf-ease), transform 0.28s var(--rf-ease);
}

.rf-works-focus-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.rf-works-focus-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.rf-works__focus-num {
  margin: 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--rf-text-muted);
}

.rf-works__focus-title {
  margin: 0;
  font-size: clamp(2rem, 5.5vw, 3.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--rf-text);
}

.rf-works__focus-meta {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-accent);
}

.rf-works__focus-summary {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--rf-text-soft);
}

.rf-works__focus-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.75rem;
}

.rf-works__focus-stack span {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
  color: var(--rf-text-muted);
}

.rf-works__focus-cta {
  margin-top: 0.85rem;
  justify-self: start;
  width: fit-content;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--rf-accent);
  text-decoration: none;
}

.rf-works__focus-cta:hover {
  text-decoration: none;
}

/* ACTE 03 — Index */
.rf-works__list {
  position: absolute;
  inset: 0;
  z-index: 3;
  list-style: none;
  margin: 0;
  padding: 0.25rem 0 0.75rem;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rf-works__list::-webkit-scrollbar {
  display: none;
}

.rf-works__row {
  border-bottom: 1px solid var(--rf-line);
}

.rf-works__link {
  display: grid;
  grid-template-columns: var(--rf-works-num) minmax(0, 1fr) 1.75rem;
  column-gap: var(--rf-works-gap);
  align-items: center;
  padding-block: clamp(1.05rem, 2.5vw, 1.55rem);
  padding-inline: clamp(0.65rem, 2.2vw, 1.35rem) 0.35rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.3s var(--rf-ease);
}

.rf-works__link.refonte-link::after {
  display: none;
}

.rf-works__link:hover,
.rf-works__link:focus-visible {
  background: rgba(255, 255, 255, 0.03);
}

.rf-works__num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--rf-text-muted);
  align-self: center;
  line-height: 1;
}

.rf-works__body {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

.rf-works__name {
  font-size: clamp(1.2rem, 2.8vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--rf-text);
  transition: color 0.3s var(--rf-ease);
}

.rf-works__link:hover .rf-works__name {
  color: var(--rf-accent);
}

.rf-works__stack {
  font-size: 0.76rem;
  color: var(--rf-text-muted);
}

.rf-works__meta {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
  margin-top: 0.15rem;
}

.rf-works__arrow {
  display: grid;
  place-items: center;
  width: 1.75rem;
  font-size: 1.2rem;
  line-height: 1;
  color: var(--rf-text-muted);
  transform: rotate(-45deg);
  transition: transform 0.35s var(--rf-ease), color 0.35s var(--rf-ease);
  justify-self: end;
}

.rf-works__link:hover .rf-works__arrow {
  transform: rotate(0deg);
  color: var(--rf-accent);
}

@media (max-width: 767px) {
  .rf-works__pin {
    position: relative;
    top: auto;
    height: auto;
    min-height: auto;
    overflow: visible;
    padding-top: var(--rf-section-pin-pad);
  }

  .rf-works__frame {
    height: auto;
    padding-block: 0 0.5rem;
  }

  .rf-works__stage {
    display: grid;
    gap: 1.25rem;
    margin-top: 1.15rem;
    overflow: visible;
  }

  .rf-works__manifesto,
  .rf-works__focus {
    position: relative;
    inset: auto;
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }

  .rf-works__focus-shell,
  .rf-works__focus-mobile {
    display: none !important;
  }

  .rf-works__manifesto-count {
    font-size: clamp(4rem, 22vw, 6rem);
  }

  .rf-works__list {
    position: relative;
    inset: auto;
    opacity: 1 !important;
    visibility: visible !important;
    overflow: visible;
    padding: 0;
  }

  .rf-works__link {
    grid-template-columns: var(--rf-works-num) minmax(0, 1fr);
  }

  .rf-works__arrow,
  .rf-works__stack {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rf-works__manifesto,
  .rf-works__focus,
  .rf-works__list,
  .rf-works__row {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }
}
</style>
