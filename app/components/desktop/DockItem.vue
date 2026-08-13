<script setup lang="ts">
import type { DesktopAppId } from '~/data/desktop-apps'

const props = defineProps<{
  appId: DesktopAppId
  icon: string
  label: string
  isOpen?: boolean
  isMinimized?: boolean
}>()

const emit = defineEmits<{
  open: [appId: DesktopAppId]
}>()

const hovered = ref(false)

function onOpen() {
  emit('open', props.appId)
}
</script>

<template>
  <button
    type="button"
    class="dock-item group relative flex flex-col items-center gap-0.5 p-1 rounded-xl outline-none transition-transform duration-200 ease-out"
    :class="hovered ? 'scale-125 -translate-y-2' : 'scale-100'"
    :title="label"
    @click="onOpen"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focus="hovered = true"
    @blur="hovered = false"
  >
    <div
      class="dock-icon w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl transition-all duration-200"
      :class="isOpen ? 'dock-icon--active' : ''"
    >
      {{ icon }}
    </div>

    <!-- Point indicateur app ouverte (style macOS) -->
    <span
      v-if="isOpen"
      class="absolute -bottom-0.5 w-1 h-1 rounded-full"
      :class="isMinimized ? 'bg-white/35' : 'bg-white/80'"
    />

    <!-- Tooltip au survol -->
    <span
      v-if="hovered"
      class="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-[10px] text-white whitespace-nowrap pointer-events-none"
    >
      {{ label }}
    </span>
  </button>
</template>

<style scoped>
.dock-icon {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.dock-icon--active {
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
