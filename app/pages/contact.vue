<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

useHead({
  title: computed(() => `Contact — ${meta.value?.name ?? 'Portfolio'}`)
})
</script>

<template>
  <RefonteContactPanel />
</template>
