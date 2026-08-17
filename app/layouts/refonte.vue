<script setup lang="ts">
/** Fonts critiques hero (LCP) — sans Bangers pour accélérer le 1er paint. */
const CRITICAL_FONTS =
  'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap'

const DEFERRED_FONTS =
  'https://fonts.googleapis.com/css2?family=Bangers&display=swap'

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: CRITICAL_FONTS }
  ]
})

onMounted(() => {
  const idle = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1200))
  idle(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = DEFERRED_FONTS
    document.head.appendChild(link)
  })
})
</script>

<template>
  <RefonteShell>
    <slot />
  </RefonteShell>
</template>
