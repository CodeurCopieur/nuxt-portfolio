<script setup lang="ts">
import type { DesktopAppId } from '~/data/desktop-apps'

defineProps<{
  appId: DesktopAppId
  icon: string
  label: string
  x: number
  y: number
}>()

const emit = defineEmits<{
  open: [appId: DesktopAppId]
}>()

const selected = ref(false)

function onOpen(appId: DesktopAppId) {
  emit('open', appId)
}

function onKey(e: KeyboardEvent, appId: DesktopAppId) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    onOpen(appId)
  }
}
</script>

<template>
  <button
    type="button"
    class="desktop-icon absolute flex flex-col items-center gap-2 w-24 p-2 rounded-xl transition-all duration-200 outline-none group"
    :class="selected ? 'bg-white/20 ring-2 ring-white/30' : 'hover:bg-white/10'"
    :style="{ left: `${x}px`, top: `${y}px` }"
    @click="onOpen(appId)"
    @dblclick="onOpen(appId)"
    @focus="selected = true"
    @blur="selected = false"
    @keydown="onKey($event, appId)"
  >
    <div class="icon-tile w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
      {{ icon }}
    </div>
    <span class="text-xs font-medium text-white/90 text-center leading-tight drop-shadow-md px-1">
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.icon-tile {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
</style>
