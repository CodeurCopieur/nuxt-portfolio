<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const saving = ref(false)
const message = ref<string | null>(null)

const form = reactive({
  name: '',
  role: '',
  years_experience: 0,
  location: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  tagline: ''
})

onMounted(async () => {
  const { data } = await supabase.from('portfolio_meta').select('*').eq('id', 1).maybeSingle()
  if (data) {
    Object.assign(form, {
      name: data.name,
      role: data.role,
      years_experience: data.years_experience,
      location: data.location,
      email: data.email,
      phone: data.phone,
      linkedin: data.linkedin,
      github: data.github,
      tagline: data.tagline
    })
  }
})

async function save() {
  saving.value = true
  message.value = null

  const { error } = await supabase.from('portfolio_meta').upsert({
    id: 1,
    ...form,
    updated_at: new Date().toISOString()
  })

  saving.value = false
  message.value = error ? error.message : 'Enregistré avec succès'
  if (!error) await refreshNuxtData('portfolio-content')
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Informations personnelles</h1>

    <form class="space-y-5 max-w-2xl" @submit.prevent="save">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">Nom</label>
          <input v-model="form.name" class="admin-input" required>
        </div>
        <div>
          <label class="admin-label">Rôle</label>
          <input v-model="form.role" class="admin-input" required>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">Années d'expérience (affichage)</label>
          <input v-model.number="form.years_experience" type="number" class="admin-input">
        </div>
        <div>
          <label class="admin-label">Localisation</label>
          <input v-model="form.location" class="admin-input">
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">Email</label>
          <input v-model="form.email" type="email" class="admin-input">
        </div>
        <div>
          <label class="admin-label">Téléphone</label>
          <input v-model="form.phone" class="admin-input">
        </div>
      </div>

      <div>
        <label class="admin-label">Tagline</label>
        <input v-model="form.tagline" class="admin-input">
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">LinkedIn</label>
          <input v-model="form.linkedin" type="url" class="admin-input">
        </div>
        <div>
          <label class="admin-label">GitHub</label>
          <input v-model="form.github" type="url" class="admin-input">
        </div>
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
