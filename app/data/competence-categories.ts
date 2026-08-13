export type BuiltinCompetenceCategoryKey =
  | 'langages'
  | 'frameworks'
  | 'outils_dev'
  | 'ui_animations'
  | 'design'
  | 'environnements'
  | 'methodes'
  | 'ia_cursor'

export type CompetenceCategoryKey = BuiltinCompetenceCategoryKey

export interface CompetenceCategoryDef {
  key: string
  label: string
  hint: string
  description: string
  accent: string
  gradient: string
}

export interface CustomCategoriesData {
  definitions: CompetenceCategoryDef[]
  skills: Record<string, string[]>
  hidden_builtin?: string[]
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

export const BUILTIN_COMPETENCE_KEYS = new Set(COMPETENCE_CATEGORIES.map((c) => c.key))

export const DEFAULT_COMPETENCES_ORDER: string[] = COMPETENCE_CATEGORIES.map((c) => c.key)

export const CUSTOM_CATEGORY_ACCENT_PRESETS: Pick<CompetenceCategoryDef, 'accent' | 'gradient'>[] = [
  { accent: 'rose', gradient: 'from-rose-500 to-red-600' },
  { accent: 'cyan', gradient: 'from-cyan-500 to-blue-600' },
  { accent: 'lime', gradient: 'from-lime-500 to-green-600' },
  { accent: 'amber', gradient: 'from-amber-500 to-yellow-600' }
]

const emptyCustomCategories = (): CustomCategoriesData => ({
  definitions: [],
  skills: {},
  hidden_builtin: []
})

export function parseCustomCategories(raw: unknown): CustomCategoriesData {
  if (!raw || typeof raw !== 'object') return emptyCustomCategories()

  const obj = raw as Record<string, unknown>
  const definitions = Array.isArray(obj.definitions)
    ? obj.definitions
        .filter((item): item is CompetenceCategoryDef =>
          !!item
          && typeof item === 'object'
          && typeof (item as CompetenceCategoryDef).key === 'string'
          && typeof (item as CompetenceCategoryDef).label === 'string'
        )
        .filter((item) => !BUILTIN_COMPETENCE_KEYS.has(item.key))
    : []

  const skills: Record<string, string[]> = {}
  if (obj.skills && typeof obj.skills === 'object') {
    for (const [key, value] of Object.entries(obj.skills as Record<string, unknown>)) {
      if (Array.isArray(value)) skills[key] = value.filter((v): v is string => typeof v === 'string')
    }
  }

  return { definitions, skills, hidden_builtin: Array.isArray(obj.hidden_builtin) ? obj.hidden_builtin.filter((k): k is string => typeof k === 'string') : [] }
}

export function isBuiltinCategoryKey(key: string) {
  return BUILTIN_COMPETENCE_KEYS.has(key)
}

export function slugifyCategoryKey(label: string) {
  const base = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40)

  return base || 'categorie'
}

export function resolveCompetencesOrder(order: string[] | undefined | null, allKeys?: string[]) {
  const keys = allKeys ?? DEFAULT_COMPETENCES_ORDER
  const valid = (order ?? []).filter((key) => keys.includes(key))
  const missing = keys.filter((key) => !valid.includes(key))
  return [...valid, ...missing]
}

export function mergeCompetenceCategories(
  order: string[] | undefined | null,
  customDefinitions: CompetenceCategoryDef[] = []
): CompetenceCategoryDef[] {
  const custom = customDefinitions.filter((cat) => !isBuiltinCategoryKey(cat.key))
  const map = new Map<string, CompetenceCategoryDef>()

  for (const cat of COMPETENCE_CATEGORIES) map.set(cat.key, cat)
  for (const cat of custom) map.set(cat.key, cat)

  return resolveCompetencesOrder(order, [...map.keys()])
    .map((key) => map.get(key))
    .filter((cat): cat is CompetenceCategoryDef => !!cat)
}

export function getCompetenceCategory(key: string, customDefinitions: CompetenceCategoryDef[] = []) {
  return mergeCompetenceCategories([...DEFAULT_COMPETENCES_ORDER, ...customDefinitions.map((c) => c.key)], customDefinitions)
    .find((cat) => cat.key === key)
}

export function sortCompetenceCategories(
  order: string[],
  customDefinitions: CompetenceCategoryDef[] = []
) {
  return mergeCompetenceCategories(order, customDefinitions)
}

export function isCompetenceCategoryKey(value: string): value is CompetenceCategoryKey {
  return BUILTIN_COMPETENCE_KEYS.has(value as CompetenceCategoryKey)
}

export function buildCustomCategoryDefinition(label: string, hint: string, description: string, index: number): CompetenceCategoryDef {
  const preset = CUSTOM_CATEGORY_ACCENT_PRESETS[index % CUSTOM_CATEGORY_ACCENT_PRESETS.length]!
  return {
    key: slugifyCategoryKey(label),
    label: label.trim(),
    hint: hint.trim() || 'Compétences…',
    description: description.trim() || label.trim(),
    accent: preset.accent,
    gradient: preset.gradient
  }
}

export function createUniqueCategoryKey(label: string, existingKeys: Set<string>) {
  let key = slugifyCategoryKey(label)
  if (!existingKeys.has(key)) return key

  let index = 2
  while (existingKeys.has(`${key}_${index}`)) index += 1
  return `${key}_${index}`
}
