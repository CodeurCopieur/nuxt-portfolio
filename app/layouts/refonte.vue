<script setup lang="ts">
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,500;9..144,700&family=Instrument+Sans:wght@400;500;600;700&display=swap'
    }
  ]
})
</script>

<template>
  <RefonteShell>
    <slot />
  </RefonteShell>
</template>
