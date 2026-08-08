<script setup lang="ts">
import type { PortfolioCompetences } from '~/types/portfolio'
import {
  COMPETENCE_CATEGORIES,
  DEFAULT_COMPETENCES_ORDER,
  resolveCompetencesOrder,
  sortCompetenceCategories,
  type CompetenceCategoryKey
} from '~/data/competence-categories'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const saving = ref(false)
const message = ref<string | null>(null)

type CategoryKey = CompetenceCategoryKey

const defaultSuggestions: PortfolioCompetences = {
  langages: ['HTML5', 'CSS3/SCSS', 'JavaScript', 'TypeScript'],
  frameworks: ['Nuxt 3', 'Vue 3', 'React', 'Twig/Drupal', 'Next.js'],
  outils_dev: ['VS Code', 'Postman', 'Git', 'GitHub', 'GitLab', 'npm'],
  ui_animations: ['TailwindCSS', 'Bootstrap', 'GSAP', 'ScrollMagic', 'AOS', 'ScrollReveal', 'CSS Animations'],
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

const categoryOrder = ref<CategoryKey[]>([...DEFAULT_COMPETENCES_ORDER])
const orderedCategories = computed(() => sortCompetenceCategories(categoryOrder.value))

const catalog = reactive<Record<CategoryKey, string[]>>({
  langages: [],
  frameworks: [],
  outils_dev: [],
  ui_animations: [],
  design: [],
  environnements: [],
  methodes: [],
  ia_cursor: []
})

const selected = reactive<Record<CategoryKey, string[]>>({
  langages: [],
  frameworks: [],
  outils_dev: [],
  ui_animations: [],
  design: [],
  environnements: [],
  methodes: [],
  ia_cursor: []
})

const openSections = reactive<Record<CategoryKey, boolean>>({
  langages: true,
  frameworks: false,
  outils_dev: false,
  ui_animations: false,
  design: false,
  environnements: false,
  methodes: false,
  ia_cursor: false
})

const newSkillInputs = reactive<Record<CategoryKey, string>>({
  langages: '',
  frameworks: '',
  outils_dev: '',
  ui_animations: '',
  design: '',
  environnements: '',
  methodes: '',
  ia_cursor: ''
})

const totalSelected = computed(() =>
  COMPETENCE_CATEGORIES.reduce((sum, cat) => sum + selected[cat.key].length, 0)
)

function buildCatalog(key: CategoryKey, saved: string[]) {
  const pool = new Set([...(defaultSuggestions[key] ?? []), ...saved])
  catalog[key] = [...pool].sort((a, b) => a.localeCompare(b, 'fr'))
  selected[key] = [...saved]
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
  const label = newSkillInputs[key].trim()
  if (!label) return

  if (!catalog[key].includes(label)) {
    catalog[key] = [...catalog[key], label].sort((a, b) => a.localeCompare(b, 'fr'))
  }
  if (!selected[key].includes(label)) {
    selected[key].push(label)
  }

  newSkillInputs[key] = ''
}

function removeFromSelection(key: CategoryKey, skill: string) {
  selected[key] = selected[key].filter((s) => s !== skill)
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
  const { data } = await supabase.from('portfolio_competences').select('*').eq('id', 1).maybeSingle()
  categoryOrder.value = resolveCompetencesOrder(data?.categories_order as string[] | undefined)

  for (const cat of COMPETENCE_CATEGORIES) {
    const saved = (data?.[cat.key] as string[] | undefined) ?? []
    buildCatalog(cat.key, saved)
  }
})

async function save() {
  saving.value = true
  message.value = null

  const payload: Record<string, unknown> = {
    id: 1,
    updated_at: new Date().toISOString(),
    categories_order: [...categoryOrder.value]
  }

  for (const cat of COMPETENCE_CATEGORIES) {
    payload[cat.key] = [...selected[cat.key]]
  }

  const { error } = await supabase.from('portfolio_competences').upsert(payload)

  saving.value = false
  message.value = error ? error.message : 'Compétences enregistrées'

  if (!error) await refreshNuxtData('portfolio-content')
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Compétences</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choisissez les compétences affichées sur le portfolio. Utilisez ↑ ↓ pour réordonner les catégories.
        </p>
      </div>
      <span class="px-3 py-1 text-sm font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 shrink-0">
        {{ totalSelected }} sélectionnée(s)
      </span>
    </div>

    <p
      v-if="message"
      class="mb-4 px-4 py-3 rounded-xl text-sm border"
      :class="message.includes('enregistr')
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'"
    >
      {{ message }}
    </p>

    <form class="space-y-4" @submit.prevent="save">
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
                <button type="button" class="selected-chip-remove" :aria-label="`Retirer ${skill}`" @click="removeFromSelection(cat.key, skill)">×</button>
              </span>
            </div>
          </div>

          <div class="add-box">
            <form class="flex flex-col sm:flex-row gap-2" @submit.prevent="addSkillToCatalog(cat.key)">
              <input
                v-model="newSkillInputs[cat.key]"
                type="text"
                class="skill-input flex-1"
                :placeholder="`Ajouter une compétence — ${cat.label}`"
                autocomplete="off"
              >
              <button
                type="submit"
                class="add-btn"
                :disabled="!newSkillInputs[cat.key].trim()"
              >
                + Ajouter
              </button>
            </form>
          </div>

          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Catalogue — cliquer pour sélectionner</p>
            <div v-if="catalog[cat.key].length" class="skill-grid">
              <button
                v-for="skill in catalog[cat.key]"
                :key="skill"
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
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2;
}

.skill-chip {
  @apply flex items-center gap-1.5 min-w-0 px-3 py-2 rounded-xl border text-left text-sm font-medium transition-all duration-150;
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
</style>
