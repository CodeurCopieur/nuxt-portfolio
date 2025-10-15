<script setup lang="ts">
import { useContent } from '@/composables/useContent'

const { sections } = useContent()
const competences = (sections as any).competences

// Transformer en tableau plat → plus pratique pour affichage
const skills = computed(() => {
  return [
    ...competences.langages,
    ...competences.frameworks,
    ...competences.ui_animations,
    ...competences.outils_dev,
    ...competences.design,
    ...competences.environnements,
    ...competences.methodes
  ]
})

// Catégoriser les compétences par importance
const categorizedSkills = computed(() => {
  const categories = {
    core: ['JavaScript', 'Vue 3', 'Nuxt 3', 'React', 'TypeScript', 'HTML5', 'CSS3/SCSS'],
    animation: ['GSAP', 'ScrollMagic', 'AOS', 'ScrollReveal', 'CSS Animations'],
    tools: ['VS Code', 'Git', 'Figma', 'Zeplin', 'Postman'],
    methods: ['Agile (Scrum)', 'TMA', 'SEO', 'RGPD', 'Accessibilité']
  }
  
  return {
    core: skills.value.filter(s => categories.core.includes(s)),
    animation: skills.value.filter(s => categories.animation.includes(s)),
    tools: skills.value.filter(s => categories.tools.includes(s)),
    methods: skills.value.filter(s => categories.methods.includes(s))
  }
})

const cloud = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

onMounted(() => {
  if (!cloud.value) return
  
  // Animation d'entrée moderne avec stagger
  $gsap.fromTo(cloud.value.querySelectorAll('.skill-category'), {
    opacity: 0,
    y: 20,
    scale: 0.95
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  })
  
  $gsap.fromTo(cloud.value.querySelectorAll('.skill-tag'), {
    opacity: 0,
    y: 10,
    scale: 0.9
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    stagger: 0.03,
    delay: 0.3,
    ease: 'back.out(1.7)'
  })
})
</script>

<template>
  <div ref="cloud" class="space-y-8">
    <!-- Compétences principales -->
    <div class="skill-category">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-sky-500 rounded-full"></div>
        Technologies principales
      </h3>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="skill in categorizedSkills.core"
          :key="skill"
          class="skill-tag px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default"
        >
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Animations -->
    <div class="skill-category">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
        Animations & UI
      </h3>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="skill in categorizedSkills.animation"
          :key="skill"
          class="skill-tag px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default"
        >
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Outils -->
    <div class="skill-category">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
        Outils & Environnements
      </h3>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="skill in categorizedSkills.tools"
          :key="skill"
          class="skill-tag px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default"
        >
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- Méthodes -->
    <div class="skill-category">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
        Méthodes & Bonnes pratiques
      </h3>
      <div class="flex flex-wrap gap-3">
        <span
          v-for="skill in categorizedSkills.methods"
          :key="skill"
          class="skill-tag px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default"
        >
          {{ skill }}
        </span>
      </div>
    </div>
  </div>
</template>
