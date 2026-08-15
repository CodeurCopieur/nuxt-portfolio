<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const route = useRoute()
const { meta, sections } = useContent()

const project = computed(() =>
  sections.value.projets.find((p) => p.slug === route.params.slug)
)

watchEffect(() => {
  if (sections.value.projets.length && !project.value) {
    throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })
  }
})

useHead({
  title: computed(() => `${project.value?.title ?? 'Projet'} — ${meta.value.name}`)
})

const pageRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!pageRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const { gsap } = await import('gsap')
  gsap.from(pageRef.value.querySelectorAll('[data-reveal]'), {
    y: 36,
    opacity: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: 'power3.out',
    delay: 0.1
  })
})
</script>

<template>
  <article v-if="project" ref="pageRef" class="refonte-case" data-scroll-section>
    <div class="refonte-container">
      <RefonteLink to="/refonte/projets" class="refonte-case__back" data-reveal>← Retour aux projets</RefonteLink>

      <header class="refonte-case__head" data-reveal>
        <p class="refonte-label">{{ project.year }} · {{ project.org }}</p>
        <h1 class="refonte-display refonte-case__title">{{ project.title }}</h1>
        <p class="refonte-case__summary">{{ project.summary }}</p>
      </header>

      <div class="refonte-case__meta refonte-card" data-reveal>
        <div>
          <span class="refonte-label">Stack</span>
          <ul>
            <li v-for="tech in project.stack" :key="tech">{{ tech }}</li>
          </ul>
        </div>
        <div v-if="project.tags?.length">
          <span class="refonte-label">Tags</span>
          <ul>
            <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
          </ul>
        </div>
        <div class="refonte-case__links">
          <a v-if="project.link" :href="project.link" target="_blank" rel="noopener">Voir en ligne</a>
          <a v-if="project.github" :href="project.github" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.refonte-case {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.refonte-case__back {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-muted);
  text-decoration: none;
}

.refonte-case__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  margin: 0.35rem 0 0.75rem;
}

.refonte-case__summary {
  max-width: 58ch;
  line-height: 1.7;
  color: var(--rf-ink-soft);
  font-size: 1.05rem;
}

.refonte-case__meta {
  margin-top: 2rem;
  padding: 1.5rem;
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .refonte-case__meta {
    grid-template-columns: 1fr 1fr auto;
    align-items: start;
  }
}

.refonte-case__meta ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.refonte-case__meta li {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: rgba(26, 22, 18, 0.06);
}

.refonte-case__links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.refonte-case__links a {
  color: var(--rf-accent);
  font-weight: 700;
  text-decoration: none;
}
</style>
