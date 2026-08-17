<script setup lang="ts">
const { meta, sections } = useContent()
</script>

<template>
  <section class="rf-hero" data-scroll-section data-rf-chapter="Accueil">
    <span class="rf-hero__ghost" aria-hidden="true">01</span>

    <div class="refonte-container rf-hero__top">
      <span class="refonte-label">{{ meta.role }}</span>
      <span class="rf-hero__status">
        <span class="rf-hero__status-dot" />
        Disponible en freelance
      </span>
    </div>

    <div class="refonte-container rf-hero__body">
      <h1 class="rf-hero__title">
        <span class="rf-hero__mask"><span class="rf-hero__line" style="--i: 0">Je conçois des</span></span>
        <span class="rf-hero__mask"><span class="rf-hero__line" style="--i: 1">interfaces</span></span>
        <span class="rf-hero__mask">
          <span class="rf-hero__line rf-hero__line--serif refonte-serif" style="--i: 2">qui tiennent la charge</span>
        </span>
      </h1>

      <div class="rf-hero__mask rf-hero__tagline-mask">
        <p class="rf-hero__line rf-hero__tagline" style="--i: 3">{{ meta.tagline }}</p>
      </div>
    </div>

    <div class="refonte-container rf-hero__foot">
      <a href="#rf-intro" class="rf-hero__scroll-cue">
        <span class="rf-hero__scroll-arrow" aria-hidden="true">↓</span>
        <span>Scroll pour explorer</span>
      </a>

      <ul class="rf-hero__stats">
        <li>{{ meta.years_experience }}+ ans</li>
        <li>{{ sections.projets.length }} projets</li>
        <li>{{ meta.location }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.rf-hero {
  position: relative;
  min-height: calc(100dvh - var(--rf-nav-h));
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  padding-block: clamp(1.75rem, 5vw, 2.75rem) clamp(1.5rem, 4vw, 2rem);
  overflow: hidden;
}

@media (max-width: 767px) {
  .rf-hero {
    min-height: auto;
    gap: 1.5rem;
    padding-block: 1.5rem 2rem;
  }
}

.rf-hero__ghost {
  position: absolute;
  top: 42%;
  right: max(-1rem, calc((100vw - var(--rf-container-max)) / -2 - 1rem));
  transform: translateY(-50%);
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: min(46vw, 32rem);
  line-height: 1;
  color: var(--rf-text);
  opacity: 0.045;
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.rf-hero__top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}

.rf-hero__status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--rf-text-soft);
}

.rf-hero__status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--rf-accent);
  box-shadow: 0 0 0 4px rgba(var(--rf-accent-rgb), 0.18);
}

.rf-hero__body {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  align-content: center;
}

.rf-hero__title {
  margin: 0;
  display: grid;
  gap: 0.05em;
}

.rf-hero__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
}

.rf-hero__line {
  display: block;
  font-family: var(--rf-sans);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  font-size: clamp(2.75rem, 9vw, 6.75rem);
  color: var(--rf-text);
  animation: rf-line-in 900ms var(--rf-ease) both;
  animation-delay: calc(var(--i, 0) * 110ms + 120ms);
}

.rf-hero__line--serif {
  font-family: var(--rf-serif);
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.01em;
  line-height: 1.12;
  color: var(--rf-accent);
}

.rf-hero__tagline {
  font-family: var(--rf-sans);
  font-weight: 500;
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  line-height: 1.6;
  color: var(--rf-text-soft);
  letter-spacing: normal;
}

@keyframes rf-line-in {
  from {
    transform: translateY(112%);
  }
  to {
    transform: translateY(0);
  }
}

.rf-hero__foot {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
}

.rf-hero__scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-hero__scroll-arrow {
  display: inline-flex;
  animation: rf-scroll-bounce 1.8s ease-in-out infinite;
}

@keyframes rf-scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.rf-hero__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--rf-text-muted);
}

@media (prefers-reduced-motion: reduce) {
  .rf-hero__line {
    animation: none;
    transform: none;
  }

  .rf-hero__scroll-arrow {
    animation: none;
  }
}
</style>
