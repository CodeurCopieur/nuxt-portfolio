<script setup lang="ts">
import { COMPETENCE_CATEGORIES, sortCompetenceCategories } from '~/data/competence-categories'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const { sections } = useContent()
const sectionRef = ref<HTMLElement | null>(null)
const { addScene } = useRefonteScroll()

const categories = computed(() => {
  const order = sections.value.competences_order ?? []
  const custom = sections.value.competences_categories ?? COMPETENCE_CATEGORIES
  return sortCompetenceCategories(order, custom).map((cat) => ({
    ...cat,
    skills: sections.value.competences[cat.key] ?? []
  })).filter((cat) => cat.skills.length > 0)
})

onMounted(() => {
  addScene({
    trigger: sectionRef,
    onEnter: async () => {
      if (!sectionRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const { gsap } = await import('gsap')
      gsap.from(sectionRef.value.querySelectorAll('.refonte-skill-block'), {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out'
      })
    }
  })
})
</script>

<template>
  <section ref="sectionRef" class="refonte-skills" data-scroll-section>
    <div class="refonte-container">
      <p class="refonte-label">Expertise</p>
      <h2 class="refonte-display refonte-skills__title">Compétences & craft technique</h2>
      <p class="refonte-skills__intro">
        Un socle solide en intégration, animation maîtrisée et culture produit — nourri par des environnements exigeants.
      </p>

      <div class="refonte-skills__grid">
        <article
          v-for="cat in categories"
          :key="cat.key"
          class="refonte-skill-block refonte-card"
          :style="{ '--rf-accent-local': cat.accent || 'var(--rf-sage)' }"
        >
          <header>
            <h3>{{ cat.label }}</h3>
            <p>{{ cat.hint }}</p>
          </header>
          <ul>
            <li v-for="skill in cat.skills" :key="skill">{{ skill }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.refonte-skills {
  padding: clamp(3rem, 8vw, 5rem) 0;
  background: linear-gradient(180deg, transparent, rgba(26, 22, 18, 0.03));
}

.refonte-skills__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  margin: 0.35rem 0 0.75rem;
}

.refonte-skills__intro {
  max-width: 52ch;
  color: var(--rf-muted);
  line-height: 1.65;
  margin-bottom: 2rem;
}

.refonte-skills__grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .refonte-skills__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .refonte-skills__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.refonte-skill-block {
  padding: 1.25rem;
  border-top: 3px solid var(--rf-accent-local, var(--rf-sage));
}

.refonte-skill-block header h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.refonte-skill-block header p {
  font-size: 0.78rem;
  color: var(--rf-muted);
  margin-bottom: 0.85rem;
}

.refonte-skill-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.refonte-skill-block li {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  background: rgba(26, 22, 18, 0.05);
  color: var(--rf-ink-soft);
}
</style>
