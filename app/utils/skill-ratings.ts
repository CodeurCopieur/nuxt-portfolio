export type SkillRatingTier = 'low' | 'mid' | 'high' | 'elite'

export const REFONTE_SKILL_COLORS: Record<string, string> = {
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

function normalizeSkillName(skill: string) {
  return skill.toLowerCase().trim()
}

export function skillRating(skill: string, categoryKey: string, index: number) {
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

export function ratingTier(value: number): SkillRatingTier {
  if (value >= 16) return 'elite'
  if (value >= 14) return 'high'
  if (value >= 12) return 'mid'
  return 'low'
}

export function categoryAvg(catKey: string, skills: string[]) {
  if (!skills.length) return 0
  const sum = skills.reduce((acc, skill, i) => acc + skillRating(skill, catKey, i), 0)
  return Math.round(sum / skills.length)
}

export function colorForSkillCategory(key: string) {
  if (REFONTE_SKILL_COLORS[key]) return REFONTE_SKILL_COLORS[key]!
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash)
  return `hsl(${Math.abs(hash) % 360} 45% 42%)`
}
