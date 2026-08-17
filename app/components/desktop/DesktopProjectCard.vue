<!-- Carte projet WiddyOS uniquement — le site classique utilise ProjectCard.vue -->
<script setup lang="ts">
import { useGamificationStore } from '@/store/useGamification'

const props = defineProps<{
  p: { slug: string; title: string; year?: string; org?: string; summary?: string; stack?: string[]; tags?: string[]; cover?: string; link?: string; github?: string }
  compact?: boolean
}>()

const emit = defineEmits<{ open: [] }>()

const gamification = useGamificationStore()
const isCompleted = computed(() => gamification.viewedProjects.includes(props.p.slug))

const cardRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!cardRef.value) return
  const gsap = await useGsap()
  gsap.fromTo(cardRef.value, { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' })
})
</script>

<template>
  <button
    ref="cardRef"
    type="button"
    class="group block relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-xl w-full text-left"
    :class="compact ? 'app-projet-card--compact' : 'rounded-3xl hover:scale-[1.02] hover:shadow-2xl duration-500'"
    @click="emit('open')"
  >
    <template v-if="compact">
      <div class="flex items-stretch min-h-[4.25rem]">
        <div class="relative w-[4.25rem] shrink-0 overflow-hidden">
          <img
            v-if="p.cover"
            :src="p.cover"
            :alt="p.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <svg class="w-7 h-7 text-sky-400 dark:text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0 p-2.5 flex flex-col justify-center">
          <div class="flex items-start justify-between gap-1 mb-0.5">
            <h3 class="text-[11px] font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400">
              {{ p.title }}
            </h3>
            <span class="text-[9px] font-semibold text-gray-500 dark:text-gray-400 shrink-0">{{ p.year }}</span>
          </div>
          <p class="text-[10px] text-sky-600 dark:text-sky-400 truncate">{{ p.org }}</p>
          <div class="mt-1 flex items-center justify-between gap-1">
            <span
              class="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              :class="isCompleted ? 'bg-emerald-500/90 text-white' : 'bg-amber-400/90 text-amber-950'"
            >
              {{ isCompleted ? '✓' : '⚔️' }}
            </span>
            <span v-if="p.stack?.length" class="text-[9px] text-gray-500 dark:text-gray-400 truncate">
              {{ p.stack.slice(0, 2).join(' · ') }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
    <div class="relative overflow-hidden aspect-video">
      <img
        v-if="p.cover"
        :src="p.cover"
        :alt="p.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center">
        <svg class="w-16 h-16 text-sky-400 dark:text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div
        class="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-bold rounded-full backdrop-blur-sm"
        :class="isCompleted ? 'bg-emerald-500/90 text-white' : 'bg-amber-400/90 text-amber-950'"
      >
        {{ isCompleted ? '✓ Mission' : '⚔️ Mission' }}
      </div>
      <div class="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-full">
        {{ p.year }}
      </div>
    </div>
    <div class="p-6">
      <div class="mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 mb-2">
          {{ p.title }}
        </h3>
        <p class="text-sm font-medium text-sky-600 dark:text-sky-400">{{ p.org }}</p>
      </div>
      <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{{ p.summary }}</p>
      <div v-if="p.stack?.length" class="mb-4 flex flex-wrap gap-2">
        <span
          v-for="tech in p.stack.slice(0, 3)"
          :key="tech"
          class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600"
        >
          {{ tech }}
        </span>
        <span
          v-if="p.stack.length > 3"
          class="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium rounded-full"
        >
          +{{ p.stack.length - 3 }}
        </span>
      </div>
    </div>
    </template>
  </button>
</template>
