<script setup lang="ts">
import { useDesktopStore } from '@/store/useDesktop'
import OsWindow from '@/components/desktop/OsWindow.vue'

const desktop = useDesktopStore()
</script>

<template>
  <div class="window-manager absolute inset-x-0 top-7 bottom-[88px] pointer-events-none">
    <OsWindow
      v-for="win in desktop.windows"
      v-show="!win.minimized"
      :key="win.id"
      :window="win"
      class="pointer-events-auto"
    />
  </div>
</template>
