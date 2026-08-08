<script setup lang="ts">
const route = useRoute()
const { logout, user } = useAdminAuth()

const navItems = [
  { label: 'Tableau de bord', to: '/admin' },
  { label: 'Profil', to: '/admin/meta' },
  { label: 'Expériences', to: '/admin/experiences' },
  { label: 'Compétences', to: '/admin/competences' },
  { label: 'Projets', to: '/admin/projets' },
  { label: 'Récents', to: '/admin/projets-recents' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="text-lg font-bold text-gray-900 dark:text-white">
            Admin<span class="text-sky-500">.Portfolio</span>
          </NuxtLink>
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :class="[
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                route.path === item.to
                  ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-gray-500 hover:text-sky-500 transition-colors"
          >
            Voir le site
          </NuxtLink>
          <button
            class="text-sm text-red-500 hover:text-red-600 transition-colors"
            @click="logout"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <slot />
    </main>
  </div>
</template>
