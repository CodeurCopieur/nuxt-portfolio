<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'

const props = defineProps<{ to: string }>()

async function onClick(event: MouseEvent) {
  event.preventDefault()
  const { navigateTo } = useRefonteTransition()
  await navigateTo(props.to)
}
</script>

<template>
  <a :href="to" @click="onClick">
    <slot />
  </a>
</template>
