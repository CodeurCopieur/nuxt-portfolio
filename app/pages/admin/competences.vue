<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const saving = ref(false)
const message = ref<string | null>(null)

const categories = [
  { key: 'langages', label: 'Langages' },
  { key: 'frameworks', label: 'Frameworks' },
  { key: 'outils_dev', label: 'Outils dev' },
  { key: 'ui_animations', label: 'UI & Animations' },
  { key: 'design', label: 'Design' },
  { key: 'environnements', label: 'Environnements' },
  { key: 'methodes', label: 'Méthodes' }
] as const

const form = reactive<Record<string, string>>({
  langages: '',
  frameworks: '',
  outils_dev: '',
  ui_animations: '',
  design: '',
  environnements: '',
  methodes: ''
})

onMounted(async () => {
  const { data } = await supabase.from('portfolio_competences').select('*').eq('id', 1).maybeSingle()
  if (data) {
    for (const cat of categories) {
      form[cat.key] = arrayToCsv(data[cat.key] as string[])
    }
  }
})

async function save() {
  saving.value = true
  message.value = null

  const payload: Record<string, unknown> = { id: 1, updated_at: new Date().toISOString() }
  for (const cat of categories) {
    payload[cat.key] = csvToArray(form[cat.key])
  }

  const { error } = await supabase.from('portfolio_competences').upsert(payload)

  saving.value = false
  message.value = error ? error.message : 'Enregistré avec succès'
  if (!error) await refreshNuxtData('portfolio-content')
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Compétences</h1>

    <form class="space-y-5 max-w-2xl" @submit.prevent="save">
      <div v-for="cat in categories" :key="cat.key">
        <label class="admin-label">{{ cat.label }} (séparés par des virgules)</label>
        <input v-model="form[cat.key]" class="admin-input">
      </div>

      <AdminSaveBar :saving="saving" :message="message" />
    </form>
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
