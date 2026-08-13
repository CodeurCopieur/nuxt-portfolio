<script setup lang="ts">
definePageMeta({ layout: 'desktop' })

const route = useRoute()
const slug = route.params.slug as string

await navigateTo({ path: '/game', query: { app: 'project', slug } }, { replace: true })
</script>

<template>
  <div />
</template>
