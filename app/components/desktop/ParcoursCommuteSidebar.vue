<script setup lang="ts">
import { buildMapPins } from '~/utils/experience-map'
import { getCareerPinPalette } from '~/utils/career-pin-colors'
import { useDesktopStore } from '@/store/useDesktop'
import {
  buildCommuteLegs,
  formatDistanceKm,
  type CommuteLeg
} from '~/utils/commute-distances'

const desktop = useDesktopStore()
const { sections } = useContent()

const pins = computed(() => buildMapPins(sections.value.experiences))
const animatedKm = ref<Record<string, number>>({})
const revealed = ref<Record<string, boolean>>({})

const legs = computed(() => buildCommuteLegs(pins.value))
const maxKm = computed(() => Math.max(...legs.value.map((leg) => leg.distanceKm), 1))
const totalKm = computed(() =>
  Math.round(legs.value.reduce((sum, leg) => sum + leg.distanceKm, 0) * 10) / 10
)
const animatedTotal = ref(0)

function paletteFor(leg: CommuteLeg) {
  return getCareerPinPalette(leg.level)
}

function animateValue(
  key: string,
  target: number,
  delayMs: number,
  durationMs = 900,
  onDone?: () => void
) {
  setTimeout(() => {
    revealed.value[key] = true
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      animatedKm.value[key] = Math.round(target * eased * 10) / 10
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        animatedKm.value[key] = target
        onDone?.()
      }
    }
    requestAnimationFrame(tick)
  }, delayMs)
}

function runAnimations() {
  animatedKm.value = {}
  revealed.value = {}
  animatedTotal.value = 0

  legs.value.forEach((leg, index) => {
    animateValue(leg.legId, leg.distanceKm, 280 + index * 140)
  })

  animateValue('total', totalKm.value, 280 + legs.value.length * 140 + 180, 700, () => {
    animatedTotal.value = totalKm.value
  })
}

watch(
  () => desktop.parcoursCommuteKey,
  () => {
    if (desktop.parcoursCommuteActive) {
      nextTick(() => runAnimations())
    }
  }
)

watch(
  () => desktop.parcoursCommuteActive,
  (active) => {
    if (active) nextTick(() => runAnimations())
  }
)

watch(
  pins,
  () => {
    if (desktop.parcoursCommuteActive) runAnimations()
  },
  { deep: true }
)
</script>

<template>
  <Transition name="commute-sidebar">
    <aside
      v-if="desktop.parcoursCommuteActive"
      :key="desktop.parcoursCommuteKey"
      class="commute-sidebar fixed top-7 right-0 bottom-[88px] z-[620] w-[min(100vw,400px)] pointer-events-none flex items-center justify-end py-4 pr-4"
      aria-label="Trajets domicile bureau"
    >
      <div
        class="commute-sidebar__panel flex flex-col w-full max-h-full pointer-events-auto"
        @mousedown.stop
        @click.stop
      >
        <header class="commute-sidebar__header shrink-0 px-5 py-5 relative z-[1]">
          <h2 class="text-lg font-bold text-white/95">Trajets</h2>
          <p class="commute-sidebar__route mt-2" aria-label="Domicile vers bureau">
            <span class="commute-sidebar__emoji" aria-hidden="true">🏠</span>
            <span class="commute-sidebar__route-arrow" aria-hidden="true">→</span>
            <span class="commute-sidebar__emoji" aria-hidden="true">🏢</span>
          </p>
        </header>

        <div class="commute-sidebar__body overflow-y-auto px-5 py-4">
          <ol class="commute-sidebar__list space-y-3">
            <li
              v-for="leg in legs"
              :key="leg.legId"
              class="commute-sidebar__row"
              :class="{ 'commute-sidebar__row--visible': revealed[leg.legId] }"
              :style="{ '--exp-color': paletteFor(leg).swatch, '--exp-ring': paletteFor(leg).ring }"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="min-w-0 flex items-start gap-2.5">
                  <span
                    class="commute-sidebar__exp-dot shrink-0 mt-0.5"
                    :style="{
                      background: paletteFor(leg).swatch,
                      boxShadow: `0 0 0 2px ${paletteFor(leg).ring}`
                    }"
                  />
                  <div class="min-w-0">
                    <p class="text-[12px] font-semibold text-white leading-snug">
                      {{ leg.company }}
                    </p>
                    <p class="commute-sidebar__home mt-1.5">
                      <span class="commute-sidebar__emoji" aria-hidden="true">🏠</span>
                      <span class="truncate">{{ leg.fromLabel }}</span>
                      <span class="commute-sidebar__route-arrow" aria-hidden="true">→</span>
                      <span class="commute-sidebar__emoji" aria-hidden="true">🏢</span>
                      <span class="truncate">{{ leg.location }}</span>
                    </p>
                  </div>
                </div>
                <span
                  class="commute-sidebar__km shrink-0 tabular-nums"
                  :style="{ color: paletteFor(leg).swatch }"
                >
                  {{ formatDistanceKm(animatedKm[leg.legId] ?? 0) }} km
                </span>
              </div>
              <div class="commute-sidebar__track">
                <div
                  class="commute-sidebar__fill"
                  :style="{
                    width: `${((animatedKm[leg.legId] ?? 0) / maxKm) * 100}%`,
                    background: paletteFor(leg).swatch
                  }"
                />
              </div>
            </li>
          </ol>
        </div>

        <footer class="commute-sidebar__footer shrink-0 px-5 py-4">
          <p class="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Total estimé</p>
          <p class="text-xl font-bold text-white/90 tabular-nums">
            {{ formatDistanceKm(animatedKm.total ?? animatedTotal) }} km
          </p>
        </footer>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.commute-sidebar__panel {
  overflow: hidden;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.35);
  max-height: calc(100vh - 7rem - 88px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.commute-sidebar__route {
  display: flex;
  align-items: center;
  gap: 6px;
}

.commute-sidebar__emoji {
  font-size: 15px;
  line-height: 1;
  flex-shrink: 0;
}

.commute-sidebar__route-arrow {
  font-size: 12px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0;
}

.commute-sidebar__header {
  position: relative;
  background: transparent;
  border-bottom: none;
}

.commute-sidebar__header::before {
  display: none;
}

.commute-sidebar__body {
  flex: 0 1 auto;
  min-height: 0;
  background: transparent;
}

.commute-sidebar__list {
  padding: 4px 2px;
}

.commute-sidebar__row {
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s ease;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 3px 0 0 var(--exp-color, rgba(255, 255, 255, 0.3));
  outline: none;
}

.commute-sidebar__row:hover {
  background: rgba(255, 255, 255, 0.07);
}

.commute-sidebar__row--visible {
  opacity: 1;
  transform: translateX(0);
}

.commute-sidebar__exp-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

.commute-sidebar__home {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 5px;
  font-size: 11px;
  color: #fff;
  min-width: 0;
}

.commute-sidebar__km {
  font-size: 13px;
  font-weight: 700;
}

.commute-sidebar__track {
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.commute-sidebar__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.15s linear;
  opacity: 0.9;
}

.commute-sidebar__footer {
  background: transparent;
  border-top: none;
}

.commute-sidebar-enter-active,
.commute-sidebar-leave-active {
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
}

.commute-sidebar-enter-from,
.commute-sidebar-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.commute-sidebar-enter-to,
.commute-sidebar-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
