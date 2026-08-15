<script setup lang="ts">
const { meta, sections } = useContent()
const heroRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!heroRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { gsap } = await import('gsap')
  const targets = heroRef.value.querySelectorAll('[data-hero-item]')
  gsap.from(targets, {
    y: 48,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.15
  })
})
</script>

<template>
  <section ref="heroRef" class="refonte-hero" data-scroll-section>
    <div class="refonte-container refonte-hero__grid">
      <div class="refonte-hero__copy">
        <p class="refonte-label" data-hero-item>Portfolio front-end · {{ meta.location }}</p>
        <h1 class="refonte-display refonte-hero__title" data-hero-item>
          {{ meta.name.split(' ')[0] }}<br>
          <em>{{ meta.name.split(' ').slice(1).join(' ') || 'Louis' }}</em>
        </h1>
        <p class="refonte-hero__role" data-hero-item>{{ meta.role }}</p>
        <p class="refonte-hero__tagline" data-hero-item>{{ meta.tagline }}</p>
        <div class="refonte-hero__stats" data-hero-item>
          <div>
            <strong>{{ meta.years_experience }}+</strong>
            <span>ans d'expérience</span>
          </div>
          <div>
            <strong>{{ sections.experiences.length }}</strong>
            <span>missions clés</span>
          </div>
          <div>
            <strong>{{ sections.projets.length }}</strong>
            <span>projets portfolio</span>
          </div>
        </div>
      </div>

      <aside class="refonte-hero__panel refonte-card" data-hero-item>
        <p class="refonte-label">Manifeste</p>
        <p class="refonte-hero__bio">{{ sections.a_propos.bio }}</p>
        <ul class="refonte-hero__highlights">
          <li v-for="item in sections.a_propos.highlights" :key="item">{{ item }}</li>
        </ul>
        <p class="refonte-hero__availability">{{ sections.a_propos.availability }}</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.refonte-hero {
  padding: clamp(3rem, 8vw, 6rem) 0 clamp(4rem, 10vw, 7rem);
}

.refonte-hero__grid {
  display: grid;
  gap: 2.5rem;
  align-items: start;
}

@media (min-width: 960px) {
  .refonte-hero__grid {
    grid-template-columns: 1.15fr 0.85fr;
  }
}

.refonte-hero__title {
  font-size: clamp(3rem, 9vw, 6.5rem);
  margin: 0.5rem 0 1rem;
}

.refonte-hero__title em {
  font-style: italic;
  color: var(--rf-accent);
}

.refonte-hero__role {
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 600;
  color: var(--rf-ink-soft);
  margin-bottom: 0.75rem;
}

.refonte-hero__tagline {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--rf-muted);
  max-width: 36ch;
  margin-bottom: 2rem;
}

.refonte-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.refonte-hero__stats strong {
  display: block;
  font-family: var(--rf-serif);
  font-size: 2rem;
  line-height: 1;
}

.refonte-hero__stats span {
  font-size: 0.78rem;
  color: var(--rf-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.refonte-hero__panel {
  padding: 1.75rem;
}

.refonte-hero__bio {
  margin: 0.75rem 0 1.25rem;
  line-height: 1.65;
  color: var(--rf-ink-soft);
}

.refonte-hero__highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: grid;
  gap: 0.55rem;
}

.refonte-hero__highlights li {
  padding-left: 1rem;
  border-left: 2px solid var(--rf-accent);
  font-size: 0.88rem;
  color: var(--rf-ink-soft);
}

.refonte-hero__availability {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-sage);
}
</style>
