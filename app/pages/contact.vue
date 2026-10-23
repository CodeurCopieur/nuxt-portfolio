<script setup lang="ts">
definePageMeta({ layout: 'refonte' })

const { meta } = useLocalizedContent()
const { ui } = useUi()

const pageTitle = computed(() => `${ui.value.contact.pageTitle} — ${meta.value?.name ?? 'Portfolio'}`)

useSeoMeta({
  title: pageTitle,
  description: computed(() => ui.value.seo.contactDescription),
  ogTitle: pageTitle,
  ogDescription: computed(() => ui.value.seo.contactDescription)
})
</script>

<template>
  <div class="rf-route">
    <div class="rf-page-ghost-wrap" aria-hidden="true">
      <span class="rf-page-ghost">04</span>
    </div>
    <RefonteContactPanel />
  </div>
</template>
