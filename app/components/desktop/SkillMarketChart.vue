<script setup lang="ts">
import { useContent } from '@/composables/useContent'
import { COMPETENCE_CATEGORIES, sortCompetenceCategories } from '~/data/competence-categories'
import { getCareerPinPalette, type CareerPinPalette } from '~/utils/career-pin-colors'

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

const visibleCategories = computed(() =>
  categoryDefs.value
    .map((cat) => ({
      ...cat,
      skills: competences.value[cat.key] ?? [],
      count: (competences.value[cat.key] ?? []).length
    }))
    .filter((cat) => cat.skills.length > 0)
)

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

const activeKey = computed(() => focusedKey.value ?? hoveredKey.value)

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
    grad.addColorStop(0, '#67e8f9')
    grad.addColorStop(1, '#22d3ee')
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
  if (CATEGORY_COLORS[key]) return CATEGORY_COLORS[key]!
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
  const grad = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.7)
  grad.addColorStop(0, '#12182b')
  grad.addColorStop(0.55, '#0a0e18')
  grad.addColorStop(1, '#060810')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  visibleCategories.value.forEach((cat, i) => {
    const angle = -Math.PI / 2 + (i / visibleCategories.value.length) * Math.PI * 2
    const gx = width * 0.5 + Math.cos(angle) * width * 0.2
    const gy = height * 0.45 + Math.sin(angle) * height * 0.16
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 100)
    glow.addColorStop(0, `${colorFor(cat.key)}20`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)
  })

  for (let i = 0; i < 36; i++) {
    const sx = (i * 137.5 + t * 10) % width
    const sy = (i * 97.3 + t * 7) % height
    ctx.beginPath()
    ctx.arc(sx, sy, 0.5 + (i % 3) * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.06 + Math.sin(t + i) * 0.03})`
    ctx.fill()
  }
}

function drawRadarGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, n: number) {
  if (n < 1) return

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
    ctx.strokeStyle = `rgba(148, 163, 184, ${0.05 + level * 0.025})`
    ctx.stroke()
  }

  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)'
    ctx.stroke()
  }

  ctx.font = '600 8px ui-monospace, monospace'
  ctx.fillStyle = 'rgba(148, 163, 184, 0.45)'
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
  fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)')
  fillGrad.addColorStop(0.5, 'rgba(129, 140, 248, 0.18)')
  fillGrad.addColorStop(1, 'rgba(167, 139, 250, 0.08)')
  ctx.fillStyle = fillGrad
  ctx.fill()

  ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)'
  ctx.lineWidth = 2
  ctx.shadowColor = 'rgba(56, 189, 248, 0.55)'
  ctx.shadowBlur = focus ? 18 : 10
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
    ctx.fillStyle = lit ? 'rgba(251, 191, 36, 0.92)' : 'rgba(15, 23, 42, 0.85)'
    ctx.globalAlpha = dim ? 0.35 : 1
    ctx.fill()
    ctx.strokeStyle = lit ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.12)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.globalAlpha = 1

    ctx.font = '800 9px ui-monospace, monospace'
    ctx.fillStyle = lit ? '#0f172a' : 'rgba(251, 191, 36, 0.9)'
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
  const cy = height * 0.52
  const radius = Math.min(width, height) * 0.36

  drawBackground(ctx, t)

  if (visibleCategories.value.length >= 3) {
    drawRadar(ctx, cx, cy, radius, ease, t)

    ctx.font = '800 22px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(totalSkills.value), cx, cy - 6)
    ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
    ctx.fillText('compétences', cx, cy + 14)
  } else {
    ctx.font = '600 12px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
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
  if (!canvas || focusedKey.value) return
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  let found: string | null = null
  for (const p of radarPoints) {
    if (Math.hypot(x - p.tipX, y - p.tipY) < 20) found = p.key
  }
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
    if (!focusedKey.value) hoveredKey.value = null
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
    class="fm-skills h-full min-h-[520px] flex flex-col xl:flex-row"
    @mouseleave="!focusedKey && (hoveredKey = null)"
  >
    <!-- Colonnes style FM -->
    <div class="fm-skills__board flex-1 min-w-0 xl:max-w-[42%] overflow-y-auto p-3 sm:p-4">
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

    <!-- Radar — style cartographie -->
    <aside class="fm-skills__radar shrink-0 w-full xl:flex-1 xl:min-w-[560px] border-t xl:border-t-0 xl:border-l border-white/8">
      <div ref="containerRef" class="fm-skills__radar-inner relative h-[420px] xl:h-full min-h-[400px]">
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
</style>
