<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta, sections } = useLocalizedContent()
const { ui } = useUi()

useHead({
  title: computed(() => `${ui.value.sitemap.pageTitle} — ${meta.value?.name ?? 'Portfolio'}`)
})

const legalLinks = computed(() => [
  { to: '/mentions-legales', label: ui.value.legalNav.mentions },
  { to: '/cgu', label: ui.value.legalNav.cgu },
  { to: '/confidentialite', label: ui.value.legalNav.privacy },
  { to: '/plan-du-site', label: ui.value.legalNav.sitemap }
])

const mainSections = computed(() => [
  {
    title: ui.value.sitemap.portfolio,
    links: [
      { label: ui.value.nav.home, to: '/' },
      { label: ui.value.nav.projects, to: '/projets' },
      { label: ui.value.nav.services, to: '/prestations' },
      { label: ui.value.nav.contact, to: '/contact' }
    ]
  },
  {
    title: ui.value.sitemap.projects,
    links: sections.value.projets.map((project) => ({
      label: project.title,
      to: `/projets/${project.slug}`
    }))
  },
  {
    title: ui.value.sitemap.legal,
    links: legalLinks.value
  },
  {
    title: ui.value.sitemap.archive,
    links: [
      { label: ui.value.sitemap.oldHome, to: '/old' },
      { label: ui.value.sitemap.oldProjects, to: '/old/projets' },
      { label: ui.value.sitemap.oldContact, to: '/old/contact' }
    ]
  }
])
</script>

<template>
  <RefonteLegalPage
    :title="ui.sitemap.title"
    :lead="ui.sitemap.lead"
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
      <h2>{{ ui.sitemap.contact }}</h2>
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
