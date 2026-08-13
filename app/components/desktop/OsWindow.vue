<script setup lang="ts">
import type { DesktopWindow } from '@/store/useDesktop'
import { useDesktopStore } from '@/store/useDesktop'
import { getDesktopApp } from '~/data/desktop-apps'

const props = defineProps<{
  window: DesktopWindow
}>()

const desktop = useDesktopStore()
const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0, winX: 0, winY: 0 })

const isFocused = computed(() => desktop.focusedId === props.window.id)
const appTheme = computed(() => getDesktopApp(props.window.appId))

const chromeStyle = computed(() => ({
  '--win-glow': appTheme.value.windowGlow
}))

function onTitleMouseDown(e: MouseEvent) {
  if (props.window.maximized) return
  desktop.focusWindow(props.window.id)
  dragging.value = true
  dragStart.value = {
    x: e.clientX,
    y: e.clientY,
    winX: props.window.x,
    winY: props.window.y
  }
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  desktop.moveWindow(props.window.id, dragStart.value.winX + dx, dragStart.value.winY + dy)
}

function onMouseUp() {
  dragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

const windowStyle = computed(() => {
  if (props.window.maximized) {
    return {
      left: '0px',
      top: '0px',
      width: '100%',
      height: 'calc(100% - 0px)',
      zIndex: props.window.zIndex
    }
  }
  return {
    left: `${props.window.x}px`,
    top: `${props.window.y}px`,
    width: `${props.window.width}px`,
    height: `${props.window.height}px`,
    zIndex: props.window.zIndex
  }
})

const appComponent = computed(() => {
  const map: Record<string, ReturnType<typeof defineAsyncComponent>> = {
    about: defineAsyncComponent(() => import('@/components/desktop/apps/AppAbout.vue')),
    parcours: defineAsyncComponent(() => import('@/components/desktop/apps/AppParcours.vue')),
    skills: defineAsyncComponent(() => import('@/components/desktop/apps/AppSkills3D.vue')),
    projets: defineAsyncComponent(() => import('@/components/desktop/apps/AppProjets.vue')),
    mail: defineAsyncComponent(() => import('@/components/desktop/apps/AppMail.vue')),
    project: defineAsyncComponent(() => import('@/components/desktop/apps/AppProjectDetail.vue')),
    experience: defineAsyncComponent(() => import('@/components/desktop/apps/AppExperienceDetail.vue'))
  }
  return map[props.window.appId]
})
</script>

<template>
  <div
    class="os-window absolute flex flex-col overflow-hidden transition-all duration-200"
    :class="[
      isFocused ? 'os-window--focused' : 'os-window--blurred',
      dragging ? 'select-none' : ''
    ]"
    :style="{ ...windowStyle, ...chromeStyle }"
    @mousedown="desktop.focusWindow(window.id)"
  >
    <header
      class="os-chrome shrink-0 flex items-center h-9 px-3 cursor-default"
      @mousedown="onTitleMouseDown"
    >
      <div class="flex items-center gap-2 shrink-0 z-10">
        <button
          type="button"
          class="traffic traffic-minimize"
          aria-label="Réduire"
          title="Réduire"
          @click.stop="desktop.minimizeWindow(window.id)"
        />
        <button
          type="button"
          class="traffic traffic-maximize"
          aria-label="Agrandir"
          @click.stop="desktop.toggleMaximize(window.id)"
        />
      </div>
      <div class="os-chrome__drag flex-1 h-full min-w-0" aria-hidden="true" />
    </header>

    <div
      class="os-content flex-1 min-h-0 overflow-hidden flex flex-col"
      :class="window.appId === 'projets' ? 'os-content--no-scroll' : ''"
    >
      <Suspense>
        <div class="os-app-shell flex-1 min-h-0 overflow-hidden flex flex-col">
          <component
            :is="appComponent"
            :payload="window.payload"
          />
        </div>
        <template #fallback>
          <div class="flex items-center justify-center h-full min-h-[200px] text-white/50 text-sm">
            Chargement…
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
.os-window {
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 24px 48px -12px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.os-window--focused {
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow:
    0 28px 56px -12px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(255, 255, 255, 0.06);
}

.os-window--blurred {
  opacity: 0.9;
  filter: saturate(0.9);
}

.os-chrome {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.os-chrome::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  pointer-events: none;
}

.os-chrome::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--win-glow),
    transparent
  );
  opacity: 0.55;
  pointer-events: none;
}

.os-window--focused .os-chrome::after {
  opacity: 0.55;
}

.os-window--blurred .os-chrome::after {
  opacity: 0;
}

.os-chrome__drag {
  -webkit-app-region: no-drag;
}

.traffic {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.traffic:hover {
  transform: scale(1.12);
  filter: brightness(1.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.traffic-minimize {
  background: linear-gradient(180deg, #ffcc3a, #febc2e);
}

.traffic-maximize {
  background: linear-gradient(180deg, #34d058, #28c840);
}

.os-content {
  background: rgba(8, 12, 24, 0.45);
  backdrop-filter: blur(16px);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.os-content--no-scroll {
  overflow: clip;
}

.os-app-shell {
  contain: layout style;
}
</style>
