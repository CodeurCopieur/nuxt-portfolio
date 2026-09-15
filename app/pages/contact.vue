<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useContent()

useHead({
  title: computed(() => `Contact — ${meta.value?.name ?? 'Portfolio'}`)
})
</script>

<template>
  <div class="rf-route">
    <div class="rf-page-ghost-wrap" aria-hidden="true">
      <span class="rf-page-ghost">04</span>
    </div>
    <RefonteContactPanel />
  </div>
</template>
