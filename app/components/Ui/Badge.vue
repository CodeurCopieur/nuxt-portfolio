<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'solid' | 'soft' | 'outline'
}>(), { variant: 'soft' })

const base = 'inline-flex items-center gap-1 rounded-full text-xs px-2.5 py-1'
const variants = {
  solid:   'bg-black text-white dark:bg-white dark:text-black',
  soft:    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  outline: 'border border-gray-300 text-gray-800 dark:text-gray-100 dark:border-gray-700'
}
</script>

<template>
  <span :class="[base, variants[variant]]">
    <slot />
  </span>
</template>
