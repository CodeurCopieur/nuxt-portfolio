<script setup lang="ts">
const CRITICAL_FONTS =
  'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: CRITICAL_FONTS }
  ]
})
</script>

<template>
  <RefonteShell>
    <slot />
  </RefonteShell>
</template>
