<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

useHead({
  title: computed(() => `${meta.value.name} — Portfolio front-end`),
  meta: [
    {
      name: 'description',
      content: computed(() => `${meta.value?.tagline ?? ''} — Portfolio front-end & motion.`.trim())
    }
  ]
})
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
