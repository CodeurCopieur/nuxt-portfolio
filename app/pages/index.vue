<!-- pages/index.vue -->
<script setup lang="ts">
const { meta, sections } = useContent()
useHead({
  title: `${meta.name} — ${meta.role}`
})

// Fonction pour calculer la durée d'expérience réelle
const calculateExperienceYears = () => {
  const experiences = (sections as any).experiences
  
  let totalMonths = 0
  
  experiences.forEach((exp: any) => {
    if (exp.date_debut && exp.date_fin) {
      // Parser les dates au format "MM/YYYY"
      const [startMonth, startYear] = exp.date_debut.split('/').map(Number)
      const [endMonth, endYear] = exp.date_fin.split('/').map(Number)
      
      if (!isNaN(startMonth) && !isNaN(startYear) && 
          !isNaN(endMonth) && !isNaN(endYear)) {
        
        // Calcul en mois (les mois sont 1-indexed, donc on soustrait 1)
        const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth)
        totalMonths += Math.max(0, monthsDiff)
      }
    }
  })
  
  // Convertir en années
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  
  if (years === 0) {
    return `${months} mois`
  } else if (months === 0) {
    return `${years} an${years > 1 ? 's' : ''}`
  } else {
    return `${years} an${years > 1 ? 's' : ''} et ${months} mois`
  }
}

const experienceDuration = computed(() => calculateExperienceYears())
</script>

<template>
  <main>
    <!-- Hero Section -->
    <HeroAbout />

        <!-- Projets Section -->
        <section class="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Projets <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Récents</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez mes réalisations les plus significatives
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard 
            v-for="project in (sections as any).projets.slice(0, 3)" 
            :key="project.slug" 
            :p="project"
          />
        </div>
        
        <div class="text-center mt-12">
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

    <!-- Compétences Section -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Compétences & <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Expertise</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Un éventail de technologies et méthodologies maîtrisées pour créer des expériences web exceptionnelles
          </p>
        </div>
        <SkillsCloud :skills="(sections as any).competences" />
      </div>
    </section>

    <!-- Expériences Section -->
    <section class="py-20">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Parcours <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Professionnel</span>
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ experienceDuration }} d'expériences dans des environnements exigeants
          </p>
        </div>
        
        <ExperienceFilter :stacks="['JavaScript','Vue 3','Nuxt 3','React','GSAP','Twig','SCSS','TailwindCSS']" />
        
        <div class="mt-12">
          <ClientOnly fallback-tag="div" fallback="Chargement…">
            <ExperienceList />
          </ClientOnly>
        </div>
      </div>
    </section>


  </main>
</template>