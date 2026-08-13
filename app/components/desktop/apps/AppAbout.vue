<script setup lang="ts">
const { meta, sections } = useContent()

const highlights = computed(() => sections.value.a_propos.highlights ?? [])
</script>

<template>
  <div class="app-about p-6 text-white">
    <div class="flex items-start gap-5 mb-6">
      <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-black shrink-0 shadow-lg shadow-orange-500/30">
        {{ meta.name.charAt(0) }}
      </div>
      <div>
        <h2 class="text-2xl font-bold">{{ meta.name }}</h2>
        <p class="text-sky-400 font-medium">{{ meta.role }}</p>
        <p class="text-white/40 text-sm mt-1">{{ meta.location }} · {{ meta.years_experience }}+ ans</p>
      </div>
    </div>

    <p class="text-white/70 leading-relaxed mb-6">{{ sections.a_propos.bio }}</p>

    <div v-if="highlights.length" class="mb-6">
      <h3 class="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Points forts</h3>
      <ul class="space-y-2">
        <li
          v-for="(h, i) in highlights"
          :key="i"
          class="flex items-start gap-2 text-sm text-white/80"
        >
          <span class="text-emerald-400 shrink-0">✦</span>
          {{ h }}
        </li>
      </ul>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <a
        v-if="meta.links.linkedin"
        :href="meta.links.linkedin"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
      >
        <span>💼</span> LinkedIn
      </a>
      <a
        v-if="meta.links.github"
        :href="meta.links.github"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
      >
        <span>🐙</span> GitHub
      </a>
      <a
        :href="`mailto:${meta.email}`"
        class="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-colors"
      >
        <span>✉️</span> Email
      </a>
      <span class="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">
        <span>🟢</span> {{ sections.a_propos.availability }}
      </span>
    </div>
  </div>
</template>
