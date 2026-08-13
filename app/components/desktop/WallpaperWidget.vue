<script setup lang="ts">
import { useDesktopStore } from '@/store/useDesktop'
import { DESKTOP_WALLPAPERS } from '~/data/desktop-wallpapers'

const desktop = useDesktopStore()
const expanded = useState('wallpaper-widget-expanded', () => false)

const currentLabel = computed(() => {
  if (desktop.wallpaperId === 'custom') return 'Personnalisé'
  return DESKTOP_WALLPAPERS.find((item) => item.id === desktop.wallpaperId)?.label ?? 'Sonoma'
})
</script>

<template>
  <div class="wallpaper-widget fixed z-[105] top-9 left-3 select-auto pointer-events-auto">
    <div
      class="wallpaper-widget__panel overflow-hidden transition-all duration-300"
      :class="expanded ? 'wallpaper-widget__panel--open' : ''"
    >
      <div
        class="wallpaper-widget__accent"
        :style="{ background: desktop.wallpaperStyle.background }"
      />

      <div class="relative px-3 py-2.5 flex items-center gap-2.5">
        <span class="wallpaper-widget__icon shrink-0" aria-hidden="true">🎨</span>

        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-semibold text-white/95 leading-tight">Fond d’écran</p>
          <p class="text-[10px] text-white/50 truncate">{{ currentLabel }}</p>
        </div>

        <button
          type="button"
          class="wallpaper-widget__toggle shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors text-[10px]"
          :aria-label="expanded ? 'Réduire' : 'Choisir une couleur'"
          @click="expanded = !expanded"
        >
          {{ expanded ? '▲' : '▼' }}
        </button>
      </div>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-64"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 max-h-64"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="expanded" class="wallpaper-widget__body px-3 pb-3 border-t border-white/10">
          <p class="text-[10px] text-white/45 uppercase tracking-wider font-semibold mt-2 mb-2">
            Thèmes
          </p>
          <ul class="grid grid-cols-3 gap-2">
            <li v-for="wallpaper in DESKTOP_WALLPAPERS" :key="wallpaper.id">
              <button
                type="button"
                class="wallpaper-widget__swatch"
                :class="{ 'wallpaper-widget__swatch--active': desktop.wallpaperId === wallpaper.id }"
                :title="wallpaper.label"
                @click="desktop.setWallpaper(wallpaper.id)"
              >
                <span
                  class="wallpaper-widget__swatch-fill"
                  :style="{ background: wallpaper.background }"
                />
                <span class="wallpaper-widget__swatch-label">{{ wallpaper.label }}</span>
              </button>
            </li>
          </ul>

          <p class="text-[10px] text-white/45 uppercase tracking-wider font-semibold mt-3 mb-2">
            Couleur libre
          </p>
          <label class="wallpaper-widget__picker flex items-center gap-2.5">
            <input
              type="color"
              class="wallpaper-widget__color-input"
              :value="desktop.customWallpaperColor"
              @input="desktop.setCustomWallpaperColor(($event.target as HTMLInputElement).value)"
            >
            <span class="text-[11px] text-white/80 tabular-nums">{{ desktop.customWallpaperColor }}</span>
          </label>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.wallpaper-widget__panel {
  width: 220px;
  border-radius: 14px;
  background: rgba(8, 12, 28, 0.72);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.wallpaper-widget__panel--open {
  width: 248px;
}

.wallpaper-widget__accent {
  height: 3px;
  opacity: 0.95;
}

.wallpaper-widget__icon {
  font-size: 18px;
  line-height: 1;
}

.wallpaper-widget__swatch {
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

.wallpaper-widget__swatch-fill {
  display: block;
  height: 34px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  transition: border-color 0.15s, transform 0.15s;
}

.wallpaper-widget__swatch-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  line-height: 1.2;
}

.wallpaper-widget__swatch:hover .wallpaper-widget__swatch-fill {
  transform: scale(1.03);
  border-color: rgba(255, 255, 255, 0.28);
}

.wallpaper-widget__swatch--active .wallpaper-widget__swatch-fill {
  border-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.wallpaper-widget__swatch--active .wallpaper-widget__swatch-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.wallpaper-widget__color-input {
  width: 36px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
}

.wallpaper-widget__color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.wallpaper-widget__color-input::-webkit-color-swatch {
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
}
</style>
