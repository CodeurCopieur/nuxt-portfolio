<script setup lang="ts">
import type { MapPin } from '~/utils/experience-map'

defineProps<{
  pin: MapPin
}>()

defineEmits<{
  close: []
}>()

const companyGradients: Record<string, string> = {
  'Société Générale': 'from-blue-600/90 to-indigo-800/90',
  Mazarine: 'from-purple-600/90 to-pink-700/90',
  Cyllene: 'from-emerald-500/90 to-cyan-700/90',
  'Le Point': 'from-orange-500/90 to-rose-600/90',
  'France Télévision': 'from-red-600/90 to-pink-700/90',
  'France Télévisions': 'from-red-600/90 to-pink-700/90'
}

function gradientFor(company: string) {
  return companyGradients[company] ?? 'from-slate-600/90 to-slate-800/90'
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-250 ease-out"
    enter-from-class="opacity-0 -translate-x-3"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 -translate-x-3"
  >
    <aside
      class="parcours-overlay absolute left-3 top-3 bottom-3 z-[500] w-[min(calc(100%-1.5rem),380px)] flex flex-col rounded-2xl overflow-hidden border border-white/12 shadow-2xl pointer-events-auto"
      @mousedown.stop
      @click.stop
    >
      <div
        class="shrink-0 p-4 bg-gradient-to-br text-white relative"
        :class="gradientFor(pin.company)"
      >
        <button
          type="button"
          class="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/25 hover:bg-black/40 text-white/90 text-xs flex items-center justify-center transition-colors"
          aria-label="Fermer"
          @click="$emit('close')"
        >
          ✕
        </button>
        <p class="text-[11px] text-white/80 flex items-center gap-1.5 pr-8">
          <span>📍</span> {{ pin.location }}
        </p>
        <h3 class="text-base font-bold mt-1.5 leading-snug pr-6">{{ pin.company }}</h3>
        <p class="text-sm text-white/90 mt-0.5">{{ pin.experience.role }}</p>
        <p class="text-[11px] text-white/65 mt-1.5">{{ pin.experience.period }}</p>
      </div>

      <div class="parcours-overlay__body flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-black/55 backdrop-blur-xl">
        <section>
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1.5">Résumé</h4>
          <p class="text-sm text-white/75 leading-relaxed">{{ pin.experience.summary }}</p>
        </section>

        <section v-if="pin.experience.missions?.length">
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1.5">Missions clés</h4>
          <ul class="space-y-2.5">
            <li
              v-for="(mission, i) in pin.experience.missions"
              :key="i"
              class="flex gap-2.5 text-sm text-white/70 leading-snug"
            >
              <span class="shrink-0 w-5 h-5 rounded-md bg-sky-500/20 text-sky-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                {{ i + 1 }}
              </span>
              <span>{{ mission }}</span>
            </li>
          </ul>
        </section>

        <section v-if="pin.experience.stack?.length">
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1.5">Stack</h4>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in pin.experience.stack"
              :key="tech"
              class="px-2 py-0.5 text-[11px] rounded-md bg-white/10 text-white/80 border border-white/10"
            >
              {{ tech }}
            </span>
          </div>
        </section>

        <section v-if="pin.experience.clients?.length">
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1.5">Clients</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="client in pin.experience.clients"
              :key="client"
              class="px-2 py-0.5 text-[11px] rounded-md bg-indigo-500/15 text-indigo-300"
            >
              {{ client }}
            </span>
          </div>
        </section>

        <section v-if="pin.experience.tags?.length">
          <h4 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1.5">Tags</h4>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="tag in pin.experience.tags"
              :key="tag"
              class="px-2 py-0.5 text-[11px] rounded-full bg-amber-500/15 text-amber-300"
            >
              {{ tag }}
            </span>
          </div>
        </section>

        <a
          v-if="pin.experience.links?.[0]"
          :href="pin.experience.links[0]"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-sm font-medium border border-sky-500/25 transition-colors"
        >
          Voir le site
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.parcours-overlay__body {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
</style>
