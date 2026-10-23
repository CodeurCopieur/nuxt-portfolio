<script setup lang="ts">
import { sortProjectsByYear } from '~/utils/sort-projects'

definePageMeta({ layout: 'refonte' })

const route = useRoute()
const { meta, sections } = useLocalizedContent()
const { ui } = useUi()

const sortedProjects = computed(() => sortProjectsByYear(sections.value.projets))

const project = computed(() =>
  sortedProjects.value.find((p) => p.slug === route.params.slug)
)

const index = computed(() =>
  sortedProjects.value.findIndex((p) => p.slug === route.params.slug)
)

watchEffect(() => {
  if (sections.value.projets.length && !project.value) {
    throw createError({ statusCode: 404, statusMessage: ui.value.case.missing })
  }
})

const pageTitle = computed(() => `${project.value?.title ?? ui.value.case.fallback} — ${meta.value.name}`)
const pageDescription = computed(() => project.value?.summary?.trim() || ui.value.seo.homeFallback)

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription
})

function pad(n: number) {
  return String(n + 1).padStart(2, '0')
}
</script>

<template>
  <article v-if="project" class="rf-case refonte-section" data-scroll-section>
    <span class="rf-case__ghost" aria-hidden="true">{{ pad(index) }}</span>

    <div class="refonte-container rf-case__inner">
      <RefonteLink to="/projets" class="rf-case__back" v-reveal>{{ ui.case.back }}</RefonteLink>

      <header class="rf-case__head">
        <p class="refonte-label" v-reveal="{ delay: 40 }">{{ project.year }} · {{ project.org }}</p>
        <h1 class="refonte-display rf-case__title" v-reveal="{ delay: 90 }">{{ project.title }}</h1>
        <p class="rf-case__summary" v-reveal="{ delay: 140 }">{{ project.summary }}</p>
      </header>

      <div class="rf-case__meta">
        <div v-reveal="{ index: 0, total: 3, stagger: 80 }">
          <span class="refonte-label">{{ ui.case.stack }}</span>
          <ul>
            <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
          </ul>
        </div>
        <div v-if="project.tags?.length" v-reveal="{ index: 1, total: 3, stagger: 80 }">
          <span class="refonte-label">{{ ui.case.tags }}</span>
          <ul>
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
        <div class="rf-case__links" v-reveal="{ index: 2, total: 3, stagger: 80 }">
          <a v-if="project.link" :href="project.link" target="_blank" rel="noopener">{{ ui.case.live }}</a>
          <a v-if="project.github" :href="project.github" target="_blank" rel="noopener">{{ ui.case.github }}</a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.rf-case {
  position: relative;
  overflow: clip;
}

.rf-case__ghost {
  position: absolute;
  top: 0;
  right: 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(4rem, 14vw, 11rem);
  line-height: 1;
  color: var(--rf-text);
  opacity: 0.05;
  pointer-events: none;
}

.rf-case__inner {
  position: relative;
}

.rf-case__back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-text-soft);
  text-decoration: none;
}

.rf-case__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0.35rem 0 0.75rem;
}

.rf-case__summary {
  max-width: 58ch;
  line-height: 1.7;
  color: var(--rf-text-soft);
  font-size: 1.05rem;
}

.rf-case__meta {
  margin-top: var(--rf-section-gap);
  padding-top: clamp(1.5rem, 4vw, 2rem);
  border-top: 1px solid var(--rf-line);
  display: grid;
  gap: var(--rf-block-gap);
}

@media (min-width: 768px) {
  .rf-case__meta {
    grid-template-columns: 1fr 1fr auto;
    align-items: start;
  }
}

.rf-case__meta ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.rf-case__meta li {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--rf-line);
  color: var(--rf-text-soft);
}

.rf-case__links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rf-case__links a {
  color: var(--rf-accent);
  font-weight: 700;
  text-decoration: none;
}
</style>
