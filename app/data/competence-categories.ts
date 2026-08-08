import type { PortfolioCompetences } from '~/types/portfolio'

export type CompetenceCategoryKey = keyof PortfolioCompetences

export interface CompetenceCategoryDef {
  key: CompetenceCategoryKey
  label: string
  hint: string
  description: string
  accent: string
  gradient: string
}

export const COMPETENCE_CATEGORIES: CompetenceCategoryDef[] = [
  {
    key: 'langages',
    label: 'Langages',
    hint: 'HTML, CSS, JavaScript…',
    description: 'Fondations du développement web',
    accent: 'sky',
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    key: 'frameworks',
    label: 'Frameworks',
    hint: 'Vue, Nuxt, React…',
    description: 'Bibliothèques et frameworks applicatifs',
    accent: 'indigo',
    gradient: 'from-indigo-500 to-violet-600'
  },
  {
    key: 'outils_dev',
    label: 'Outils dev',
    hint: 'Git, VS Code, Postman…',
    description: 'Outils du quotidien en développement',
    accent: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    key: 'ui_animations',
    label: 'UI & Animations',
    hint: 'GSAP, Tailwind, Bootstrap…',
    description: 'Interfaces, styles et motion design',
    accent: 'purple',
    gradient: 'from-purple-500 to-fuchsia-600'
  },
  {
    key: 'design',
    label: 'Design',
    hint: 'Figma, Zeplin…',
    description: 'Outils de conception et prototypage',
    accent: 'pink',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    key: 'environnements',
    label: 'Environnements',
    hint: 'Windows, macOS…',
    description: 'Systèmes et environnements de travail',
    accent: 'teal',
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    key: 'methodes',
    label: 'Méthodes',
    hint: 'Agile, SEO, RGPD…',
    description: 'Organisation, qualité et bonnes pratiques',
    accent: 'orange',
    gradient: 'from-orange-500 to-amber-600'
  },
  {
    key: 'ia_cursor',
    label: 'IA & Cursor',
    hint: 'Grok, Composer, Opus, GPT-5.6…',
    description: 'Assistants IA et workflow de développement avec Cursor',
    accent: 'violet',
    gradient: 'from-violet-500 to-purple-600'
  }
]

export const DEFAULT_COMPETENCES_ORDER: CompetenceCategoryKey[] = COMPETENCE_CATEGORIES.map((c) => c.key)

const categoryKeys = new Set<CompetenceCategoryKey>(DEFAULT_COMPETENCES_ORDER)

export function isCompetenceCategoryKey(value: string): value is CompetenceCategoryKey {
  return categoryKeys.has(value as CompetenceCategoryKey)
}

export function resolveCompetencesOrder(order: string[] | undefined | null): CompetenceCategoryKey[] {
  const valid = (order ?? []).filter(isCompetenceCategoryKey)
  const missing = DEFAULT_COMPETENCES_ORDER.filter((key) => !valid.includes(key))
  return [...valid, ...missing]
}

export function getCompetenceCategory(key: CompetenceCategoryKey): CompetenceCategoryDef {
  return COMPETENCE_CATEGORIES.find((c) => c.key === key)!
}

export function sortCompetenceCategories(order: CompetenceCategoryKey[]): CompetenceCategoryDef[] {
  return resolveCompetencesOrder(order).map(getCompetenceCategory)
}
