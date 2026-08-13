<script setup lang="ts">
import { buildMapPins, findPinById } from '~/utils/experience-map'

import { useDesktopStore } from '@/store/useDesktop'

const props = defineProps<{
  payload?: { pinId?: string }
}>()

const { sections } = useContent()
const desktop = useDesktopStore()
const { $gsap } = useNuxtApp()

const rootRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)

const pins = computed(() => buildMapPins(sections.value.experiences))
const pin = computed(() =>
  props.payload?.pinId ? findPinById(pins.value, props.payload.pinId) : undefined
)

const companyGradients: Record<string, string> = {
  'Société Générale': 'from-blue-600 via-blue-700 to-indigo-800',
  Mazarine: 'from-purple-600 via-fuchsia-600 to-pink-700',
  Cyllene: 'from-emerald-500 via-teal-600 to-cyan-700',
  'Le Point': 'from-orange-500 via-red-500 to-rose-600',
  'France Télévision': 'from-red-600 via-rose-600 to-pink-700'
}

const gradient = computed(() =>
  pin.value ? companyGradients[pin.value.company] ?? 'from-slate-600 to-slate-800' : ''
)

watch(
  () => props.payload?.pinId,
  async () => {
    if (!pin.value) return
    const win = desktop.windows.find((w) => w.id === desktop.focusedId)
    if (win?.appId === 'experience') win.title = pin.value.company

    await nextTick()
    if (!rootRef.value || !headerRef.value || !bodyRef.value) return

    const tl = $gsap.timeline()
    tl.fromTo(rootRef.value, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    tl.fromTo(
      headerRef.value,
      { y: -24, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
      '-=0.05'
    )
    tl.fromTo(
      bodyRef.value.querySelectorAll('[data-anim]'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out' },
      '-=0.25'
    )
    tl.fromTo(
      bodyRef.value.querySelectorAll('[data-tag]'),
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, stagger: 0.03, ease: 'back.out(2)' },
      '-=0.2'
    )
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="pin" ref="rootRef" class="app-experience h-full overflow-y-auto bg-gray-950">
    <div
      ref="headerRef"
      class="relative p-5 text-white bg-gradient-to-br overflow-hidden"
      :class="gradient"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
      <div class="relative flex items-start justify-between gap-3">
        <div>
          <p class="text-[11px] font-medium opacity-90 flex items-center gap-1.5">
            <span>📍</span> {{ pin.location }}
          </p>
          <h2 class="text-xl font-bold mt-1 tracking-tight">{{ pin.company }}</h2>
          <p class="text-sm opacity-90 mt-0.5">{{ pin.experience.role }}</p>
          <p class="text-xs opacity-75 mt-2">{{ pin.experience.period }}</p>
        </div>
        <div class="shrink-0 flex flex-col items-center gap-1">
          <span class="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg font-black">
            {{ pin.level }}
          </span>
          <span class="text-[9px] uppercase tracking-wider opacity-70">Niveau</span>
        </div>
      </div>
    </div>

    <div ref="bodyRef" class="p-5 space-y-5">
      <section data-anim>
        <h3 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Résumé</h3>
        <p class="text-sm text-white/75 leading-relaxed">{{ pin.experience.summary }}</p>
      </section>

      <section v-if="pin.experience.missions?.length" data-anim>
        <h3 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Missions clés</h3>
        <ul class="space-y-2">
          <li
            v-for="(mission, i) in pin.experience.missions"
            :key="i"
            class="flex gap-2.5 text-sm text-white/65"
          >
            <span class="shrink-0 w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold">
              {{ i + 1 }}
            </span>
            <span>{{ mission }}</span>
          </li>
        </ul>
      </section>

      <section v-if="pin.experience.stack?.length" data-anim>
        <h3 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Compétences acquises</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tech in pin.experience.stack"
            :key="tech"
            data-tag
            class="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/10 text-white/80 border border-white/10"
          >
            {{ tech }}
          </span>
        </div>
      </section>

      <section v-if="pin.experience.clients?.length" data-anim>
        <h3 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Clients</h3>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="client in pin.experience.clients"
            :key="client"
            data-tag
            class="px-2 py-0.5 text-[11px] rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
          >
            {{ client }}
          </span>
        </div>
      </section>

      <section v-if="pin.experience.tags?.length" data-anim>
        <h3 class="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-2">Tags</h3>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in pin.experience.tags"
            :key="tag"
            data-tag
            class="px-2 py-0.5 text-[11px] rounded-full bg-amber-500/15 text-amber-300"
          >
            {{ tag }}
          </span>
        </div>
      </section>

      <a
        v-if="pin.experience.links?.[0]"
        data-anim
        :href="pin.experience.links[0]"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-sm font-medium transition-colors border border-sky-500/25"
      >
        Voir le site
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-full min-h-[200px] text-white/40 text-sm p-6">
    Expérience introuvable.
  </div>
</template>
