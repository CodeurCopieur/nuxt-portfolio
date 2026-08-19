<script setup lang="ts">
import {
  categoryAvg,
  categoryLetter,
  ratingTier,
  ratingToLetter,
  skillRating
} from '~/utils/skill-ratings'
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
  ui_animations: 'UI & motion',
  design: 'Design',
  environnements: 'Environnements',
  methodes: 'Méthodes',
  ia_cursor: 'IA & Cursor',
  accessibilite: 'Accessibilité'
}

const scrollerRef = ref<HTMLElement | null>(null)
const smooth = ref(0)
const isDesktop = ref(false)
const openKey = ref<string | null>(null)
const scrollActive = ref(false)
const statsIntroStep = ref(0)
const sectionChoreActive = ref(false)

const SCROLL_TRAVEL_BASE = 2200
const SCROLL_TRAVEL_PER_CAT = 380
const SCROLL_IDLE_MS = 220
const SCROLL_SETTLE_EPS = 0.002

const DETAIL_START = 0.3
const DETAIL_END = 0.96
const FINALE_START = 0.94

let rafId = 0
let targetP = 0
let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null
let statsIntroTimers: ReturnType<typeof setTimeout>[] = []
let statsIntroPlayed = false

function clearStatsIntroTimers() {
  statsIntroTimers.forEach(clearTimeout)
  statsIntroTimers = []
}

function resetStatsIntro() {
  clearStatsIntroTimers()
  statsIntroStep.value = 0
  statsIntroPlayed = false
}

function startStatsIntro() {
  if (!isDesktop.value || statsIntroPlayed) return
  statsIntroPlayed = true
  clearStatsIntroTimers()
  statsIntroStep.value = 1
  statsIntroTimers.push(setTimeout(() => {
    statsIntroStep.value = Math.max(statsIntroStep.value, 2)
  }, 110))
  statsIntroTimers.push(setTimeout(() => {
    statsIntroStep.value = 3
  }, 220))
}

function markScrolling() {
  scrollActive.value = true
  if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
  scrollIdleTimer = setTimeout(checkScrollIdle, SCROLL_IDLE_MS)
}

function checkScrollIdle() {
  if (Math.abs(targetP - smooth.value) > SCROLL_SETTLE_EPS) {
    scrollIdleTimer = setTimeout(checkScrollIdle, 80)
    return
  }
  scrollActive.value = false
  scrollIdleTimer = null
}

function labelFor(key: string) {
  return CATEGORY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const categories = computed(() => {
  const order = sections.value.competences_order?.length
    ? sections.value.competences_order
    : Object.keys(sections.value.competences)

  const cats = order
    .map((key) => ({
      key,
      label: labelFor(key),
      radarLabel: RADAR_LABELS[key] ?? labelFor(key),
      skills: sections.value.competences[key] ?? [],
      avg: categoryAvg(key, sections.value.competences[key] ?? []),
      letter: categoryLetter(key, sections.value.competences[key] ?? [])
    }))
    .filter((cat) => cat.skills.length > 0)

  // Accessibilité toujours en tête
  const accessIndex = cats.findIndex((cat) => cat.key === 'accessibilite')
  if (accessIndex <= 0) return cats
  const next = [...cats]
  const [access] = next.splice(accessIndex, 1)
  return [access!, ...next]
})

watch(
  [categories, isDesktop],
  ([cats, desktop]) => {
    if (desktop) {
      openKey.value = null
      return
    }
    if (!cats.length) {
      openKey.value = null
      return
    }
    if (!openKey.value || !cats.some((cat) => cat.key === openKey.value)) {
      openKey.value = cats[0]!.key
    }
  },
  { immediate: true }
)

function isGroupOpen(key: string) {
  return isDesktop.value || openKey.value === key
}

function toggleGroup(key: string) {
  if (isDesktop.value) return
  openKey.value = openKey.value === key ? null : key
}

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
 * 0–0.04  apparition une par une (00, 00, 00)
 * 0.04–0.16 décompte chiffres
 * 0.14–0.26 montée vers le titre
 * 0.22–0.32 radar apparaît / se dessine
 * 0.30–0.96 parcours catégorie par catégorie (radar + détail droite)
 * 0.94–1.00 fin de chorégraphie
 */

const activeCatIndex = computed(() => {
  if (!isDesktop.value || p.value < DETAIL_START) return 0
  const cats = categories.value
  if (!cats.length) return 0
  if (p.value >= DETAIL_END) return cats.length - 1
  const t = (p.value - DETAIL_START) / (DETAIL_END - DETAIL_START)
  return Math.min(Math.floor(t * cats.length), cats.length - 1)
})

const activeCategory = computed(() => categories.value[activeCatIndex.value] ?? null)

const activeSkills = computed(() => {
  const cat = activeCategory.value
  if (!cat) return []
  return cat.skills.map((skill, index) => {
    const rating = skillRating(skill, cat.key, index)
    return {
      skill,
      rating,
      letter: ratingToLetter(rating),
      tier: ratingTier(rating)
    }
  })
})

const detailActive = computed(() => isDesktop.value && p.value >= DETAIL_START)

const isChoreographyComplete = computed(() =>
  isDesktop.value
  && p.value >= FINALE_START
  && activeCatIndex.value >= Math.max(categories.value.length - 1, 0)
)

const STAT_STAGGER = 0.013
const STAT_REVEAL_DUR = 0.022
const STAT_COUNT_START = 0.042

function statReveal(index: number) {
  if (!isDesktop.value || !sectionChoreActive.value) return 0
  if (index === 0) return 1
  if (p.value >= STAT_COUNT_START) return 1

  const scrollReveal = easeOut(span(p.value, index * STAT_STAGGER, index * STAT_STAGGER + STAT_REVEAL_DUR))
  const introVisible = statsIntroStep.value > index
  return Math.max(introVisible ? 1 : 0, scrollReveal)
}

function statItemStyle(reveal: number, index: number) {
  if (!isDesktop.value || !sectionChoreActive.value) {
    return { visibility: 'hidden' as const }
  }
  return {
    opacity: Math.round(reveal * 40) / 40,
    transform: `translateY(${(1 - reveal) * 1.1}rem)`,
    visibility: reveal < 0.015 && index > 0 ? 'hidden' as const : 'visible' as const
  }
}

const liveStats = computed(() => {
  const t = easeOut(span(p.value, STAT_COUNT_START, STAT_COUNT_START + 0.12))
  return statTargets.value.map((s, i) => ({
    ...s,
    display: String(Math.round(s.target * t)).padStart(s.pad, '0'),
    reveal: statReveal(i)
  }))
})

const statsCompact = computed(() => easeInOut(span(p.value, 0.14, 0.24)))

const statsCount = computed(() => easeOut(span(p.value, STAT_COUNT_START, STAT_COUNT_START + 0.12)))

const statsDock = computed(() => easeInOut(span(p.value, 0.14, 0.26)))

const statsStyle = computed(() => {
  const compact = statsCompact.value

  if (!isDesktop.value) {
    return { '--rf-compact': compact }
  }

  if (!sectionChoreActive.value) {
    return {
      '--rf-compact': compact,
      visibility: 'hidden' as const
    }
  }

  const dock = statsDock.value
  const count = statsCount.value
  const lineAlpha = Math.round(dock * 100) / 100
  const pushToCenter = (1 - dock) * 26
  const scale = 1.42 - dock * 0.32
  const riseIn = (1 - count) * 0.85

  return {
    '--rf-compact': compact,
    opacity: 1,
    transform: `translateY(calc(${pushToCenter}vh + ${riseIn}rem)) scale(${scale})`,
    transformOrigin: 'center center',
    borderTopColor: dock > 0.08 ? `rgba(255, 255, 255, ${0.14 * lineAlpha})` : 'transparent',
    borderBottomColor: dock > 0.08 ? `rgba(255, 255, 255, ${0.14 * lineAlpha})` : 'transparent',
    visibility: 'visible' as const
  }
})

const radarOpacity = computed(() => {
  if (!isDesktop.value || !sectionChoreActive.value) return 0
  return Math.round(easeOut(span(p.value, 0.22, 0.32)) * 40) / 40
})

const radarScale = computed(() => {
  if (!isDesktop.value || !sectionChoreActive.value) return 1
  const grow = 0.9 + easeOut(span(p.value, 0.22, 0.38)) * 0.1
  return Math.round(grow * 50) / 50
})

const radarDraw = computed(() => Math.round(easeOut(span(p.value, 0.24, 0.38)) * 40) / 40)

const detailOpacity = computed(() => {
  if (!isDesktop.value || !sectionChoreActive.value) return 0
  return Math.round(easeOut(span(p.value, 0.28, 0.36)) * 40) / 40
})

const finaleOpacity = computed(() => {
  if (!isDesktop.value) return 0
  return Math.round(easeOut(span(p.value, FINALE_START, 1)) * 40) / 40
})

function axisScoreOpacity(index: number) {
  const reveal = easeOut(span(p.value, 0.32, 0.42))
  if (reveal <= 0.02) return 0
  if (!detailActive.value) return reveal
  if (index === activeRadarIndex.value) return 1
  return scrollActive.value ? 0.4 : 0.58
}

function isAxisActive(index: number) {
  return detailActive.value && index === activeRadarIndex.value
}

const actLabel = computed(() => {
  if (p.value < 0.24) return '01 — Chiffres'
  if (p.value < DETAIL_START) return '02 — Radar'
  if (isChoreographyComplete.value) return 'Fin — Parcours complet'
  return activeCategory.value ? `03 — ${activeCategory.value.label}` : '03 — Détail'
})

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}

const radarSize = 720
const radarCx = radarSize / 2
const radarCy = radarSize / 2
const radarMaxR = 205

const radarAxes = computed(() => {
  const cats = categories.value
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
      labelX: radarCx + cos * (radarMaxR + 56),
      labelY: radarCy + sin * (radarMaxR + 56),
      gridX: (level: number) => radarCx + cos * radarMaxR * level,
      gridY: (level: number) => radarCy + sin * radarMaxR * level
    }
  })
})

const radarPolygon = computed(() =>
  radarAxes.value.map((a) => `${a.x.toFixed(1)},${a.y.toFixed(1)}`).join(' ')
)

const activeRadarIndex = computed(() => {
  const key = activeCategory.value?.key
  if (!key) return 0
  const idx = radarAxes.value.findIndex((a) => a.key === key)
  return idx >= 0 ? idx : 0
})

const focusedAxis = computed(() => radarAxes.value[activeRadarIndex.value] ?? null)

const radarGridLevels = [0.33, 0.66, 1]

function gridPolygon(level: number) {
  const axes = radarAxes.value
  if (!axes.length) return ''
  return axes.map((a) => `${a.gridX(level).toFixed(1)},${a.gridY(level).toFixed(1)}`).join(' ')
}

const scrollerHeight = computed(() => {
  if (!isDesktop.value) return 'auto'
  const travel = SCROLL_TRAVEL_BASE + Math.max(categories.value.length, 1) * SCROLL_TRAVEL_PER_CAT
  return `calc(100dvh - var(--rf-nav-h) + ${travel}px)`
})

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
    checkScrollIdle()
    return
  }
  scrollActive.value = true
  smooth.value += diff * 0.2
  rafId = requestAnimationFrame(tickSmooth)
}

function updateProgress() {
  if (!import.meta.client || !isDesktop.value) {
    targetP = 1
    smooth.value = 1
    scrollActive.value = false
    sectionChoreActive.value = false
    return
  }
  const el = scrollerRef.value
  if (!el) return
  markScrolling()
  const nav = getNavOffset()
  const viewportH = window.innerHeight - nav
  const midLine = nav + viewportH * 0.5
  const top = el.getBoundingClientRect().top

  if (top > midLine) {
    if (sectionChoreActive.value) resetStatsIntro()
    sectionChoreActive.value = false
    targetP = 0
    if (!rafId) rafId = requestAnimationFrame(tickSmooth)
    return
  }

  if (!sectionChoreActive.value) {
    sectionChoreActive.value = true
    startStatsIntro()
  }

  const leadIn = viewportH * 0.5
  const pinTravel = Math.max(el.offsetHeight - viewportH, 1)
  const maxScroll = leadIn + pinTravel
  const scrolledInto = midLine - top
  targetP = Math.min(scrolledInto / maxScroll, 1)

  if (targetP >= STAT_COUNT_START) {
    statsIntroStep.value = 3
    clearStatsIntroTimers()
  }

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
  if (scrollIdleTimer) {
    clearTimeout(scrollIdleTimer)
    scrollIdleTimer = null
  }
  scrollActive.value = false
  resetStatsIntro()
  sectionChoreActive.value = false
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
            :style="statsStyle"
          >
            <div
              v-for="(stat, si) in liveStats"
              :key="stat.label"
              class="rf-expertise__stat"
              :style="statItemStyle(stat.reveal, si)"
            >
              <span class="rf-expertise__stat-value refonte-serif">{{ stat.display }}</span>
              <span class="rf-expertise__stat-label">{{ stat.label }}</span>
            </div>
          </div>

          <!-- Desktop : radar (gauche) + détail catégorie (droite) au scroll -->
          <div class="rf-expertise__stage">
            <template v-if="isDesktop">
              <div
                class="rf-expertise__radar"
                :class="{
                  'is-scrolling': scrollActive && detailActive,
                  'has-selection': detailActive
                }"
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
                  <g class="rf-expertise__radar-fog">
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
                      :class="{ 'is-active': isAxisActive(i) }"
                    />
                    <polygon
                      v-if="radarAxes.length"
                      :points="radarPolygon"
                      class="rf-expertise__radar-shape"
                    />
                    <g
                      v-for="(axis, i) in radarAxes"
                      :key="`pt-${i}`"
                      class="rf-expertise__radar-g"
                      :class="{ 'is-active': isAxisActive(i) }"
                    >
                      <g
                        class="rf-expertise__radar-note"
                        :opacity="axisScoreOpacity(i)"
                      >
                        <circle
                          :cx="axis.x"
                          :cy="axis.y"
                          r="15"
                          class="rf-expertise__radar-note-bg"
                        />
                        <text
                          :x="axis.x"
                          :y="axis.y"
                          class="rf-expertise__radar-score"
                          text-anchor="middle"
                          dominant-baseline="middle"
                        >
                          {{ axis.letter }}
                        </text>
                      </g>
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
                  </g>

                  <g v-if="detailActive && focusedAxis && scrollActive" class="rf-expertise__radar-focus is-active">
                    <g class="rf-expertise__radar-note">
                      <circle
                        :cx="focusedAxis.x"
                        :cy="focusedAxis.y"
                        r="17"
                        class="rf-expertise__radar-note-bg"
                      />
                      <text
                        :x="focusedAxis.x"
                        :y="focusedAxis.y"
                        class="rf-expertise__radar-score"
                        text-anchor="middle"
                        dominant-baseline="middle"
                      >
                        {{ focusedAxis.letter }}
                      </text>
                    </g>
                    <text
                      :x="focusedAxis.labelX"
                      :y="focusedAxis.labelY"
                      class="rf-expertise__radar-label"
                      text-anchor="middle"
                      dominant-baseline="middle"
                    >
                      {{ focusedAxis.radarLabel }}
                    </text>
                  </g>
                </svg>
              </div>

              <aside
                class="rf-expertise__detail"
                :style="{
                  opacity: detailOpacity,
                  visibility: detailOpacity < 0.02 ? 'hidden' : 'visible'
                }"
              >
                <Transition name="rf-detail" mode="out-in">
                  <div
                    v-if="activeCategory && detailActive"
                    :key="activeCategory.key"
                    class="rf-expertise__detail-panel"
                  >
                    <header class="rf-expertise__detail-head">
                      <h3 class="rf-expertise__detail-title">{{ activeCategory.label }}</h3>
                      <span class="rf-expertise__detail-grade-value rf-grade">{{ activeCategory.letter }}</span>
                    </header>
                    <ul class="rf-expertise__meters">
                      <li
                        v-for="item in activeSkills"
                        :key="item.skill"
                        class="rf-expertise__meter"
                        :class="`rf-expertise__meter--${item.tier}`"
                      >
                        <span class="rf-expertise__meter-accent" aria-hidden="true" />
                        <span class="rf-expertise__meter-name">{{ item.skill }}</span>
                        <span class="rf-expertise__meter-val rf-grade">{{ item.letter }}</span>
                      </li>
                    </ul>
                  </div>
                </Transition>

                <p
                  v-if="isChoreographyComplete"
                  class="rf-expertise__finale"
                  :style="{ opacity: finaleOpacity }"
                >
                  Parcours complet — continuez vers le bas.
                </p>
              </aside>
            </template>

            <div
              v-else
              class="rf-expertise__groups"
            >
              <div
                v-for="(cat, ci) in categories"
                :key="cat.key"
                class="rf-expertise__group"
                :class="{ 'is-open': isGroupOpen(cat.key) }"
              >
                <button
                  type="button"
                  class="rf-expertise__group-head"
                  :aria-expanded="isGroupOpen(cat.key)"
                  :aria-controls="`rf-expertise-panel-${cat.key}`"
                  @click="toggleGroup(cat.key)"
                >
                  <span class="rf-expertise__group-num">{{ pad(ci) }}</span>
                  <h3 class="rf-expertise__group-label">{{ cat.label }}</h3>
                  <span class="rf-expertise__group-avg rf-grade">{{ cat.letter }}</span>
                  <span class="rf-expertise__group-chevron" aria-hidden="true" />
                </button>
                <div
                  :id="`rf-expertise-panel-${cat.key}`"
                  class="rf-expertise__group-pills"
                  :hidden="!isGroupOpen(cat.key)"
                >
                  <span
                    v-for="skill in cat.skills"
                    :key="skill"
                    class="rf-expertise__pill"
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

.rf-expertise__pin {
  position: sticky;
  top: var(--rf-nav-h);
  height: calc(100dvh - var(--rf-nav-h));
  min-height: calc(100dvh - var(--rf-nav-h));
  box-sizing: border-box;
  overflow: hidden;
  /* Même offset que Expériences au pin / démarrage de chorégraphie */
  padding-top: var(--rf-section-pin-pad);
}

.rf-expertise__frame {
  height: 100%;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 0;
  padding-block: 0 0.75rem;
  box-sizing: border-box;
}

.rf-expertise__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.rf-expertise__title {
  margin: 0.35rem 0 0;
  font-size: var(--rf-section-title-size);
  line-height: 1.02;
  letter-spacing: -0.03em;
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
  margin-top: var(--rf-section-stack-gap);
  padding-block: 0.55rem;
  border-top: 1px solid var(--rf-line);
  border-bottom: 1px solid var(--rf-line);
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 4;
}

@media (min-width: 768px) {
  .rf-expertise__stats {
    will-change: transform, opacity;
    margin-top: clamp(0.55rem, 1.35vw, 0.85rem);
    padding-block: 0.65rem 0.55rem;
  }

  .rf-expertise__stat {
    text-align: center;
    justify-items: center;
    transition: opacity 0.32s var(--rf-ease), transform 0.32s var(--rf-ease);
  }
}

.rf-expertise__stat {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.rf-expertise__stat-value {
  /* Compacte au scroll via --rf-compact (0→1), sans scale qui déborde */
  font-size: calc(
    (1 - var(--rf-compact, 0)) * clamp(2.35rem, 6.2vw, 5rem)
    + var(--rf-compact, 0) * clamp(1.95rem, 4.2vw, 3rem)
  );
  color: var(--rf-accent);
  line-height: 0.95;
  font-variant-numeric: tabular-nums;
}

.rf-expertise__stat-label {
  font-size: calc(
    (1 - var(--rf-compact, 0)) * 0.68rem
    + var(--rf-compact, 0) * 0.62rem
  );
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-expertise__stage {
  position: relative;
  min-height: 0;
  overflow: hidden;
  margin-top: var(--rf-section-stack-gap);
  padding-top: 0.25rem;
}

@media (min-width: 768px) {
  .rf-expertise__stage {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
    gap: clamp(0.75rem, 2vw, 1.5rem);
    align-items: center;
    place-items: stretch;
  }
}

.rf-expertise__radar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 0.35rem;
  box-sizing: border-box;
  will-change: opacity, transform;
  transform-origin: center center;
  z-index: 1;
}

.rf-expertise__radar-svg {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 1;
  overflow: visible;
}

.rf-expertise__radar-grid {
  stroke: rgba(255, 255, 255, 0.14);
  stroke-width: 1.35;
  fill: rgba(var(--rf-accent-rgb), 0.06);
}

.rf-expertise__radar-axis {
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1.1;
  transition: stroke 0.55s var(--rf-ease), stroke-width 0.55s var(--rf-ease);
}

.rf-expertise__radar-axis.is-active {
  stroke: rgba(var(--rf-accent-rgb), 0.72);
  stroke-width: 1.65;
}

.rf-expertise__radar-shape {
  fill: rgba(var(--rf-accent-rgb), 0.2);
  stroke: var(--rf-accent);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.rf-expertise__radar-dot {
  fill: rgba(255, 255, 255, 0.35);
  transition: fill 0.35s var(--rf-ease);
}

.rf-expertise__radar-note {
  pointer-events: none;
  transition: opacity 0.55s var(--rf-ease);
}

.rf-expertise__radar-note-bg {
  fill: rgba(11, 26, 58, 0.88);
  stroke: rgba(255, 255, 255, 0.22);
  stroke-width: 1.25;
  transition: fill 0.55s var(--rf-ease), stroke 0.55s var(--rf-ease), stroke-width 0.55s var(--rf-ease);
}

.rf-expertise__radar-score {
  fill: var(--rf-text);
  font-size: 15px;
  font-family: var(--rf-comic);
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.02em;
  paint-order: stroke fill;
  stroke: rgba(11, 26, 58, 0.65);
  stroke-width: 2px;
  transition: fill 0.35s var(--rf-ease);
}

.rf-expertise__radar-g.is-active .rf-expertise__radar-note-bg {
  fill: rgba(11, 26, 58, 0.95);
  stroke: var(--rf-accent);
  stroke-width: 1.85;
}

.rf-expertise__radar-g.is-active .rf-expertise__radar-score {
  fill: var(--rf-accent);
}

.rf-expertise__radar-label {
  fill: var(--rf-text-muted);
  font-size: 12px;
  font-family: var(--rf-sans);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: fill 0.55s var(--rf-ease), opacity 0.55s var(--rf-ease);
}

.rf-expertise__radar-g.is-active .rf-expertise__radar-label {
  fill: var(--rf-accent);
}

.rf-expertise__radar.has-selection .rf-expertise__radar-g:not(.is-active) .rf-expertise__radar-label {
  opacity: 0.56;
}

.rf-expertise__radar.has-selection:not(.is-scrolling) .rf-expertise__radar-g.is-active .rf-expertise__radar-label {
  font-size: 12.5px;
}

.rf-expertise__radar-fog {
  transform-origin: center;
  filter: blur(0);
  opacity: 1;
  transition:
    filter 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

.rf-expertise__radar.is-scrolling .rf-expertise__radar-fog {
  filter: blur(2.75px);
  opacity: 0.9;
}

.rf-expertise__radar-focus .rf-expertise__radar-label {
  fill: var(--rf-accent);
  font-size: 13px;
}

.rf-expertise__radar-focus .rf-expertise__radar-note-bg {
  fill: rgba(11, 26, 58, 0.97);
  stroke: var(--rf-accent);
  stroke-width: 2;
}

.rf-expertise__radar-focus .rf-expertise__radar-score {
  fill: var(--rf-accent);
  font-size: 17px;
}

.rf-expertise__detail {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 0.65rem;
  min-width: 0;
  min-height: 0;
  padding: 0.15rem 0 0.15rem 0.35rem;
  will-change: opacity;
}

.rf-expertise__detail-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.65rem;
  width: min(100%, 25rem);
  min-height: 0;
  align-content: start;
}

.rf-expertise__detail-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 0.1rem 0.5rem;
  border-bottom: 1px solid var(--rf-line);
}

.rf-expertise__detail-title {
  margin: 0;
  font-size: clamp(0.92rem, 1.85vh, 1.08rem);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1.2;
  color: var(--rf-accent);
}

.rf-expertise__detail-grade-value {
  font-size: clamp(1.45rem, 2.85vh, 1.9rem);
  line-height: 1;
  color: var(--rf-accent);
  flex-shrink: 0;
}

.rf-expertise__detail .rf-grade {
  font-weight: inherit;
}

.rf-expertise__meters {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.38rem;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.rf-expertise__meters::-webkit-scrollbar {
  display: none;
}

.rf-expertise__meter {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2.5rem;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.6rem 0.5rem 0.85rem;
  border: 1px solid var(--rf-line);
  background: rgba(255, 255, 255, 0.03);
}

.rf-expertise__meter-accent {
  position: absolute;
  left: 0;
  top: 22%;
  bottom: 22%;
  width: 3px;
  background: var(--rf-accent);
}

.rf-expertise__meter-name {
  font-size: 0.88rem;
  color: var(--rf-text);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rf-expertise__meter-val {
  font-size: 1rem;
  line-height: 1;
  text-align: right;
  color: var(--rf-gold);
  flex-shrink: 0;
}

.rf-expertise__meter--elite .rf-expertise__meter-val,
.rf-expertise__meter--high .rf-expertise__meter-val {
  color: var(--rf-accent);
}

.rf-expertise__finale {
  margin: 0.5rem 0 0;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--rf-accent);
}

.rf-detail-enter-active,
.rf-detail-leave-active {
  transition: opacity 0.32s var(--rf-ease), transform 0.32s var(--rf-ease);
}

.rf-detail-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.rf-detail-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Liste mobile */
.rf-expertise__groups {
  position: relative;
  inset: auto;
  z-index: 2;
  display: grid;
  align-content: start;
  gap: var(--rf-section-stack-gap);
  padding: 0.35rem 0 0.75rem;
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
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
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

.rf-expertise__group-chevron {
  display: none;
}

.rf-expertise__group-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.rf-expertise__group-pills[hidden] {
  display: none !important;
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
    padding-top: var(--rf-section-pin-pad);
  }

  .rf-expertise__frame {
    height: auto;
    grid-template-rows: auto auto auto;
    padding-block: 0 0.5rem;
  }

  .rf-expertise__stage {
    position: relative;
    min-height: 0;
    margin-block: 0.85rem 0.5rem;
    display: grid;
    gap: 1.25rem;
    place-items: stretch;
    justify-items: stretch;
    overflow: visible;
  }

  .rf-expertise__radar {
    display: none !important;
  }

  .rf-expertise__groups {
    position: relative;
    inset: auto;
    width: 100%;
    max-width: none;
    opacity: 1 !important;
    visibility: visible !important;
    overflow: visible;
    padding: 0;
    gap: 0;
    justify-self: stretch;
  }

  .rf-expertise__group {
    width: 100%;
    border-bottom: 1px solid var(--rf-line);
  }

  .rf-expertise__group-head {
    margin-bottom: 0;
    padding-block: 0.95rem;
    cursor: pointer;
    pointer-events: auto;
    -webkit-tap-highlight-color: transparent;
  }

  .rf-expertise__group-avg {
    margin-left: auto;
    margin-right: 0.35rem;
    font-size: 1.45rem;
  }

  .rf-expertise__group-chevron {
    display: block;
    width: 0.55rem;
    height: 0.55rem;
    flex-shrink: 0;
    border-right: 1.5px solid var(--rf-text-muted);
    border-bottom: 1.5px solid var(--rf-text-muted);
    transform: rotate(45deg);
    transition: transform 0.25s var(--rf-ease), border-color 0.25s var(--rf-ease);
  }

  .rf-expertise__group.is-open .rf-expertise__group-chevron {
    transform: rotate(225deg);
    border-color: var(--rf-accent);
  }

  .rf-expertise__group-pills {
    padding: 0 0 1rem;
  }

  .rf-expertise__stat-value {
    font-size: clamp(2.1rem, 11vw, 3rem) !important;
  }
}

@media (min-width: 768px) and (max-width: 1200px) {
  .rf-expertise__stage {
    grid-template-columns: minmax(0, 1.55fr) minmax(10rem, 0.45fr);
    justify-content: center;
    align-items: center;
    gap: clamp(0.65rem, 1.8vw, 1.1rem);
    width: min(100%, 62rem);
    margin-inline: auto;
  }

  .rf-expertise__radar {
    padding: 0;
  }

  .rf-expertise__radar-svg {
    width: min(100%, 40rem);
    height: auto;
    max-height: min(78vh, 40rem);
  }

  .rf-expertise__detail {
    padding: 0;
  }

  .rf-expertise__detail-panel {
    width: min(100%, 21rem);
    max-width: 21rem;
  }
}

@media (max-height: 900px) and (min-width: 1201px) {
  .rf-expertise__stage {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: min(100%, 58rem);
    margin-inline: auto;
  }

  .rf-expertise__radar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 0;
  }

  .rf-expertise__radar-svg {
    width: min(100%, 30rem);
    height: auto;
    max-height: min(62vh, 30rem);
  }

  .rf-expertise__radar-label {
    font-size: 11px;
  }

  .rf-expertise__radar-score {
    font-size: 13px;
  }

  .rf-expertise__radar-note {
    transform: scale(0.88);
    transform-origin: center;
    transform-box: fill-box;
  }

  .rf-expertise__radar-focus .rf-expertise__radar-score {
    font-size: 14px;
  }

  .rf-expertise__detail {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .rf-expertise__detail-panel {
    width: min(100%, 22.5rem);
    max-width: 22.5rem;
  }

  .rf-expertise__detail-head {
    padding-bottom: 0.4rem;
  }

  .rf-expertise__detail-title {
    font-size: clamp(0.86rem, 1.6vh, 0.98rem);
  }

  .rf-expertise__detail-grade-value {
    font-size: clamp(1.3rem, 2.5vh, 1.65rem);
  }

  .rf-expertise__meters {
    gap: 0.32rem;
  }

  .rf-expertise__meter {
    padding: 0.44rem 0.5rem 0.44rem 0.78rem;
  }

  .rf-expertise__meter-name {
    font-size: 0.82rem;
  }

  .rf-expertise__meter-val {
    font-size: 0.94rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rf-expertise__groups,
  .rf-expertise__group,
  .rf-expertise__pill,
  .rf-expertise__detail-panel {
    opacity: 1 !important;
    transform: none !important;
    visibility: visible !important;
  }

  @media (min-width: 768px) {
    .rf-expertise__radar {
      opacity: 1 !important;
      transform: none !important;
      visibility: visible !important;
    }

    .rf-expertise__stats {
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      border-top-color: var(--rf-line) !important;
      border-bottom-color: var(--rf-line) !important;
    }

    .rf-expertise__radar.is-scrolling .rf-expertise__radar-fog {
      filter: none;
      opacity: 1;
    }

    .rf-expertise__detail {
      opacity: 1 !important;
      visibility: visible !important;
    }
  }
}
</style>
