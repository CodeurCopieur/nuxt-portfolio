<script setup lang="ts">
definePageMeta({ layout: 'desktop' })

const { meta } = useContent()

useHead({
  title: computed(() => `WiddyOS — ${meta.value.name}`)
})
</script>

<template>
  <div />
</template>
