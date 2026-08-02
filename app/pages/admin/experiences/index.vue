<script setup lang="ts">
import type { PortfolioExperience } from '~/types/portfolio'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const experiences = ref<PortfolioExperience[]>([])
const editing = ref<PortfolioExperience | null>(null)
const isNew = ref(false)
const saving = ref(false)
const reordering = ref(false)
const message = ref<string | null>(null)

const emptyForm = (): PortfolioExperience => ({
  company: '',
  location: '',
  role: '',
  period: '',
  date_debut: '',
  date_fin: '',
  summary: '',
  missionsText: '' as unknown as string[],
  stackText: '' as unknown as string[],
  tagsText: '' as unknown as string[],
  clientsText: '' as unknown as string[],
  linksText: '' as unknown as string[]
} as PortfolioExperience & {
  missionsText: string
  stackText: string
  tagsText: string
  clientsText: string
  linksText: string
})

async function load() {
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

function startEdit(exp: PortfolioExperience) {
  editing.value = {
    ...exp,
    missionsText: arrayToLines(exp.missions),
    stackText: arrayToCsv(exp.stack),
    tagsText: arrayToCsv(exp.tags),
    clientsText: arrayToCsv(exp.clients),
    linksText: arrayToLines(exp.links)
  } as PortfolioExperience & Record<string, string>
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

  const e = editing.value as PortfolioExperience & {
    missionsText: string
    stackText: string
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
    stack: csvToArray(e.stackText),
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
    await load()
    await refreshNuxtData('portfolio-content')
  }
}

async function remove(id: string) {
  if (!confirm('Supprimer cette expérience ?')) return
  await supabase.from('portfolio_experiences').delete().eq('id', id)
  await load()
  await normalizeOrder()
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

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Expériences</h1>
      <button
        class="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors text-sm font-medium"
        @click="startNew"
      >
        + Ajouter
      </button>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      Utilisez ↑ ↓ pour définir l'ordre d'affichage sur la page d'accueil (section Parcours professionnel).
    </p>

    <p v-if="message" class="mb-4 text-sm" :class="message.includes('succès') || message.includes('Ordre') ? 'text-green-600' : 'text-red-500'">
      {{ message }}
    </p>

    <!-- Formulaire d'édition -->
    <div v-if="editing" class="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold mb-4">{{ isNew ? 'Nouvelle expérience' : 'Modifier' }}</h2>
      <form class="space-y-4" @submit.prevent="save">
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="admin-label">Stack (virgules)</label>
            <input v-model="(editing as any).stackText" class="admin-input">
          </div>
          <div>
            <label class="admin-label">Tags (virgules)</label>
            <input v-model="(editing as any).tagsText" class="admin-input">
          </div>
          <div>
            <label class="admin-label">Clients (virgules)</label>
            <input v-model="(editing as any).clientsText" class="admin-input">
          </div>
          <div>
            <label class="admin-label">Liens (un par ligne)</label>
            <textarea v-model="(editing as any).linksText" rows="2" class="admin-input" />
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

    <!-- Liste -->
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

      <p v-if="!experiences.length" class="text-gray-500 text-sm">Aucune expérience. Importez content.json ou ajoutez-en une.</p>
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
