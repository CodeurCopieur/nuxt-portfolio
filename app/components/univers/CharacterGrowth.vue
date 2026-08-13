<script setup lang="ts">
const props = defineProps<{
  stats: {
    level: number
    xp: number
    maxXp: number
    power: number
    frontEnd: number
    animation: number
    leadership: number
    skillsUnlocked: number
    experiencesCompleted: number
  }
  characterName: string
  selectedCompany: string | null
}>()

const charRef = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

const titles = [
  'Apprenti intégrateur',
  'Intégrateur confirmé',
  'Développeur Front-End',
  'Expert Front-End',
  'Maître du code',
  'Légende du web'
]

const title = computed(() => titles[Math.min(props.stats.level, titles.length - 1)] ?? titles[0])

const scale = computed(() => 0.75 + props.stats.level * 0.08)
const muscleWidth = computed(() => 8 + props.stats.level * 2)
const auraOpacity = computed(() => 0.15 + props.stats.level * 0.08)

watch(
  () => props.stats.level,
  () => {
    if (!charRef.value) return
    $gsap.fromTo(
      charRef.value,
      { scale: 0.9 },
      { scale: 1, duration: 0.5, ease: 'back.out(2)' }
    )
  }
)

const statBars = computed(() => [
  { label: 'Front-End', value: props.stats.frontEnd, color: 'from-sky-500 to-blue-600' },
  { label: 'Animation', value: props.stats.animation, color: 'from-purple-500 to-fuchsia-600' },
  { label: 'Leadership', value: props.stats.leadership, color: 'from-emerald-500 to-teal-600' },
  { label: 'Puissance', value: props.stats.power, color: 'from-amber-500 to-orange-600' }
])
</script>

<template>
  <div class="character-growth rounded-3xl border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 shadow-sm">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Niveau {{ stats.level }}
        </p>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
          {{ title }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ characterName }}
        </p>
      </div>
      <div class="text-right shrink-0">
        <p class="text-2xl font-black tabular-nums bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
          {{ stats.power }}
        </p>
        <p class="text-[10px] uppercase tracking-wider text-gray-400">Power</p>
      </div>
    </div>

    <!-- Personnage SVG -->
    <div
      ref="charRef"
      class="relative flex justify-center py-6"
    >
      <!-- Aura -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
        :style="{ opacity: auraOpacity }"
      >
        <div
          class="w-32 h-32 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 blur-2xl animate-pulse"
        />
      </div>

      <svg
        viewBox="0 0 120 160"
        class="relative z-[1] h-40 w-auto transition-transform duration-500"
        :style="{ transform: `scale(${scale})` }"
        aria-hidden="true"
      >
        <!-- Level stars -->
        <g v-for="i in Math.min(stats.level, 5)" :key="i">
          <polygon
            :points="`${20 + i * 20},8 ${22 + i * 20},14 ${28 + i * 20},14 ${23 + i * 20},18 ${25 + i * 20},24 ${20 + i * 20},20 ${15 + i * 20},24 ${17 + i * 20},18 ${12 + i * 20},14 ${18 + i * 20},14`"
            class="fill-amber-400"
            :opacity="0.5 + i * 0.1"
          />
        </g>

        <!-- Body (gets wider with level) -->
        <ellipse
          cx="60"
          :cy="95 + stats.level * 2"
          :rx="22 + stats.level * 2"
          :ry="28 + stats.level * 3"
          class="fill-sky-500 dark:fill-sky-600"
        />

        <!-- Arms (muscle grows) -->
        <ellipse
          cx="30"
          cy="88"
          :rx="muscleWidth"
          :ry="6 + stats.level"
          class="fill-sky-600 dark:fill-sky-700"
          transform="rotate(-20 30 88)"
        />
        <ellipse
          cx="90"
          cy="88"
          :rx="muscleWidth"
          :ry="6 + stats.level"
          class="fill-sky-600 dark:fill-sky-700"
          transform="rotate(20 90 88)"
        />

        <!-- Head -->
        <circle
          cx="60"
          cy="45"
          :r="18 + stats.level * 0.5"
          class="fill-amber-200 dark:fill-amber-300 stroke-amber-400"
          stroke-width="1"
        />

        <!-- Eyes (determined at higher levels) -->
        <circle cx="52" cy="42" r="2.5" class="fill-gray-800" />
        <circle cx="68" cy="42" r="2.5" class="fill-gray-800" />
        <path
          v-if="stats.level >= 3"
          d="M 50 52 Q 60 58 70 52"
          fill="none"
          class="stroke-gray-700"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          v-else
          x1="52"
          y1="52"
          x2="68"
          y2="52"
          class="stroke-gray-600"
          stroke-width="1"
        />

        <!-- Cape at high level -->
        <path
          v-if="stats.level >= 4"
          d="M 35 70 Q 20 100 25 140 Q 60 130 95 140 Q 100 100 85 70 Z"
          class="fill-indigo-500/70 dark:fill-indigo-600/70"
        />

        <!-- Keyboard / tool -->
        <rect
          x="42"
          y="108"
          :width="36 + stats.level * 2"
          height="8"
          rx="2"
          class="fill-gray-700 dark:fill-gray-600"
        />
      </svg>
    </div>

    <!-- XP bar -->
    <div class="mb-5">
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>XP</span>
        <span class="tabular-nums">{{ stats.xp }} / {{ stats.maxXp }}</span>
      </div>
      <div class="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          class="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
          :style="{ width: `${Math.min(100, (stats.xp / stats.maxXp) * 100)}%` }"
        />
      </div>
    </div>

    <!-- Stats -->
    <div class="space-y-2.5">
      <div
        v-for="bar in statBars"
        :key="bar.label"
      >
        <div class="flex justify-between text-xs mb-1">
          <span class="text-gray-600 dark:text-gray-400">{{ bar.label }}</span>
          <span class="font-semibold text-gray-800 dark:text-gray-200 tabular-nums">{{ bar.value }}</span>
        </div>
        <div class="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r transition-all duration-700"
            :class="bar.color"
            :style="{ width: `${bar.value}%` }"
          />
        </div>
      </div>
    </div>

    <p
      v-if="selectedCompany"
      class="mt-4 text-xs text-center text-sky-600 dark:text-sky-400 font-medium animate-pulse"
    >
      +XP après {{ selectedCompany }} !
    </p>

    <p class="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500">
      {{ stats.skillsUnlocked }} compétences · {{ stats.experiencesCompleted }} expérience{{ stats.experiencesCompleted > 1 ? 's' : '' }}
    </p>
  </div>
</template>
