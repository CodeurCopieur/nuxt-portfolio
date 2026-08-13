<script setup lang="ts">
import { ZONES, ACHIEVEMENTS, HOME_SECTIONS } from '~/data/gamification'
import { useGamificationStore } from '@/store/useGamification'

const gamification = useGamificationStore()
const expanded = ref(false)
const showBoard = ref(false)

const levelInfo = computed(() => gamification.levelInfo)

const zoneProgress = computed(() =>
  ZONES.map((zone) => ({
    ...zone,
    done: gamification.visitedZones.includes(zone.id)
  }))
)

const sectionProgress = computed(() =>
  HOME_SECTIONS.map((section) => ({
    ...section,
    done: gamification.homeSectionsSeen.includes(section.id)
  }))
)

const achievementList = computed(() =>
  ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: gamification.unlockedAchievements.includes(a.id)
  }))
)
</script>

<template>
  <div class="gamification-hud fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2 pointer-events-none">
    <!-- Toast handled separately -->

    <!-- Quest board -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="showBoard"
        class="pointer-events-auto w-[min(100vw-2rem,340px)] max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl p-4 mb-2"
        role="dialog"
        aria-label="Tableau de quêtes"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">Quêtes & Succès</h3>
          <button
            type="button"
            class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Fermer"
            @click="showBoard = false"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Exploration : <strong class="text-sky-600 dark:text-sky-400">{{ gamification.explorationPercent }}%</strong>
        </p>

        <div class="space-y-4">
          <section>
            <h4 class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Zones</h4>
            <ul class="space-y-1.5">
              <li
                v-for="zone in zoneProgress"
                :key="zone.id"
                class="flex items-center gap-2 text-xs"
                :class="zone.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'"
              >
                <span>{{ zone.icon }}</span>
                <span class="flex-1">{{ zone.label }}</span>
                <span>{{ zone.done ? '✓' : '…' }}</span>
              </li>
            </ul>
          </section>

          <section>
            <h4 class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Accueil</h4>
            <ul class="space-y-1.5">
              <li
                v-for="section in sectionProgress"
                :key="section.id"
                class="flex items-center gap-2 text-xs"
                :class="section.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'"
              >
                <span class="flex-1">{{ section.title }}</span>
                <span>{{ section.done ? '✓' : '…' }}</span>
              </li>
            </ul>
          </section>

          <section>
            <h4 class="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Succès</h4>
            <ul class="space-y-2">
              <li
                v-for="ach in achievementList"
                :key="ach.id"
                class="flex items-start gap-2 text-xs rounded-lg p-2"
                :class="ach.unlocked ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800/50 opacity-60'"
              >
                <span class="text-base leading-none">{{ ach.icon }}</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">{{ ach.title }}</p>
                  <p class="text-gray-500 dark:text-gray-400">{{ ach.description }}</p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Transition>

    <!-- HUD compact -->
    <div
      class="pointer-events-auto flex items-center gap-2 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg pl-3 pr-2 py-2"
    >
      <button
        type="button"
        class="flex items-center gap-2 min-w-0"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <div class="relative shrink-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            {{ levelInfo.level }}
          </div>
        </div>
        <div
          v-if="expanded"
          class="text-left min-w-[120px] max-w-[160px]"
        >
          <p class="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold truncate">
            {{ levelInfo.title }}
          </p>
          <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mt-1 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              :style="{ width: `${levelInfo.ratio * 100}%` }"
            />
          </div>
          <p class="text-[10px] text-gray-400 mt-0.5 tabular-nums">{{ gamification.xp }} XP</p>
        </div>
      </button>

      <button
        type="button"
        class="p-2 rounded-xl text-gray-500 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
        :aria-label="showBoard ? 'Fermer les quêtes' : 'Ouvrir les quêtes'"
        @click="showBoard = !showBoard"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </button>
    </div>

    <p
      v-if="expanded && !showBoard"
      class="pointer-events-none text-[10px] text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/60 dark:border-gray-700/60 max-w-[220px] text-right"
    >
      {{ gamification.nextQuestHint }}
    </p>
  </div>
</template>
