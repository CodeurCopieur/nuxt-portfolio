<script setup lang="ts">
import { useGamificationStore } from '@/store/useGamification'
import { useDesktopStore } from '@/store/useDesktop'
import { ZONES } from '~/data/gamification'

const desktop = useDesktopStore()
const gamification = useGamificationStore()
const showQuests = ref(false)

const levelInfo = computed(() => gamification.levelInfo)
const time = ref('')

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  updateClock()
  setInterval(updateClock, 30000)
})

const zoneProgress = computed(() =>
  ZONES.map((z) => ({
    ...z,
    done: gamification.visitedZones.includes(z.id)
  }))
)
</script>

<template>
  <footer class="taskbar fixed bottom-0 inset-x-0 z-[100] h-[52px] flex items-center px-3 gap-2">
    <button
      type="button"
      class="taskbar-logo shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white hover:scale-105 transition-transform"
      title="WiddyOS"
      @click="showQuests = !showQuests"
    >
      W
    </button>

    <div class="flex items-center gap-1 overflow-x-auto flex-1 min-w-0 px-1">
      <button
        v-for="win in desktop.taskbarWindows"
        :key="win.id"
        type="button"
        class="taskbar-app shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all max-w-[160px]"
        :class="[
          desktop.focusedId === win.id && !win.minimized
            ? 'taskbar-app--active'
            : 'taskbar-app--idle',
          win.minimized ? 'opacity-60' : ''
        ]"
        @click="win.minimized ? desktop.focusWindow(win.id) : desktop.minimizeWindow(win.id)"
      >
        <span>{{ win.icon }}</span>
        <span class="truncate">{{ win.title }}</span>
      </button>
    </div>

    <div class="shrink-0 flex items-center gap-3 px-2">
      <div class="hidden sm:flex items-center gap-2 min-w-[140px]">
        <div class="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            :style="{ width: `${levelInfo.ratio * 100}%` }"
          />
        </div>
        <span class="text-[10px] font-bold text-amber-300 tabular-nums whitespace-nowrap">
          Nv.{{ levelInfo.level }}
        </span>
      </div>

      <NuxtLink
        to="/"
        class="hidden md:inline text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
      >
        Site classique
      </NuxtLink>

      <span class="text-xs font-medium text-white/70 tabular-nums w-12 text-right">{{ time }}</span>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showQuests"
        class="absolute bottom-14 left-3 w-[min(calc(100vw-1.5rem),320px)] rounded-2xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl p-4 max-h-[50vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-white">Quêtes & XP</h3>
          <button type="button" class="text-white/40 hover:text-white text-xs" @click="showQuests = false">✕</button>
        </div>
        <p class="text-xs text-amber-300 mb-3">{{ gamification.nextQuestHint }}</p>
        <ul class="space-y-2">
          <li
            v-for="zone in zoneProgress"
            :key="zone.id"
            class="flex items-center gap-2 text-xs"
            :class="zone.done ? 'text-emerald-400' : 'text-white/60'"
          >
            <span>{{ zone.done ? '✓' : '○' }}</span>
            <span>{{ zone.icon }} {{ zone.label }}</span>
            <span class="ml-auto text-white/30">+{{ zone.xp }} XP</span>
          </li>
        </ul>
        <p class="text-[10px] text-white/30 mt-3">{{ gamification.explorationPercent }}% exploré · {{ gamification.xp }} XP</p>
      </div>
    </Transition>
  </footer>
</template>

<style scoped>
.taskbar {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.taskbar-logo {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.taskbar-app--active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.taskbar-app--idle {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
}

.taskbar-app--idle:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
