<!-- pages/projets/index.vue -->
<script setup lang="ts">
const { meta, sections } = useContent()

useHead({
  title: `Projets — ${meta.name}`
})

const projets = computed(() => (sections as any).projets as any[])
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 overflow-hidden">
      <!-- Éléments décoratifs -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-sky-200/30 dark:bg-sky-800/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Mes <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Projets</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Découvrez mes réalisations les plus significatives, de la conception à la mise en production
        </p>
        <div class="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-2">
            <div class="w-2 h-2 bg-sky-500 rounded-full"></div>
            {{ projets.length }} projets réalisés
          </span>
          <span class="flex items-center gap-2">
            <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
            Technologies variées
          </span>
        </div>
      </div>
    </section>

    <!-- Slider Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-6">
        <ProjectSlider />
      </div>
    </section>

    <!-- Section Technologies -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Technologies <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Utilisées</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Un éventail de technologies modernes pour créer des expériences web exceptionnelles
          </p>
        </div>
        
        <!-- Grille de technologies -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div 
            v-for="tech in ['JavaScript', 'Vue 3', 'Nuxt 3', 'React', 'GSAP', 'TailwindCSS']" 
            :key="tech"
            class="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            <div class="text-2xl mb-3">
              {{ tech === 'JavaScript' ? '⚡' : tech === 'Vue 3' ? '💚' : tech === 'Nuxt 3' ? '🟢' : tech === 'React' ? '⚛️' : tech === 'GSAP' ? '🎬' : '🎨' }}
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ tech }}</h3>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
  