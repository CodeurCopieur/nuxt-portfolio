<script setup lang="ts">
import type { PortfolioProject } from '~/types/portfolio'

const props = defineProps<{ project: PortfolioProject; index?: number }>()

function pad(n: number) {
  return String(n + 1).padStart(3, '0')
}
</script>

<template>
  <RefonteLink
    :to="`/refonte/projets/${project.slug}`"
    class="rf-prow"
    v-reveal="{ index: (index ?? 0) % 5, stagger: 55 }"
  >
    <span class="rf-prow__num">{{ pad(index ?? 0) }}</span>

    <span class="rf-prow__main">
      <span class="rf-prow__title">{{ project.title }}</span>
      <span class="rf-prow__summary">{{ project.summary }}</span>
    </span>

    <span class="rf-prow__side">
      <span class="rf-prow__org">{{ project.org }} · {{ project.year }}</span>
      <span v-if="project.stack.length" class="rf-prow__stack">
        <span v-for="tech in project.stack.slice(0, 4)" :key="tech">{{ tech }}</span>
      </span>
    </span>

    <span class="rf-prow__arrow" aria-hidden="true">→</span>
  </RefonteLink>
</template>

<style scoped>
.rf-prow {
  display: grid;
  grid-template-columns: 3.5rem 1fr auto 2rem;
  gap: 1.5rem;
  align-items: center;
  padding-block: clamp(1.5rem, 3.5vw, 2.25rem);
  border-bottom: 1px solid var(--rf-line);
  text-decoration: none;
  color: inherit;
  transition: padding-left 0.35s var(--rf-ease);
}

.rf-prow.refonte-link::after {
  display: none;
}

.rf-prow:hover,
.rf-prow:focus-visible {
  padding-left: 0.75rem;
}

.rf-prow__num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.25rem;
  color: var(--rf-text-muted);
}

.rf-prow__main {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
}

.rf-prow__title {
  font-size: clamp(1.25rem, 2.8vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--rf-text);
  transition: color 0.3s var(--rf-ease);
}

.rf-prow:hover .rf-prow__title {
  color: var(--rf-accent);
}

.rf-prow__summary {
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--rf-text-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 60ch;
}

.rf-prow__side {
  display: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.45rem;
  text-align: right;
}

@media (min-width: 720px) {
  .rf-prow__side {
    display: flex;
  }
}

.rf-prow__org {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-prow__stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
  max-width: 16rem;
}

.rf-prow__stack span {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--rf-line);
  color: var(--rf-text-muted);
}

.rf-prow__arrow {
  font-size: 1.25rem;
  color: var(--rf-text-muted);
  transform: rotate(-45deg);
  transition: transform 0.35s var(--rf-ease), color 0.35s var(--rf-ease);
}

.rf-prow:hover .rf-prow__arrow {
  transform: translateX(4px) rotate(0deg);
  color: var(--rf-accent);
}
</style>
