<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggle } = useDarkMode()
</script>

<template>
  <button
    type="button"
    class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    :aria-pressed="isDark"
    aria-label="Basculer le mode sombre"
    @click="toggle"
  >
    <span v-if="!isDark">🌙<span class="sr-only">Activer le mode sombre</span></span>
    <span v-else>☀️<span class="sr-only">Désactiver le mode sombre</span></span>
  </button>
</template>
