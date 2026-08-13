<script setup lang="ts">
import type { PortfolioCompetences } from '~/types/portfolio'
import type { CompetenceCategoryDef } from '~/data/competence-categories'
import {
  COMPETENCE_CATEGORIES,
  DEFAULT_COMPETENCES_ORDER,
  createUniqueCategoryKey,
  isBuiltinCategoryKey,
  mergeCompetenceCategories,
  parseCustomCategories,
  resolveCompetencesOrder
} from '~/data/competence-categories'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const saving = ref(false)
const message = ref<string | null>(null)

type CategoryKey = string

const customDefinitions = ref<CompetenceCategoryDef[]>([])
const hiddenBuiltin = ref<string[]>([])
const categoryOrder = ref<string[]>([...DEFAULT_COMPETENCES_ORDER])
const orderedCategories = computed(() => mergeCompetenceCategories(categoryOrder.value, customDefinitions.value))

const catalog = reactive<Record<string, string[]>>({})
const selected = reactive<Record<string, string[]>>({})
const openSections = reactive<Record<string, boolean>>({})
const newSkillInputs = reactive<Record<string, string>>({})

const newCategoryLabel = ref('')
const newCategoryHint = ref('')
const newCategoryDescription = ref('')

const defaultSuggestions: PortfolioCompetences = {
  langages: ['HTML5', 'CSS3/SCSS', 'JavaScript', 'TypeScript'],
  frameworks: ['Nuxt 4', 'Nuxt 3', 'Vue 3', 'Vue Router', 'Pinia', 'React', 'Twig/Drupal', 'Next.js'],
  outils_dev: ['VS Code', 'Postman', 'Git', 'GitHub', 'GitLab', 'npm', 'Supabase', 'Firebase'],
  ui_animations: ['Tailwind CSS', 'Bootstrap', 'Bulma', 'Materialize', 'GSAP', 'ScrollMagic', 'AOS', 'ScrollReveal', 'CSS Animations'],
  design: ['Figma', 'Zeplin', 'Adobe XD'],
  environnements: ['Windows', 'macOS', 'Linux', 'Git Bash'],
  methodes: ['Agile (Scrum)', 'TMA', 'SEO', 'RGPD', 'Accessibilité'],
  ia_cursor: [
    'Cursor Grok 4.5',
    'Composer 2.5',
    'Opus 5',
    'GPT-5.6 Sol',
    'Fable 5',
    'Sonnet 5',
    'GPT-5.6 Terra',
    'Opus 4.8',
    'GPT-5.5',
    'Sonnet 4.6',
    'Codex 5.3',
    'Opus 4.7',
    'GPT-5.4',
    'Opus 4.6',
    'Opus 4.5',
    'GPT-5.2',
    'GPT-5.6 Luna',
    'Gemini 3.6 Flash',
    'Gemini 3.1 Pro',
    'GPT-5.4 Mini',
    'GPT-5.4 Nano',
    'Haiku 4.5',
    'Sonnet 4.5',
    'GPT-5.1',
    'Gemini 3 Flash',
    'Gemini 3.5 Flash',
    'Sonnet 4',
    'GPT-5 Mini',
    'Gemini 2.5 Flash',
    'Kimi K3',
    'Kimi K2.7 Code',
    'GLM 5.2'
  ]
}

const EXCLUDED_STORAGE_KEY = 'portfolio-admin-competences-excluded'
const excludedSkills = reactive<Record<string, string[]>>({})

function ensureCategoryKeys(keys: string[]) {
  for (const key of keys) {
    if (!(key in catalog)) catalog[key] = []
    if (!(key in selected)) selected[key] = []
    if (!(key in openSections)) openSections[key] = false
    if (!(key in newSkillInputs)) newSkillInputs[key] = ''
    if (!(key in excludedSkills)) excludedSkills[key] = []
  }
}

watch(
  orderedCategories,
  (cats) => ensureCategoryKeys(cats.map((cat) => cat.key)),
  { immediate: true }
)

const totalSelected = computed(() =>
  orderedCategories.value.reduce((sum, cat) => sum + (selected[cat.key]?.length ?? 0), 0)
)

const deleteTarget = ref<{ key: CategoryKey; skill: string } | null>(null)
const cascadeDeleting = ref(false)
const linkUsage = ref({ filters: 0, projects: 0, experiences: 0 })

function loadExcludedFromStorage() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(EXCLUDED_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Partial<Record<string, string[]>>
    for (const [key, values] of Object.entries(parsed)) {
      excludedSkills[key] = [...(values ?? [])]
    }
  } catch {
    /* ignore */
  }
}

function persistExcludedToStorage() {
  if (!import.meta.client) return
  localStorage.setItem(EXCLUDED_STORAGE_KEY, JSON.stringify(excludedSkills))
}

function skillKey(label: string) {
  return normalizeSkill(label).toLowerCase()
}

function isExcluded(key: CategoryKey, skill: string) {
  const k = skillKey(skill)
  return (excludedSkills[key] ?? []).some((s) => s.toLowerCase() === k)
}

function matchesSkill(value: string, skill: string) {
  return skillKey(value) === skillKey(skill)
}

function normalizeSkill(label: string): string {
  const trimmed = label.trim()
  if (/^tailwind\s*css$/i.test(trimmed) || trimmed === 'TailwindCSS') return 'Tailwind CSS'
  return trimmed
}

function dedupeSkills(skills: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const skill of skills) {
    const norm = normalizeSkill(skill)
    const key = norm.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(norm)
    }
  }
  return result
}

function buildCatalog(key: CategoryKey, saved: string[]) {
  const pool = new Set([
    ...saved.map(normalizeSkill),
    ...(defaultSuggestions[key] ?? [])
      .map(normalizeSkill)
      .filter((skill) => !isExcluded(key, skill))
  ])
  catalog[key] = [...pool].sort((a, b) => a.localeCompare(b, 'fr'))
  selected[key] = dedupeSkills(saved)
}

function isSelected(key: CategoryKey, skill: string) {
  return selected[key].includes(skill)
}

function toggleSkill(key: CategoryKey, skill: string) {
  const list = selected[key]
  const index = list.indexOf(skill)
  if (index === -1) list.push(skill)
  else list.splice(index, 1)
}

function addSkillToCatalog(key: CategoryKey) {
  const label = normalizeSkill(newSkillInputs[key])
  if (!label) return

  excludedSkills[key] = excludedSkills[key].filter((s) => !matchesSkill(s, label))
  persistExcludedToStorage()

  if (!catalog[key].some((s) => matchesSkill(s, label))) {
    catalog[key] = [...catalog[key], label].sort((a, b) => a.localeCompare(b, 'fr'))
  }
  if (!selected[key].some((s) => matchesSkill(s, label))) {
    selected[key].push(label)
  }

  newSkillInputs[key] = ''
  message.value = `« ${label} » ajoutée à ${orderedCategories.value.find((c) => c.key === key)?.label ?? key}`
}

function removeFromSelection(key: CategoryKey, skill: string) {
  selected[key] = selected[key].filter((s) => !matchesSkill(s, skill))
}

async function countSkillUsage(skill: string) {
  const [filtersRes, projectsRes, experiencesRes] = await Promise.all([
    supabase.from('portfolio_tech_filters').select('id, label'),
    supabase.from('portfolio_projects').select('id, stack'),
    supabase.from('portfolio_experiences').select('id, stack')
  ])

  const filters = (filtersRes.data ?? []).filter((f) => matchesSkill(String(f.label), skill)).length
  const projects = (projectsRes.data ?? []).filter((p) =>
    ((p.stack as string[]) ?? []).some((s) => matchesSkill(s, skill))
  ).length
  const experiences = (experiencesRes.data ?? []).filter((e) =>
    ((e.stack as string[]) ?? []).some((s) => matchesSkill(s, skill))
  ).length

  return { filters, projects, experiences }
}

async function openDeleteSkill(key: CategoryKey, skill: string) {
  deleteTarget.value = { key, skill }
  linkUsage.value = await countSkillUsage(skill)
}

function closeDeleteSkill() {
  if (cascadeDeleting.value) return
  deleteTarget.value = null
}

async function deleteSkillCompletely() {
  if (!deleteTarget.value) return

  const { key, skill } = deleteTarget.value
  const label = normalizeSkill(skill)
  cascadeDeleting.value = true
  message.value = null

  try {
    if (!excludedSkills[key].some((s) => matchesSkill(s, label))) {
      excludedSkills[key].push(label)
    }
    persistExcludedToStorage()

    catalog[key] = catalog[key].filter((s) => !matchesSkill(s, label))
    selected[key] = selected[key].filter((s) => !matchesSkill(s, label))

    const { data: filters } = await supabase.from('portfolio_tech_filters').select('id, label')
    for (const filter of filters ?? []) {
      if (matchesSkill(String(filter.label), label)) {
        const { error } = await supabase.from('portfolio_tech_filters').delete().eq('id', filter.id)
        if (error) throw new Error(`Filtre : ${error.message}`)
      }
    }

    const { data: projects } = await supabase.from('portfolio_projects').select('id, stack')
    for (const project of projects ?? []) {
      const stack = ((project.stack as string[]) ?? []).filter((s) => !matchesSkill(s, label))
      if (stack.length !== ((project.stack as string[]) ?? []).length) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update({ stack, updated_at: new Date().toISOString() })
          .eq('id', project.id)
        if (error) throw new Error(`Projet : ${error.message}`)
      }
    }

    const { data: experiences } = await supabase.from('portfolio_experiences').select('id, stack')
    for (const experience of experiences ?? []) {
      const stack = ((experience.stack as string[]) ?? []).filter((s) => !matchesSkill(s, label))
      if (stack.length !== ((experience.stack as string[]) ?? []).length) {
        const { error } = await supabase
          .from('portfolio_experiences')
          .update({ stack, updated_at: new Date().toISOString() })
          .eq('id', experience.id)
        if (error) throw new Error(`Expérience : ${error.message}`)
      }
    }

    await save({ silent: true })

    const total =
      linkUsage.value.filters + linkUsage.value.projects + linkUsage.value.experiences
    message.value = total
      ? `« ${label} » supprimée (${total} lien${total > 1 ? 's' : ''} retiré${total > 1 ? 's' : ''})`
      : `« ${label} » supprimée du catalogue`
    deleteTarget.value = null
  } catch (err) {
    message.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
  } finally {
    cascadeDeleting.value = false
  }
}

function moveCategory(key: CategoryKey, direction: -1 | 1) {
  const index = categoryOrder.value.indexOf(key)
  if (index === -1) return
  const target = index + direction
  if (target < 0 || target >= categoryOrder.value.length) return
  const next = [...categoryOrder.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  categoryOrder.value = next
}

onMounted(async () => {
  loadExcludedFromStorage()

  const { data } = await supabase.from('portfolio_competences').select('*').eq('id', 1).maybeSingle()
  const custom = parseCustomCategories(data?.custom_categories)
  customDefinitions.value = custom.definitions
  hiddenBuiltin.value = [...(custom.hidden_builtin ?? [])]

  const allKeys = [
    ...COMPETENCE_CATEGORIES.map((cat) => cat.key),
    ...custom.definitions.map((cat) => cat.key)
  ].filter((key) => !hiddenBuiltin.value.includes(key))
  categoryOrder.value = resolveCompetencesOrder(data?.categories_order as string[] | undefined, allKeys)

  for (const cat of COMPETENCE_CATEGORIES) {
    const saved = (data?.[cat.key] as string[] | undefined) ?? []
    buildCatalog(cat.key, saved)
  }

  for (const cat of custom.definitions) {
    buildCatalog(cat.key, custom.skills[cat.key] ?? [])
  }
})

function addCustomCategory() {
  const label = newCategoryLabel.value.trim()
  if (!label) return

  const existingKeys = new Set([
    ...COMPETENCE_CATEGORIES.map((cat) => cat.key),
    ...customDefinitions.value.map((cat) => cat.key)
  ])
  const key = createUniqueCategoryKey(label, existingKeys)
  const presetIndex = customDefinitions.value.length
  const def: CompetenceCategoryDef = {
    key,
    label,
    hint: newCategoryHint.value.trim() || 'Compétences…',
    description: newCategoryDescription.value.trim() || label,
    accent: ['rose', 'cyan', 'lime', 'amber'][presetIndex % 4]!,
    gradient: [
      'from-rose-500 to-red-600',
      'from-cyan-500 to-blue-600',
      'from-lime-500 to-green-600',
      'from-amber-500 to-yellow-600'
    ][presetIndex % 4]!
  }

  customDefinitions.value.push(def)
  categoryOrder.value.push(key)
  ensureCategoryKeys([key])
  openSections[key] = true

  newCategoryLabel.value = ''
  newCategoryHint.value = ''
  newCategoryDescription.value = ''
  message.value = `Catégorie « ${label} » créée — pensez à enregistrer`
}

function removeCategory(key: string) {
  categoryOrder.value = categoryOrder.value.filter((item) => item !== key)

  if (isBuiltinCategoryKey(key)) {
    if (!hiddenBuiltin.value.includes(key)) hiddenBuiltin.value.push(key)
    selected[key] = []
    catalog[key] = []
  } else {
    customDefinitions.value = customDefinitions.value.filter((cat) => cat.key !== key)
    delete catalog[key]
    delete selected[key]
    delete openSections[key]
    delete newSkillInputs[key]
    delete excludedSkills[key]
  }

  message.value = 'Catégorie retirée — enregistrez pour appliquer'
}

async function save(options: { silent?: boolean } = {}) {
  saving.value = true
  if (!options.silent) message.value = null

  const customSkills: Record<string, string[]> = {}
  for (const cat of customDefinitions.value) {
    customSkills[cat.key] = dedupeSkills(selected[cat.key] ?? [])
  }

  const payload: Record<string, unknown> = {
    id: 1,
    updated_at: new Date().toISOString(),
    categories_order: [...categoryOrder.value],
    custom_categories: {
      definitions: customDefinitions.value,
      skills: customSkills,
      hidden_builtin: hiddenBuiltin.value
    }
  }

  for (const cat of COMPETENCE_CATEGORIES) {
    payload[cat.key] = hiddenBuiltin.value.includes(cat.key)
      ? []
      : dedupeSkills(selected[cat.key] ?? [])
  }

  const { error } = await supabase.from('portfolio_competences').upsert(payload)

  saving.value = false
  if (error) {
    if (options.silent) throw new Error(error.message)
    message.value = error.message.includes('custom_categories')
      ? `${error.message} — exécutez supabase/migration-custom-categories.sql dans Supabase`
      : error.message
    return
  }

  if (!options.silent) message.value = 'Compétences enregistrées'
  await refreshNuxtData('portfolio-content')
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Compétences</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Créez des catégories (ex. Accessibilité), ajoutez ou supprimez des compétences. La suppression d'une compétence nettoie aussi projets, expériences et filtres tech.
        </p>
      </div>
      <span class="px-3 py-1 text-sm font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 shrink-0">
        {{ totalSelected }} sélectionnée(s)
      </span>
    </div>

    <p
      v-if="message"
      class="mb-4 px-4 py-3 rounded-xl text-sm border"
      :class="message.includes('enregistr') || message.includes('supprimée') || message.includes('ajoutée') || message.includes('créée') || message.includes('retirée')
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'"
    >
      {{ message }}
    </p>

    <form class="space-y-4" @submit.prevent="save">
      <section class="new-category-box">
        <h2 class="text-base font-bold text-gray-900 dark:text-white mb-1">Nouvelle catégorie</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Créez un axe radar personnalisé (ex. Accessibilité, Backend, Cloud…).
        </p>
        <div class="grid gap-2 sm:grid-cols-3 mb-3">
          <input v-model="newCategoryLabel" type="text" class="skill-input" placeholder="Nom — ex. Accessibilité" autocomplete="off">
          <input v-model="newCategoryHint" type="text" class="skill-input" placeholder="Exemples — WCAG, ARIA…" autocomplete="off">
          <input v-model="newCategoryDescription" type="text" class="skill-input" placeholder="Description courte" autocomplete="off">
        </div>
        <button type="button" class="add-btn" :disabled="!newCategoryLabel.trim()" @click="addCustomCategory">
          + Créer la catégorie
        </button>
      </section>

      <section
        v-for="(cat, index) in orderedCategories"
        :key="cat.key"
        class="accordion"
      >
        <div class="accordion-header">
          <button
            type="button"
            class="accordion-toggle"
            :aria-expanded="openSections[cat.key]"
            @click="openSections[cat.key] = !openSections[cat.key]"
          >
            <div class="flex items-center gap-3 min-w-0 text-left flex-1">
              <span class="accordion-chevron" :class="{ 'accordion-chevron--open': openSections[cat.key] }" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ cat.label }}</h2>
                  <span
                    class="px-2 py-0.5 text-xs font-semibold rounded-full"
                    :class="`badge-${cat.accent}`"
                  >
                    {{ selected[cat.key].length }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ cat.hint }}</p>
              </div>
            </div>
          </button>
          <div class="flex gap-1 shrink-0 pr-3">
            <button
              type="button"
              class="order-btn text-red-500"
              :aria-label="`Supprimer la catégorie ${cat.label}`"
              @click="removeCategory(cat.key)"
            >
              🗑
            </button>
            <button
              type="button"
              class="order-btn"
              :disabled="index === 0"
              :aria-label="`Monter ${cat.label}`"
              @click="moveCategory(cat.key, -1)"
            >
              ↑
            </button>
            <button
              type="button"
              class="order-btn"
              :disabled="index === orderedCategories.length - 1"
              :aria-label="`Descendre ${cat.label}`"
              @click="moveCategory(cat.key, 1)"
            >
              ↓
            </button>
          </div>
        </div>

        <div v-show="openSections[cat.key]" class="accordion-body space-y-4">
          <div v-if="selected[cat.key].length" class="selected-box">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Affichées sur le site</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="skill in selected[cat.key]"
                :key="skill"
                class="selected-chip"
              >
                {{ skill }}
                <button type="button" class="selected-chip-remove" :aria-label="`Masquer ${skill}`" @click="removeFromSelection(cat.key, skill)">×</button>
              </span>
            </div>
          </div>

          <div class="add-box">
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="newSkillInputs[cat.key]"
                type="text"
                class="skill-input flex-1"
                :placeholder="`Ajouter une compétence — ${cat.label}`"
                autocomplete="off"
                @keydown.enter.prevent="addSkillToCatalog(cat.key)"
              >
              <button
                type="button"
                class="add-btn"
                :disabled="!newSkillInputs[cat.key].trim()"
                @click="addSkillToCatalog(cat.key)"
              >
                + Ajouter
              </button>
            </div>
          </div>

          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Catalogue — cliquer pour sélectionner · 🗑 pour supprimer</p>
            <div v-if="catalog[cat.key].length" class="skill-grid">
              <div
                v-for="skill in catalog[cat.key]"
                :key="skill"
                class="skill-chip-row"
              >
                <button
                  type="button"
                  class="skill-chip"
                  :class="{ 'skill-chip--selected': isSelected(cat.key, skill) }"
                  @click="toggleSkill(cat.key, skill)"
                >
                  <span class="skill-chip-check" aria-hidden="true">
                    <svg v-if="isSelected(cat.key, skill)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="truncate">{{ skill }}</span>
                </button>
                <button
                  type="button"
                  class="skill-delete-btn"
                  :aria-label="`Supprimer ${skill}`"
                  @click="openDeleteSkill(cat.key, skill)"
                >
                  🗑
                </button>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              Aucune compétence. Ajoutez-en ci-dessus.
            </p>
          </div>
        </div>
      </section>

      <div class="sticky bottom-4 z-10 flex justify-end">
        <button
          type="submit"
          :disabled="saving"
          class="save-btn"
        >
          {{ saving ? 'Enregistrement…' : 'Enregistrer les compétences' }}
        </button>
      </div>
    </form>

    <div
      v-if="deleteTarget"
      class="delete-modal-backdrop"
      @click.self="closeDeleteSkill"
    >
      <div class="delete-modal" role="dialog" aria-modal="true" :aria-label="`Supprimer ${deleteTarget.skill}`">
        <h3 class="delete-modal__title">Supprimer « {{ deleteTarget.skill }} » ?</h3>
        <p class="delete-modal__text">
          Cette action retire la compétence du catalogue et du site, et nettoie les liens associés :
        </p>
        <ul class="delete-modal__list">
          <li>{{ linkUsage.filters }} filtre(s) tech</li>
          <li>{{ linkUsage.projects }} projet(s)</li>
          <li>{{ linkUsage.experiences }} expérience(s)</li>
        </ul>
        <div class="delete-modal__actions">
          <button type="button" class="delete-modal__cancel" :disabled="cascadeDeleting" @click="closeDeleteSkill">
            Annuler
          </button>
          <button type="button" class="delete-modal__confirm" :disabled="cascadeDeleting" @click="deleteSkillCompletely">
            {{ cascadeDeleting ? 'Suppression…' : 'Supprimer définitivement' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion {
  @apply rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm;
}

.accordion-header {
  @apply flex items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors;
}

.accordion-toggle {
  @apply flex items-center flex-1 min-w-0 px-4 py-4 text-left;
}

.order-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold;
}

.accordion-chevron {
  @apply text-gray-400 transition-transform duration-200 shrink-0;
}

.accordion-chevron--open {
  transform: rotate(90deg);
}

.accordion-body {
  @apply px-4 pb-5 pt-1 border-t border-gray-100 dark:border-gray-800;
}

.selected-box {
  @apply p-3 rounded-xl bg-sky-50/80 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/50;
}

.selected-chip {
  @apply inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800;
}

.selected-chip-remove {
  @apply opacity-60 hover:opacity-100 leading-none;
}

.add-box {
  @apply p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700;
}

.skill-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm;
}

.add-btn {
  @apply shrink-0 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed;
}

.skill-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2;
}

.skill-chip-row {
  @apply flex items-stretch gap-1 min-w-0;
}

.skill-chip {
  @apply flex items-center gap-1.5 min-w-0 flex-1 px-3 py-2 rounded-xl border text-left text-sm font-medium transition-all duration-150;
  @apply border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply hover:border-sky-300 dark:hover:border-sky-700;
}

.skill-chip--selected {
  @apply border-sky-400 dark:border-sky-600 bg-sky-50 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 ring-1 ring-sky-400/30;
}

.skill-chip-check {
  @apply w-4 h-4 shrink-0 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900;
}

.skill-chip--selected .skill-chip-check {
  @apply border-sky-500 bg-sky-500 text-white;
}

.skill-delete-btn {
  @apply shrink-0 w-10 flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors text-sm;
}

.delete-modal-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm;
}

.delete-modal {
  @apply w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl;
}

.delete-modal__title {
  @apply text-lg font-bold text-gray-900 dark:text-white mb-2;
}

.delete-modal__text {
  @apply text-sm text-gray-600 dark:text-gray-400 mb-3;
}

.delete-modal__list {
  @apply text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-5 pl-5 list-disc;
}

.delete-modal__actions {
  @apply flex justify-end gap-2;
}

.delete-modal__cancel {
  @apply px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50;
}

.delete-modal__confirm {
  @apply px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50;
}

.save-btn {
  @apply px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/20 hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50;
}

.badge-sky { @apply bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300; }
.badge-indigo { @apply bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300; }
.badge-emerald { @apply bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300; }
.badge-purple { @apply bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300; }
.badge-pink { @apply bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300; }
.badge-teal { @apply bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300; }
.badge-orange { @apply bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300; }
.badge-violet { @apply bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300; }
.badge-rose { @apply bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300; }
.badge-cyan { @apply bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300; }
.badge-lime { @apply bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300; }
.badge-amber { @apply bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300; }

.new-category-box {
  @apply rounded-2xl border border-dashed border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4;
}
</style>
