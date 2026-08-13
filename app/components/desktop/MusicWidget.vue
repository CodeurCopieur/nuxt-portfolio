<script setup lang="ts">
const {
  tracks,
  currentIndex,
  currentTrack,
  isPlaying,
  loadError,
  volume,
  currentTime,
  duration,
  initTrack,
  toggle,
  prev,
  next,
  selectTrack,
  seek,
  setVolume,
  formatTime
} = useMusicPlayer()

const expanded = useState('music-widget-expanded', () => false)
const progressRef = ref<HTMLElement | null>(null)

const progress = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
)

function onProgressClick(e: MouseEvent) {
  const el = progressRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  seek((e.clientX - rect.left) / rect.width)
}

onMounted(() => {
  initTrack(currentIndex.value)
})
</script>

<template>
  <div
    class="music-widget fixed z-[105] top-9 right-3 select-auto pointer-events-auto"
    :style="{ '--accent': currentTrack.accent }"
  >
    <div
      class="music-widget__panel overflow-hidden transition-all duration-300"
      :class="expanded ? 'music-widget__panel--open' : 'music-widget__panel--mini'"
    >
      <!-- Bandeau accent -->
      <div class="music-widget__accent" :class="`bg-gradient-to-r ${currentTrack.coverGradient}`" />

      <!-- Mode compact (toujours visible) -->
      <div class="relative px-3 py-2.5 flex items-center gap-2.5">
        <button
          type="button"
          class="music-widget__play shrink-0"
          :class="isPlaying ? 'music-widget__play--active' : ''"
          aria-label="Lecture / Pause"
          @click="toggle()"
        >
          {{ isPlaying ? '⏸' : '▶' }}
        </button>

        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-semibold text-white/95 truncate leading-tight">
            {{ currentTrack.title }}
          </p>
          <p class="text-[10px] text-white/50 truncate">{{ currentTrack.artist }}</p>
        </div>

        <!-- Mini visualizer -->
        <div class="music-widget__bars shrink-0 flex items-end gap-0.5 h-4" aria-hidden="true">
          <span v-for="i in 4" :key="i" class="music-widget__bar" :class="isPlaying ? 'music-widget__bar--on' : ''" />
        </div>

        <button
          type="button"
          class="music-widget__toggle shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors text-[10px]"
          :aria-label="expanded ? 'Réduire' : 'Développer'"
          @click="expanded = !expanded"
        >
          {{ expanded ? '▲' : '▼' }}
        </button>
      </div>

      <!-- Panneau étendu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-48"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 max-h-48"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="expanded" class="music-widget__body px-3 pb-3 border-t border-white/10">
          <p v-if="loadError" class="mt-2 text-[10px] text-red-300">{{ loadError }}</p>

          <div
            ref="progressRef"
            class="mt-2.5 h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
            @click="onProgressClick"
          >
            <div
              class="h-full rounded-full transition-[width] duration-100 music-widget__progress"
              :style="{ width: `${progress}%` }"
            />
          </div>

          <div class="flex justify-between text-[9px] text-white/40 tabular-nums mt-1 mb-2.5">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <div class="flex items-center justify-center gap-3 mb-2.5">
            <button type="button" class="music-widget__ctrl" aria-label="Précédent" @click="prev()">⏮</button>
            <button type="button" class="music-widget__ctrl music-widget__ctrl--main" @click="toggle()">
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button type="button" class="music-widget__ctrl" aria-label="Suivant" @click="next()">⏭</button>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] opacity-50">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              class="music-widget__volume flex-1"
              @input="setVolume(Number(($event.target as HTMLInputElement).value))"
            >
            <span class="text-[9px] text-white/40 tabular-nums w-7">{{ Math.round(volume * 100) }}</span>
          </div>

          <ul v-if="tracks.length > 1" class="mt-2.5 max-h-24 overflow-y-auto space-y-0.5 music-widget__list">
            <li v-for="(track, i) in tracks" :key="track.id">
              <button
                type="button"
                class="w-full text-left px-2 py-1.5 rounded-lg text-[10px] transition-colors truncate"
                :class="currentIndex === i ? 'bg-white/15 text-white font-medium' : 'text-white/55 hover:bg-white/8'"
                @click="selectTrack(i)"
              >
                {{ track.title }} — {{ track.artist }}
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.music-widget__panel {
  width: 280px;
  border-radius: 14px;
  background: rgba(8, 12, 28, 0.72);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    0 0 24px color-mix(in srgb, var(--accent) 25%, transparent);
}

.music-widget__panel--open {
  width: 300px;
}

.music-widget__accent {
  height: 3px;
  opacity: 0.9;
}

.music-widget__play {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
}

.music-widget__play:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.music-widget__play--active {
  background: color-mix(in srgb, var(--accent) 35%, transparent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 40%, transparent);
}

.music-widget__bars {
  width: 18px;
}

.music-widget__bar {
  width: 3px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  transition: height 0.15s;
}

.music-widget__bar--on {
  animation: bar-bounce 0.6s ease-in-out infinite alternate;
  background: var(--accent);
}

.music-widget__bar:nth-child(1) { animation-delay: 0s; }
.music-widget__bar:nth-child(2) { animation-delay: 0.12s; }
.music-widget__bar:nth-child(3) { animation-delay: 0.24s; }
.music-widget__bar:nth-child(4) { animation-delay: 0.08s; }

@keyframes bar-bounce {
  from { height: 4px; }
  to { height: 14px; }
}

.music-widget__progress {
  background: linear-gradient(90deg, var(--accent), #fff);
}

.music-widget__ctrl {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.music-widget__ctrl:hover {
  background: rgba(255, 255, 255, 0.16);
}

.music-widget__ctrl--main {
  width: 40px;
  height: 40px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
}

.music-widget__volume {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
}

.music-widget__volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.music-widget__list {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
</style>
