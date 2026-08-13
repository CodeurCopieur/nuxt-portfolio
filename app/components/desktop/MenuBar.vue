<script setup lang="ts">
import { useGamificationStore } from '@/store/useGamification'
import { ZONES } from '~/data/gamification'

const { meta } = useContent()
const gamification = useGamificationStore()
const showQuests = ref(false)
const showControlCenter = useState('control-center-open', () => false)

function toggleControlCenter() {
  showControlCenter.value = !showControlCenter.value
  if (showControlCenter.value) showQuests.value = false
}

function toggleQuests() {
  showQuests.value = !showQuests.value
  if (showQuests.value) showControlCenter.value = false
}

const levelInfo = computed(() => gamification.levelInfo)
const time = ref('')
const dateStr = ref('')

function updateClock() {
  const now = new Date()
  time.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  dateStr.value = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

onMounted(() => {
  gamification.hydrate()
  updateClock()
  setInterval(updateClock, 30000)
})

const zoneProgress = computed(() =>
  ZONES.map((z) => ({
    ...z,
    done: gamification.visitedZones.includes(z.id)
  }))
)

defineEmits<{
  logout: []
}>()
</script>

<template>
  <header class="menu-bar fixed top-0 inset-x-0 z-[110] h-7 flex items-center px-3 text-[13px] text-white/90">
    <div class="flex items-center gap-3 min-w-0 flex-1">
      <button
        type="button"
        class="level-badge flex items-center gap-2 pl-1 pr-2.5 py-0.5 rounded-md hover:bg-white/10 transition-colors"
        @click="toggleQuests"
      >
        <div class="relative w-7 h-7 shrink-0">
          <svg class="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="3" />
            <circle
              cx="18" cy="18" r="15" fill="none"
              stroke="url(#xpGrad)" stroke-width="3" stroke-linecap="round"
              :stroke-dasharray="`${levelInfo.ratio * 94} 94`"
            />
            <defs>
              <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fbbf24" />
                <stop offset="100%" stop-color="#f97316" />
              </linearGradient>
            </defs>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold tabular-nums">
            {{ levelInfo.level }}
          </span>
        </div>
        <div class="hidden sm:block text-left leading-tight">
          <span class="block text-[11px] font-semibold">{{ levelInfo.title }}</span>
          <span class="block text-[10px] text-white/50 tabular-nums">{{ gamification.xp }} XP</span>
        </div>
      </button>

      <span class="hidden md:inline text-white/30">|</span>
      <span class="hidden md:inline font-semibold hover:bg-white/10 px-2 py-0.5 rounded-md cursor-default">WiddyOS</span>
      <span class="hidden lg:inline text-white/50">{{ meta.name }}</span>
    </div>

    <div class="flex items-center gap-1.5 shrink-0">
      <button
        type="button"
        class="control-center-trigger w-7 h-7 rounded-md flex items-center justify-center transition-colors"
        :class="showControlCenter ? 'control-center-trigger--active' : 'hover:bg-white/10'"
        aria-label="Centre de contrôle"
        :aria-expanded="showControlCenter"
        @click.stop="toggleControlCenter"
      >
        <svg class="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="1" y="2" width="6" height="2.5" rx="1.25" />
          <circle cx="11" cy="3.25" r="2" />
          <rect x="1" y="6.75" width="6" height="2.5" rx="1.25" />
          <circle cx="11" cy="8" r="2" />
          <rect x="1" y="11.5" width="6" height="2.5" rx="1.25" />
          <circle cx="11" cy="12.75" r="2" />
        </svg>
      </button>

      <NuxtLink
        to="/"
        class="hidden sm:inline px-2 py-0.5 rounded-md hover:bg-white/10 text-white/70 transition-colors text-[12px]"
      >
        Site classique
      </NuxtLink>
      <button
        type="button"
        class="px-2 py-0.5 rounded-md hover:bg-white/10 text-white/70 transition-colors text-[12px]"
        @click="$emit('logout')"
      >
        Déconnexion
      </button>
      <span class="text-[12px] font-medium tabular-nums text-white/80 px-1">
        {{ dateStr }} {{ time }}
      </span>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="showQuests"
        class="absolute top-8 left-3 w-[min(calc(100vw-1.5rem),300px)] rounded-xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl p-4 max-h-[50vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-xs font-bold">Quêtes</h3>
          <button type="button" class="text-white/40 hover:text-white text-xs" @click="showQuests = false">✕</button>
        </div>
        <p class="text-[11px] text-amber-300/90 mb-3">{{ gamification.nextQuestHint }}</p>
        <ul class="space-y-1.5">
          <li
            v-for="zone in zoneProgress"
            :key="zone.id"
            class="flex items-center gap-2 text-[11px]"
            :class="zone.done ? 'text-emerald-400/90' : 'text-white/55'"
          >
            <span class="w-3 text-center">{{ zone.done ? '✓' : '○' }}</span>
            <span>{{ zone.icon }} {{ zone.label }}</span>
            <span class="ml-auto text-white/30">+{{ zone.xp }}</span>
          </li>
        </ul>
        <p class="text-[10px] text-white/35 mt-3">{{ gamification.explorationPercent }}% exploré</p>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-bar {
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
}

.level-badge {
  font-family: inherit;
}

.control-center-trigger {
  color: rgba(255, 255, 255, 0.82);
}

.control-center-trigger--active {
  background: rgba(255, 255, 255, 0.18);
  color: white;
}
</style>
