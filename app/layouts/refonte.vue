<script setup lang="ts">
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Bangers&family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    // Preload non bloquant → puis bascule en stylesheet
    {
      rel: 'preload',
      as: 'style',
      href: FONT_HREF,
      onload: "this.onload=null;this.rel='stylesheet'"
    }
  ],
  noscript: [
    {
      children: `<link rel="stylesheet" href="${FONT_HREF}">`
    }
  ]
})
</script>

<template>
  <RefonteShell>
    <slot />
  </RefonteShell>
</template>
