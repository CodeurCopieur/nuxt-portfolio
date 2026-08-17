<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

const pageTitle = computed(() => `${meta.value.name} — Développeur front-end`)
const pageDescription = computed(() => {
  const tagline = meta.value?.tagline?.trim()
  if (tagline) return `${tagline} Portfolio front-end Nuxt & Vue — interfaces performantes et accessibles.`
  return 'Widdy Louis — développeur front-end freelance. Interfaces web performantes, accessibles et animées.'
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription
})

useSchemaOrg([
  definePerson({
    name: () => meta.value.name || 'Widdy Louis',
    jobTitle: () => meta.value.role || 'Développeur Front-End',
    url: 'https://www.linkedin.com/in/widdy-louis/',
    sameAs: [
      'https://www.linkedin.com/in/widdy-louis/',
      'https://github.com/CodeurCopieur'
    ]
  }),
  defineWebSite({
    name: 'Widdy Louis — Portfolio',
    description: pageDescription
  }),
  defineWebPage({
    name: pageTitle,
    description: pageDescription
  })
])
</script>

<template>
  <div>
    <RefonteHero />
    <RefonteIntro />
    <RefonteWorks />
    <RefonteExpertise />
    <RefonteExperienceRail />
  </div>
</template>
