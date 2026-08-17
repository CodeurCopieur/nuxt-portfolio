<script setup lang="ts">
import { useContent } from '@/composables/useContent'
import { COMPETENCE_CATEGORIES, sortCompetenceCategories } from '~/data/competence-categories'
import { getCareerPinPalette, type CareerPinPalette } from '~/utils/career-pin-colors'

const props = withDefaults(
  defineProps<{ variant?: 'game' | 'refonte' }>(),
  { variant: 'game' }
)

const isRefonte = computed(() => props.variant === 'refonte')

interface ChartTheme {
  bgStops: [string, string, string]
  showParticles: boolean
  gridStroke: (level: number) => string
  gridSpoke: string
  gridLabel: string
  polygonFill: [string, string, string]
  polygonStroke: string
  polygonGlow: string
  badgeFillLit: string
  badgeFill: string
  badgeStrokeLit: string
  badgeStroke: string
  badgeTextLit: string
  badgeText: string
  centerMain: string
  centerSub: string
  pinLitGrad: [string, string]
}

const chartTheme = computed((): ChartTheme =>
  isRefonte.value
    ? {
        bgStops: ['#f7f2ea', '#ebe4d6', '#e0d8c8'],
        showParticles: false,
        gridStroke: (level) => `rgba(26, 22, 18, ${0.07 + level * 0.035})`,
        gridSpoke: 'rgba(26, 22, 18, 0.14)',
        gridLabel: 'rgba(74, 67, 60, 0.62)',
        polygonFill: [
          'rgba(184, 67, 47, 0.32)',
          'rgba(74, 107, 93, 0.22)',
          'rgba(184, 149, 74, 0.12)'
        ],
        polygonStroke: 'rgba(184, 67, 47, 0.95)',
        polygonGlow: 'rgba(184, 67, 47, 0.45)',
        badgeFillLit: 'rgba(184, 67, 47, 0.92)',
        badgeFill: 'rgba(247, 242, 234, 0.95)',
        badgeStrokeLit: 'rgba(255, 255, 255, 0.45)',
        badgeStroke: 'rgba(26, 22, 18, 0.12)',
        badgeTextLit: '#f7f2ea',
        badgeText: 'rgba(184, 67, 47, 0.88)',
        centerMain: '#1a1612',
        centerSub: 'rgba(122, 114, 104, 0.65)',
        pinLitGrad: ['#d46a55', '#b8432f']
      }
    : {
        bgStops: ['#12182b', '#0a0e18', '#060810'],
        showParticles: true,
        gridStroke: (level) => `rgba(148, 163, 184, ${0.05 + level * 0.025})`,
        gridSpoke: 'rgba(148, 163, 184, 0.08)',
        gridLabel: 'rgba(148, 163, 184, 0.45)',
        polygonFill: [
          'rgba(56, 189, 248, 0.28)',
          'rgba(129, 140, 248, 0.18)',
          'rgba(167, 139, 250, 0.08)'
        ],
        polygonStroke: 'rgba(125, 211, 252, 0.85)',
        polygonGlow: 'rgba(56, 189, 248, 0.55)',
        badgeFillLit: 'rgba(251, 191, 36, 0.92)',
        badgeFill: 'rgba(15, 23, 42, 0.85)',
        badgeStrokeLit: 'rgba(255, 255, 255, 0.35)',
        badgeStroke: 'rgba(255, 255, 255, 0.12)',
        badgeTextLit: '#0f172a',
        badgeText: 'rgba(251, 191, 36, 0.9)',
        centerMain: 'rgba(255,255,255,0.95)',
        centerSub: 'rgba(148, 163, 184, 0.6)',
        pinLitGrad: ['#67e8f9', '#22d3ee']
      }
)

const REFONTE_PIN_COLORS: CareerPinPalette[] = [
  { dot: 'linear-gradient(135deg, #c85a48, #b8432f)', ring: 'rgba(184, 67, 47, 0.35)', swatch: '#b8432f' },
  { dot: 'linear-gradient(135deg, #5a7d6e, #4a6b5d)', ring: 'rgba(74, 107, 93, 0.35)', swatch: '#4a6b5d' },
  { dot: 'linear-gradient(135deg, #c9a85a, #b8954a)', ring: 'rgba(184, 149, 74, 0.35)', swatch: '#b8954a' },
  { dot: 'linear-gradient(135deg, #8f6b5a, #7a5544)', ring: 'rgba(122, 85, 68, 0.35)', swatch: '#7a5544' },
  { dot: 'linear-gradient(135deg, #6b8f7a, #567a66)', ring: 'rgba(86, 122, 102, 0.35)', swatch: '#567a66' },
  { dot: 'linear-gradient(135deg, #a8432f, #8f2f1f)', ring: 'rgba(143, 47, 31, 0.35)', swatch: '#8f2f1f' }
]

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { sections } = useContent()

const categoryOrder = computed(() => sections.value.competences_order ?? [])
const categoryDefs = computed(() => {
  if (sections.value.competences_categories?.length) {
    return sections.value.competences_categories
  }

  const order = categoryOrder.value
  const builtinKeys = new Set(COMPETENCE_CATEGORIES.map((cat) => cat.key))
  const customDefs = order
    .filter((key) => !builtinKeys.has(key))
    .map((key, index) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      hint: 'Compétences…',
      description: '',
      accent: ['rose', 'cyan', 'lime', 'amber'][index % 4]!,
      gradient: [
        'from-rose-500 to-red-600',
        'from-cyan-500 to-blue-600',
        'from-lime-500 to-green-600',
        'from-amber-500 to-yellow-600'
      ][index % 4]!
    }))

  return sortCompetenceCategories(order, customDefs)
})

const competences = computed(() => sections.value.competences)

function withAccessibiliteFirst<T extends { key: string }>(cats: T[]): T[] {
  const index = cats.findIndex((cat) => cat.key === 'accessibilite')
  if (index <= 0) return cats
  const next = [...cats]
  const [access] = next.splice(index, 1)
  return [access!, ...next]
}

const visibleCategories = computed(() => {
  const cats = categoryDefs.value
    .map((cat) => ({
      ...cat,
      skills: competences.value[cat.key] ?? [],
      count: (competences.value[cat.key] ?? []).length
    }))
    .filter((cat) => cat.skills.length > 0)

  return isRefonte.value ? withAccessibiliteFirst(cats) : cats
})

const totalSkills = computed(() =>
  visibleCategories.value.reduce((sum, cat) => sum + cat.count, 0)
)

const hoveredKey = ref<string | null>(null)
const focusedKey = ref<string | null>(null)

const CATEGORY_COLORS: Record<string, string> = {
  langages: '#38bdf8',
  frameworks: '#818cf8',
  outils_dev: '#34d399',
  ui_animations: '#c084fc',
  design: '#f472b6',
  environnements: '#2dd4bf',
  methodes: '#fb923c',
  ia_cursor: '#a78bfa',
  accessibilite: '#f43f5e'
}

const REFONTE_CATEGORY_COLORS: Record<string, string> = {
  langages: '#b8432f',
  frameworks: '#4a6b5d',
  outils_dev: '#567a66',
  ui_animations: '#8f6b5a',
  design: '#7a5544',
  environnements: '#6b8f7a',
  methodes: '#b8954a',
  ia_cursor: '#8f2f1f',
  accessibilite: '#c85a48'
}

const activeKey = computed(() => hoveredKey.value ?? focusedKey.value)

const selectedTabKey = ref<string | null>(null)
const TABS_PER_PAGE = 3
const tabPageIndex = ref(0)

const selectedCategory = computed(() => {
  const key = selectedTabKey.value
  const cats = visibleCategories.value
  if (!cats.length) return null
  if (key) {
    return cats.find((cat) => cat.key === key) ?? cats[0]!
  }
  return cats[0]!
})

watch(
  visibleCategories,
  (cats) => {
    if (!cats.length) {
      selectedTabKey.value = null
      tabPageIndex.value = 0
      return
    }
    if (!selectedTabKey.value || !cats.some((cat) => cat.key === selectedTabKey.value)) {
      selectedTabKey.value = cats[0]!.key
    }
    tabPageIndex.value = Math.min(tabPageIndex.value, Math.max(0, Math.ceil(cats.length / TABS_PER_PAGE) - 1))
  },
  { immediate: true }
)

function selectTab(key: string) {
  selectedTabKey.value = key
  focusedKey.value = key
  hoveredKey.value = key
}

function previewTab(key: string) {
  hoveredKey.value = key
  selectedTabKey.value = key
}

const tabPageCount = computed(() =>
  Math.max(1, Math.ceil(visibleCategories.value.length / TABS_PER_PAGE))
)

const pagedTabCategories = computed(() => {
  const start = tabPageIndex.value * TABS_PER_PAGE
  return visibleCategories.value.slice(start, start + TABS_PER_PAGE)
})

const canScrollTabsLeft = computed(() => tabPageIndex.value > 0)
const canScrollTabsRight = computed(() => tabPageIndex.value < tabPageCount.value - 1)

function tabPageForKey(key: string) {
  const index = visibleCategories.value.findIndex((cat) => cat.key === key)
  if (index < 0) return tabPageIndex.value
  return Math.floor(index / TABS_PER_PAGE)
}

function scrollTabStrip(direction: -1 | 1) {
  tabPageIndex.value = Math.max(0, Math.min(tabPageCount.value - 1, tabPageIndex.value + direction))
}

function scrollActiveTabIntoView(key: string) {
  tabPageIndex.value = tabPageForKey(key)
}

function categoryTabIndex(key: string) {
  const index = visibleCategories.value.findIndex((cat) => cat.key === key)
  return index < 0 ? 0 : index
}

function syncFromRadar(key: string | null) {
  if (key) {
    hoveredKey.value = key
    selectedTabKey.value = key
    scrollActiveTabIntoView(key)
  } else if (!focusedKey.value) {
    hoveredKey.value = null
  }
}

function onSkillsMouseLeave() {
  if (isRefonte.value) {
    hoveredKey.value = focusedKey.value
    return
  }
  if (!focusedKey.value) hoveredKey.value = null
}

interface RadarPoint {
  key: string
  label: string
  count: number
  avgRating: number
  angle: number
  value: number
  color: string
  palette: CareerPinPalette
  x: number
  y: number
  axisX: number
  axisY: number
  tipX: number
  tipY: number
}

function pinPaletteForCategory(index: number): CareerPinPalette {
  if (isRefonte.value) return REFONTE_PIN_COLORS[index % REFONTE_PIN_COLORS.length]!
  return getCareerPinPalette(index + 1)
}

function gradientStopsFromPalette(palette: CareerPinPalette): [string, string] {
  const matches = palette.dot.match(/#[0-9a-f]{6}/gi)
  if (matches && matches.length >= 2) return [matches[0]!, matches[1]!]
  return [palette.swatch, palette.swatch]
}

function pulseRingColor(ring: string, alpha: number) {
  return ring.replace(/,\s*[\d.]+\)$/, `, ${alpha})`)
}

function drawMapStylePin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  palette: CareerPinPalette,
  lit: boolean,
  dim: boolean,
  t: number,
  index: number
) {
  const dotR = lit ? 11.5 : 10
  const [c1, c2] = gradientStopsFromPalette(palette)
  const alpha = dim ? 0.3 : 1

  if (!dim || lit) {
    const phase = (t * (lit ? 1.4 : 2.5) + index * 0.65) % 1
    const pulseR = dotR * (0.55 + phase * 1.65)
    const pulseAlpha = (1 - phase) * (lit ? 0.65 : 0.35)
    ctx.beginPath()
    ctx.arc(x, y, pulseR, 0, Math.PI * 2)
    ctx.fillStyle = pulseRingColor(palette.ring, pulseAlpha * alpha)
    ctx.fill()
  }

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.beginPath()
  ctx.arc(x, y, dotR + 4, 0, Math.PI * 2)
  ctx.fillStyle = palette.ring
  ctx.fill()

  const grad = ctx.createLinearGradient(x - dotR, y - dotR, x + dotR, y + dotR)
  if (lit) {
    const [pinLitA, pinLitB] = chartTheme.value.pinLitGrad
    grad.addColorStop(0, pinLitA)
    grad.addColorStop(1, pinLitB)
  } else {
    grad.addColorStop(0, c1)
    grad.addColorStop(1, c2)
  }
  ctx.beginPath()
  ctx.arc(x, y, dotR, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.restore()
}

function colorFor(key: string) {
  const palette = isRefonte.value ? REFONTE_CATEGORY_COLORS : CATEGORY_COLORS
  if (palette[key]) return palette[key]!
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${Math.abs(hash) % 360} 70% 58%)`
}

function normalizeSkillName(skill: string) {
  return skill.toLowerCase().trim()
}

function skillRating(skill: string, categoryKey: string, index: number) {
  const name = normalizeSkillName(skill)

  const exact: Record<string, number> = {
    'nuxt 4': 16,
    'nuxt 3': 16,
    'vue 3': 17,
    'vue router': 15,
    pinia: 16,
    'twig/drupal': 14,
    react: 12,
    'next.js': 13,
    html5: 19,
    html: 19,
    'css3/scss': 19,
    'css3 / scss': 19,
    javascript: 16,
    typescript: 15,
    'typescript (débutant)': 15,
    pug: 16,
    'tailwind css': 15,
    gsap: 15,
    bootstrap: 14,
    bulma: 13,
    materialize: 13,
    scrollmagic: 14,
    aos: 14,
    scrollreveal: 14,
    'css animations': 15,
    'vs code': 17,
    postman: 16,
    'git cli': 17,
    'github desktop': 16,
    gitlab: 16,
    supabase: 16,
    firebase: 14,
    figma: 12,
    zeplin: 11,
    'wcag 2.1': 14,
    'html sémantique': 14,
    aria: 13,
    'navigation clavier': 13,
    windows: 14,
    macos: 13,
    'git bash': 14,
    hyper: 13,
    linux: 12
  }

  if (exact[name]) return exact[name]
  if (/^html/i.test(name)) return 19
  if (/css|scss|sass/i.test(name)) return 19
  if (/javascript|^js$/i.test(name)) return 16
  if (/typescript|^ts$/i.test(name)) return 15
  if (/pug/i.test(name)) return 16
  if (/nuxt/i.test(name)) return 16
  if (/vue/i.test(name) && !/revue/i.test(name)) return 16
  if (/pinia/i.test(name)) return 16
  if (/twig|drupal/i.test(name)) return 14
  if (/^react$/i.test(name) || name === 'react') return 12
  if (/tailwind|gsap|scroll/i.test(name)) return 15
  if (/vs code|vscode/i.test(name)) return 17
  if (/postman|git cli|gitlab|github desktop/i.test(name)) return 16
  if (/supabase/i.test(name)) return 16
  if (/firebase/i.test(name)) return 14
  if (/cursor|gpt|composer|opus|gemini|claude/i.test(name)) return 15
  if (/windows/i.test(name)) return 14
  if (/mac\s?os|macos/i.test(name)) return 13
  if (/git\s?bash|bash/i.test(name)) return 14
  if (/hyper|terminal|iterm|wsl/i.test(name)) return 13
  if (/linux/i.test(name)) return 12

  const categoryBase: Record<string, number> = {
    ui_animations: 14,
    frameworks: 14,
    langages: 13,
    outils_dev: 16,
    design: 11,
    environnements: 13,
    methodes: 12,
    ia_cursor: 15,
    accessibilite: 14
  }

  const seed = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0) + index * 13
  const base = categoryBase[categoryKey] ?? 12
  const value = base + (seed % 3) - 1

  return Math.min(20, Math.max(10, value))
}

function ratingTier(value: number): 'low' | 'mid' | 'high' | 'elite' {
  if (value >= 16) return 'elite'
  if (value >= 14) return 'high'
  if (value >= 12) return 'mid'
  return 'low'
}

function categoryAvg(catKey: string, skills: string[]) {
  if (!skills.length) return 0
  const sum = skills.reduce((acc, skill, i) => acc + skillRating(skill, catKey, i), 0)
  return Math.round(sum / skills.length)
}

/** Échelle /20 : 0 = centre, 20 = bord · anneaux à 4, 8, 12, 16, 20 */
function normalizedRadarValue(avg: number) {
  return Math.max(0, Math.min(1, avg / 20))
}

function setHover(key: string | null) {
  hoveredKey.value = key
}

function toggleFocus(key: string) {
  focusedKey.value = focusedKey.value === key ? null : key
  if (isRefonte.value) {
    selectedTabKey.value = key
    hoveredKey.value = key
  }
}

function isCategoryLit(key: string) {
  return activeKey.value === key
}

function isCategoryDimmed(key: string) {
  return !!activeKey.value && activeKey.value !== key
}

function isTopSkill(catKey: string, skill: string, skills: string[]) {
  const ratings = skills.map((s, i) => ({ s, r: skillRating(s, catKey, i) }))
  ratings.sort((a, b) => b.r - a.r)
  return ratings.slice(0, 2).some((item) => item.s === skill)
}

let animationId = 0
let dpr = 1
let width = 0
let height = 0
let radarPoints: RadarPoint[] = []

function computeRadarPoints(cx: number, cy: number, radius: number): RadarPoint[] {
  const cats = visibleCategories.value
  const n = cats.length
  if (!n) return []

  return cats.map((cat, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2
    const avg = categoryAvg(cat.key, cat.skills)
    const value = normalizedRadarValue(avg)
    const r = radius * value
    const axisX = cx + Math.cos(angle) * radius
    const axisY = cy + Math.sin(angle) * radius
    return {
      key: cat.key,
      label: cat.label,
      count: cat.count,
      avgRating: categoryAvg(cat.key, cat.skills),
      angle,
      value,
      color: colorFor(cat.key),
      palette: pinPaletteForCategory(i),
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      axisX,
      axisY,
      tipX: cx + Math.cos(angle) * r,
      tipY: cy + Math.sin(angle) * r
    }
  })
}

let introProgress = 0

function drawBackground(ctx: CanvasRenderingContext2D, t: number) {
  const theme = chartTheme.value
  const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.7)
  grad.addColorStop(0, theme.bgStops[0])
  grad.addColorStop(0.55, theme.bgStops[1])
  grad.addColorStop(1, theme.bgStops[2])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  visibleCategories.value.forEach((cat, i) => {
    const angle = -Math.PI / 2 + (i / visibleCategories.value.length) * Math.PI * 2
    const gx = width * 0.5 + Math.cos(angle) * width * 0.2
    const gy = height * 0.45 + Math.sin(angle) * height * 0.16
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 100)
    glow.addColorStop(0, `${colorFor(cat.key)}${isRefonte.value ? '18' : '20'}`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)
  })

  if (theme.showParticles) {
    for (let i = 0; i < 36; i++) {
      const sx = (i * 137.5 + t * 10) % width
      const sy = (i * 97.3 + t * 7) % height
      ctx.beginPath()
      ctx.arc(sx, sy, 0.5 + (i % 3) * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${0.06 + Math.sin(t + i) * 0.03})`
      ctx.fill()
    }
  }
}

function drawRadarGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, n: number) {
  if (n < 1) return

  const theme = chartTheme.value
  const ringScores = [4, 8, 12, 16, 20]

  for (const score of ringScores) {
    const r = radius * (score / 20)
    ctx.beginPath()
    for (let i = 0; i <= n; i++) {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2
      const x = cx + Math.cos(angle) * r
      const y = cy + Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const level = score / 4
    ctx.strokeStyle = theme.gridStroke(level)
    ctx.stroke()
  }

  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    ctx.strokeStyle = theme.gridSpoke
    ctx.stroke()
  }

  ctx.font = '600 8px ui-monospace, monospace'
  ctx.fillStyle = theme.gridLabel
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  for (const score of ringScores) {
    const r = radius * (score / 20)
    ctx.fillText(String(score), cx, cy - r - 3)
  }
}

function drawRadar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, ease: number, t: number) {
  const cats = visibleCategories.value
  const n = cats.length
  if (n < 3) return

  radarPoints = computeRadarPoints(cx, cy, radius)
  const focus = activeKey.value

  const theme = chartTheme.value

  drawRadarGrid(ctx, cx, cy, radius, n)

  ctx.beginPath()
  radarPoints.forEach((p, i) => {
    const x = cx + (p.x - cx) * ease
    const y = cy + (p.y - cy) * ease
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.closePath()

  const fillGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  fillGrad.addColorStop(0, theme.polygonFill[0])
  fillGrad.addColorStop(0.5, theme.polygonFill[1])
  fillGrad.addColorStop(1, theme.polygonFill[2])
  ctx.fillStyle = fillGrad
  ctx.fill()

  ctx.strokeStyle = theme.polygonStroke
  ctx.lineWidth = isRefonte.value ? 2.75 : 2
  ctx.shadowColor = theme.polygonGlow
  ctx.shadowBlur = focus ? (isRefonte.value ? 22 : 18) : (isRefonte.value ? 14 : 10)
  ctx.stroke()
  ctx.shadowBlur = 0

  radarPoints.forEach((p, index) => {
    const lit = focus === p.key
    const dim = !!focus && focus !== p.key
    const tipX = cx + (p.x - cx) * ease
    const tipY = cy + (p.y - cy) * ease
    p.tipX = tipX
    p.tipY = tipY

    const cos = Math.cos(p.angle)
    const sin = Math.sin(p.angle)

    const pinR = lit ? 11.5 : 10

    drawMapStylePin(ctx, tipX, tipY, p.palette, lit, dim, t, index)

    const badgeX = tipX + cos * (pinR + 10)
    const badgeY = tipY + sin * (pinR + 10)
    const badgeW = 28
    const badgeH = 15
    ctx.beginPath()
    ctx.roundRect(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 4)
    ctx.fillStyle = lit ? theme.badgeFillLit : theme.badgeFill
    ctx.globalAlpha = dim ? 0.35 : 1
    ctx.fill()
    ctx.strokeStyle = lit ? theme.badgeStrokeLit : theme.badgeStroke
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.globalAlpha = 1

    ctx.font = '800 9px ui-monospace, monospace'
    ctx.fillStyle = lit ? theme.badgeTextLit : theme.badgeText
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(p.avgRating), badgeX, badgeY + 0.5)
  })
}

function drawFrame() {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return

  resize()
  width = canvas.width / dpr
  height = canvas.height / dpr
  if (width < 2 || height < 2) {
    animationId = requestAnimationFrame(drawFrame)
    return
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const t = Date.now() * 0.001
  introProgress = Math.min(1, introProgress + 0.025)
  const ease = 1 - Math.pow(1 - introProgress, 3)

  const cx = width * 0.5
  const cy = height * 0.5
  const radius = Math.min(width, height) * (isRefonte.value ? 0.44 : 0.36)

  drawBackground(ctx, t)

  if (visibleCategories.value.length >= 3) {
    drawRadar(ctx, cx, cy, radius, ease, t)

    const theme = chartTheme.value
    ctx.font = isRefonte.value
      ? '800 22px Fraunces, Georgia, serif'
      : '800 22px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = theme.centerMain
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(totalSkills.value), cx, cy - 6)
    ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = theme.centerSub
    ctx.fillText('compétences', cx, cy + 14)
  } else {
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = chartTheme.value.centerSub
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Chargement…', cx, cy)
  }

  animationId = requestAnimationFrame(drawFrame)
}

function resize() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  dpr = Math.min(window.devicePixelRatio, 2)
  const w = container.clientWidth
  const h = container.clientHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
}

function pickRadar(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  for (const p of radarPoints) {
    if (Math.hypot(x - p.tipX, y - p.tipY) < 22) {
      toggleFocus(p.key)
      return
    }
  }
}

function moveRadar(e: MouseEvent) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  let found: string | null = null
  for (const p of radarPoints) {
    if (Math.hypot(x - p.tipX, y - p.tipY) < 20) found = p.key
  }

  if (isRefonte.value) {
    if (found !== hoveredKey.value) syncFromRadar(found)
    return
  }

  if (focusedKey.value) return
  hoveredKey.value = found
}

let resizeObserver: ResizeObserver | null = null

watch(visibleCategories, () => {
  focusedKey.value = null
  hoveredKey.value = null
  introProgress = 0
  nextTick(() => resize())
})

watch(activeKey, () => {
  introProgress = 0.85
})

onMounted(() => {
  drawFrame()
  window.addEventListener('resize', resize)
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(containerRef.value)
  }
  containerRef.value?.addEventListener('click', pickRadar)
  containerRef.value?.addEventListener('mousemove', moveRadar)
  containerRef.value?.addEventListener('mouseleave', () => {
    if (isRefonte.value) {
      hoveredKey.value = focusedKey.value
      return
    }
    if (focusedKey.value) return
    hoveredKey.value = null
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="fm-skills h-full flex flex-col"
    :class="[
      isRefonte ? 'fm-skills--refonte min-h-0' : 'min-h-[520px] xl:flex-row',
    ]"
    @mouseleave="onSkillsMouseLeave"
  >
    <!-- Colonnes style FM (game uniquement) -->
    <div
      v-if="!isRefonte"
      class="fm-skills__board flex-1 min-w-0 xl:max-w-[42%] overflow-y-auto p-3 sm:p-4"
    >
      <header class="fm-skills__header mb-4">
        <p class="fm-skills__eyebrow">Cartographie technique</p>
        <div class="flex items-end gap-3 flex-wrap">
          <h2 class="fm-skills__title">{{ totalSkills }}</h2>
          <p class="fm-skills__subtitle">
            {{ visibleCategories.length }} domaines · {{ totalSkills }} technologies
          </p>
        </div>
      </header>

      <div class="fm-skills__grid">
        <section
          v-for="cat in visibleCategories"
          :key="cat.key"
          class="fm-block"
          :class="{
            'fm-block--lit': isCategoryLit(cat.key),
            'fm-block--dim': isCategoryDimmed(cat.key)
          }"
          :style="{ '--cat-color': colorFor(cat.key) }"
          @mouseenter="setHover(cat.key)"
          @mouseleave="!focusedKey && setHover(null)"
          @click="toggleFocus(cat.key)"
        >
          <header class="fm-block__head">
            <h3 class="fm-block__title">{{ cat.label }}</h3>
            <span class="fm-block__avg">{{ categoryAvg(cat.key, cat.skills) }}</span>
          </header>

          <ul class="fm-block__list">
            <li
              v-for="(skill, index) in cat.skills"
              :key="skill"
              class="fm-row"
              :class="{
                'fm-row--lit': isCategoryLit(cat.key),
                'fm-row--dim': isCategoryDimmed(cat.key),
                'fm-row--star': isTopSkill(cat.key, skill, cat.skills)
              }"
            >
              <span class="fm-row__accent" aria-hidden="true" />
              <span class="fm-row__name">{{ skill }}</span>
              <span
                class="fm-row__rating"
                :class="`fm-row__rating--${ratingTier(skillRating(skill, cat.key, index))}`"
              >
                {{ skillRating(skill, cat.key, index) }}
              </span>
            </li>
          </ul>
        </section>
      </div>

      <p class="fm-skills__hint mt-3">
        Survolez un domaine pour illuminer son stack · clic pour épingler
      </p>
    </div>

    <!-- Barre compacte refonte -->
    <div v-if="isRefonte" class="fm-skills__compact-bar">
      <p class="fm-skills__compact-stats">
        <strong>{{ totalSkills }}</strong> compétences ·
        <strong>{{ visibleCategories.length }}</strong> domaines
      </p>
      <p class="fm-skills__compact-hint">
        Survolez ou cliquez le radar · les onglets suivent la sélection
      </p>
    </div>

    <!-- Refonte : radar hero + tabs -->
    <div v-if="isRefonte" class="fm-skills__refonte-body">
      <aside class="fm-skills__radar fm-skills__radar--hero shrink-0 w-full border-0">
        <div
          ref="containerRef"
          class="fm-skills__radar-inner relative h-[340px] sm:h-[400px] lg:h-full lg:min-h-[460px]"
        >
          <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />

          <div class="skills-radar__hud absolute top-4 left-4 z-10 pointer-events-none">
            <p class="skills-radar__hud-label">Profil radar</p>
            <p class="skills-radar__hud-value">
              {{ activeKey ? categoryAvg(activeKey, visibleCategories.find(c => c.key === activeKey)?.skills ?? []) : Math.round(visibleCategories.reduce((s, c) => s + categoryAvg(c.key, c.skills), 0) / Math.max(visibleCategories.length, 1)) }}
            </p>
            <p class="skills-radar__hud-sub">
              <template v-if="activeKey">
                {{ visibleCategories.find((c) => c.key === activeKey)?.label }} · moyenne /20
              </template>
              <template v-else>
                Moyenne globale · échelle /20
              </template>
            </p>
          </div>
        </div>
      </aside>

      <div v-if="selectedCategory" class="fm-skills__tabs-wrap">
        <div class="fm-skills__tabnav">
          <button
            type="button"
            class="fm-skills__tabnav-btn"
            aria-label="Afficher les domaines précédents"
            :disabled="!canScrollTabsLeft"
            @click="scrollTabStrip(-1)"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div
            class="fm-skills__tablist"
            role="tablist"
            aria-label="Domaines de compétences"
          >
            <button
              v-for="cat in pagedTabCategories"
              :id="`fm-tab-${cat.key}`"
              :key="cat.key"
              type="button"
              role="tab"
              class="fm-skills__tab"
              :class="{ 'fm-skills__tab--active': activeKey === cat.key }"
              :aria-selected="activeKey === cat.key"
              :aria-controls="`fm-panel-${cat.key}`"
              :style="{ '--cat-color': colorFor(cat.key) }"
              @click="selectTab(cat.key)"
              @mouseenter="previewTab(cat.key)"
            >
              <span
                class="fm-skills__tab-swatch"
                :style="{
                  background: pinPaletteForCategory(categoryTabIndex(cat.key)).swatch,
                  boxShadow: `0 0 0 2px ${pinPaletteForCategory(categoryTabIndex(cat.key)).ring}`
                }"
                aria-hidden="true"
              />
              <span class="fm-skills__tab-label">{{ cat.label }}</span>
              <span class="fm-skills__tab-avg">{{ categoryAvg(cat.key, cat.skills) }}</span>
            </button>
          </div>

          <button
            type="button"
            class="fm-skills__tabnav-btn"
            aria-label="Afficher les domaines suivants"
            :disabled="!canScrollTabsRight"
            @click="scrollTabStrip(1)"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div
          :id="`fm-panel-${selectedCategory.key}`"
          class="fm-skills__tabpanel"
          role="tabpanel"
          :aria-labelledby="`fm-tab-${selectedCategory.key}`"
          :style="{ '--cat-color': colorFor(selectedCategory.key) }"
        >
          <header class="fm-tabpanel__head">
            <div>
              <h3 class="fm-tabpanel__title">{{ selectedCategory.label }}</h3>
              <p class="fm-tabpanel__meta">
                {{ selectedCategory.skills.length }} technologie{{ selectedCategory.skills.length > 1 ? 's' : '' }}
              </p>
            </div>
            <span class="fm-tabpanel__avg">{{ categoryAvg(selectedCategory.key, selectedCategory.skills) }}/20</span>
          </header>

          <ul class="fm-tabpanel__list">
            <li
              v-for="(skill, index) in selectedCategory.skills"
              :key="skill"
              class="fm-tab-row"
              :class="{ 'fm-tab-row--star': isTopSkill(selectedCategory.key, skill, selectedCategory.skills) }"
            >
              <span class="fm-tab-row__name">{{ skill }}</span>
              <span
                class="fm-tab-row__rating"
                :class="`fm-tab-row__rating--${ratingTier(skillRating(skill, selectedCategory.key, index))}`"
              >
                {{ skillRating(skill, selectedCategory.key, index) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Radar game -->
    <aside
      v-if="!isRefonte"
      class="fm-skills__radar shrink-0 w-full xl:flex-1 xl:min-w-[560px] border-t xl:border-t-0 xl:border-l border-white/8"
    >
      <div
        ref="containerRef"
        class="fm-skills__radar-inner relative h-[420px] xl:h-full min-h-[400px]"
      >
        <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />

        <div class="skills-radar__hud absolute top-4 left-4 z-10 pointer-events-none">
          <p class="skills-radar__hud-label">Profil radar</p>
          <p class="skills-radar__hud-value">
            {{ activeKey ? categoryAvg(activeKey, visibleCategories.find(c => c.key === activeKey)?.skills ?? []) : Math.round(visibleCategories.reduce((s, c) => s + categoryAvg(c.key, c.skills), 0) / Math.max(visibleCategories.length, 1)) }}
          </p>
          <p class="skills-radar__hud-sub">
            <template v-if="activeKey">
              {{ visibleCategories.find((c) => c.key === activeKey)?.label }} · moyenne /20
            </template>
            <template v-else>
              Moyenne globale · échelle /20
            </template>
          </p>
        </div>

        <div class="skills-radar__legend absolute bottom-4 right-4 z-10 pointer-events-none max-w-[240px]">
          <p class="skills-radar__legend-title">Domaines</p>
          <ul class="skills-radar__legend-list">
            <li
              v-for="(cat, i) in visibleCategories"
              :key="cat.key"
              class="skills-radar__legend-item"
              :class="{ 'skills-radar__legend-item--active': activeKey === cat.key }"
            >
              <span
                class="skills-radar__legend-swatch"
                :style="{
                  background: pinPaletteForCategory(i).swatch,
                  boxShadow: `0 0 0 2px ${pinPaletteForCategory(i).ring}`
                }"
              />
              <span class="skills-radar__legend-label">{{ cat.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.fm-skills {
  background: #060810;
  color: #cbd5e1;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
}

.fm-skills__board {
  background:
    radial-gradient(ellipse 60% 40% at 20% 0%, rgba(56, 189, 248, 0.05), transparent 55%),
    #060810;
}

.fm-skills__header {
  border-bottom: 1px solid rgba(30, 58, 95, 0.6);
  padding-bottom: 0.75rem;
}

.fm-skills__eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(148, 163, 184, 0.65);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.fm-skills__title {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  color: #f8fafc;
}

.fm-skills__subtitle {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.55);
  padding-bottom: 0.15rem;
}

.fm-skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 0.35rem 0.5rem;
}

.fm-block {
  --cat-color: #38bdf8;
  border-radius: 2px;
  transition: opacity 0.25s ease, transform 0.25s ease;
  cursor: default;
}

.fm-block--dim {
  opacity: 0.28;
}

.fm-block--lit {
  opacity: 1;
}

.fm-block__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.5rem 0.25rem;
  border-bottom: 1px solid rgba(30, 58, 95, 0.5);
  margin-bottom: 0.15rem;
}

.fm-block__title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(226, 232, 240, 0.85);
  transition: color 0.2s ease, text-shadow 0.2s ease;
}

.fm-block--lit .fm-block__title {
  color: #fff;
  text-shadow: 0 0 12px color-mix(in srgb, var(--cat-color) 80%, transparent);
}

.fm-block__avg {
  font-size: 11px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #fbbf24;
}

.fm-block__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.fm-row {
  display: grid;
  grid-template-columns: 3px 1fr auto;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem 0.2rem 0;
  min-height: 22px;
  position: relative;
  transition:
    background 0.2s ease,
    box-shadow 0.25s ease,
    opacity 0.25s ease;
}

.fm-row--dim {
  opacity: 0.35;
}

.fm-row__accent {
  align-self: stretch;
  border-radius: 0 2px 2px 0;
  background: transparent;
  transition: background 0.2s ease, box-shadow 0.25s ease;
}

.fm-row--star .fm-row__accent {
  background: rgba(34, 197, 94, 0.55);
}

.fm-row--lit {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--cat-color) 22%, transparent) 0%,
    color-mix(in srgb, var(--cat-color) 8%, transparent) 55%,
    transparent 100%
  );
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--cat-color) 25%, transparent),
    0 0 18px color-mix(in srgb, var(--cat-color) 20%, transparent);
}

.fm-row--lit .fm-row__accent {
  background: var(--cat-color);
  box-shadow: 0 0 10px var(--cat-color);
}

.fm-row--lit .fm-row__name {
  color: #fff;
  font-weight: 600;
}

.fm-row--lit .fm-row__rating {
  transform: scale(1.05);
}

.fm-row__name {
  font-size: 11px;
  color: rgba(203, 213, 225, 0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.fm-row__rating {
  font-size: 11px;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  min-width: 1.4rem;
  text-align: right;
  transition: color 0.2s ease, transform 0.2s ease;
}

.fm-row__rating--low {
  color: rgba(100, 116, 139, 0.75);
}

.fm-row__rating--mid {
  color: rgba(226, 232, 240, 0.9);
}

.fm-row__rating--high {
  color: #86efac;
}

.fm-row__rating--elite {
  color: #fbbf24;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.45);
}

.fm-skills__hint {
  font-size: 10px;
  color: rgba(100, 116, 139, 0.55);
}

.fm-skills__radar {
  background: #060810;
}

.fm-skills__radar-inner {
  background: transparent;
}

.skills-radar__hud-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 600;
}

.skills-radar__hud-value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.skills-radar__hud-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 2px;
}

.skills-radar__legend {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
}

.skills-radar__legend-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 8px;
}

.skills-radar__legend-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skills-radar__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.skills-radar__legend-item--active .skills-radar__legend-label {
  color: rgba(103, 232, 249, 0.95);
}

.skills-radar__legend-swatch {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.92);
}

.skills-radar__legend-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

/* Variante refonte — papier chaud, radar compact + accordéon */
.fm-skills--refonte {
  background: var(--rf-paper, #f7f2ea);
  color: var(--rf-ink-soft, #4a433c);
  font-family: var(--rf-sans, ui-sans-serif, system-ui, sans-serif);
  min-height: 0;
}

.fm-skills__compact-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.35rem 1rem;
  padding: 0.85rem 1rem 0.65rem;
  border-bottom: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
}

.fm-skills__compact-stats {
  margin: 0;
  font-size: 0.82rem;
  color: var(--rf-ink-soft, #4a433c);
}

.fm-skills__compact-stats strong {
  font-family: var(--rf-serif, Fraunces, Georgia, serif);
  font-weight: 700;
  color: var(--rf-ink, #1a1612);
}

.fm-skills__compact-hint {
  margin: 0;
  font-size: 0.72rem;
  color: var(--rf-muted-ink, #5e5978);
}

.fm-skills__refonte-body {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .fm-skills__refonte-body {
    grid-template-columns: 1.15fr 0.85fr;
    min-height: 460px;
  }
}

.fm-skills__radar--hero {
  background:
    radial-gradient(ellipse 70% 60% at 50% 45%, rgba(225, 29, 72, 0.12), transparent 60%),
    var(--rf-bg-deep, #0a0f22);
  border-bottom: 1px solid var(--rf-line-ink, rgba(24, 22, 42, 0.2));
}

@media (min-width: 960px) {
  .fm-skills__radar--hero {
    border-bottom: 0;
    border-right: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
  }
}

.fm-skills__radar--hero .fm-skills__radar-inner {
  padding: 0.5rem;
}

.fm-skills__tabs-wrap {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.fm-skills__tabnav {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
}

.fm-skills__tabnav-btn {
  flex-shrink: 0;
  width: 2.35rem;
  border: 0;
  background: var(--rf-paper, #f7f2ea);
  color: var(--rf-ink, #1a1612);
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.2s var(--rf-ease, ease),
    color 0.2s var(--rf-ease, ease),
    opacity 0.2s var(--rf-ease, ease);
}

.fm-skills__tabnav-btn:first-child {
  border-right: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
}

.fm-skills__tabnav-btn:last-child {
  border-left: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
}

.fm-skills__tabnav-btn:hover:not(:disabled) {
  background: rgba(26, 22, 18, 0.05);
  color: var(--rf-accent, #b8432f);
}

.fm-skills__tabnav-btn:focus-visible {
  outline: 2px solid var(--rf-accent, #b8432f);
  outline-offset: -2px;
  z-index: 1;
}

.fm-skills__tabnav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fm-skills__tablist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
  padding: 0.65rem 0.5rem;
  overflow: hidden;
}

.fm-skills__tablist::-webkit-scrollbar {
  display: none;
}

.fm-skills__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex-shrink: 0;
  width: 100%;
  min-width: 0;
  padding: 0.45rem 0.5rem;
  border: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
  border-radius: 999px;
  background: rgba(26, 22, 18, 0.03);
  color: var(--rf-ink-soft, #4a433c);
  font-family: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s var(--rf-ease, ease),
    border-color 0.2s var(--rf-ease, ease),
    color 0.2s var(--rf-ease, ease),
    box-shadow 0.2s var(--rf-ease, ease);
}

.fm-skills__tab:hover {
  background: rgba(26, 22, 18, 0.06);
  border-color: color-mix(in srgb, var(--cat-color) 35%, var(--rf-line, rgba(26, 22, 18, 0.12)));
}

.fm-skills__tab--active {
  background: color-mix(in srgb, var(--cat-color) 12%, var(--rf-paper, #f7f2ea));
  border-color: color-mix(in srgb, var(--cat-color) 55%, var(--rf-line, rgba(26, 22, 18, 0.12)));
  color: var(--rf-ink, #1a1612);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--cat-color) 18%, transparent);
}

.fm-skills__tab-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fm-skills__tab-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.fm-skills__tab-avg {
  font-family: ui-monospace, monospace;
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--rf-gold, #b8954a);
}

.fm-skills__tabpanel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.85rem 1rem 1rem;
}

.fm-tabpanel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
  padding-bottom: 0.55rem;
  border-bottom: 2px solid color-mix(in srgb, var(--cat-color) 55%, var(--rf-line, rgba(26, 22, 18, 0.12)));
}

.fm-tabpanel__title {
  margin: 0;
  font-family: var(--rf-serif, Fraunces, Georgia, serif);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--rf-ink, #1a1612);
}

.fm-tabpanel__meta {
  margin: 0.15rem 0 0;
  font-size: 0.72rem;
  color: var(--rf-muted-ink, #5e5978);
}

.fm-tabpanel__avg {
  flex-shrink: 0;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  color: var(--rf-gold, #b8954a);
}

.fm-tabpanel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .fm-tabpanel__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 0.75rem;
  }
}

.fm-tab-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.45rem;
  background: rgba(26, 22, 18, 0.03);
}

.fm-tab-row--star {
  background: color-mix(in srgb, var(--cat-color) 10%, rgba(26, 22, 18, 0.03));
  box-shadow: inset 2px 0 0 var(--cat-color);
}

.fm-tab-row__name {
  font-size: 0.78rem;
  color: var(--rf-ink-soft, #4a433c);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fm-tab-row__rating {
  flex-shrink: 0;
  font-size: 0.78rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
}

.fm-tab-row__rating--low { color: var(--rf-muted-ink, #4a4660); }
.fm-tab-row__rating--mid { color: var(--rf-ink-soft, #2f2c45); }
.fm-tab-row__rating--high { color: var(--rf-sage-paper, #1e40af); }
.fm-tab-row__rating--elite { color: var(--rf-gold-paper, #a16207); }

.fm-skills--refonte .fm-skills__board {
  background:
    radial-gradient(ellipse 55% 45% at 15% 0%, rgba(225, 29, 72, 0.06), transparent 55%),
    var(--rf-paper, #fff9ed);
}

.fm-skills--refonte .fm-skills__header {
  border-bottom: 1px solid var(--rf-line, rgba(26, 22, 18, 0.12));
}

.fm-skills--refonte .fm-skills__eyebrow {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: var(--rf-muted-ink, #5e5978);
}

.fm-skills--refonte .fm-skills__title {
  font-family: var(--rf-serif, Fraunces, Georgia, serif);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--rf-ink, #1a1612);
}

.fm-skills--refonte .fm-skills__subtitle {
  font-size: 0.75rem;
  color: var(--rf-muted-ink, #5e5978);
}

.fm-skills--refonte .fm-block__head {
  border-bottom-color: var(--rf-line, rgba(26, 22, 18, 0.12));
}

.fm-skills--refonte .fm-block__title {
  color: var(--rf-ink-soft, #4a433c);
}

.fm-skills--refonte .fm-block--lit .fm-block__title {
  color: var(--rf-ink, #1a1612);
  text-shadow: none;
}

.fm-skills--refonte .fm-block__avg {
  color: var(--rf-gold-paper, #a16207);
}

.fm-skills--refonte .fm-row--star .fm-row__accent {
  background: rgba(37, 99, 235, 0.45);
}

.fm-skills--refonte .fm-row--lit .fm-row__name {
  color: var(--rf-ink, #1a1612);
}

.fm-skills--refonte .fm-row__name {
  color: var(--rf-ink-soft, #4a433c);
}

.fm-skills--refonte .fm-row__rating--low {
  color: var(--rf-muted-ink, #4a4660);
}

.fm-skills--refonte .fm-row__rating--mid {
  color: var(--rf-ink-soft, #2f2c45);
}

.fm-skills--refonte .fm-row__rating--high {
  color: var(--rf-sage-paper, #1e40af);
}

.fm-skills--refonte .fm-row__rating--elite {
  color: var(--rf-gold-paper, #a16207);
  text-shadow: none;
}

.fm-skills--refonte .fm-skills__hint {
  color: var(--rf-muted-ink, #5e5978);
}

.fm-skills--refonte .fm-skills__radar {
  background: transparent;
}

.fm-skills--refonte .skills-radar__hud-label {
  color: var(--rf-text-soft, #e4e9f5);
}

.fm-skills--refonte .skills-radar__hud-value {
  font-size: 2rem;
  background: linear-gradient(135deg, #e11d48, #2563eb, #eab308);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.fm-skills--refonte .skills-radar__hud-sub {
  color: var(--rf-text-soft, #e4e9f5);
}

.fm-skills--refonte .skills-radar__legend {
  background: rgba(255, 249, 237, 0.95);
  border-color: var(--rf-line-ink, rgba(24, 22, 42, 0.2));
  box-shadow: var(--rf-shadow, 4px 4px 0 rgba(0, 0, 0, 0.92));
}

.fm-skills--refonte .skills-radar__legend-title {
  color: var(--rf-muted-ink, #5e5978);
}

.fm-skills--refonte .skills-radar__legend-item--active .skills-radar__legend-label {
  color: var(--rf-accent, #b8432f);
}

.fm-skills--refonte .skills-radar__legend-swatch {
  border-color: var(--rf-paper, #f7f2ea);
}

.fm-skills--refonte .skills-radar__legend-label {
  color: var(--rf-ink-soft, #4a433c);
}

/* Refonte manga — radar scouter + notes BD */
.fm-skills--refonte {
  border: none;
  box-shadow: none;
}

.fm-skills--refonte .fm-skills__compact-bar {
  padding: 1rem 1.15rem 0.85rem;
  border-bottom: 2.5px solid var(--rf-ink, #18162a);
  background:
    linear-gradient(90deg, rgba(225, 29, 72, 0.12), transparent 40%),
    var(--rf-paper-deep, #f5ecd6);
}

.fm-skills--refonte .fm-skills__compact-stats strong {
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.fm-skills--refonte .fm-skills__radar--hero {
  background:
    radial-gradient(circle at center, rgba(234, 179, 8, 0.08) 0%, transparent 55%),
    repeating-radial-gradient(circle at center, transparent 0 18px, rgba(255, 249, 237, 0.04) 18px 19px),
    radial-gradient(ellipse 70% 60% at 50% 45%, rgba(225, 29, 72, 0.14), transparent 60%),
    var(--rf-bg-deep, #0a0f22);
}

.fm-skills--refonte .fm-skills__tabnav-btn {
  border: 2px solid var(--rf-ink, #18162a);
  background: var(--rf-paper, #fff9ed);
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  box-shadow: 2px 2px 0 var(--rf-ink, #18162a);
}

.fm-skills--refonte .fm-skills__tabnav-btn:hover:not(:disabled) {
  background: var(--rf-gold, #eab308);
  color: var(--rf-ink, #18162a);
}

.fm-skills--refonte .fm-skills__tab {
  border-radius: var(--rf-radius, 0.35rem);
  border-width: 2px;
  border-color: var(--rf-ink, #18162a);
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 2px 2px 0 rgba(24, 22, 42, 0.15);
  color: var(--rf-ink, #141222);
  background: var(--rf-paper, #fff9ed);
}

.fm-skills--refonte .fm-skills__tab-avg {
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  color: var(--rf-gold-paper, #a16207);
  font-size: 0.75rem;
}

.fm-skills--refonte .fm-skills__tab--active {
  background: var(--rf-accent, #e11d48);
  border-color: var(--rf-ink, #18162a);
  color: #fff;
  box-shadow: 3px 3px 0 var(--rf-ink, #18162a);
  transform: translate(-1px, -1px);
}

.fm-skills--refonte .fm-skills__tab--active .fm-skills__tab-avg {
  color: #fff;
}

.fm-skills--refonte .fm-tabpanel__head {
  border-bottom-width: 3px;
  border-bottom-color: var(--rf-ink, #18162a);
}

.fm-skills--refonte .fm-tabpanel__title {
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  font-size: 1.25rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.fm-skills--refonte .fm-tabpanel__avg {
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  font-size: 1.65rem;
  color: var(--rf-accent, #e11d48);
  text-shadow: 1px 1px 0 var(--rf-ink, #18162a);
}

.fm-skills--refonte .fm-tab-row {
  border: 1.5px solid rgba(24, 22, 42, 0.12);
  border-radius: var(--rf-radius, 0.35rem);
  transition: transform 0.2s var(--rf-ease, ease), box-shadow 0.2s var(--rf-ease, ease);
}

.fm-skills--refonte .fm-tab-row:hover {
  transform: translateX(3px);
  box-shadow: -3px 0 0 var(--rf-accent, #e11d48);
}

.fm-skills--refonte .fm-tab-row--star {
  background: rgba(234, 179, 8, 0.12);
  box-shadow: inset 3px 0 0 var(--rf-gold, #eab308);
}

.fm-skills--refonte .fm-tab-row__rating--low {
  color: var(--rf-muted-ink, #4a4660);
}

.fm-skills--refonte .fm-tab-row__rating--mid {
  color: var(--rf-ink-soft, #2f2c45);
}

.fm-skills--refonte .fm-tab-row__rating--high {
  color: var(--rf-sage-paper, #1e40af);
}

.fm-skills--refonte .fm-tab-row__rating--elite {
  color: var(--rf-accent, #e11d48);
  font-family: var(--rf-serif, Bangers, Impact, sans-serif);
  font-size: 0.85rem;
}

.fm-skills--refonte .skills-radar__hud-value {
  background: linear-gradient(135deg, #eab308, #e11d48, #2563eb);
}

.fm-skills--refonte .skills-radar__legend {
  border: 2px solid var(--rf-ink, #18162a);
  box-shadow: 3px 3px 0 var(--rf-ink, #18162a);
}
</style>
