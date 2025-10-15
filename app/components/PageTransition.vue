<!-- components/PageTransition.vue -->
<script setup lang="ts">
const route = useRoute()
const showOverlay = ref(false)
const isTransitioning = ref(false)

// Gestion des changements de route avec hooks de navigation
const router = useRouter()

// Hook avant le changement de route
router.beforeEach((to, from) => {
  if (to.path === from.path) return true
  
  // Afficher l'overlay avant le changement
  showOverlay.value = true
  isTransitioning.value = true
  
  // Attendre que l'animation soit visible
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 300)
  })
})

// Hook après le changement de route
router.afterEach(() => {
  // Cacher l'overlay après le changement
  setTimeout(() => {
    showOverlay.value = false
    isTransitioning.value = false
  }, 500)
})

// Animation initiale
onMounted(() => {
  showOverlay.value = true
  setTimeout(() => {
    showOverlay.value = false
  }, 800)
})
</script>

<template>
  <div class="relative">
    <!-- Overlay de transition -->
    <Transition name="overlay">
      <div 
        v-if="showOverlay"
        class="fixed inset-0 z-[9999] bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600"
      >
        <!-- Éléments décoratifs -->
        <div class="absolute inset-0 overflow-hidden">
          <!-- Particules flottantes -->
          <div class="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div class="absolute top-3/4 right-1/4 w-12 h-12 bg-white/15 rounded-full animate-pulse" style="animation-delay: 0.5s;"></div>
          <div class="absolute bottom-1/4 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
          
          <!-- Lignes de progression -->
          <div class="absolute top-0 left-0 w-full h-0.5 bg-white/20 transform -translate-x-full animate-slide-right"></div>
          <div class="absolute bottom-0 right-0 w-full h-0.5 bg-white/20 transform translate-x-full animate-slide-left"></div>
        </div>
        
        <!-- Logo et indicateur -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-2xl font-bold text-white mb-4 animate-fade-in">
              Widdy<span class="text-yellow-300">.Dev</span>
            </div>
            <div class="flex items-center justify-center space-x-1">
              <div class="w-1.5 h-1.5 bg-white/60 rounded-full loading-dot"></div>
              <div class="w-1.5 h-1.5 bg-white/60 rounded-full loading-dot"></div>
              <div class="w-1.5 h-1.5 bg-white/60 rounded-full loading-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Contenu de la page -->
    <div 
      class="relative z-10"
      :class="{ 'pointer-events-none': isTransitioning }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Transition de l'overlay */
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.overlay-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Animations personnalisées */
@keyframes slide-right {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes slide-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-slide-right {
  animation: slide-right 2s ease-in-out infinite;
}

.animate-slide-left {
  animation: slide-left 2s ease-in-out infinite reverse;
}
</style>
