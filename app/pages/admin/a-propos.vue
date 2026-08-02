<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const saving = ref(false)
const message = ref<string | null>(null)

const form = reactive({
  bio: '',
  highlightsText: '',
  availability: ''
})

onMounted(async () => {
  const { data } = await supabase.from('portfolio_about').select('*').eq('id', 1).maybeSingle()
  if (data) {
    form.bio = data.bio
    form.highlightsText = arrayToLines(data.highlights as string[])
    form.availability = data.availability
  }
})

async function save() {
  saving.value = true
  message.value = null

  const { error } = await supabase.from('portfolio_about').upsert({
    id: 1,
    bio: form.bio,
    highlights: linesToArray(form.highlightsText),
    availability: form.availability,
    updated_at: new Date().toISOString()
  })

  saving.value = false
  message.value = error ? error.message : 'Enregistré avec succès'
  if (!error) await refreshNuxtData('portfolio-content')
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">À propos</h1>

    <form class="space-y-5 max-w-2xl" @submit.prevent="save">
      <div>
        <label class="admin-label">Bio</label>
        <textarea v-model="form.bio" rows="6" class="admin-input" required />
      </div>

      <div>
        <label class="admin-label">Points forts (un par ligne)</label>
        <textarea v-model="form.highlightsText" rows="5" class="admin-input" />
      </div>

      <div>
        <label class="admin-label">Disponibilité</label>
        <input v-model="form.availability" class="admin-input">
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
