<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

useHead({
  title: computed(() => `${meta.value.name} — Portfolio front-end`),
  meta: [
    {
      name: 'description',
      content: computed(() => `${meta.value.tagline} — Refonte portfolio éditoriale.`)
    }
  ]
})
</script>

<template>
  <div>
    <RefonteHero />
    <RefonteMarquee />
    <RefonteProjectsShowcase />
    <RefonteSkillsTapestry />
    <RefonteExperienceRail />
  </div>
</template>
