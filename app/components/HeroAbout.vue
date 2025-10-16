<script setup lang="ts">
const { meta, sections } = useContent()

const heroRef = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

onMounted(() => {
  if (!heroRef.value) return
  
  // Animation d'entrée moderne
  $gsap.fromTo(heroRef.value.querySelector('.hero-title'), {
    opacity: 0,
    y: 30,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power3.out'
  })
  
  $gsap.fromTo(heroRef.value.querySelector('.hero-subtitle'), {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out'
  })
  
  $gsap.fromTo(heroRef.value.querySelector('.hero-bio'), {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.4,
    ease: 'power2.out'
  })
  
  $gsap.fromTo(heroRef.value.querySelector('.hero-highlights'), {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.6,
    ease: 'power2.out'
  })
})
</script>

<template>
  <section ref="heroRef" class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <!-- Background gradient moderne -->
    <div class="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900"></div>
    
    <!-- Éléments décoratifs -->
    <div class="absolute top-20 left-10 w-72 h-72 bg-sky-200/30 dark:bg-sky-800/20 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl"></div>
    
    <!-- Grille de points décorative -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-sky-500 rounded-full"></div>
      <div class="absolute top-1/3 right-1/3 w-1 h-1 bg-indigo-500 rounded-full"></div>
      <div class="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <!-- Badge de statut -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm font-medium mb-8 animate-fade-in">
        <div class="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
        {{ (sections as any).a_propos.availability }}
      </div>

      <!-- Titre principal -->
      <h1 style="padding-bottom: 1rem;" class="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-sky-800 to-indigo-800 dark:from-white dark:via-sky-200 dark:to-indigo-200 bg-clip-text text-transparent">
        {{ meta.name }}
      </h1>

      <!-- Sous-titre -->
      <p class="hero-subtitle text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
        {{ meta.role }}
      </p>

      <!-- Bio -->
      <p class="hero-bio text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        {{ (sections as any).a_propos.bio }}
      </p>

      <!-- Highlights -->
      <div class="hero-highlights grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <div 
          v-for="highlight in (sections as any).a_propos.highlights" 
          :key="highlight"
          class="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:scale-105"
        >
          <p class="text-sm text-gray-700 dark:text-gray-300">{{ highlight }}</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink 
          to="/projets" 
          class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Voir mes projets
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </NuxtLink>
        
        <NuxtLink 
          to="/contact" 
          class="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:border-sky-500 hover:text-sky-600 dark:hover:border-sky-400 dark:hover:text-sky-400 transition-all duration-300"
        >
          Me contacter
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
