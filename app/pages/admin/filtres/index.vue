<script setup lang="ts">
import type { TechFilter } from '~/types/portfolio'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const filters = ref<TechFilter[]>([])
const editing = ref<TechFilter | null>(null)
const isNew = ref(false)
const saving = ref(false)
const message = ref<string | null>(null)

async function load() {
  const { data, error } = await supabase
    .from('portfolio_tech_filters')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    message.value = `Erreur de chargement : ${error.message}`
    return
  }

  filters.value = (data ?? []).map((f) => ({
    id: f.id,
    sort_order: f.sort_order,
    label: f.label
  }))
}

function startNew() {
  editing.value = { label: '' }
  isNew.value = true
}

function startEdit(f: TechFilter) {
  editing.value = { ...f }
  isNew.value = false
}

function cancelEdit() {
  editing.value = null
}

async function save() {
  if (!editing.value?.label.trim()) return
  saving.value = true
  message.value = null

  const payload = {
    label: editing.value.label.trim(),
    sort_order: editing.value.sort_order ?? filters.value.length,
    updated_at: new Date().toISOString()
  }

  const { error } = isNew.value
    ? await supabase.from('portfolio_tech_filters').insert(payload)
    : await supabase.from('portfolio_tech_filters').update(payload).eq('id', editing.value.id!)

  saving.value = false
  message.value = error ? error.message : 'Enregistré avec succès'

  if (!error) {
    editing.value = null
    await load()
    await refreshNuxtData('portfolio-content')
  }
}

async function remove(id: string, label: string) {
  if (!confirm(`Supprimer le filtre « ${label} » ?`)) return

  const { error } = await supabase.from('portfolio_tech_filters').delete().eq('id', id)
  if (error) {
    message.value = error.message
    return
  }

  await load()
  await refreshNuxtData('portfolio-content')
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Filtres technologie</h1>
      <button
        class="px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors text-sm font-medium"
        @click="startNew"
      >
        + Ajouter
      </button>
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      Ces filtres apparaissent sur la page d'accueil, section « Parcours professionnel ».
    </p>

    <p v-if="message" class="mb-4 text-sm" :class="message.includes('succès') ? 'text-green-600' : 'text-red-500'">
      {{ message }}
    </p>

    <div v-if="editing" class="mb-8 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold mb-4">{{ isNew ? 'Nouveau filtre' : 'Modifier le filtre' }}</h2>
      <form class="flex flex-col sm:flex-row gap-3" @submit.prevent="save">
        <input
          v-model="editing.label"
          class="admin-input flex-1"
          placeholder="Ex. TypeScript, Nuxt 3…"
          required
        >
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
        v-for="f in filters"
        :key="f.id"
        class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <span class="font-medium text-gray-900 dark:text-white">{{ f.label }}</span>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 text-sm text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg" @click="startEdit(f)">
            Modifier
          </button>
          <button class="px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" @click="remove(f.id!, f.label)">
            Supprimer
          </button>
        </div>
      </div>

      <p v-if="!filters.length" class="text-gray-500 text-sm">
        Aucun filtre. Ajoute-en un ou importe content.json depuis le tableau de bord.
      </p>
    </div>
  </div>
</template>

<style scoped>
.admin-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent;
}
</style>
