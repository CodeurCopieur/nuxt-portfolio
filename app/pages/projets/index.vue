<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

useHead({
  title: computed(() => `Projets — ${meta.value.name}`)
})
</script>

<template>
  <RefonteSection chapter="Projets">
    <RefonteProjectsArchive />
  </RefonteSection>
</template>
