<script setup lang="ts">
import { LEGAL_PAGES } from '@/constants/legal'

definePageMeta({ layout: 'refonte' })

const { meta, sections } = useContent()

useHead({
  title: computed(() => `Plan du site — ${meta.value?.name ?? 'Portfolio'}`)
})

const mainSections = computed(() => [
  {
    title: 'Refonte portfolio',
    links: [
      { label: 'Accueil', to: '/refonte' },
      { label: 'Projets', to: '/refonte/projets' },
      { label: 'Contact', to: '/refonte/contact' }
    ]
  },
  {
    title: 'Projets',
    links: sections.value.projets.map((project) => ({
      label: project.title,
      to: `/refonte/projets/${project.slug}`
    }))
  },
  {
    title: 'Informations légales',
    links: LEGAL_PAGES.map((page) => ({ label: page.label, to: page.to }))
  },
  {
    title: 'Autres versions',
    links: [
      { label: 'Portfolio classique', to: '/' },
      { label: 'Projets (classique)', to: '/projets' },
      { label: 'Contact (classique)', to: '/contact' }
    ]
  }
])
</script>

<template>
  <RefonteLegalPage
    title="Plan du site"
    lead="Vue d'ensemble de l'architecture et des pages accessibles sur le portfolio."
  >
    <section v-for="group in mainSections" :key="group.title">
      <h2>{{ group.title }}</h2>
      <ul>
        <li v-for="link in group.links" :key="link.to">
          <RefonteLink :to="link.to">{{ link.label }}</RefonteLink>
        </li>
      </ul>
    </section>

    <section>
      <h2>Contact</h2>
      <p>
        <a :href="`mailto:${meta.email}`">{{ meta.email }}</a>
        · {{ meta.phone }}
        · {{ meta.location }}
      </p>
    </section>
  </RefonteLegalPage>
</template>

<style scoped>
:deep(.rf-legal__content) {
  gap: 2.5rem;
}

@media (min-width: 960px) {
  :deep(.rf-legal__content) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(2rem, 5vw, 4rem);
  }

  :deep(.rf-legal__content section:last-child) {
    grid-column: 1 / -1;
  }
}

:deep(.rf-legal__content ul) {
  list-style: none;
  padding-left: 0;
}

:deep(.rf-legal__content li a) {
  text-decoration: none;
  font-weight: 600;
}

:deep(.rf-legal__content li a:hover) {
  text-decoration: underline;
}
</style>
