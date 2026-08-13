<script setup lang="ts">
import type { MapPin } from '~/utils/experience-map'

const props = defineProps<{
  pin: MapPin | null
}>()

const companyColors: Record<string, string> = {
  'Société Générale': 'from-blue-500 to-blue-700',
  'Mazarine': 'from-purple-500 to-pink-600',
  'Cyllene': 'from-emerald-500 to-teal-600',
  'Le Point': 'from-orange-500 to-red-600',
  'France Télévision': 'from-red-500 to-rose-600'
}

const gradient = computed(() =>
  props.pin ? companyColors[props.pin.company] ?? 'from-gray-500 to-gray-700' : ''
)

const panelRef = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

watch(
  () => props.pin?.id,
  async () => {
    await nextTick()
    if (!panelRef.value || !props.pin) return
    $gsap.fromTo(
      panelRef.value,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    )
  }
)
</script>

<template>
  <div
    ref="panelRef"
    class="experience-spot-panel rounded-3xl border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm overflow-hidden shadow-sm min-h-[320px]"
  >
    <!-- État vide -->
    <div
      v-if="!pin"
      class="flex flex-col items-center justify-center h-full min-h-[320px] p-8 text-center"
    >
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Choisissez un lieu
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        Sélectionnez un point sur la carte pour voir ce que j'y ai accompli et les compétences développées.
      </p>
    </div>

    <!-- Détail expérience -->
    <div v-else>
      <div
        class="p-5 text-white bg-gradient-to-r"
        :class="gradient"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium opacity-90 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {{ pin.location }}
            </p>
            <h3 class="text-xl font-bold mt-1">{{ pin.company }}</h3>
            <p class="text-sm opacity-90 mt-0.5">{{ pin.experience.role }}</p>
          </div>
          <span class="shrink-0 px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold">
            Nv. {{ pin.level }}
          </span>
        </div>
        <p class="text-xs opacity-80 mt-2">{{ pin.experience.period }}</p>
      </div>

      <div class="p-5 space-y-5 max-h-[420px] overflow-y-auto">
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Ce que j'ai fait
          </h4>
          <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ pin.experience.summary }}
          </p>
        </section>

        <section v-if="pin.experience.missions?.length">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Missions clés
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(mission, i) in pin.experience.missions.slice(0, 4)"
              :key="i"
              class="flex gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span class="text-sky-500 shrink-0">▸</span>
              <span>{{ mission }}</span>
            </li>
          </ul>
        </section>

        <section v-if="pin.experience.stack?.length">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Compétences acquises
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in pin.experience.stack"
              :key="tech"
              class="px-2.5 py-1 text-xs font-medium rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200"
            >
              {{ tech }}
            </span>
          </div>
        </section>

        <section v-if="pin.experience.clients?.length">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Clients
          </h4>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="client in pin.experience.clients"
              :key="client"
              class="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {{ client }}
            </span>
          </div>
        </section>

        <a
          v-if="pin.experience.links?.[0]"
          :href="pin.experience.links[0]"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400 hover:underline"
        >
          Voir le site
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
