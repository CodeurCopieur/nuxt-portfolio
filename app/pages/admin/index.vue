<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { logout, user } = useAdminAuth()

const sections = [
  { title: 'Profil', desc: 'Informations personnelles, bio et à propos', to: '/admin/meta', icon: '👤' },
  { title: 'Expériences', desc: 'Parcours professionnel et filtres technologie', to: '/admin/experiences', icon: '💼' },
  { title: 'Compétences', desc: 'Technologies et outils', to: '/admin/competences', icon: '🛠️' },
  { title: 'Projets', desc: 'Réalisations et portfolio', to: '/admin/projets', icon: '🚀' },
  { title: 'Travaux sélectionnés', desc: '6 projets page d\'accueil', to: '/admin/projets-recents', icon: '⭐' }
]
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
      <button
        class="px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        @click="logout"
      >
        Déconnexion
      </button>
    </div>

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
