<script setup lang="ts">
import DockItem from '@/components/desktop/DockItem.vue'
import { DESKTOP_ICONS, getDesktopApp } from '~/data/desktop-apps'
import type { DesktopAppId } from '~/data/desktop-apps'
import { useDesktopStore } from '@/store/useDesktop'

const desktop = useDesktopStore()

const emit = defineEmits<{
  open: [appId: DesktopAppId]
}>()

const dockApps = computed(() =>
  DESKTOP_ICONS.map((icon) => ({
    ...icon,
    icon: getDesktopApp(icon.appId).icon
  }))
)

const openAppIds = computed(() => {
  const ids = new Set<DesktopAppId>()
  for (const win of desktop.windows) {
    if (win.appId === 'project') ids.add('projets')
    else if (win.appId === 'experience') continue
    else ids.add(win.appId)
  }
  return ids
})

const minimizedAppIds = computed(() => {
  const ids = new Set<DesktopAppId>()
  for (const win of desktop.minimizedWindows) {
    if (win.appId === 'project') ids.add('projets')
    else if (win.appId === 'experience') continue
    else ids.add(win.appId)
  }
  return ids
})

function onDockOpen(appId: DesktopAppId) {
  const dockAppId = appId
  const existing = desktop.windows.find((w) => {
    if (w.appId === 'project') return dockAppId === 'projets'
    if (w.appId === 'experience') return false
    return w.appId === dockAppId
  })

  if (existing?.minimized) {
    desktop.restoreWindow(existing.id)
    return
  }

  if (existing && !existing.minimized) {
    desktop.minimizeWindow(existing.id)
    return
  }

  emit('open', appId)
}
</script>

<template>
  <nav
    class="dock fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]"
    aria-label="Dock applications"
  >
    <div class="dock-container flex items-end justify-center gap-1.5 px-3.5 py-2.5">
      <DockItem
        v-for="app in dockApps"
        :key="app.appId"
        :app-id="app.appId"
        :icon="app.icon"
        :label="app.label"
        :is-open="openAppIds.has(app.appId)"
        :is-minimized="minimizedAppIds.has(app.appId)"
        @open="onDockOpen"
      />
    </div>
  </nav>
</template>

<style scoped>
.dock-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
</style>
