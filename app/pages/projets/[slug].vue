<!-- pages/projets/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { sections } = useContent()
const p = computed(() => (sections as any).projets.find((x: any) => x.slug === route.params.slug))

if (!p.value) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })

useHead({ 
  title: `${p.value.title} — Case Study`,
  meta: [
    { name: 'description', content: p.value.summary },
    { property: 'og:title', content: p.value.title },
    { property: 'og:description', content: p.value.summary },
    { property: 'og:image', content: p.value.cover || '/og-image.jpg' }
  ]
})

// Références pour les animations
const heroRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

// Animation d'entrée
onMounted(() => {
  if (!heroRef.value || !contentRef.value) return
  
  // Animation du hero
  $gsap.fromTo(heroRef.value.querySelector('.hero-title'), {
    opacity: 0,
    y: 30,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    ease: 'power2.out'
  })
  
  $gsap.fromTo(heroRef.value.querySelector('.hero-meta'), {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out'
  })
  
  // Animation du contenu
  $gsap.fromTo(contentRef.value.querySelectorAll('.content-section'), {
    opacity: 0,
    y: 40
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.2,
    delay: 0.4,
    ease: 'power2.out'
  })
})

// Navigation breadcrumb
const goBack = () => {
  navigateTo('/projets')
}
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section 
      ref="heroRef"
      class="relative py-20 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 overflow-hidden"
    >
      <!-- Éléments décoratifs -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-sky-200/30 dark:bg-sky-800/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <button 
            @click="goBack"
            class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour aux projets
          </button>
        </nav>
        
        <!-- En-tête du projet -->
        <div class="text-center mb-12">
          <h1 class="hero-title text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {{ p.title }}
          </h1>
          
          <div class="hero-meta flex flex-col sm:flex-row items-center justify-center gap-4 text-lg text-gray-600 dark:text-gray-300 mb-8">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span class="font-semibold text-sky-600 dark:text-sky-400">{{ p.org }}</span>
            </div>
            
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ p.year }}</span>
            </div>
          </div>
          
          <!-- Image de couverture -->
          <div v-if="p.cover" class="max-w-4xl mx-auto mb-8">
            <div class="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                :src="p.cover" 
                :alt="p.title" 
                class="w-full h-auto object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contenu principal -->
    <section ref="contentRef" class="py-20">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Description -->
        <div class="content-section mb-16">
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              À propos du projet
            </h2>
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ p.summary }}
            </p>
          </div>
        </div>

        <!-- Stack technique -->
        <div class="content-section mb-16">
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              Technologies utilisées
            </h2>
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="tech in p.stack" 
                :key="tech"
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="p.tags && p.tags.length" class="content-section mb-16">
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
              Catégories
            </h2>
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="tag in p.tags" 
                :key="tag"
                class="px-4 py-2 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-sky-700 dark:text-sky-300 font-medium rounded-xl border border-sky-200/50 dark:border-sky-700/50 hover:from-sky-500/20 hover:to-indigo-500/20 transition-all duration-300"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Lien vers le projet -->
        <div v-if="p.link" class="content-section">
          <div class="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-200/50 dark:border-sky-700/50 rounded-3xl p-8 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Voir le projet en ligne
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Découvrez le résultat final de ce projet
            </p>
            <a 
              :href="p.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Visiter le site
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation entre projets -->
    <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Découvrez mes autres <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">projets</span>
          </h2>
          <NuxtLink 
            to="/projets" 
            class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Voir tous les projets
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Animations personnalisées */
.hero-title {
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animation d'entrée pour les sections */
.content-section {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects pour les cartes */
.content-section > div {
  transition: all 0.3s ease;
}

.content-section > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>