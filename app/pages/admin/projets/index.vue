<script setup lang="ts">
import type { PortfolioExperience, PortfolioProject, TechFilter } from '~/types/portfolio'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const projects = ref<PortfolioProject[]>([])
const experiences = ref<PortfolioExperience[]>([])
const filters = ref<TechFilter[]>([])
const editing = ref<(PortfolioProject & { tagsText: string }) | null>(null)
const isNew = ref(false)
const saving = ref(false)
const message = ref<string | null>(null)
const selectedStacks = ref<string[]>([])

const filterLabels = computed(() => filters.value.map((f) => f.label))

const selectedTechnologies = computed(() =>
  selectedStacks.value.filter((label) => filterLabels.value.includes(label))
)

function syncSelectedStacksFromProject(project?: PortfolioProject | null) {
  const catalog = filterLabels.value
  selectedStacks.value = (project?.stack ?? []).filter((label) => catalog.includes(label))
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

const emptyForm = (): PortfolioProject & { tagsText: string } => ({
  slug: '',
  title: '',
  org: '',
  year: '',
  stack: [],
  tags: [],
  summary: '',
  link: '',
  github: '',
  experience_id: null,
  tagsText: ''
})

function experienceLabel(exp: PortfolioExperience) {
  const parts = [exp.company]
  if (exp.role) parts.push(exp.role)
  if (exp.period) parts.push(`(${exp.period})`)
  return parts.join(' — ')
}

function workplaceForProject(project: PortfolioProject) {
  if (!project.experience_id) return null
  return experiences.value.find((exp) => exp.id === project.experience_id) ?? null
}

async function loadExperiences() {
  const { data, error } = await supabase
    .from('portfolio_experiences')
    .select('id, company, location, role, period, sort_order')
    .order('sort_order', { ascending: true })

  if (error) {
    message.value = `Erreur expériences : ${error.message}`
    return
  }

  experiences.value = (data ?? []).map((exp) => ({
    id: exp.id,
    sort_order: exp.sort_order,
    company: exp.company,
    location: exp.location,
    role: exp.role,
    period: exp.period,
    date_debut: '',
    date_fin: '',
    summary: '',
    missions: [],
    stack: [],
    tags: [],
    links: []
  }))
}

async function loadProjects() {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    message.value = `Erreur de chargement : ${error.message}`
    return
  }

  projects.value = (data ?? []).map((p) => ({
    id: p.id,
    sort_order: p.sort_order,
    slug: p.slug,
    title: p.title,
    org: p.org,
    year: p.year,
    stack: p.stack as string[],
    tags: p.tags as string[],
    summary: p.summary,
    link: p.link ?? undefined,
    github: p.github ?? undefined,
    featured_slot: p.featured_slot ?? null,
    experience_id: p.experience_id ?? null
  }))
}

async function loadFilters() {
  const { data, error } = await supabase
    .from('portfolio_tech_filters')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    message.value = `Erreur filtres : ${error.message}`
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
  await Promise.all([loadProjects(), loadFilters(), loadExperiences()])
}

function uniqueSlug(base: string, excludeId?: string) {
  const existing = projects.value
    .filter((p) => p.id !== excludeId)
    .map((p) => p.slug)

  if (!base) return ''
  if (!existing.includes(base)) return base

  let suffix = 2
  while (existing.includes(`${base}-${suffix}`)) suffix++
  return `${base}-${suffix}`
}

const previewSlug = computed(() => {
  if (!editing.value?.title) return ''
  return uniqueSlug(slugify(editing.value.title), isNew.value ? undefined : editing.value.id)
})

function startEdit(p: PortfolioProject) {
  editing.value = {
    ...p,
    experience_id: p.experience_id ?? null,
    tagsText: arrayToCsv(p.tags)
  }
  isNew.value = false
  syncSelectedStacksFromProject(p)
}

function startNew() {
  editing.value = emptyForm()
  isNew.value = true
  syncSelectedStacksFromProject()
}

function cancelEdit() {
  editing.value = null
  selectedStacks.value = []
}

async function save() {
  if (!editing.value) return
  saving.value = true
  message.value = null

  const p = editing.value
  const slug = uniqueSlug(slugify(p.title), isNew.value ? undefined : p.id)

  if (!slug) {
    saving.value = false
    message.value = 'Le titre doit contenir au moins un caractère valide pour l\'URL'
    return
  }

  const payload = {
    slug,
    title: p.title,
    org: p.org,
    year: p.year,
    stack: buildStackPayload(),
    tags: csvToArray(p.tagsText),
    summary: p.summary,
    link: p.link || null,
    github: p.github || null,
    experience_id: p.experience_id || null,
    sort_order: p.sort_order ?? projects.value.length,
    updated_at: new Date().toISOString()
  }

  const { error } = isNew.value
    ? await supabase.from('portfolio_projects').insert(payload)
    : await supabase.from('portfolio_projects').update(payload).eq('id', p.id!)

  saving.value = false

  if (error) {
    message.value = error.message.includes('experience_id')
      ? `Colonne experience_id absente. Exécutez supabase/migration-project-experience.sql dans Supabase. (${error.message})`
      : error.message
    return
  }

  message.value = 'Projet enregistré avec succès'

  editing.value = null
  selectedStacks.value = []
  await loadProjects()
  await refreshNuxtData('portfolio-content')
}

async function remove(id: string) {
  if (!confirm('Supprimer ce projet ?')) return
  await supabase.from('portfolio_projects').delete().eq('id', id)
  message.value = 'Projet supprimé'
  await load()
  await refreshNuxtData('portfolio-content')
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && editing.value) cancelEdit()
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

function onExperienceChange(experienceId: string) {
  if (!editing.value) return

  if (!experienceId) {
    editing.value.experience_id = null
    if (!editing.value.org || experiences.value.some((exp) => exp.company === editing.value!.org)) {
      editing.value.org = 'Projet personnel'
    }
    return
  }

  editing.value.experience_id = experienceId
  const exp = experiences.value.find((item) => item.id === experienceId)
  if (exp) editing.value.org = exp.company
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projets</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gérez les projets affichés sur le portfolio.
        </p>
      </div>
      <button type="button" class="add-btn shrink-0" @click="startNew">
        + Ajouter un projet
      </button>
    </div>

    <p
      v-if="message"
      class="mb-4 px-4 py-3 rounded-xl text-sm border"
      :class="message.includes('succès') || message.includes('supprimé')
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'"
    >
      {{ message }}
    </p>

    <div v-if="projects.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <article
        v-for="p in projects"
        :key="p.id"
        class="project-card group"
      >
        <div class="project-card-accent" aria-hidden="true" />

        <div class="relative p-5 sm:p-6">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {{ p.title }}
                </h2>
                <span v-if="p.year" class="year-badge">{{ p.year }}</span>
                <span
                  v-if="p.featured_slot != null"
                  class="featured-badge"
                  title="Projet récent"
                >
                  ★ {{ p.featured_slot }}
                </span>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                <template v-if="workplaceForProject(p)">
                  📍 {{ workplaceForProject(p)!.company }}
                  <span v-if="workplaceForProject(p)!.location"> · {{ workplaceForProject(p)!.location }}</span>
                </template>
                <template v-else>
                  {{ p.org || 'Sans organisation' }}
                </template>
              </p>
              <p class="text-xs font-mono text-sky-600 dark:text-sky-400 mt-1 truncate">
                /projets/{{ p.slug }}
              </p>
            </div>

            <div class="flex gap-1 shrink-0">
              <button
                type="button"
                class="icon-btn icon-btn--edit"
                aria-label="Modifier le projet"
                @click="startEdit(p)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path d="m2.695 14.763-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
                </svg>
              </button>
              <button
                type="button"
                class="icon-btn icon-btn--delete"
                aria-label="Supprimer le projet"
                @click="remove(p.id!)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <p v-if="p.summary" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
            {{ p.summary }}
          </p>

          <div v-if="p.stack?.length" class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="tech in p.stack.slice(0, 5)"
              :key="tech"
              class="stack-chip"
            >
              {{ tech }}
            </span>
            <span v-if="p.stack.length > 5" class="text-xs text-gray-400 self-center">
              +{{ p.stack.length - 5 }}
            </span>
          </div>

          <div class="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <a
              v-if="p.link"
              :href="p.link"
              target="_blank"
              rel="noopener noreferrer"
              class="link-chip"
            >
              Démo ↗
            </a>
            <a
              v-if="p.github"
              :href="p.github"
              target="_blank"
              rel="noopener noreferrer"
              class="link-chip link-chip--github"
            >
              GitHub ↗
            </a>
            <span v-if="!p.link && !p.github" class="text-xs text-gray-400">
              Aucun lien externe
            </span>
          </div>
        </div>
      </article>
    </div>

    <p
      v-else
      class="text-center text-gray-500 dark:text-gray-400 py-16 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
    >
      Aucun projet. Cliquez sur « Ajouter un projet » pour commencer.
    </p>
  </div>

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
          :aria-label="isNew ? 'Nouveau projet' : 'Modifier le projet'"
        >
          <div class="modal-header">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {{ isNew ? 'Nouveau projet' : 'Modifier le projet' }}
            </h2>
            <button type="button" class="modal-close" aria-label="Fermer" @click="cancelEdit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          <form class="modal-body space-y-4" @submit.prevent="save">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="admin-label">Titre *</label>
                <input v-model="editing.title" class="admin-input" required placeholder="Mon super projet">
                <p v-if="previewSlug" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  URL : <span class="font-mono text-sky-600 dark:text-sky-400">/projets/{{ previewSlug }}</span>
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="admin-label">Lieu de travail</label>
                <select
                  class="admin-input"
                  :value="editing.experience_id ?? ''"
                  @change="onExperienceChange(($event.target as HTMLSelectElement).value)"
                >
                  <option value="">— Projet personnel / sans lieu —</option>
                  <option
                    v-for="exp in experiences"
                    :key="exp.id"
                    :value="exp.id"
                  >
                    {{ experienceLabel(exp) }}
                  </option>
                </select>
                <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Lie les expériences du parcours à ce projet. L’organisation est remplie automatiquement.
                </p>
              </div>
              <div>
                <label class="admin-label">Organisation</label>
                <input v-model="editing.org" class="admin-input" placeholder="Projet personnel">
              </div>
              <div>
                <label class="admin-label">Année</label>
                <input v-model="editing.year" class="admin-input" placeholder="2025">
              </div>
              <div>
                <label class="admin-label">Lien démo</label>
                <input v-model="editing.link" type="url" class="admin-input" placeholder="https://...">
              </div>
              <div>
                <label class="admin-label">GitHub</label>
                <input v-model="editing.github" type="url" class="admin-input" placeholder="https://github.com/...">
              </div>
            </div>

            <div>
              <label class="admin-label">Résumé</label>
              <textarea v-model="editing.summary" rows="3" class="admin-input" placeholder="Description courte du projet" />
            </div>

            <div class="stack-picker">
              <div class="flex items-start justify-between gap-3 mb-3">
                <div>
                  <label class="admin-label mb-0">Stack / technologies</label>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Sélection depuis le catalogue — les filtres se gèrent dans Expériences → Filtres technologie.
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
                Aucun filtre dans le catalogue. Créez-en dans Expériences → Filtres technologie.
              </p>
            </div>

            <div>
              <label class="admin-label">Tags (virgules)</label>
              <input v-model="editing.tagsText" class="admin-input" placeholder="Front-end, Portfolio">
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
.add-btn {
  @apply px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all shadow-sm;
}

.project-card {
  @apply relative rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300;
}

.project-card-accent {
  @apply absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-600;
}

.year-badge {
  @apply px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300;
}

.featured-badge {
  @apply px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300;
}

.stack-chip {
  @apply text-[11px] px-2 py-1 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 font-medium;
}

.link-chip {
  @apply text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline;
}

.link-chip--github {
  @apply text-gray-600 dark:text-gray-400;
}

.icon-btn {
  @apply w-9 h-9 flex items-center justify-center rounded-xl border transition-colors;
}

.icon-btn--edit {
  @apply border-gray-200 dark:border-gray-700 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20;
}

.icon-btn--delete {
  @apply border-gray-200 dark:border-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20;
}

.admin-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.admin-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40;
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

.stack-picker {
  @apply p-4 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-indigo-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-sky-950/20 border border-sky-100 dark:border-gray-800;
}

.stack-picker-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 gap-2;
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
