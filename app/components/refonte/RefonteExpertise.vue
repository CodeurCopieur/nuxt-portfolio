<script setup lang="ts">
import { categoryAvg, categoryLetter } from '~/utils/skill-ratings'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const { sections } = useContent()
const { scroll, ready, refresh } = useRefonteScroll()

const CATEGORY_LABELS: Record<string, string> = {
  langages: 'Langages',
  frameworks: 'Frameworks',
  outils_dev: 'Outils',
  ui_animations: 'UI & motion',
  design: 'Design',
  environnements: 'Environnements',
  methodes: 'Méthodes',
  ia_cursor: 'IA',
  accessibilite: 'Accessibilité'
}

const RADAR_LABELS: Record<string, string> = {
  langages: 'Langages',
  frameworks: 'Frameworks',
  outils_dev: 'Outils',
  ui_animations: 'UI / Motion',
  design: 'Design',
  environnements: 'Env.',
  methodes: 'Méthodes',
  ia_cursor: 'IA',
  accessibilite: 'A11y'
}

const scrollerRef = ref<HTMLElement | null>(null)
const smooth = ref(0)
const isDesktop = ref(import.meta.client ? window.innerWidth >= 768 : true)

const SCROLL_TRAVEL = 3000

let rafId = 0
let targetP = 0

function labelFor(key: string) {
  return CATEGORY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const categories = computed(() => {
  const order = sections.value.competences_order?.length
    ? sections.value.competences_order
    : Object.keys(sections.value.competences)

  return order
    .map((key) => ({
      key,
      label: labelFor(key),
      radarLabel: RADAR_LABELS[key] ?? labelFor(key),
      skills: sections.value.competences[key] ?? [],
      avg: categoryAvg(key, sections.value.competences[key] ?? []),
      letter: categoryLetter(key, sections.value.competences[key] ?? [])
    }))
    .filter((cat) => cat.skills.length > 0)
})

const totalSkills = computed(() => categories.value.reduce((n, c) => n + c.skills.length, 0))

const statTargets = computed(() => [
  { target: sections.value.experiences.length, label: 'Missions', pad: 2 },
  { target: totalSkills.value, label: 'Technologies', pad: 2 },
  { target: categories.value.length, label: 'Domaines', pad: 2 }
])

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
 * 0–0.22  décompte chiffres
 * 0.20–0.55 radar grand / dessiné
 * 0.52–0.64 radar sort
 * 0.60–1.00 liste à la place du radar
 */

const liveStats = computed(() => {
  const t = easeOut(span(p.value, 0.02, 0.2))
  return statTargets.value.map((s) => ({
    ...s,
    display: String(Math.round(s.target * t)).padStart(s.pad, '0')
  }))
})

const statsCompact = computed(() => easeInOut(span(p.value, 0.18, 0.3)))

const radarOpacity = computed(() => {
  const enter = easeOut(span(p.value, 0.18, 0.3))
  const exit = 1 - easeInOut(span(p.value, 0.52, 0.64))
  return Math.round(enter * exit * 40) / 40
})

const radarScale = computed(() => {
  const grow = 0.92 + easeOut(span(p.value, 0.2, 0.42)) * 0.08
  const exit = 1 - easeInOut(span(p.value, 0.52, 0.64)) * 0.25
  return Math.round(grow * exit * 50) / 50
})

const radarDraw = computed(() => Math.round(easeOut(span(p.value, 0.22, 0.48)) * 40) / 40)
const scoreOpacity = computed(() => Math.round(easeOut(span(p.value, 0.34, 0.5)) * 40) / 40)

/** Liste apparaît dans la même zone que le radar. */
const listOpacity = computed(() => {
  if (!isDesktop.value) return 1
  return Math.round(easeOut(span(p.value, 0.6, 0.7)) * 40) / 40
})

const listVisible = computed(() => listOpacity.value > 0.02 || !isDesktop.value)

function groupStyle(catIndex: number) {
  if (!isDesktop.value) return { opacity: 1, transform: 'none' }
  const start = 0.62 + catIndex * 0.04
  const t = easeOut(span(p.value, start, start + 0.08))
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 20}px)`
  }
}

function pillStyle(catIndex: number, skillIndex: number) {
  if (!isDesktop.value) return { opacity: 1, transform: 'none' }
  const start = 0.64 + catIndex * 0.04 + skillIndex * 0.005
  const t = easeOut(span(p.value, start, start + 0.05))
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 8}px)`
  }
}

const actLabel = computed(() => {
  if (p.value < 0.24) return '01 — Chiffres'
  if (p.value < 0.6) return '02 — Radar'
  return '03 — Détail'
})

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}

const radarSize = 640
const radarCx = radarSize / 2
const radarCy = radarSize / 2
const radarMaxR = 195

const radarAxes = computed(() => {
  const cats = categories.value.slice(0, 8)
  const n = Math.max(cats.length, 3)
  const draw = radarDraw.value
  return cats.map((cat, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2
    const r = (cat.avg / 20) * radarMaxR * draw
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      ...cat,
      x: radarCx + cos * r,
      y: radarCy + sin * r,
      labelX: radarCx + cos * (radarMaxR + 44),
      labelY: radarCy + sin * (radarMaxR + 44),
                  scoreX: radarCx + cos * (r + 28),
                  scoreY: radarCy + sin * (r + 28),
      gridX: (level: number) => radarCx + cos * radarMaxR * level,
      gridY: (level: number) => radarCy + sin * radarMaxR * level
    }
  })
})

const radarPolygon = computed(() =>
  radarAxes.value.map((a) => `${a.x.toFixed(1)},${a.y.toFixed(1)}`).join(' ')
)

const radarGridLevels = [0.33, 0.66, 1]

function gridPolygon(level: number) {
  const axes = radarAxes.value
  if (!axes.length) return ''
  return axes.map((a) => `${a.gridX(level).toFixed(1)},${a.gridY(level).toFixed(1)}`).join(' ')
}

const scrollerHeight = computed(() =>
  isDesktop.value ? `calc(100dvh - var(--rf-nav-h) + ${SCROLL_TRAVEL}px)` : 'auto'
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
  <RefonteSection chapter="Savoir-faire" :scroll-section="false" flush class="rf-expertise">
    <div
      ref="scrollerRef"
      class="rf-expertise__scroller"
      :style="isDesktop ? { height: scrollerHeight } : undefined"
    >
      <div class="rf-expertise__pin">
        <div class="refonte-container rf-expertise__frame">
          <header class="rf-expertise__head">
            <div>
              <p class="refonte-label">04 — Savoir-faire</p>
              <h2 class="refonte-display rf-expertise__title">Compétences</h2>
            </div>
            <p class="rf-expertise__act" aria-hidden="true">{{ actLabel }}</p>
          </header>

          <!-- Chiffres : toujours sous le titre, dans le container — pas de vide géant -->
          <div
            class="rf-expertise__stats"
            :style="{ '--rf-compact': statsCompact }"
          >
            <div
              v-for="stat in liveStats"
              :key="stat.label"
              class="rf-expertise__stat"
            >
              <span class="rf-expertise__stat-value refonte-serif">{{ stat.display }}</span>
              <span class="rf-expertise__stat-label">{{ stat.label }}</span>
            </div>
          </div>

          <!-- Même zone : radar puis liste à la place -->
          <div class="rf-expertise__stage">
            <div
              class="rf-expertise__radar"
              aria-hidden="true"
              :style="{
                opacity: radarOpacity,
                transform: `scale(${radarScale})`,
                visibility: radarOpacity < 0.02 ? 'hidden' : 'visible'
              }"
            >
              <svg
                class="rf-expertise__radar-svg"
                :viewBox="`0 0 ${radarSize} ${radarSize}`"
                fill="none"
              >
                <polygon
                  v-for="level in radarGridLevels"
                  :key="level"
                  :points="gridPolygon(level)"
                  class="rf-expertise__radar-grid"
                />
                <line
                  v-for="(axis, i) in radarAxes"
                  :key="`axis-${i}`"
                  :x1="radarCx"
                  :y1="radarCy"
                  :x2="axis.gridX(1)"
                  :y2="axis.gridY(1)"
                  class="rf-expertise__radar-axis"
                />
                <polygon
                  v-if="radarAxes.length"
                  :points="radarPolygon"
                  class="rf-expertise__radar-shape"
                />
                <g v-for="(axis, i) in radarAxes" :key="`pt-${i}`">
                  <circle :cx="axis.x" :cy="axis.y" r="4.5" class="rf-expertise__radar-dot" />
                  <text
                    :x="axis.scoreX"
                    :y="axis.scoreY"
                    class="rf-expertise__radar-score"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    :opacity="scoreOpacity"
                  >
                    {{ axis.letter }}
                  </text>
                  <text
                    :x="axis.labelX"
                    :y="axis.labelY"
                    class="rf-expertise__radar-label"
                    text-anchor="middle"
                    dominant-baseline="middle"
                  >
                    {{ axis.radarLabel }}
                  </text>
                </g>
              </svg>
            </div>

            <div
              class="rf-expertise__groups"
              :style="{
                opacity: listOpacity,
                visibility: listVisible ? 'visible' : 'hidden',
                pointerEvents: listOpacity > 0.2 ? 'auto' : 'none'
              }"
            >
              <div
                v-for="(cat, ci) in categories"
                :key="cat.key"
                class="rf-expertise__group"
                :style="groupStyle(ci)"
              >
                <div class="rf-expertise__group-head">
                  <span class="rf-expertise__group-num">{{ pad(ci) }}</span>
                  <h3 class="rf-expertise__group-label">{{ cat.label }}</h3>
                  <span class="rf-expertise__group-avg rf-grade">{{ cat.letter }}</span>
                </div>
                <div class="rf-expertise__group-pills">
                  <span
                    v-for="(skill, si) in cat.skills"
                    :key="skill"
                    class="rf-expertise__pill"
                    :style="pillStyle(ci, si)"
                  >{{ skill }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RefonteSection>
</template>

<style scoped>
.rf-expertise__scroller {
  position: relative;
}

/* Collé pile sous la nav — pas de padding fantôme */
.rf-expertise__pin {
  position: sticky;
  top: var(--rf-nav-h);
  height: calc(100dvh - var(--rf-nav-h));
  min-height: calc(100dvh - var(--rf-nav-h));
  box-sizing: border-box;
  overflow: hidden;
}

.rf-expertise__frame {
  height: 100%;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 0;
  padding-block: 0.65rem 0.75rem;
  box-sizing: border-box;
}

.rf-expertise__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.rf-expertise__title {
  margin: 0.25rem 0 0;
  font-size: clamp(1.85rem, 4.5vw, 3rem);
  line-height: 1;
}

.rf-expertise__act {
  margin: 0.35rem 0 0;
  flex-shrink: 0;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rf-accent);
  opacity: 0.75;
}

.rf-expertise__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.5rem);
  margin-top: 0.55rem;
  padding-block: 0.65rem;
  border-top: 1px solid var(--rf-line);
  border-bottom: 1px solid var(--rf-line);
  width: 100%;
  box-sizing: border-box;
}

.rf-expertise__stat {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.rf-expertise__stat-value {
  /* Compacte au scroll via --rf-compact (0→1), sans scale qui déborde */
  font-size: calc(
    (1 - var(--rf-compact, 0)) * clamp(2.75rem, 7vw, 4.5rem)
    + var(--rf-compact, 0) * clamp(1.65rem, 3.5vw, 2.4rem)
  );
  color: var(--rf-accent);
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
}

.rf-expertise__stat-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-expertise__stage {
  position: relative;
  min-height: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  /* Respire entre chiffres et radar / liste */
  margin-top: clamp(1.25rem, 3vw, 2rem);
  padding-top: clamp(0.35rem, 1vw, 0.75rem);
}

.rf-expertise__radar {
  position: absolute;
  inset: 0;
  margin: auto;
  width: min(100%, 98%);
  height: min(100%, 98%);
  max-width: 720px;
  max-height: 720px;
  aspect-ratio: 1;
  will-change: opacity, transform;
  transform-origin: center center;
  z-index: 1;
}

.rf-expertise__radar-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rf-expertise__radar-grid {
  stroke: rgba(245, 242, 232, 0.14);
  stroke-width: 1.35;
  fill: rgba(214, 242, 76, 0.04);
}

.rf-expertise__radar-axis {
  stroke: rgba(245, 242, 232, 0.16);
  stroke-width: 1.1;
}

.rf-expertise__radar-shape {
  fill: rgba(var(--rf-accent-rgb), 0.2);
  stroke: var(--rf-accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.rf-expertise__radar-dot {
  fill: var(--rf-accent);
}

.rf-expertise__radar-score {
  fill: var(--rf-accent);
  font-size: 28px;
  font-family: var(--rf-comic);
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.04em;
  paint-order: stroke fill;
  stroke: rgba(11, 10, 8, 0.9);
  stroke-width: 3.5px;
}

.rf-expertise__radar-label {
  fill: var(--rf-text-soft);
  font-size: 12px;
  font-family: var(--rf-sans);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Liste = même place que le radar */
.rf-expertise__groups {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  align-content: start;
  gap: clamp(1rem, 2.2vw, 1.45rem);
  padding: clamp(0.5rem, 1.5vw, 1rem) 0 1rem;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rf-expertise__groups::-webkit-scrollbar {
  display: none;
}

.rf-expertise__group-head {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.rf-expertise__group-num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--rf-text-muted);
  flex-shrink: 0;
}

.rf-expertise__group-label {
  margin: 0;
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  font-weight: 700;
  color: var(--rf-text);
  min-width: 0;
}

.rf-expertise__group-avg {
  margin-left: auto;
  flex-shrink: 0;
  font-size: clamp(1.6rem, 3.2vw, 2.1rem);
}

.rf-expertise__group-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.rf-expertise__pill {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.38rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--rf-line);
  color: var(--rf-text-soft);
}

.rf-expertise__pill:hover {
  border-color: rgba(var(--rf-accent-rgb), 0.5);
  color: var(--rf-accent);
}

@media (max-width: 767px) {
  .rf-expertise__pin {
    position: relative;
    top: auto;
    height: auto;
    min-height: auto;
    overflow: visible;
  }

  .rf-expertise__frame {
    height: auto;
    grid-template-rows: auto auto auto;
    padding-block: 1.25rem;
  }

  .rf-expertise__stage {
    position: relative;
    min-height: 300px;
    margin-block: 0.5rem 1rem;
    display: grid;
    gap: 1.5rem;
  }

  .rf-expertise__radar {
    position: relative;
    inset: auto;
    width: min(100%, 380px);
    height: auto;
    max-width: none;
    max-height: none;
    opacity: 0.85 !important;
    transform: none !important;
    visibility: visible !important;
  }

  .rf-expertise__groups {
    position: relative;
    inset: auto;
    opacity: 1 !important;
    visibility: visible !important;
    overflow: visible;
    padding: 0;
  }

  .rf-expertise__stat-value {
    font-size: clamp(2.1rem, 11vw, 3rem) !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rf-expertise__radar,
  .rf-expertise__groups,
  .rf-expertise__group,
  .rf-expertise__pill {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }
}
</style>
