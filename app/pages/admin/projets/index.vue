<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const projects = ref<PortfolioProject[]>([])
const editing = ref<PortfolioProject | null>(null)
const isNew = ref(false)
const saving = ref(false)
const message = ref<string | null>(null)

const emptyForm = (): PortfolioProject & { stackText: string; tagsText: string } => ({
  slug: '',
  title: '',
  org: '',
  year: '',
  stack: [],
  tags: [],
  summary: '',
  link: '',
  github: '',
  stackText: '',
  tagsText: ''
})

async function load() {
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
    github: p.github ?? undefined
  }))
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
    stackText: arrayToCsv(p.stack),
    tagsText: arrayToCsv(p.tags)
  } as PortfolioProject & { stackText: string; tagsText: string }
  isNew.value = false
}

function startNew() {
  editing.value = emptyForm()
  isNew.value = true
}

function cancelEdit() {
  editing.value = null
}

async function save() {
  if (!editing.value) return
  saving.value = true
  message.value = null

  const p = editing.value as PortfolioProject & { stackText: string; tagsText: string }
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
    stack: csvToArray(p.stackText),
    tags: csvToArray(p.tagsText),
    summary: p.summary,
    link: p.link || null,
    github: p.github || null,
    sort_order: p.sort_order ?? projects.value.length,
    updated_at: new Date().toISOString()
  }

  const { error } = isNew.value
    ? await supabase.from('portfolio_projects').insert(payload)
    : await supabase.from('portfolio_projects').update(payload).eq('id', p.id!)

  saving.value = false
  message.value = error ? error.message : 'Enregistré avec succès'

  if (!error) {
    editing.value = null
    await load()
    await refreshNuxtData('portfolio-content')
  }
}

async function remove(id: string) {
  if (!confirm('Supprimer ce projet ?')) return
  await supabase.from('portfolio_projects').delete().eq('id', id)
  await load()
  await refreshNuxtData('portfolio-content')
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projets</h1>
      <button
        class="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors text-sm font-medium"
        @click="startNew"
      >
        + Ajouter
      </button>
    </div>

    <p v-if="message" class="mb-4 text-sm" :class="message.includes('succès') ? 'text-green-600' : 'text-red-500'">
      {{ message }}
    </p>

    <div v-if="editing" class="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold mb-4">{{ isNew ? 'Nouveau projet' : 'Modifier' }}</h2>
      <form class="space-y-4" @submit.prevent="save">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="admin-label">Titre *</label>
            <input v-model="editing.title" class="admin-input" required placeholder="Mon super projet">
            <p v-if="previewSlug" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              URL : <span class="font-mono text-sky-600 dark:text-sky-400">/projets/{{ previewSlug }}</span>
            </p>
          </div>
          <div>
            <label class="admin-label">Organisation</label>
            <input v-model="editing.org" class="admin-input">
          </div>
          <div>
            <label class="admin-label">Année</label>
            <input v-model="editing.year" class="admin-input">
          </div>
          <div>
            <label class="admin-label">Lien démo</label>
            <input v-model="editing.link" type="url" class="admin-input">
          </div>
          <div>
            <label class="admin-label">GitHub</label>
            <input v-model="editing.github" type="url" class="admin-input">
          </div>
        </div>

        <div>
          <label class="admin-label">Résumé</label>
          <textarea v-model="editing.summary" rows="3" class="admin-input" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="admin-label">Stack (virgules)</label>
            <input v-model="(editing as any).stackText" class="admin-input">
          </div>
          <div>
            <label class="admin-label">Tags (virgules)</label>
            <input v-model="(editing as any).tagsText" class="admin-input">
          </div>
        </div>

        <div class="flex gap-3">
          <button type="submit" :disabled="saving" class="px-5 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium disabled:opacity-50">
            {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
          <button type="button" class="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm" @click="cancelEdit">
            Annuler
          </button>
        </div>
      </form>
    </div>

    <div class="space-y-3">
      <div
        v-for="p in projects"
        :key="p.id"
        class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">{{ p.title }}</p>
          <p class="text-sm text-gray-500">{{ p.org }} · {{ p.year }} · /projets/{{ p.slug }}</p>
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 text-sm text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg" @click="startEdit(p)">
            Modifier
          </button>
          <button class="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" @click="remove(p.id!)">
            Supprimer
          </button>
        </div>
      </div>

      <p v-if="!projects.length" class="text-gray-500 text-sm">Aucun projet. Importez content.json ou ajoutez-en un.</p>
    </div>
  </div>
</template>

<style scoped>
.admin-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}
.admin-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent;
}
</style>
