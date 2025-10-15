<!-- components/ProjectGrid.vue -->
<script setup lang="ts">
const { sections } = useContent()
const projets = computed(() => (sections as any).projets as any[])
</script>

<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProjectCard v-for="p in projets" :key="p.slug" :p="p" />
  </div>
</template>
