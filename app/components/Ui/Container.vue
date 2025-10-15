<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg' | 'xl'
const props = withDefaults(defineProps<{ size?: Size }>(), { size: 'lg' })

const sizeClass: Record<Size, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl'
}
</script>

<template>
  <div :class="['mx-auto px-4', sizeClass[props.size]]">
    <slot />
  </div>
</template>
