<script setup lang="ts">
import DesktopShell from '@/components/desktop/DesktopShell.vue'

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
</script>

<template>
  <DesktopShell />
</template>
