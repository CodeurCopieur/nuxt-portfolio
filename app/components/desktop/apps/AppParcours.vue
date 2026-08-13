<script setup lang="ts">
import { buildMapPins, findPinById, type MapPin } from '~/utils/experience-map'
import { useDesktopStore } from '@/store/useDesktop'
import CareerMap from '@/components/univers/CareerMap.client.vue'
import ParcoursMissionOverlay from '@/components/desktop/apps/ParcoursMissionOverlay.vue'

const { sections } = useContent()
const desktop = useDesktopStore()

const mapRef = ref<{ invalidate: () => void } | null>(null)
const pins = computed(() => buildMapPins(sections.value.experiences))
const selectedPinId = ref<string | null>(null)

const selectedPin = computed(() =>
  selectedPinId.value ? findPinById(pins.value, selectedPinId.value) ?? null : null
)

function onPinSelect(pin: MapPin) {
  selectedPinId.value = pin.id
}

function closePanel() {
  selectedPinId.value = null
}

watch(selectedPinId, (id) => {
  desktop.setParcoursPinSelected(!!id)
  nextTick(() => mapRef.value?.invalidate())
})

onUnmounted(() => {
  desktop.setParcoursPinSelected(false)
})
</script>

<template>
  <div class="app-parcours h-full min-h-0 p-2">
    <div class="relative h-full min-h-[420px]">
      <CareerMap
        ref="mapRef"
        class="h-full"
        :pins="pins"
        :selected-pin-id="selectedPinId"
        :hide-legend="!!selectedPin"
        @select="onPinSelect"
      />

      <ParcoursMissionOverlay
        v-if="selectedPin"
        :pin="selectedPin"
        @close="closePanel"
      />
    </div>
  </div>
</template>
