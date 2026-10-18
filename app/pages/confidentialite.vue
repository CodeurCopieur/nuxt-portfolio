<script setup lang="ts">
import { LEGAL_ENTITY, LEGAL_THIRD_PARTIES } from '@/constants/legal'
import { fill } from '@/i18n/ui'

definePageMeta({ layout: 'refonte' })

const { meta } = useLocalizedContent()
const { ui } = useUi()
const siteUrl = computed(() => useRequestURL().origin)
const copy = computed(() => ui.value.privacy)
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
      <h2>{{ copy.controllerTitle }}</h2>
      <p>
        {{ LEGAL_ENTITY.businessName }} — {{ ui.entity.legalForm }}<br>
        {{ address }}<br>
        {{ copy.contact }}
        <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>
        · {{ LEGAL_ENTITY.phone }}
      </p>
    </section>

    <section>
      <h2>{{ copy.collectedTitle }}</h2>
      <p>{{ fill(copy.collectedIntro, { url: siteUrl }) }}</p>
      <ul>
        <li><strong>{{ copy.formItem }}</strong></li>
        <li><strong>{{ copy.techItem }}</strong></li>
        <li><strong>{{ copy.cookieItem }}</strong></li>
      </ul>
    </section>

    <section>
      <h2>{{ copy.purposesTitle }}</h2>
      <ul>
        <li>{{ copy.purpose1 }}</li>
        <li>{{ copy.purpose2 }}</li>
        <li>{{ copy.purpose3 }}</li>
        <li>{{ copy.purpose4 }}</li>
      </ul>
    </section>

    <section>
      <h2>{{ copy.basisTitle }}</h2>
      <ul>
        <li>{{ copy.basis1 }}</li>
        <li>{{ copy.basis2 }}</li>
        <li>{{ copy.basis3 }}</li>
      </ul>
    </section>

    <section>
      <h2>{{ copy.recipientsTitle }}</h2>
      <p>{{ copy.recipientsIntro }}</p>
      <ul>
        <li>
          <strong>{{ copy.vercel }}</strong>
          (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">{{ copy.vercelPolicy }}</a>).
        </li>
        <li>
          <strong>{{ fill(copy.emailjs, { name: LEGAL_THIRD_PARTIES.emailjs.name }) }}</strong>
          (<a :href="LEGAL_THIRD_PARTIES.emailjs.website" target="_blank" rel="noopener">{{ copy.emailjsSite }}</a>).
        </li>
      </ul>
      <p>{{ copy.noSale }}</p>
    </section>

    <section>
      <h2>{{ copy.retentionTitle }}</h2>
      <ul>
        <li>{{ copy.retention1 }}</li>
        <li>{{ copy.retention2 }}</li>
        <li>{{ copy.retention3 }}</li>
      </ul>
    </section>

    <section>
      <h2>{{ copy.rightsTitle }}</h2>
      <p>{{ copy.rights }}</p>
      <p>
        {{ copy.rightsContact }}
        <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>.
        {{ copy.cnil }}
        (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).
      </p>
    </section>

    <section>
      <h2>{{ copy.cookiesTitle }}</h2>
      <p>{{ copy.cookies }}</p>
    </section>

    <section>
      <h2>{{ copy.securityTitle }}</h2>
      <p>{{ fill(copy.security, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.changesTitle }}</h2>
      <p>{{ copy.changes }}</p>
    </section>
  </RefonteLegalPage>
</template>
