<script setup lang="ts">
import { fill } from '@/i18n/ui'

definePageMeta({ layout: 'refonte' })

const { meta } = useLocalizedContent()
const { ui } = useUi()

const pageTitle = computed(() => fill(ui.value.seo.homeTitle, { name: meta.value.name }))
const pageDescription = computed(() => ui.value.seo.homeFallback)

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
    jobTitle: () => meta.value.role || ui.value.seo.roleFallback,
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
    <RefonteOffers />
    <RefonteWorks />
    <RefonteExpertise />
    <RefonteExperienceRail />
  </div>
</template>
