<!-- components/CustomCursor.vue -->
<script setup lang="ts">
const cursor = ref<HTMLElement | null>(null)
const follower = ref<HTMLElement | null>(null)
const trail = ref<HTMLElement | null>(null)

const mouseX = ref(0)
const mouseY = ref(0)
const followerX = ref(0)
const followerY = ref(0)

// Variables pour le throttling et l'optimisation
let animationFrameId: number | null = null
let isAnimating = false

// Fonction de throttling pour les événements mousemove
const throttleMouseMove = (callback: (e: MouseEvent) => void, delay: number) => {
  let lastCall = 0
  return function (e: MouseEvent) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      callback(e)
    }
  }
}

// Gestion optimisée du mouvement de la souris
const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  
  // Utiliser requestAnimationFrame pour une animation fluide
  if (!isAnimating) {
    isAnimating = true
    animationFrameId = requestAnimationFrame(() => {
      updateCursorPosition()
      isAnimating = false
    })
  }
}

// Fonction séparée pour mettre à jour la position du curseur
const updateCursorPosition = () => {
  // Animation fluide du curseur de suivi avec easing
  const easing = 0.15
  followerX.value += (mouseX.value - followerX.value) * easing
  followerY.value += (mouseY.value - followerY.value) * easing
  
  // Mettre à jour les positions avec transform3d pour l'accélération matérielle
  if (cursor.value) {
    cursor.value.style.transform = `translate3d(${mouseX.value}px, ${mouseY.value}px, 0)`
  }
  
  if (follower.value) {
    follower.value.style.transform = `translate3d(${followerX.value}px, ${followerY.value}px, 0)`
  }
  
  // Effet de traînée optimisé
  if (trail.value) {
    trail.value.style.transform = `translate3d(${mouseX.value}px, ${mouseY.value}px, 0)`
    trail.value.style.opacity = '0.6'
    
    // Utiliser requestAnimationFrame au lieu de setTimeout
    requestAnimationFrame(() => {
      if (trail.value) {
        trail.value.style.opacity = '0'
      }
    })
  }
}

// Gestion du clic optimisée
const handleMouseDown = () => {
  if (cursor.value) cursor.value.classList.add('clicking')
  if (follower.value) follower.value.classList.add('clicking')
}

const handleMouseUp = () => {
  if (cursor.value) cursor.value.classList.remove('clicking')
  if (follower.value) follower.value.classList.remove('clicking')
}

// Gestion des hovers optimisée
const handleMouseEnter = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  
  if (cursor.value && follower.value && trail.value) {
    // Liens et boutons
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
      cursor.value.classList.add('hover')
      follower.value.classList.add('hover')
      trail.value.classList.add('hover')
    }
    
    // Labels
    if (target.tagName === 'LABEL' || target.closest('label')) {
      cursor.value.classList.add('label')
      follower.value.classList.add('label')
      trail.value.classList.add('label')
    }
    
    // Images
    if (target.tagName === 'IMG') {
      cursor.value.classList.add('image')
    }
    
    // Inputs et textarea
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      cursor.value.classList.add('input')
    }
    
    // Zones de texte
    if (target.contentEditable === 'true' || target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3') {
      cursor.value.classList.add('text')
    }
  }
}

const handleMouseLeave = () => {
  if (cursor.value) {
    cursor.value.classList.remove('hover', 'label', 'image', 'input', 'text')
  }
  if (follower.value) {
    follower.value.classList.remove('hover', 'label')
  }
  if (trail.value) {
    trail.value.classList.remove('hover', 'label')
  }
}

// Gestion du drag
const handleDragStart = () => {
  if (cursor.value) cursor.value.classList.add('dragging')
}

const handleDragEnd = () => {
  if (cursor.value) cursor.value.classList.remove('dragging')
}

// Lifecycle
onMounted(() => {
  // Initialiser la position
  mouseX.value = window.innerWidth / 2
  mouseY.value = window.innerHeight / 2
  followerX.value = mouseX.value
  followerY.value = mouseY.value
  
  // Événements de souris avec throttling
  const throttledMouseMove = throttleMouseMove(handleMouseMove, 16) // ~60fps
  
  document.addEventListener('mousemove', throttledMouseMove)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('mouseenter', handleMouseEnter)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('dragstart', handleDragStart)
  document.addEventListener('dragend', handleDragEnd)
  
  // Événements sur les éléments
  document.addEventListener('mouseover', handleMouseEnter)
  document.addEventListener('mouseout', handleMouseLeave)
})

onUnmounted(() => {
  // Nettoyer l'animation frame
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('mouseenter', handleMouseEnter)
  document.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('dragstart', handleDragStart)
  document.removeEventListener('dragend', handleDragEnd)
  document.removeEventListener('mouseover', handleMouseEnter)
  document.removeEventListener('mouseout', handleMouseLeave)
})
</script>

<template>
  <!-- Curseur principal -->
  <div 
    ref="cursor"
    class="custom-cursor"
  ></div>
  
  <!-- Curseur de suivi -->
  <div 
    ref="follower"
    class="cursor-follower"
  ></div>
  
  <!-- Effet de traînée -->
  <div 
    ref="trail"
    class="cursor-trail"
  ></div>
</template>

<style scoped>
/* Styles spécifiques au composant */
.custom-cursor,
.cursor-follower,
.cursor-trail {
  /* Optimisations pour Chrome */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  /* Désactiver les sélections de texte */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
