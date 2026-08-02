<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { logout, user, getAccessToken } = useAdminAuth()
const seeding = ref(false)
const seedMessage = ref<string | null>(null)

const sections = [
  { title: 'Informations personnelles', desc: 'Nom, rôle, contact, liens', to: '/admin/meta', icon: '👤' },
  { title: 'À propos', desc: 'Bio, points forts, disponibilité', to: '/admin/a-propos', icon: '📝' },
  { title: 'Expériences', desc: 'Parcours professionnel', to: '/admin/experiences', icon: '💼' },
  { title: 'Compétences', desc: 'Technologies et outils', to: '/admin/competences', icon: '🛠️' },
  { title: 'Projets', desc: 'Réalisations et portfolio', to: '/admin/projets', icon: '🚀' },
  { title: 'Projets récents', desc: '3 projets page d\'accueil', to: '/admin/projets-recents', icon: '⭐' },
  { title: 'Filtres technologie', desc: 'Filtres section expériences', to: '/admin/filtres', icon: '🔍' }
]

async function importFromJson() {
  if (!confirm('Importer les données de content.json ? Cela remplacera toutes les données existantes.')) return

  seeding.value = true
  seedMessage.value = null

  try {
    const token = await getAccessToken()
    const result = await $fetch<{ message: string; counts?: { experiences: number; projects: number; filters: number } }>('/api/admin/seed', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const counts = result.counts
    seedMessage.value = counts
      ? `Import réussi : ${counts.experiences} expériences, ${counts.projects} projets, ${counts.filters} filtres`
      : result.message
    await refreshNuxtData('portfolio-content')
  } catch (err: unknown) {
    const fetchErr = err as { data?: { message?: string }; message?: string }
    seedMessage.value = fetchErr.data?.message || fetchErr.message || 'Erreur lors de l\'import'
  } finally {
    seeding.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Connecté en tant que {{ user?.email }}
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :disabled="seeding"
          @click="importFromJson"
        >
          {{ seeding ? 'Import…' : 'Importer content.json' }}
        </button>
        <button
          class="px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          @click="logout"
        >
          Déconnexion
        </button>
      </div>
    </div>

    <p v-if="seedMessage" class="mb-6 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-sm">
      {{ seedMessage }}
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 hover:shadow-lg transition-all"
      >
        <span class="text-3xl">{{ section.icon }}</span>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {{ section.title }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">{{ section.desc }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
