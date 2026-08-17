<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'
import { sortProjectsByYear } from '~/utils/sort-projects'

const { sections } = useContent()

const activeTech = ref<string | null>(null)

const allProjects = computed(() => sortProjectsByYear(sections.value.projets))

const techFilters = computed(() => {
  const catalog = sections.value.filtres_technologies ?? []
  if (catalog.length) return catalog

  const set = new Set<string>()
  for (const project of allProjects.value) {
    project.stack.forEach((item) => set.add(item))
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'fr'))
})

function projectMatchesTech(project: PortfolioProject, tech: string) {
  const needle = tech.toLowerCase()
  return (
    project.stack.some((item) => item.toLowerCase() === needle)
    || project.tags.some((item) => item.toLowerCase() === needle)
  )
}

function countForTech(tech: string) {
  return allProjects.value.filter((project) => projectMatchesTech(project, tech)).length
}

const filteredProjects = computed(() => {
  if (!activeTech.value) return allProjects.value
  return allProjects.value.filter((project) => projectMatchesTech(project, activeTech.value!))
})

function selectTech(tech: string | null) {
  activeTech.value = activeTech.value === tech ? null : tech
}
</script>

<template>
  <div class="rf-projects">
    <div class="refonte-container rf-projects__head">
      <span class="rf-projects__ghost" aria-hidden="true">02</span>
      <p class="refonte-label" v-reveal>Archives</p>
      <h1 class="refonte-display rf-projects__title" v-reveal="{ delay: 60 }">Tous les projets</h1>
      <p class="rf-projects__lead" v-reveal="{ delay: 120 }">
        {{ allProjects.length }} réalisations — filtrez par technologie pour cibler une stack.
      </p>
    </div>

    <div class="refonte-container rf-projects__filters">
      <div class="rf-projects__filters-track">
        <div class="rf-projects__tabs" role="group" aria-label="Filtrer par technologie">
          <button
            type="button"
            class="rf-projects__tab"
            :class="{ 'is-active': !activeTech }"
            @click="selectTech(null)"
          >
            Tous
          </button>
          <button
            v-for="tech in techFilters"
            :key="tech"
            type="button"
            class="rf-projects__tab"
            :class="{ 'is-active': activeTech === tech, 'is-disabled': countForTech(tech) === 0 }"
            :disabled="countForTech(tech) === 0"
            @click="selectTech(tech)"
          >
            {{ tech }}
          </button>
        </div>
      </div>
      <p class="rf-projects__count" aria-live="polite">
        {{ filteredProjects.length }} projet{{ filteredProjects.length > 1 ? 's' : '' }}
      </p>
    </div>

    <div class="refonte-container rf-projects__body">
      <p v-if="!filteredProjects.length" class="rf-projects__empty">
        Aucun projet pour cette technologie.
      </p>

      <div v-else class="rf-projects__list">
        <RefonteProjectCard
          v-for="(project, index) in filteredProjects"
          :key="project.slug"
          :project="project"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rf-projects {
  padding-block: clamp(3rem, 8vw, 5rem);
}

.rf-projects__head {
  position: relative;
}

.rf-projects__ghost {
  position: absolute;
  top: -2rem;
  right: 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(4rem, 12vw, 9rem);
  color: var(--rf-text);
  opacity: 0.06;
  pointer-events: none;
  line-height: 1;
}

.rf-projects__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0.35rem 0 0.75rem;
  position: relative;
}

.rf-projects__lead {
  max-width: 48ch;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--rf-text-soft);
  position: relative;
}

.rf-projects__filters {
  margin-top: clamp(2rem, 5vw, 3rem);
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--rf-line);
}

.rf-projects__filters-track {
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 0.65rem;
}

.rf-projects__filters-track::-webkit-scrollbar {
  display: none;
}

.rf-projects__tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 1.5rem;
  min-width: min-content;
}

.rf-projects__tab {
  flex-shrink: 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  padding: 0.35rem 0;
  color: var(--rf-text-muted);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
  transition: color 0.2s var(--rf-ease), border-color 0.2s var(--rf-ease);
}

.rf-projects__tab:hover:not(:disabled):not(.is-active) {
  color: var(--rf-text-soft);
}

.rf-projects__tab.is-active {
  color: var(--rf-accent);
  border-color: var(--rf-accent);
}

.rf-projects__tab.is-disabled,
.rf-projects__tab:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.rf-projects__count {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
  font-variant-numeric: tabular-nums;
}

.rf-projects__body {
  margin-top: 0.5rem;
}

.rf-projects__empty {
  margin: 0;
  padding: 2rem 0;
  text-align: center;
  color: var(--rf-text-soft);
}

.rf-projects__list {
  display: block;
}
</style>
