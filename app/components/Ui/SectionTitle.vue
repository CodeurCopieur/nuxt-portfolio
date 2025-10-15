<script setup lang="ts">
const props = withDefaults(defineProps<{
  tag?: 'h1' | 'h2' | 'h3'
  align?: 'left' | 'center'
  eyebrow?: string
  sub?: string
}>(), {
  tag: 'h2',
  align: 'left'
})
</script>

<template>
  <header :class="['mb-6', props.align === 'center' ? 'text-center' : 'text-left']">
    <p v-if="eyebrow" class="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
      {{ eyebrow }}
    </p>
    <component
      :is="props.tag"
      class="mt-1 text-2xl md:text-3xl font-bold tracking-tight"
    >
      <slot />
    </component>
    <p v-if="sub" class="mt-2 text-gray-600 dark:text-gray-300 max-w-prose mx-auto">
      {{ sub }}
    </p>
  </header>
</template>
