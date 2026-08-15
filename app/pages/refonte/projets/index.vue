<script setup lang="ts">
import { sortProjectsByYear } from '~/utils/sort-projects'

definePageMeta({ layout: 'refonte' })

const { meta, sections } = useContent()

useHead({
  title: computed(() => `Projets — ${meta.value.name}`)
})

const projects = computed(() => sortProjectsByYear(sections.value.projets))
</script>
<template>
  <section class="refonte-page" data-scroll-section>
    <div class="refonte-container">
      <p class="refonte-label">Portfolio</p>
      <h1 class="refonte-display refonte-page__title">Tous les projets</h1>
      <p class="refonte-page__lead">
        {{ projects.length }} réalisations — de l'intégration éditoriale aux interfaces animées.
      </p>

      <div class="refonte-page__grid">
        <RefonteProjectCard
          v-for="(project, index) in projects"
          :key="project.slug"
          :project="project"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.refonte-page {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.refonte-page__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0.35rem 0 0.75rem;
}

.refonte-page__lead {
  color: var(--rf-muted);
  max-width: 48ch;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.refonte-page__grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .refonte-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .refonte-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
