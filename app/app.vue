<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <SpeedInsights /> <!-- Ajoutez cette ligne si vous utilisez la méthode manuelle -->
  </div>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue'

const { locale } = useLocale()

useHead({
  htmlAttrs: {
    lang: locale
  }
})
</script>