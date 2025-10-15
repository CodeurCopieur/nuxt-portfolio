<!-- components/ProjectSlider.vue -->
<script setup lang="ts">
const { sections } = useContent()
const projets = computed(() => (sections as any).projets as any[])

// Référence pour Swiper
const swiperRef = ref<any>(null)

// GSAP
const { $gsap } = useNuxtApp()

// Configuration Swiper
const swiperOptions = {
  slidesPerView: 1.1,
  spaceBetween: 30,
  touchRatio: 0.5,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    stopOnLastSlide: false,
  },
  pagination: {
    el: '.swiper-pagination.custom-swiper-pagination',
    type: 'bullets' as const,
    dynamicBullets: true,
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    768: {
      slidesPerView: 2.1,
      spaceBetween: 30,
      resistanceRatio : 0.2,
    },
    1024: {
      slidesPerView: 3.1,
      spaceBetween: 30,
      resistanceRatio : 0.2,
    },
  },
  on: {
    init: function(this: any) {
      // Animation d'entrée pour les slides
      this.slides.forEach((slide: any, index: number) => {
        $gsap.fromTo(slide, {
          opacity: 0,
          y: 30,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power2.out'
        })
      })
    },
    slideChange: function(this: any) {
      // Animation pour les nouvelles slides
      this.slides[this.activeIndex].querySelectorAll('.project-card').forEach((card: any, index: number) => {
        $gsap.fromTo(card, {
          opacity: 0,
          y: 20,
          scale: 0.95
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power2.out'
        })
      })
    }
  }
}

onMounted(() => {
  // Initialiser Swiper avec un délai pour s'assurer que le DOM est prêt
  if (typeof window !== 'undefined') {
    const { $Swiper, $Navigation, $Pagination, $Autoplay } = useNuxtApp()
    
    // Délai pour s'assurer que le DOM est complètement rendu
    setTimeout(() => {
      const swiperElement = document.querySelector('.swiper')
      if (swiperElement) {
        swiperRef.value = new $Swiper('.swiper', {
          modules: [$Navigation, $Pagination, $Autoplay],
          ...swiperOptions
        })
        
        // Vérifier que la navigation fonctionne
        console.log('Swiper initialisé avec navigation:', swiperRef.value)
      }
    }, 100)
  }
})

onUnmounted(() => {
  if (swiperRef.value) {
    swiperRef.value.destroy()
  }
})
</script>

<template>
  <div class="project-slider">
    <!-- En-tête du slider -->
    <div class="flex items-center justify-between mb-12">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Projets Récents
        </h2>
        <p class="text-gray-600 dark:text-gray-300">
          Glissez pour découvrir mes réalisations
        </p>
      </div>
      
      <!-- Navigation moderne -->
      <div class="modern-navigation">
        <div class="nav-buttons">
          <button class="swiper-button-prev modern-nav-btn" aria-label="Projet précédent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 18L9 12L15 6" />
            </svg>
          </button>
          <button class="swiper-button-next modern-nav-btn" aria-label="Projet suivant">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 18L15 12L9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Swiper Container -->
    <div class="swiper project-swiper">
      <div class="swiper-wrapper">
        <div 
          v-for="project in projets" 
          :key="project.slug"
          class="swiper-slide"
        >
          <ProjectCard :p="project" class="project-card" />
        </div>
      </div>
      
      <!-- Pagination Swiper -->
      <div class="swiper-pagination custom-swiper-pagination"></div>
    </div>
  </div>
</template>

<style scoped>
/* Import Swiper CSS */
@import 'swiper/css';
@import 'swiper/css/navigation';
@import 'swiper/css/pagination';

.project-slider {
  width: 100%;
  position: relative;
}

.project-swiper {
  width: 100%;
  padding: 20px 0 60px 0;
  overflow: hidden;
}

.swiper-slide {
  height: auto;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.project-card {
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}

/* Navigation moderne au-dessus */
.modern-navigation {
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  margin-bottom: 20px !important;
  padding: 0 10px !important;
}

.nav-buttons {
  display: flex !important;
  gap: 12px !important;
  align-items: center !important;
}

/* Boutons de navigation modernes */
.modern-nav-btn {
  width: 48px !important;
  height: 48px !important;
  background: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 12px !important;
  color: #6b7280 !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  margin: 0 !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  transform: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
}

.dark .modern-nav-btn {
  background: #1f2937 !important;
  border-color: #374151 !important;
  color: #9ca3af !important;
}

.modern-nav-btn:hover {
  background: #f0f9ff !important;
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
  transform: scale(1.05) !important;
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15) !important;
}

.dark .modern-nav-btn:hover {
  background: #0c4a6e !important;
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
}

.modern-nav-btn::after {
  display: none !important;
}

/* Navigation personnalisée (pour la pagination) */
.custom-swiper-nav {
  width: 48px !important;
  height: 48px !important;
  background: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 12px !important;
  color: #6b7280 !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  margin: 0 !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  transform: none !important;
}

.dark .custom-swiper-nav {
  background: #1f2937 !important;
  border-color: #374151 !important;
  color: #9ca3af !important;
}

.custom-swiper-nav:hover {
  background: #f0f9ff !important;
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
  transform: scale(1.05) !important;
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.15) !important;
}

.dark .custom-swiper-nav:hover {
  background: #0c4a6e !important;
  border-color: #0ea5e9 !important;
  color: #0ea5e9 !important;
}

.custom-swiper-nav::after {
  display: none !important;
}

/* Pagination masquée (pas de compteur visuel) */
.swiper-pagination {
  display: none !important;
}

.custom-swiper-pagination {
  display: none !important;
}

.custom-swiper-pagination .swiper-pagination-bullet {
  width: 14px !important;
  height: 14px !important;
  background: #cbd5e1 !important;
  opacity: 0.4 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  border: 2px solid transparent !important;
  outline: none !important;
  margin: 0 !important;
}

.custom-swiper-pagination .swiper-pagination-bullet:hover {
  opacity: 0.7 !important;
  transform: scale(1.15) !important;
  background: #94a3b8 !important;
}

.custom-swiper-pagination .swiper-pagination-bullet-active {
  background: linear-gradient(135deg, #0ea5e9, #6366f1) !important;
  opacity: 1 !important;
  transform: scale(1.3) !important;
  border-color: rgba(14, 165, 233, 0.3) !important;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .project-swiper {
    padding: 10px 0 50px 0;
  }
  
  .custom-swiper-pagination {
    gap: 8px;
  }
  
  .custom-swiper-pagination .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
  }
  
  .custom-swiper-nav {
    width: 40px !important;
    height: 40px !important;
  }
}

/* Animation d'entrée pour les slides */
.swiper-slide {
  animation: slideFadeIn 0.6s ease-out;
}

@keyframes slideFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Effet de hover sur les cartes */
.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}


/* S'assurer que les boutons de navigation sont visibles */
.swiper-button-next,
.swiper-button-prev {
  display: flex !important;
}
</style>
