<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'

const props = defineProps<{ to: string }>()
const { navigateTo } = useRefonteTransition()

async function onClick(event: MouseEvent) {
  event.preventDefault()
  await navigateTo(props.to)
}
</script>

<template>
  <a :href="to" class="refonte-link" @click="onClick">
    <slot />
  </a>
</template>
