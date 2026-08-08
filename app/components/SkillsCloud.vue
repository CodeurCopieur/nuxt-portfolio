<script setup lang="ts">
import { useContent } from '@/composables/useContent'
import { sortCompetenceCategories } from '~/data/competence-categories'

const { sections } = useContent()
const competences = computed(() => sections.value.competences)
const categoryOrder = computed(() => sections.value.competences_order ?? [])

const visibleCategories = computed(() =>
  sortCompetenceCategories(categoryOrder.value)
    .map((cat) => ({
      ...cat,
      skills: competences.value[cat.key] ?? []
    }))
    .filter((cat) => cat.skills.length > 0)
)

const totalSkills = computed(() =>
  visibleCategories.value.reduce((sum, cat) => sum + cat.skills.length, 0)
)

const cloud = ref<HTMLElement | null>(null)
const { $gsap } = useNuxtApp()

const prefersReducedMotion = ref(false)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!cloud.value || prefersReducedMotion.value) return

  $gsap.fromTo(
    cloud.value.querySelectorAll('.skill-category'),
    { opacity: 0, y: 20, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
  )

  $gsap.fromTo(
    cloud.value.querySelectorAll('.skill-tag'),
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.35, stagger: 0.02, delay: 0.2, ease: 'power2.out' }
  )
})
</script>

<template>
  <div
    ref="cloud"
    role="region"
    aria-label="Compétences par catégorie"
  >
    <p class="sr-only">
      {{ totalSkills }} compétence{{ totalSkills > 1 ? 's' : '' }} répartie{{ totalSkills > 1 ? 's' : '' }}
      en {{ visibleCategories.length }} catégorie{{ visibleCategories.length > 1 ? 's' : '' }}.
    </p>

    <div
      v-if="visibleCategories.length"
      class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
    >
      <section
        v-for="cat in visibleCategories"
        :key="cat.key"
        class="skill-category group rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        :aria-labelledby="`skills-${cat.key}-title`"
      >
        <header class="mb-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <h3
                :id="`skills-${cat.key}-title`"
                class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
              >
                <span
                  class="w-2.5 h-2.5 rounded-full shrink-0"
                  :class="`dot-${cat.accent}`"
                  aria-hidden="true"
                />
                {{ cat.label }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ cat.description }}
              </p>
            </div>
            <span
              class="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full tabular-nums"
              :class="`badge-${cat.accent}`"
              :aria-label="`${cat.skills.length} compétence${cat.skills.length > 1 ? 's' : ''}`"
            >
              {{ cat.skills.length }}
            </span>
          </div>
        </header>

        <ul
          class="flex flex-wrap gap-2.5"
          :aria-label="`Compétences — ${cat.label}`"
        >
          <li
            v-for="skill in cat.skills"
            :key="skill"
          >
            <span
              class="skill-tag inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-medium text-white shadow-sm transition-transform duration-200 motion-safe:group-hover:scale-[1.02]"
              :class="`skill-gradient-${cat.accent}`"
            >
              {{ skill }}
            </span>
          </li>
        </ul>
      </section>
    </div>

    <p
      v-else
      class="text-center text-gray-500 dark:text-gray-400 py-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
      role="status"
    >
      Aucune compétence configurée pour le moment.
    </p>
  </div>
</template>

<style scoped>
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}

.dot-sky { @apply bg-sky-500; }
.dot-indigo { @apply bg-indigo-500; }
.dot-emerald { @apply bg-emerald-500; }
.dot-purple { @apply bg-purple-500; }
.dot-pink { @apply bg-pink-500; }
.dot-teal { @apply bg-teal-500; }
.dot-orange { @apply bg-orange-500; }
.dot-violet { @apply bg-violet-500; }

.badge-sky { @apply bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200; }
.badge-indigo { @apply bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200; }
.badge-emerald { @apply bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200; }
.badge-purple { @apply bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200; }
.badge-pink { @apply bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200; }
.badge-teal { @apply bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200; }
.badge-orange { @apply bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200; }
.badge-violet { @apply bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200; }

.skill-gradient-sky { @apply bg-gradient-to-r from-sky-500 to-blue-600; }
.skill-gradient-indigo { @apply bg-gradient-to-r from-indigo-500 to-violet-600; }
.skill-gradient-emerald { @apply bg-gradient-to-r from-emerald-500 to-teal-600; }
.skill-gradient-purple { @apply bg-gradient-to-r from-purple-500 to-fuchsia-600; }
.skill-gradient-pink { @apply bg-gradient-to-r from-pink-500 to-rose-600; }
.skill-gradient-teal { @apply bg-gradient-to-r from-teal-500 to-cyan-600; }
.skill-gradient-orange { @apply bg-gradient-to-r from-orange-500 to-amber-600; }
.skill-gradient-violet { @apply bg-gradient-to-r from-violet-500 to-purple-600; }

@media (prefers-reduced-motion: reduce) {
  .skill-tag {
    transition: none !important;
  }
}
</style>
