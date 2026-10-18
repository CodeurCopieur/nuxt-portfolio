<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useLocalizedContent()
const { ui } = useUi()

useHead({
  title: computed(() => `${ui.value.archive.pageTitle} — ${meta.value.name}`)
})
</script>

<template>
  <div class="rf-route">
    <div class="rf-page-ghost-wrap" aria-hidden="true">
      <span class="rf-page-ghost">02</span>
    </div>
    <RefonteSection chapter="Projets">
      <RefonteProjectsArchive />
    </RefonteSection>
  </div>
</template>
