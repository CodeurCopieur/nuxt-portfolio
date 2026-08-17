<script setup lang="ts">
import { LEGAL_LAST_UPDATED } from '@/constants/legal'

defineProps<{
  title: string
  lead?: string
}>()
</script>

<template>
  <article class="rf-legal" data-scroll-section>
    <div class="refonte-container rf-legal__inner">
      <header class="rf-legal__head">
        <RefonteLink to="/refonte" class="rf-legal__back">← Retour à l'accueil</RefonteLink>
        <p class="refonte-label">Informations légales</p>
        <h1 class="refonte-display rf-legal__title">{{ title }}</h1>
        <p v-if="lead" class="rf-legal__lead">{{ lead }}</p>
        <p class="rf-legal__updated">Dernière mise à jour : {{ LEGAL_LAST_UPDATED }}</p>
      </header>

      <div class="rf-legal__content">
        <slot />
      </div>
    </div>
  </article>
</template>

<style scoped>
.rf-legal {
  padding-block: clamp(1.25rem, 3vw, 2rem);
}

.rf-legal__inner {
  padding-block: 0;
}

.rf-legal__back {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--rf-text-soft);
  text-decoration: none;
}

.rf-legal__title {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0.25rem 0 0.5rem;
}

.rf-legal__lead {
  max-width: 72ch;
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--rf-text-soft);
}

.rf-legal__updated {
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: var(--rf-text-muted);
}

.rf-legal__content {
  margin-top: clamp(1.25rem, 3vw, 1.75rem);
  display: grid;
  gap: 1.35rem;
}

.rf-legal__content :deep(section) {
  display: grid;
  gap: 0.75rem;
}

.rf-legal__content :deep(h2) {
  margin: 0;
  font-family: var(--rf-sans);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--rf-text);
}

.rf-legal__content :deep(p),
.rf-legal__content :deep(li),
.rf-legal__content :deep(dd) {
  margin: 0;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--rf-text-soft);
  max-width: none;
}

.rf-legal__content :deep(ul),
.rf-legal__content :deep(ol) {
  margin: 0;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.45rem;
}

.rf-legal__content :deep(dl) {
  margin: 0;
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .rf-legal__content :deep(dl) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem 2rem;
  }
}

.rf-legal__content :deep(dt) {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-legal__content :deep(a) {
  color: var(--rf-accent);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.rf-legal__content :deep(a:hover) {
  color: var(--rf-text);
}
</style>
