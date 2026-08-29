<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'
import { FEATURED_WORKS_LIMIT } from '~/composables/useContent'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const projects = ref<PortfolioProject[]>([])
const slots = ref<(string | null)[]>(Array.from({ length: FEATURED_WORKS_LIMIT }, () => null))
const saving = ref(false)
const message = ref<string | null>(null)

const slotLabels = Array.from({ length: FEATURED_WORKS_LIMIT }, (_, i) => `Travail sélectionné n°${i + 1}`)
const slotIndexes = Array.from({ length: FEATURED_WORKS_LIMIT }, (_, i) => i + 1)

function formatProjectsError(error: { message?: string; code?: string }) {
  const msg = error.message ?? 'Erreur inconnue'
  if (msg.includes('does not exist') && msg.includes('featured_slot')) {
    return 'Colonne manquante : exécutez supabase/migration-featured-projects.sql dans le SQL Editor Supabase.'
  }
  if (msg.includes('featured_slot_check') || msg.includes('featured_slot_range') || error.code === '23514') {
    return 'Contrainte SQL trop restrictive (slots 1–3). Exécutez supabase/migration-featured-projects.sql pour autoriser les slots 1–6.'
  }
  return msg
}

async function load() {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    message.value = formatProjectsError(error)
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
    featured_slot: p.featured_slot ?? null
  }))

  slots.value = slotIndexes.map((n) => {
    const found = projects.value.find((p) => p.featured_slot === n)
    return found?.id ?? null
  })
}

function projectById(id: string | null) {
  if (!id) return null
  return projects.value.find((p) => p.id === id) ?? null
}

async function save() {
  saving.value = true
  message.value = null

  const selected = slots.value.filter(Boolean) as string[]
  if (new Set(selected).size !== selected.length) {
    saving.value = false
    message.value = 'Chaque projet ne peut être sélectionné qu\'une seule fois'
    return
  }

  await supabase
    .from('portfolio_projects')
    .update({ featured_slot: null, updated_at: new Date().toISOString() })
    .not('featured_slot', 'is', null)

  for (let i = 0; i < FEATURED_WORKS_LIMIT; i++) {
    const projectId = slots.value[i]
    if (!projectId) continue

    const { error } = await supabase
      .from('portfolio_projects')
      .update({ featured_slot: i + 1, updated_at: new Date().toISOString() })
      .eq('id', projectId)

    if (error) {
      saving.value = false
      message.value = formatProjectsError(error)
      return
    }
  }

  saving.value = false
  message.value = 'Travaux sélectionnés enregistrés'
  await load()
  await refreshNuxtData('portfolio-content')
}

onMounted(load)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Travaux sélectionnés</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      Choisissez jusqu’à {{ FEATURED_WORKS_LIMIT }} projets affichés sur la page d’accueil, section « Travaux sélectionnés ».
      L’ordre des slots définit l’ordre d’affichage.
    </p>

    <p v-if="message" class="mb-4 text-sm" :class="message.includes('enregistr') ? 'text-green-600' : 'text-red-500'">
      {{ message }}
    </p>

    <form class="space-y-4 max-w-2xl" @submit.prevent="save">
      <div
        v-for="(label, index) in slotLabels"
        :key="index"
        class="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <label class="admin-label">{{ label }}</label>
        <select v-model="slots[index]" class="admin-input mt-1">
          <option :value="null">— Aucun —</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">
            {{ p.title }} ({{ p.year }})
          </option>
        </select>
        <p v-if="projectById(slots[index])" class="mt-2 text-xs text-gray-500 font-mono">
          /projets/{{ projectById(slots[index])!.slug }}
        </p>
      </div>

      <button
        type="submit"
        :disabled="saving"
        class="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50"
      >
        {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.admin-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}
.admin-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent;
}
</style>
