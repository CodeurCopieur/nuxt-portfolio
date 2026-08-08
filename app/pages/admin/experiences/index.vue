<script setup lang="ts">
import type { PortfolioExperience, TechFilter } from '~/types/portfolio'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const experiences = ref<PortfolioExperience[]>([])
const filters = ref<TechFilter[]>([])
const editing = ref<PortfolioExperience | null>(null)
const editingFilter = ref<TechFilter | null>(null)
const isNew = ref(false)
const saving = ref(false)
const savingFilter = ref(false)
const reordering = ref(false)
const message = ref<string | null>(null)
const filterMessage = ref<string | null>(null)
const newFilterLabel = ref('')
const newFilterVisible = ref(true)

const visibleFiltersCount = computed(() => filters.value.filter((f) => f.visible !== false).length)
const filtersOpen = ref(true)
const experiencesOpen = ref(true)
const selectedStacks = ref<string[]>([])

const filterLabels = computed(() => filters.value.map((f) => f.label))

const selectedTechnologies = computed(() =>
  selectedStacks.value.filter((label) => filterLabels.value.includes(label))
)

function filterUsageCount(label: string) {
  return experiences.value.filter((e) => (e.stack || []).includes(label)).length
}

function syncSelectedStacksFromExperience(exp?: PortfolioExperience | null) {
  const catalog = filterLabels.value
  selectedStacks.value = (exp?.stack ?? []).filter((label) => catalog.includes(label))
}

function isStackSelected(label: string) {
  return selectedStacks.value.includes(label)
}

function toggleStackSelection(label: string) {
  const index = selectedStacks.value.indexOf(label)
  if (index === -1) selectedStacks.value.push(label)
  else selectedStacks.value.splice(index, 1)
}

function buildStackPayload(): string[] {
  return selectedStacks.value.filter((label) => filterLabels.value.includes(label))
}

const emptyForm = (): PortfolioExperience => ({
  company: '',
  location: '',
  role: '',
  period: '',
  date_debut: '',
  date_fin: '',
  summary: '',
  missionsText: '' as unknown as string[],
  tagsText: '' as unknown as string[],
  clientsText: '' as unknown as string[],
  linksText: '' as unknown as string[]
} as PortfolioExperience & {
  missionsText: string
  tagsText: string
  clientsText: string
  linksText: string
})

async function loadExperiences() {
  const { data } = await supabase
    .from('portfolio_experiences')
    .select('*')
    .order('sort_order', { ascending: true })

  experiences.value = (data ?? []).map((exp) => ({
    id: exp.id,
    sort_order: exp.sort_order,
    company: exp.company,
    location: exp.location,
    role: exp.role,
    period: exp.period,
    date_debut: exp.date_debut,
    date_fin: exp.date_fin,
    summary: exp.summary,
    missions: exp.missions as string[],
    stack: exp.stack as string[],
    tags: exp.tags as string[],
    clients: exp.clients as string[],
    links: exp.links as string[]
  }))
}

async function loadFilters() {
  const { data, error } = await supabase
    .from('portfolio_tech_filters')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    filterMessage.value = `Erreur de chargement : ${error.message}`
    return
  }

  filters.value = (data ?? []).map((f) => ({
    id: f.id,
    sort_order: f.sort_order,
    label: f.label,
    visible: f.visible !== false
  }))
}

async function load() {
  await Promise.all([loadExperiences(), loadFilters()])
}

function startNew() {
  editing.value = emptyForm()
  isNew.value = true
  experiencesOpen.value = true
  syncSelectedStacksFromExperience()
}

function startEdit(exp: PortfolioExperience) {
  editing.value = {
    ...exp,
    missionsText: arrayToLines(exp.missions),
    tagsText: arrayToCsv(exp.tags),
    clientsText: arrayToCsv(exp.clients),
    linksText: arrayToLines(exp.links)
  } as PortfolioExperience & Record<string, string>
  isNew.value = false
  experiencesOpen.value = true
  syncSelectedStacksFromExperience(exp)
}

function cancelEdit() {
  editing.value = null
  selectedStacks.value = []
}

async function quickAddFilter() {
  const label = newFilterLabel.value.trim()
  if (!label) return

  savingFilter.value = true
  filterMessage.value = null

  const { error } = await supabase.from('portfolio_tech_filters').insert({
    label,
    visible: newFilterVisible.value,
    sort_order: filters.value.length,
    updated_at: new Date().toISOString()
  })

  savingFilter.value = false

  if (error) {
    filterMessage.value = error.message
    return
  }

  newFilterLabel.value = ''
  newFilterVisible.value = true
  filterMessage.value = 'Filtre ajouté'
  await loadFilters()
  await refreshNuxtData('portfolio-content')
}

function startEditFilter(f: TechFilter) {
  editingFilter.value = { ...f }
}

function cancelFilterEdit() {
  editingFilter.value = null
}

async function save() {
  if (!editing.value) return
  saving.value = true
  message.value = null

  const e = editing.value as PortfolioExperience & {
    missionsText: string
    tagsText: string
    clientsText: string
    linksText: string
  }

  const payload = {
    company: e.company,
    location: e.location,
    role: e.role,
    period: e.period,
    date_debut: e.date_debut,
    date_fin: e.date_fin,
    summary: e.summary,
    missions: linesToArray(e.missionsText),
    stack: buildStackPayload(),
    tags: csvToArray(e.tagsText),
    clients: csvToArray(e.clientsText),
    links: linesToArray(e.linksText),
    sort_order: e.sort_order ?? experiences.value.length,
    updated_at: new Date().toISOString()
  }

  const { error } = isNew.value
    ? await supabase.from('portfolio_experiences').insert(payload)
    : await supabase.from('portfolio_experiences').update(payload).eq('id', e.id!)

  saving.value = false
  message.value = error ? error.message : 'Enregistré avec succès'

  if (!error) {
    editing.value = null
    await loadExperiences()
    await refreshNuxtData('portfolio-content')
  }
}

async function saveFilter() {
  if (!editingFilter.value?.label.trim() || !editingFilter.value.id) return
  savingFilter.value = true
  filterMessage.value = null

  const payload = {
    label: editingFilter.value.label.trim(),
    visible: editingFilter.value.visible !== false,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('portfolio_tech_filters')
    .update(payload)
    .eq('id', editingFilter.value.id)

  savingFilter.value = false
  filterMessage.value = error ? error.message : 'Filtre mis à jour'

  if (!error) {
    editingFilter.value = null
    await loadFilters()
    await refreshNuxtData('portfolio-content')
  }
}

async function toggleFilterVisible(filter: TechFilter, visible: boolean) {
  if (!filter.id) return

  const { error } = await supabase
    .from('portfolio_tech_filters')
    .update({ visible, updated_at: new Date().toISOString() })
    .eq('id', filter.id)

  if (error) {
    filterMessage.value = error.message
    return
  }

  filter.visible = visible
  filterMessage.value = null
  await refreshNuxtData('portfolio-content')
}

async function remove(id: string) {
  if (!confirm('Supprimer cette expérience ?')) return
  await supabase.from('portfolio_experiences').delete().eq('id', id)
  await loadExperiences()
  await normalizeOrder()
  await refreshNuxtData('portfolio-content')
}

async function removeFilter(id: string, label: string) {
  const usage = filterUsageCount(label)
  const warning = usage > 0
    ? `Ce filtre est utilisé dans ${usage} expérience(s). Supprimer quand même ?`
    : `Supprimer le filtre « ${label} » ?`
  if (!confirm(warning)) return

  const { error } = await supabase.from('portfolio_tech_filters').delete().eq('id', id)
  if (error) {
    filterMessage.value = error.message
    return
  }

  await loadFilters()
  await refreshNuxtData('portfolio-content')
}

async function normalizeOrder() {
  const items = [...experiences.value]
  await persistOrder(items)
}

async function persistOrder(items: PortfolioExperience[]) {
  reordering.value = true
  message.value = null

  const updates = await Promise.all(
    items.map((exp, index) =>
      supabase
        .from('portfolio_experiences')
        .update({ sort_order: index, updated_at: new Date().toISOString() })
        .eq('id', exp.id!)
    )
  )

  const error = updates.find((r) => r.error)?.error
  reordering.value = false

  if (error) {
    message.value = error.message
    return
  }

  experiences.value = items.map((exp, index) => ({ ...exp, sort_order: index }))
  await refreshNuxtData('portfolio-content')
}

async function moveExperience(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= experiences.value.length) return

  const items = [...experiences.value]
  const [moved] = items.splice(index, 1)
  items.splice(target, 0, moved)

  message.value = 'Ordre mis à jour'
  await persistOrder(items)
}

onMounted(() => {
  load()
  window.addEventListener('keydown', onEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  if (import.meta.client) document.body.style.overflow = ''
})

watch(editing, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && editing.value) cancelEdit()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Accordéon Filtres -->
    <section class="accordion">
      <button
        type="button"
        class="accordion-header"
        :aria-expanded="filtersOpen"
        @click="filtersOpen = !filtersOpen"
      >
        <div class="flex items-center gap-3 min-w-0 text-left">
          <span class="accordion-chevron" :class="{ 'accordion-chevron--open': filtersOpen }" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </span>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">Filtres technologie</h1>
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                {{ visibleFiltersCount }}/{{ filters.length }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">Catalogue affiché sur le site · les expériences choisissent leurs technologies ci-dessous</p>
          </div>
        </div>
      </button>

      <div v-show="filtersOpen" class="accordion-body">
        <p
          v-if="filterMessage"
          class="mb-4 px-4 py-3 rounded-xl text-sm border"
          :class="filterMessage.includes('ajouté') || filterMessage.includes('mis à jour')
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'"
        >
          {{ filterMessage }}
        </p>

      <!-- Ajout rapide -->
      <div class="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-sky-950/30 border border-sky-100 dark:border-gray-800 shadow-sm">
        <form class="flex flex-col lg:flex-row gap-4 lg:items-center" @submit.prevent="quickAddFilter">
          <div class="flex-1 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 font-semibold text-sm pointer-events-none">#</span>
            <input
              v-model="newFilterLabel"
              type="text"
              class="filter-input pl-9"
              placeholder="Ex. TypeScript, Nuxt 3, GSAP…"
              autocomplete="off"
            >
          </div>

          <label class="filter-toggle-row shrink-0">
            <span class="text-sm text-gray-600 dark:text-gray-300">Visible sur le site</span>
            <span class="filter-switch">
              <input v-model="newFilterVisible" type="checkbox" class="sr-only">
              <span class="filter-switch-track" aria-hidden="true" />
            </span>
          </label>

          <button
            type="submit"
            :disabled="savingFilter || !newFilterLabel.trim()"
            class="shrink-0 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-500/20"
          >
            {{ savingFilter ? 'Ajout…' : '+ Ajouter' }}
          </button>
        </form>
      </div>

      <!-- Grille de filtres -->
      <div v-if="filters.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <div
          v-for="f in filters"
          :key="f.id"
          class="filter-card group"
          :class="f.visible !== false ? 'filter-card--active' : 'filter-card--hidden'"
        >
          <form
            v-if="editingFilter?.id === f.id"
            class="flex flex-col sm:flex-row sm:items-center gap-3"
            @submit.prevent="saveFilter"
          >
            <input
              v-model="editingFilter.label"
              class="filter-input filter-input--sm flex-1"
              required
              autofocus
            >
            <label class="filter-toggle-row shrink-0">
              <span class="text-xs text-gray-500 dark:text-gray-400">Visible</span>
              <span class="filter-switch filter-switch--sm">
                <input v-model="editingFilter.visible" type="checkbox" class="sr-only">
                <span class="filter-switch-track" aria-hidden="true" />
              </span>
            </label>
            <div class="flex gap-1 shrink-0 ml-auto">
              <button type="submit" :disabled="savingFilter" class="filter-icon-btn filter-icon-btn--primary" title="Enregistrer" aria-label="Enregistrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                </svg>
              </button>
              <button type="button" class="filter-icon-btn" title="Annuler" aria-label="Annuler" @click="cancelFilterEdit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </form>

          <template v-else>
            <div class="flex items-center gap-2 min-h-[2.5rem]">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium bg-white/80 dark:bg-gray-800/80 border border-sky-200/60 dark:border-sky-800/60 text-gray-900 dark:text-white min-w-0 truncate">
                <span class="text-sky-500 shrink-0">#</span>
                <span class="truncate">{{ f.label }}</span>
              </span>
              <span
                v-if="filterUsageCount(f.label) > 0"
                class="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shrink-0"
                :title="`${filterUsageCount(f.label)} expérience(s)`"
              >
                {{ filterUsageCount(f.label) }} exp.
              </span>

              <div class="flex items-center gap-1 ml-auto shrink-0">
                <label class="filter-toggle-compact" :title="f.visible !== false ? 'Masquer du site' : 'Afficher sur le site'">
                  <span class="filter-switch filter-switch--sm">
                    <input
                      type="checkbox"
                      class="sr-only"
                      :checked="f.visible !== false"
                      @change="toggleFilterVisible(f, ($event.target as HTMLInputElement).checked)"
                    >
                    <span class="filter-switch-track" aria-hidden="true" />
                  </span>
                </label>

                <button
                  type="button"
                  class="filter-icon-btn"
                  title="Modifier"
                  aria-label="Modifier"
                  @click="startEditFilter(f)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path d="m2.695 14.763-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
                  </svg>
                </button>

                <button
                  type="button"
                  class="filter-icon-btn filter-icon-btn--danger"
                  title="Supprimer"
                  aria-label="Supprimer"
                  @click="removeFilter(f.id!, f.label)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                    <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div v-else class="filter-empty">
        <p class="text-gray-500 dark:text-gray-400 text-sm">Aucun filtre pour l'instant.</p>
        <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">Ajoute ton premier tag ci-dessus.</p>
      </div>
      </div>
    </section>

    <!-- Accordéon Expériences -->
    <section class="accordion">
      <div class="accordion-header-row">
        <button
          type="button"
          class="accordion-header accordion-header--flex"
          :aria-expanded="experiencesOpen"
          @click="experiencesOpen = !experiencesOpen"
        >
          <div class="flex items-center gap-3 min-w-0 text-left flex-1">
            <span class="accordion-chevron" :class="{ 'accordion-chevron--open': experiencesOpen }" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Expériences</h2>
                <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {{ experiences.length }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Parcours professionnel · ↑ ↓ pour réordonner</p>
            </div>
          </div>
        </button>
        <button
          type="button"
          class="accordion-action-btn"
          @click="startNew"
        >
          + Ajouter
        </button>
      </div>

      <div v-show="experiencesOpen" class="accordion-body">
        <p v-if="message" class="mb-4 text-sm" :class="message.includes('succès') || message.includes('Ordre') ? 'text-green-600' : 'text-red-500'">
          {{ message }}
        </p>

        <div class="space-y-3">
        <div
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div class="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sky-600 hover:border-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                :disabled="index === 0 || reordering"
                title="Monter"
                @click="moveExperience(index, -1)"
              >
                ↑
              </button>
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-sky-600 hover:border-sky-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                :disabled="index === experiences.length - 1 || reordering"
                title="Descendre"
                @click="moveExperience(index, 1)"
              >
                ↓
              </button>
            </div>
            <span class="w-7 h-7 flex items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-bold shrink-0">
              {{ index + 1 }}
            </span>
            <div class="min-w-0">
              <p class="font-semibold text-gray-900 dark:text-white">{{ exp.company }}</p>
              <p class="text-sm text-gray-500 truncate">{{ exp.role }} · {{ exp.period }}</p>
              <div v-if="exp.stack?.length" class="flex flex-wrap gap-1 mt-1.5">
                <span
                  v-for="tech in exp.stack.slice(0, 4)"
                  :key="tech"
                  class="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                >
                  {{ tech }}
                </span>
                <span v-if="exp.stack.length > 4" class="text-[10px] text-gray-400">+{{ exp.stack.length - 4 }}</span>
              </div>
            </div>
          </div>
          <div class="flex gap-2 shrink-0 ml-3">
            <button class="px-3 py-1.5 text-sm text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg" @click="startEdit(exp)">
              Modifier
            </button>
            <button class="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" @click="remove(exp.id!)">
              Supprimer
            </button>
          </div>
        </div>

        <p v-if="!experiences.length" class="text-gray-500 text-sm">Aucune expérience. Ajoute-en une.</p>
        </div>
      </div>
    </section>
  </div>

  <!-- Popup expérience -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="editing"
        class="modal-overlay"
        role="presentation"
        @click.self="cancelEdit"
      >
        <div
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="isNew ? 'Nouvelle expérience' : 'Modifier l\'expérience'"
        >
          <div class="modal-header">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {{ isNew ? 'Nouvelle expérience' : 'Modifier l\'expérience' }}
            </h2>
            <button type="button" class="modal-close" aria-label="Fermer" @click="cancelEdit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          <form class="modal-body space-y-4" @submit.prevent="save">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">Entreprise *</label>
                <input v-model="editing.company" class="admin-input" required>
              </div>
              <div>
                <label class="admin-label">Lieu</label>
                <input v-model="editing.location" class="admin-input">
              </div>
              <div>
                <label class="admin-label">Rôle</label>
                <input v-model="editing.role" class="admin-input">
              </div>
              <div>
                <label class="admin-label">Période (affichage)</label>
                <input v-model="editing.period" class="admin-input" placeholder="Jan 2022 – Août 2025">
              </div>
              <div>
                <label class="admin-label">Date début (MM/YYYY)</label>
                <input v-model="editing.date_debut" class="admin-input" placeholder="01/2022">
              </div>
              <div>
                <label class="admin-label">Date fin (MM/YYYY)</label>
                <input v-model="editing.date_fin" class="admin-input" placeholder="06/2025">
              </div>
            </div>

            <div>
              <label class="admin-label">Résumé</label>
              <textarea v-model="editing.summary" rows="3" class="admin-input" />
            </div>

            <div>
              <label class="admin-label">Missions (une par ligne)</label>
              <textarea v-model="(editing as any).missionsText" rows="4" class="admin-input" />
            </div>

            <!-- Technologies utilisées (sélection depuis le catalogue filtres) -->
            <div class="stack-picker">
              <div class="flex items-start justify-between gap-3 mb-3">
                <div>
                  <label class="admin-label mb-0">Technologies utilisées</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Sélection uniquement — les nouveaux filtres se créent dans la section « Filtres technologie ».
                  </p>
                </div>
                <span class="shrink-0 text-xs font-semibold px-2 py-1 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                  {{ selectedTechnologies.length }} choisie(s)
                </span>
              </div>

              <div v-if="selectedTechnologies.length" class="flex flex-wrap gap-2 mb-3 p-3 rounded-xl bg-white/70 dark:bg-gray-800/50 border border-sky-100 dark:border-gray-700">
                <span
                  v-for="tech in selectedTechnologies"
                  :key="tech"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
                >
                  {{ tech }}
                  <button
                    type="button"
                    class="opacity-60 hover:opacity-100"
                    aria-label="Retirer"
                    @click="toggleStackSelection(tech)"
                  >
                    ×
                  </button>
                </span>
              </div>

              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Catalogue disponible</p>

              <div v-if="filters.length" class="stack-picker-grid">
                <button
                  v-for="f in filters"
                  :key="f.id"
                  type="button"
                  class="stack-chip"
                  :class="{
                    'stack-chip--selected': isStackSelected(f.label),
                    'stack-chip--hidden': f.visible === false
                  }"
                  @click="toggleStackSelection(f.label)"
                >
                  <span class="stack-chip-check" aria-hidden="true">
                    <svg v-if="isStackSelected(f.label)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                      <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="truncate">{{ f.label }}</span>
                  <span v-if="f.visible === false" class="stack-chip-badge">masqué</span>
                </button>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                Aucun filtre dans le catalogue. Créez-en dans la section « Filtres technologie ».
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">Tags (virgules)</label>
                <input v-model="(editing as any).tagsText" class="admin-input">
              </div>
              <div>
                <label class="admin-label">Clients (virgules)</label>
                <input v-model="(editing as any).clientsText" class="admin-input">
              </div>
              <div class="sm:col-span-2">
                <label class="admin-label">Liens (un par ligne)</label>
                <textarea v-model="(editing as any).linksText" rows="2" class="admin-input" />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="modal-btn modal-btn--ghost" @click="cancelEdit">
                Annuler
              </button>
              <button type="submit" :disabled="saving" class="modal-btn modal-btn--primary">
                {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.admin-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.admin-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent;
}

.filter-input {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-shadow;
}

.filter-input--sm {
  @apply py-2 text-sm;
}

.filter-toggle-row {
  @apply flex items-center gap-2 cursor-pointer select-none;
}

.filter-toggle-compact {
  @apply cursor-pointer;
}

.filter-switch {
  @apply relative inline-flex h-7 w-12 shrink-0;
}

.filter-switch--sm {
  @apply h-6 w-10;
}

.filter-switch-track {
  @apply absolute inset-0 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-200;
}

.filter-switch-track::after {
  content: '';
  @apply absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200;
}

.filter-switch--sm .filter-switch-track::after {
  @apply h-5 w-5;
}

.filter-switch:has(input:checked) .filter-switch-track {
  @apply bg-gradient-to-r from-sky-500 to-indigo-500;
}

.filter-switch:has(input:checked) .filter-switch-track::after {
  transform: translateX(1.25rem);
}

.filter-switch--sm:has(input:checked) .filter-switch-track::after {
  transform: translateX(1rem);
}

.filter-card {
  @apply px-3 py-2.5 rounded-xl border transition-all duration-200;
}

.filter-card--active {
  @apply bg-white dark:bg-gray-900 border-sky-200/80 dark:border-sky-900/50 shadow-sm hover:border-sky-300 dark:hover:border-sky-700;
}

.filter-card--hidden {
  @apply bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-70;
}

.filter-icon-btn {
  @apply w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors;
}

.filter-icon-btn--primary {
  @apply text-sky-600 hover:text-sky-700 hover:bg-sky-100 dark:hover:bg-sky-900/30;
}

.filter-icon-btn--danger {
  @apply hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20;
}

.filter-empty {
  @apply text-center py-10 px-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30;
}

.stack-picker {
  @apply p-4 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-sky-950/20 border border-sky-100 dark:border-gray-800;
}

.stack-picker-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 gap-2;
}

.stack-chip {
  @apply flex items-center gap-1.5 min-w-0 px-3 py-2 rounded-xl border text-left text-sm font-medium transition-all duration-150;
  @apply border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-sm;
}

.stack-chip--selected {
  @apply border-sky-400 dark:border-sky-600 bg-sky-50 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 ring-1 ring-sky-400/30;
}

.stack-chip--hidden:not(.stack-chip--selected) {
  @apply opacity-60 border-dashed;
}

.stack-chip-check {
  @apply w-4 h-4 shrink-0 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900;
}

.stack-chip--selected .stack-chip-check {
  @apply border-sky-500 bg-sky-500 text-white;
}

.stack-chip-badge {
  @apply ml-auto shrink-0 text-[10px] uppercase tracking-wide px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400;
}

.accordion {
  @apply rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm;
}

.accordion-header-row {
  @apply flex items-stretch border-b border-gray-100 dark:border-gray-800;
}

.accordion-header {
  @apply w-full flex items-center px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors;
}

.accordion-header--flex {
  @apply flex-1 border-0;
}

.accordion-action-btn {
  @apply shrink-0 self-center mx-3 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600 transition-colors;
}

.accordion-chevron {
  @apply text-gray-400 transition-transform duration-200 shrink-0;
}

.accordion-chevron--open {
  transform: rotate(90deg);
}

.accordion-body {
  @apply p-4 sm:p-5;
}

.modal-overlay {
  @apply fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm;
}

.modal-panel {
  @apply w-full sm:max-w-2xl lg:max-w-3xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700;
}

.modal-header {
  @apply flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0;
}

.modal-close {
  @apply w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors;
}

.modal-body {
  @apply flex-1 overflow-y-auto px-4 sm:px-6 py-4;
}

.modal-footer {
  @apply sticky bottom-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 pb-1 sm:pb-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-2 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4;
}

.modal-btn {
  @apply w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50;
}

.modal-btn--primary {
  @apply bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700;
}

.modal-btn--ghost {
  @apply border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: translateY(100%);
  opacity: 0.95;
}

@media (min-width: 640px) {
  .modal-enter-from .modal-panel,
  .modal-leave-to .modal-panel {
    transform: translateY(12px) scale(0.98);
  }
}
</style>
