<script setup lang="ts">
import { LEGAL_ENTITY } from '@/constants/legal'
import { fill } from '@/i18n/ui'

definePageMeta({ layout: 'refonte' })

const { meta } = useLocalizedContent()
const { ui } = useUi()
const siteUrl = computed(() => useRequestURL().origin)
const copy = computed(() => ui.value.cgu)
const address = computed(() => {
  const { line1, postalCode, city } = LEGAL_ENTITY.address
  return `${line1}, ${postalCode} ${city}, ${ui.value.entity.country}`
})

useHead({
  title: computed(() => `${copy.value.pageTitle} — ${meta.value?.name ?? 'Portfolio'}`)
})
</script>

<template>
  <RefonteLegalPage
    :title="copy.title"
    :lead="copy.lead"
  >
    <section>
      <h2>{{ copy.s1 }}</h2>
      <p>
        {{ fill(copy.p1, {
          url: siteUrl,
          name: LEGAL_ENTITY.businessName,
          form: ui.entity.legalForm,
          trade: LEGAL_ENTITY.tradeName
        }) }}
      </p>
    </section>

    <section>
      <h2>{{ copy.s2 }}</h2>
      <p>{{ copy.p2 }}</p>
    </section>

    <section>
      <h2>{{ copy.s3 }}</h2>
      <p>{{ fill(copy.p3, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.s4 }}</h2>
      <p>{{ fill(copy.p4, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.s5 }}</h2>
      <p>{{ copy.p5 }}</p>
    </section>

    <section>
      <h2>{{ copy.s6 }}</h2>
      <p>{{ fill(copy.p6, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.s7 }}</h2>
      <p>{{ fill(copy.p7, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.s8 }}</h2>
      <p>{{ fill(copy.p8, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.s9 }}</h2>
      <p>
        {{ copy.p9 }}
        <RefonteLink to="/confidentialite">{{ copy.privacyLink }}</RefonteLink>.
      </p>
    </section>

    <section>
      <h2>{{ copy.s10 }}</h2>
      <p>{{ fill(copy.p10, { address }) }}</p>
    </section>

    <section>
      <h2>{{ copy.s11 }}</h2>
      <p>
        {{ copy.p11 }}
        <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>.
      </p>
    </section>
  </RefonteLegalPage>
</template>
