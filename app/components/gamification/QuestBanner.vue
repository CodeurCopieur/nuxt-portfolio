<script setup lang="ts">
import { getZoneQuest, type ZoneId } from '~/data/gamification'
import { useGamificationStore } from '@/store/useGamification'

const props = defineProps<{
  zone: ZoneId
  chapter?: string
  subtitle?: string
}>()

const gamification = useGamificationStore()
const zoneDef = computed(() => getZoneQuest(props.zone))
const isComplete = computed(() => gamification.visitedZones.includes(props.zone))
</script>

<template>
  <div
    class="quest-banner inline-flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm mb-6"
    :class="
      isComplete
        ? 'border-emerald-300/60 dark:border-emerald-700/40 bg-emerald-50/80 dark:bg-emerald-900/20'
        : 'border-amber-300/60 dark:border-amber-700/40 bg-amber-50/80 dark:bg-amber-900/20'
    "
    role="status"
  >
    <div class="flex items-center gap-3 min-w-0">
      <span class="text-2xl shrink-0">{{ zoneDef?.icon ?? '🎮' }}</span>
      <div class="min-w-0">
        <p class="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          {{ chapter ?? 'Quête active' }}
          <span
            v-if="isComplete"
            class="ml-2 text-emerald-600 dark:text-emerald-400"
          >✓ Complétée</span>
        </p>
        <p class="font-semibold text-gray-900 dark:text-white truncate">
          {{ zoneDef?.questTitle }}
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ subtitle ?? zoneDef?.questDescription }}
        </p>
      </div>
    </div>
    <div
      v-if="!isComplete"
      class="shrink-0 sm:ml-auto px-3 py-1 rounded-full bg-amber-400/30 text-amber-800 dark:text-amber-200 text-xs font-bold"
    >
      +{{ zoneDef?.xp ?? 0 }} XP
    </div>
  </div>
</template>
