<script setup lang="ts">
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'
import { sortProjectsByYear } from '~/utils/sort-projects'

const { recentProjects } = useContent()
const sectionRef = ref<HTMLElement | null>(null)
const { addScene } = useRefonteScroll()

const projects = computed(() => sortProjectsByYear(recentProjects.value))

onMounted(() => {
  addScene({
    trigger: sectionRef,
    onEnter: async () => {
      if (!sectionRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const { gsap } = await import('gsap')
      gsap.from(sectionRef.value.querySelectorAll('.refonte-project-card'), {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      })
    }
  })
})
</script>

<template>
  <section ref="sectionRef" class="refonte-projects" data-scroll-section>
    <div class="refonte-container">
      <div class="refonte-projects__head">
        <div>
          <p class="refonte-label">Sélection</p>
          <h2 class="refonte-display refonte-projects__title">Projets récents</h2>
        </div>
        <RefonteLink to="/refonte/projets" class="refonte-btn refonte-btn--ghost">Tout voir</RefonteLink>
      </div>

      <div class="refonte-projects__grid">
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
.refonte-projects {
  padding: clamp(3rem, 8vw, 5rem) 0;
}

.refonte-projects__head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.refonte-projects__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
}

.refonte-projects__grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .refonte-projects__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
