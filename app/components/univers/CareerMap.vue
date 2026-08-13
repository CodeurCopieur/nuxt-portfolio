<script setup lang="ts">
import type { MapPin } from '~/utils/experience-map'
import CareerMapLeaflet from '@/components/univers/CareerMap.client.vue'

defineProps<{
  pins: MapPin[]
}>()

defineEmits<{
  select: [pin: MapPin]
}>()
</script>

<template>
  <CareerMapLeaflet :pins="pins" @select="$emit('select', $event)" />
</template>
