<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'

defineProps<{ project: PortfolioProject; index?: number }>()
</script>

<template>
  <article class="refonte-project-card refonte-card">
    <div class="refonte-project-card__top">
      <span class="refonte-label">{{ project.year }}</span>
      <span class="refonte-project-card__org">{{ project.org }}</span>
    </div>
    <h3 class="refonte-display refonte-project-card__title">{{ project.title }}</h3>
    <p class="refonte-project-card__summary">{{ project.summary }}</p>
    <ul class="refonte-project-card__stack">
      <li v-for="tech in project.stack.slice(0, 5)" :key="tech">{{ tech }}</li>
    </ul>
    <RefonteLink :to="`/refonte/projets/${project.slug}`" class="refonte-project-card__link">
      Voir l'étude →
    </RefonteLink>
  </article>
</template>

<style scoped>
.refonte-project-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 100%;
  transition: transform 0.35s var(--rf-ease), box-shadow 0.35s var(--rf-ease);
}

.refonte-project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 90px rgba(26, 22, 18, 0.16);
}

.refonte-project-card__top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
}

.refonte-project-card__org {
  font-size: 0.78rem;
  color: var(--rf-muted);
}

.refonte-project-card__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.refonte-project-card__summary {
  flex: 1;
  color: var(--rf-ink-soft);
  line-height: 1.6;
  font-size: 0.92rem;
}

.refonte-project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.refonte-project-card__stack li {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  background: rgba(26, 22, 18, 0.06);
}

.refonte-project-card__link {
  margin-top: 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-accent);
  text-decoration: none;
}
</style>
