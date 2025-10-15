<!-- components/LoadingPulse.vue -->
<script setup lang="ts">
const props = defineProps<{ label?: string }>()
</script>

<template>
  <div class="flex items-center gap-3" role="status" aria-live="polite">
    <span class="inline-block h-3 w-3 rounded-full bg-gray-400 animate-pulse"></span>
    <span class="inline-block h-3 w-3 rounded-full bg-gray-400 animate-pulse [animation-delay:150ms]"></span>
    <span class="inline-block h-3 w-3 rounded-full bg-gray-400 animate-pulse [animation-delay:300ms]"></span>
    <span class="sr-only">{{ label || 'Chargement…' }}</span>
  </div>
</template>
