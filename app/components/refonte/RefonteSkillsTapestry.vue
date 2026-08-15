<script setup lang="ts">
import SkillMarketChart from '@/components/desktop/SkillMarketChart.vue'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const sectionRef = ref<HTMLElement | null>(null)
const { addScene } = useRefonteScroll()

onMounted(() => {
  addScene({
    trigger: sectionRef,
    onEnter: async () => {
      if (!sectionRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const { gsap } = await import('gsap')
      gsap.from(sectionRef.value.querySelector('.refonte-skills__map'), {
        y: 40,
        opacity: 0,
        duration: 0.85,
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

      <div class="refonte-skills__map refonte-card">
        <ClientOnly>
          <SkillMarketChart variant="refonte" />
        </ClientOnly>
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

.refonte-skills__map {
  overflow: hidden;
  padding: 0;
}

.refonte-skills__map :deep(.fm-skills--refonte) {
  border-radius: inherit;
  min-height: 0;
}
</style>
