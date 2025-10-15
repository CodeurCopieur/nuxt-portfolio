<!-- components/ExperienceList.vue -->
<script setup lang="ts">
const { sections } = useContent()
const exps = computed(() => (sections as any).experiences as any[])

import { useFilters } from '@/store/useFilters'
const filters = useFilters()
const filtered = computed(() => {
  if (!filters.selectedStacks.length) return exps.value
  return exps.value.filter(e =>
    (e.stack || []).some((s: string) => filters.selectedStacks.includes(s))
  )
})

const el = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

onMounted(() => {
  if (!el.value) return
  $gsap.fromTo(el.value.querySelectorAll('.experience-card'), {
    opacity: 0,
    y: 30,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  })
})

// Fonction pour obtenir l'icône de l'entreprise
const getCompanyIcon = (company: string) => {
  return 'building'
}

// Fonction pour obtenir la couleur de l'entreprise
const getCompanyColor = (company: string) => {
  const colors: Record<string, string> = {
    'Société Générale': 'from-blue-500 to-blue-600',
    'Mazarine': 'from-purple-500 to-pink-600',
    'Cyllene': 'from-emerald-500 to-teal-600',
    'Le Point': 'from-orange-500 to-red-600'
  }
  return colors[company] || 'from-gray-500 to-gray-600'
}
</script>

<template>
  <div ref="el" class="space-y-6">
    <!-- Message quand aucun résultat -->
    <div 
      v-if="filters.selectedStacks.length > 0 && filtered.length === 0"
      class="no-results-card text-center py-16 px-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
    >
      <!-- Icône décorative -->
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center">
        <svg class="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <!-- Titre -->
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Aucune expérience trouvée
      </h3>
      
      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
        Aucune expérience ne correspond aux technologies sélectionnées. 
        <span class="font-medium text-sky-600 dark:text-sky-400">
          Hâte de découvrir votre entreprise et d'ajouter de nouvelles compétences à mon parcours !
        </span>
      </p>
      
      <!-- Bouton pour réinitialiser -->
      <button
        @click="filters.clearStacks"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Voir toutes les expériences
      </button>
      
      <!-- Technologies sélectionnées -->
      <div class="mt-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Technologies recherchées :
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <span 
            v-for="tech in filters.selectedStacks" 
            :key="tech"
            class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-600"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- Liste des expériences -->
    <article 
      v-for="e in filtered" 
      :key="e.company + e.period" 
      class="experience-card group relative p-6 rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
    >
      <!-- Indicateur de période -->
      <div class="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg">
        {{ e.period }}
      </div>

      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Icône et infos principales -->
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-lg">
            <!-- Icône SVG d'immeuble par défaut -->
            <svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {{ e.role }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ e.company }}</span>
                <span class="text-xs text-gray-500 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{ e.location }}
                </span>
              </div>
            </div>
            
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {{ e.summary }}
            </p>
          </div>
        </div>
      </div>

      <!-- Missions -->
      <div v-if="e.missions && e.missions.length" class="mt-6">
        <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Missions principales
        </h4>
        <ul class="space-y-2">
          <li 
            v-for="mission in e.missions" 
            :key="mission"
            class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <div class="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>{{ mission }}</span>
          </li>
      </ul>
      </div>

      <!-- Stack technique -->
      <div class="mt-6">
        <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          Technologies utilisées
        </h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="tech in e.stack" 
            :key="tech"
            class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300"
          >
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="e.tags && e.tags.length" class="mt-4 flex flex-wrap gap-2">
        <span 
          v-for="tag in e.tags" 
          :key="tag"
          class="px-2 py-1 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-sky-700 dark:text-sky-300 text-xs font-medium rounded-lg border border-sky-200/50 dark:border-sky-700/50"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Liens -->
      <div v-if="e.links && e.links.length" class="mt-4 flex gap-2">
        <a 
          v-for="link in e.links" 
          :key="link"
          :href="link"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1 px-3 py-1 text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Voir le projet
        </a>
      </div>
    </article>
  </div>
</template>
