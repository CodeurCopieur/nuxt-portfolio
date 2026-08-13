<script setup lang="ts">
import { useDesktopStore } from '@/store/useDesktop'
import { DESKTOP_WALLPAPERS } from '~/data/desktop-wallpapers'

const desktop = useDesktopStore()
const open = useState('control-center-open', () => false)
const panelRef = ref<HTMLElement | null>(null)

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

const progressRef = ref<HTMLElement | null>(null)

const progress = computed(() =>
  duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
)

const currentWallpaperLabel = computed(() => {
  if (desktop.wallpaperId === 'custom') return 'Personnalisé'
  return DESKTOP_WALLPAPERS.find((item) => item.id === desktop.wallpaperId)?.label ?? 'Sonoma'
})

function onProgressClick(e: MouseEvent) {
  const el = progressRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  seek((e.clientX - rect.left) / rect.width)
}

function onDocumentClick(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as Node
  if (panelRef.value?.contains(target)) return
  if ((e.target as Element).closest?.('.control-center-trigger')) return
  open.value = false
}

onMounted(() => {
  initTrack(currentIndex.value)
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div class="control-center fixed z-[105] top-8 right-3 select-auto pointer-events-none">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        ref="panelRef"
        class="cc-panel pointer-events-auto overflow-hidden"
        :style="{ '--accent': currentTrack.accent }"
        @click.stop
      >
        <!-- Musique -->
        <div class="cc-accent" :class="`bg-gradient-to-r ${currentTrack.coverGradient}`" />

        <div class="px-3 py-2.5 flex items-center gap-2.5">
          <button
            type="button"
            class="cc-play shrink-0"
            :class="isPlaying ? 'cc-play--active' : ''"
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

          <div class="cc-bars shrink-0 flex items-end gap-0.5 h-4" aria-hidden="true">
            <span v-for="i in 4" :key="i" class="cc-bar" :class="isPlaying ? 'cc-bar--on' : ''" />
          </div>
        </div>

        <div class="px-3 pb-3 border-t border-white/10">
          <p v-if="loadError" class="mt-2 text-[10px] text-red-300">{{ loadError }}</p>

          <div
            ref="progressRef"
            class="mt-2.5 h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
            @click="onProgressClick"
          >
            <div class="h-full rounded-full cc-progress" :style="{ width: `${progress}%` }" />
          </div>

          <div class="flex justify-between text-[9px] text-white/40 tabular-nums mt-1 mb-2.5">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>

          <div class="flex items-center justify-center gap-3 mb-2.5">
            <button type="button" class="cc-ctrl" aria-label="Précédent" @click="prev()">⏮</button>
            <button type="button" class="cc-ctrl cc-ctrl--main" @click="toggle()">
              {{ isPlaying ? '⏸' : '▶' }}
            </button>
            <button type="button" class="cc-ctrl" aria-label="Suivant" @click="next()">⏭</button>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] opacity-50">🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="volume"
              class="cc-volume flex-1"
              @input="setVolume(Number(($event.target as HTMLInputElement).value))"
            >
            <span class="text-[9px] text-white/40 tabular-nums w-7">{{ Math.round(volume * 100) }}</span>
          </div>

          <ul v-if="tracks.length > 1" class="mt-2.5 max-h-20 overflow-y-auto space-y-0.5 cc-list">
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

        <!-- Fond d'écran -->
        <div
          class="cc-accent cc-accent--wall"
          :style="{ background: desktop.wallpaperStyle.background }"
        />

        <div class="px-3 py-2 border-t border-white/10">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-base leading-none" aria-hidden="true">🎨</span>
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-semibold text-white/95 leading-tight">Fond d'écran</p>
              <p class="text-[10px] text-white/50 truncate">{{ currentWallpaperLabel }}</p>
            </div>
          </div>

          <ul class="grid grid-cols-3 gap-2">
            <li v-for="wallpaper in DESKTOP_WALLPAPERS" :key="wallpaper.id">
              <button
                type="button"
                class="cc-swatch"
                :class="{ 'cc-swatch--active': desktop.wallpaperId === wallpaper.id }"
                :title="wallpaper.label"
                @click="desktop.setWallpaper(wallpaper.id)"
              >
                <span class="cc-swatch__fill" :style="{ background: wallpaper.background }" />
                <span class="cc-swatch__label">{{ wallpaper.label }}</span>
              </button>
            </li>
          </ul>

          <label class="flex items-center gap-2.5 mt-2.5">
            <input
              type="color"
              class="cc-color"
              :value="desktop.customWallpaperColor"
              @input="desktop.setCustomWallpaperColor(($event.target as HTMLInputElement).value)"
            >
            <span class="text-[11px] text-white/80 tabular-nums">{{ desktop.customWallpaperColor }}</span>
          </label>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cc-panel {
  width: 260px;
  border-radius: 14px;
  background: rgba(8, 12, 28, 0.72);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    0 0 24px color-mix(in srgb, var(--accent) 25%, transparent);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
}

.cc-accent {
  height: 3px;
  opacity: 0.9;
}

.cc-accent--wall {
  opacity: 0.95;
}

.cc-play {
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

.cc-play:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.cc-play--active {
  background: color-mix(in srgb, var(--accent) 35%, transparent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 40%, transparent);
}

.cc-bars {
  width: 18px;
}

.cc-bar {
  width: 3px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
  transition: height 0.15s;
}

.cc-bar--on {
  animation: cc-bar-bounce 0.6s ease-in-out infinite alternate;
  background: var(--accent);
}

.cc-bar:nth-child(1) { animation-delay: 0s; }
.cc-bar:nth-child(2) { animation-delay: 0.12s; }
.cc-bar:nth-child(3) { animation-delay: 0.24s; }
.cc-bar:nth-child(4) { animation-delay: 0.08s; }

@keyframes cc-bar-bounce {
  from { height: 4px; }
  to { height: 14px; }
}

.cc-progress {
  background: linear-gradient(90deg, var(--accent), #fff);
}

.cc-ctrl {
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

.cc-ctrl:hover {
  background: rgba(255, 255, 255, 0.16);
}

.cc-ctrl--main {
  width: 40px;
  height: 40px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
}

.cc-volume {
  -webkit-appearance: none;
  appearance: none;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  outline: none;
}

.cc-volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.cc-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.cc-swatch {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.cc-swatch__fill {
  display: block;
  height: 30px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  transition: border-color 0.15s, transform 0.15s;
}

.cc-swatch__label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  line-height: 1.2;
}

.cc-swatch:hover .cc-swatch__fill {
  transform: scale(1.03);
  border-color: rgba(255, 255, 255, 0.28);
}

.cc-swatch--active .cc-swatch__fill {
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.cc-swatch--active .cc-swatch__label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.cc-color {
  width: 36px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.cc-color::-webkit-color-swatch-wrapper {
  padding: 0;
}

.cc-color::-webkit-color-swatch {
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
}
</style>
