<!-- components/ProjectCard.vue -->
<script setup lang="ts">
defineProps<{ p: any }>()

const cardRef = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

onMounted(() => {
  if (!cardRef.value) return
  
  // Animation d'entrée avec GSAP
  $gsap.fromTo(cardRef.value, {
    opacity: 0,
    y: 30,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out'
  })
})
</script>

<template>
  <NuxtLink 
    :to="`/projets/${p.slug}`"
    ref="cardRef"
    class="group block relative overflow-hidden rounded-3xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
  >
    <!-- Image de couverture -->
    <div class="relative overflow-hidden aspect-video">
      <img 
        v-if="p.cover" 
        :src="p.cover" 
        :alt="p.title" 
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy" 
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center">
        <svg class="w-16 h-16 text-sky-400 dark:text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      
      <!-- Overlay au hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Badge année -->
      <div class="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-full">
        {{ p.year }}
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6">
      <!-- En-tête -->
      <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 mb-2">
          {{ p.title }}
        </h3>
        <p class="text-sm font-medium text-sky-600 dark:text-sky-400">
          {{ p.org }}
        </p>
      </div>
      
      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
        {{ p.summary }}
      </p>
      
      <!-- Stack technique -->
      <div class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="tech in p.stack.slice(0, 3)" 
            :key="tech"
            class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600"
          >
            {{ tech }}
          </span>
          <span 
            v-if="p.stack.length > 3"
            class="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium rounded-full border border-sky-200 dark:border-sky-700"
          >
            +{{ p.stack.length - 3 }}
          </span>
        </div>
      </div>
      
      <!-- Tags -->
      <div v-if="p.tags && p.tags.length" class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in p.tags.slice(0, 2)" 
          :key="tag"
          class="px-2 py-1 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-sky-700 dark:text-sky-300 text-xs font-medium rounded-lg border border-sky-200/50 dark:border-sky-700/50"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- Lien externe -->
      <div v-if="p.link" class="flex items-center justify-between mt-2">
        <a 
          :href="p.link"
          target="_blank"
          rel="noopener"
          class="mb-2 inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
          @click.stop
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Voir le projet
        </a>
      </div>

      <!-- Lien externe -->
      <div v-if="p.github" class="flex items-center justify-between mt-2">
        <a 
          :href="p.github"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
          @click.stop
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Voir le code
        </a>
      </div>
      
      <!-- Indicateur de navigation -->
      <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </div>
    </div>
  </NuxtLink>
</template>
