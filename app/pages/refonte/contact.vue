<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

useHead({
  title: computed(() => `Contact — ${meta.value.name}`)
})
</script>

<template>
  <RefonteContactPanel />
</template>
