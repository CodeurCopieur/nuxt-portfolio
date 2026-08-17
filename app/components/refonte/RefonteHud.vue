<script setup lang="ts">
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const { cursor } = useRefonteScroll()

const clock = ref('--:--')
let clockTimer: ReturnType<typeof setInterval> | null = null

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function updateClock() {
  const now = new Date()
  clock.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 30_000)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

const cursorLabel = computed(() => `${pad(cursor.value.x)} X ${pad(cursor.value.y)} Y`)
</script>

<template>
  <aside class="refonte-hud" aria-hidden="true">
    <div class="refonte-hud__row refonte-hud__row--meta">
      <span>{{ clock }}</span>
      <span>GMT+1 FR</span>
    </div>

    <div class="refonte-hud__row">
      <span class="refonte-hud__coords">{{ cursorLabel }}</span>
    </div>
  </aside>
</template>

<style scoped>
.refonte-hud {
  position: fixed;
  left: max(0.75rem, env(safe-area-inset-left));
  bottom: max(0.75rem, env(safe-area-inset-bottom));
  z-index: 95;
  pointer-events: none;
  display: grid;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rf-text-soft);
}

.refonte-hud__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  align-items: baseline;
}

.refonte-hud__row--meta {
  color: var(--rf-text-muted);
}

.refonte-hud__coords {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 639px) {
  .refonte-hud {
    left: 0.5rem;
    bottom: 0.5rem;
    font-size: 0.62rem;
  }

  .refonte-hud__coords {
    display: none;
  }
}
</style>
