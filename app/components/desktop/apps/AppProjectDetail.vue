<script setup lang="ts">
import { useDesktopStore } from '@/store/useDesktop'

const props = defineProps<{
  payload?: { slug?: string }
}>()

const { sections } = useContent()
const desktop = useDesktopStore()

const project = computed(() =>
  sections.value.projets.find((p) => p.slug === props.payload?.slug)
)

watch(
  project,
  (p) => {
    if (p) {
      const win = desktop.windows.find((w) => w.id === desktop.focusedId)
      if (win?.appId === 'project') win.title = p.title
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="project" class="app-project p-6 text-white">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">Projet</span>
        <h2 class="text-xl font-bold mt-1">{{ project.title }}</h2>
        <p class="text-sm text-sky-400">{{ project.org }} · {{ project.year }}</p>
      </div>
    </div>

    <p class="text-white/70 text-sm leading-relaxed mb-5">{{ project.summary }}</p>

    <div class="mb-5">
      <h3 class="text-xs font-bold uppercase text-white/40 mb-2">Stack</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in project.stack"
          :key="tech"
          class="px-2.5 py-1 text-xs rounded-lg bg-white/10 text-white/80"
        >
          {{ tech }}
        </span>
      </div>
    </div>

    <div v-if="project.tags?.length" class="mb-5 flex flex-wrap gap-2">
      <span
        v-for="tag in project.tags"
        :key="tag"
        class="px-2 py-0.5 text-[10px] rounded bg-indigo-500/20 text-indigo-300"
      >
        {{ tag }}
      </span>
    </div>

    <div class="flex flex-wrap gap-3">
      <a
        v-if="project.link"
        :href="project.link"
        target="_blank"
        rel="noopener"
        class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors"
      >
        Voir le projet →
      </a>
      <a
        v-if="project.github"
        :href="project.github"
        target="_blank"
        rel="noopener"
        class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
      >
        Code source
      </a>
    </div>
  </div>
  <div v-else class="p-6 text-white/50 text-sm">Projet introuvable.</div>
</template>
