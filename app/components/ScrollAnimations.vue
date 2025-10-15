<!-- components/ScrollAnimations.vue -->
<script setup lang="ts">
const scrollProgress = ref(0)
const isScrolling = ref(false)

// Gestion du scroll
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
  
  isScrolling.value = true
  clearTimeout(window.scrollTimeout)
  window.scrollTimeout = setTimeout(() => {
    isScrolling.value = false
  }, 150)
}

// Intersection Observer pour les animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        
        // Ajouter des délais pour les animations en cascade
        const delay = entry.target.getAttribute('data-scroll-delay')
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`
        }
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })
  
  // Observer tous les éléments avec des classes d'animation
  const animatedElements = document.querySelectorAll(
    '.scroll-fade-in, .scroll-fade-in-left, .scroll-fade-in-right, .scroll-scale-in, .scroll-slide-up'
  )
  
  animatedElements.forEach((el) => {
    observer.observe(el)
  })
}

// Effet de parallaxe
const handleParallax = () => {
  const parallaxElements = document.querySelectorAll('.parallax-bg')
  const scrolled = window.pageYOffset
  
  parallaxElements.forEach((el) => {
    const speed = el.getAttribute('data-parallax-speed') || '0.5'
    const yPos = -(scrolled * parseFloat(speed))
    el.style.transform = `translateY(${yPos}px)`
  })
}

// Animation de rebond au scroll
const handleBounceScroll = () => {
  const bounceElements = document.querySelectorAll('.bounce-on-scroll')
  
  bounceElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0
    
    if (isInView && isScrolling.value) {
      el.classList.add('bouncing')
      setTimeout(() => {
        el.classList.remove('bouncing')
      }, 300)
    }
  })
}

// Effet de flou au scroll
const handleBlurScroll = () => {
  const blurElements = document.querySelectorAll('.scroll-blur')
  const scrollTop = window.pageYOffset
  
  blurElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const elementTop = rect.top + scrollTop
    
    if (scrollTop > elementTop - window.innerHeight) {
      el.classList.add('blurred')
    } else {
      el.classList.remove('blurred')
    }
  })
}

// Animation de rotation au scroll
const handleRotateScroll = () => {
  const rotateElements = document.querySelectorAll('.rotate-on-scroll')
  const scrollTop = window.pageYOffset
  
  rotateElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const elementTop = rect.top + scrollTop
    const rotation = (scrollTop - elementTop) * 0.1
    
    el.style.transform = `rotate(${rotation}deg)`
  })
}

// Effet de glitch au scroll
const handleGlitchScroll = () => {
  const glitchElements = document.querySelectorAll('.glitch-on-scroll')
  
  glitchElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0
    
    if (isInView && isScrolling.value) {
      el.classList.add('glitching')
      setTimeout(() => {
        el.classList.remove('glitching')
      }, 300)
    }
  })
}

// Effet de typewriter au scroll
const handleTypewriterScroll = () => {
  const typewriterElements = document.querySelectorAll('.typewriter-on-scroll')
  
  typewriterElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0
    
    if (isInView && !el.classList.contains('typed')) {
      el.classList.add('typed')
      el.style.animation = 'typewriter 2s steps(40, end)'
    }
  })
}

// Effet de morphing au scroll
const handleMorphScroll = () => {
  const morphElements = document.querySelectorAll('.morph-on-scroll')
  
  morphElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const isInView = rect.top < window.innerHeight && rect.bottom > 0
    
    if (isInView) {
      el.classList.add('morphing')
    } else {
      el.classList.remove('morphing')
    }
  })
}

// Gestionnaire principal de scroll
const handleAllScrollEffects = () => {
  handleScroll()
  handleParallax()
  handleBounceScroll()
  handleBlurScroll()
  handleRotateScroll()
  handleGlitchScroll()
  handleTypewriterScroll()
  handleMorphScroll()
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleAllScrollEffects, { passive: true })
  observeElements()
  
  // Initialiser les animations
  nextTick(() => {
    observeElements()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleAllScrollEffects)
})
</script>

<template>
  <!-- Indicateur de progression de scroll -->
  <div 
    class="scroll-indicator"
    :style="{ transform: `scaleX(${scrollProgress / 100})` }"
  ></div>
  
  <!-- Slot pour le contenu -->
  <slot />
</template>

<style scoped>
/* Styles pour les animations de rebond */
.bouncing {
  animation: bounce-on-scroll 0.3s ease-in-out;
}

/* Styles pour les animations de glitch */
.glitching {
  animation: glitch 0.3s ease-in-out;
}

/* Styles pour les animations de morphing */
.morphing {
  animation: morph 8s ease-in-out infinite;
}

/* Styles pour les animations de typewriter */
.typed {
  animation: typewriter 2s steps(40, end);
}
</style>
