<script setup lang="ts">
import {
  LEGAL_ENTITY,
  LEGAL_HOSTING,
  LEGAL_THIRD_PARTIES
} from '@/constants/legal'
import { fill } from '@/i18n/ui'

definePageMeta({ layout: 'refonte' })

const { meta } = useLocalizedContent()
const { ui } = useUi()
const siteUrl = computed(() => useRequestURL().origin)
const copy = computed(() => ui.value.mentions)
const address = computed(() => {
  const { line1, postalCode, city } = LEGAL_ENTITY.address
  return `${line1}, ${postalCode} ${city}, ${ui.value.entity.country}`
})
const hostingAddress = computed(() =>
  LEGAL_HOSTING.address.replace('États-Unis', ui.value.entity.hostingCountry)
)

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
      <h2>{{ copy.publisher }}</h2>
      <dl>
        <div>
          <dt>{{ copy.businessName }}</dt>
          <dd>{{ LEGAL_ENTITY.businessName }}</dd>
        </div>
        <div>
          <dt>{{ copy.tradeName }}</dt>
          <dd>{{ LEGAL_ENTITY.tradeName }}</dd>
        </div>
        <div>
          <dt>{{ copy.legalForm }}</dt>
          <dd>{{ ui.entity.legalForm }}</dd>
        </div>
        <div>
          <dt>{{ copy.siren }}</dt>
          <dd>{{ LEGAL_ENTITY.siren }}</dd>
        </div>
        <div>
          <dt>{{ copy.siret }}</dt>
          <dd>{{ LEGAL_ENTITY.siret }}</dd>
        </div>
        <div>
          <dt>{{ copy.vat }}</dt>
          <dd>{{ LEGAL_ENTITY.vatNumber }}</dd>
        </div>
        <div>
          <dt>{{ copy.registration }}</dt>
          <dd>{{ ui.entity.rne }} · {{ ui.entity.rcs }}</dd>
        </div>
        <div>
          <dt>{{ copy.activity }}</dt>
          <dd>{{ ui.entity.activity }} ({{ fill(copy.naf, { code: LEGAL_ENTITY.nafCode }) }})</dd>
        </div>
        <div>
          <dt>{{ copy.address }}</dt>
          <dd>{{ address }}</dd>
        </div>
        <div>
          <dt>{{ copy.domiciliation }}</dt>
          <dd>{{ LEGAL_ENTITY.domiciliation }}</dd>
        </div>
        <div>
          <dt>{{ copy.created }}</dt>
          <dd>{{ ui.entity.created }}</dd>
        </div>
        <div>
          <dt>{{ copy.contact }}</dt>
          <dd>
            <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>
            · {{ LEGAL_ENTITY.phone }}
          </dd>
        </div>
      </dl>
    </section>

    <section>
      <h2>{{ copy.directorTitle }}</h2>
      <p>{{ fill(copy.director, { name: LEGAL_ENTITY.director }) }}</p>
    </section>

    <section>
      <h2>{{ copy.hostingTitle }}</h2>
      <p>
        {{ fill(copy.hosting, { name: LEGAL_HOSTING.name, address: hostingAddress }) }}
        {{ copy.website }}
        <a :href="LEGAL_HOSTING.website" target="_blank" rel="noopener">{{ LEGAL_HOSTING.website }}</a>.
      </p>
    </section>

    <section>
      <h2>{{ copy.ipTitle }}</h2>
      <p>{{ fill(copy.ip, { url: siteUrl, name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.thirdTitle }}</h2>
      <ul>
        <li>{{ LEGAL_THIRD_PARTIES.emailjs.name }} — {{ ui.entity.emailjs }}.</li>
        <li>{{ LEGAL_THIRD_PARTIES.vercelAnalytics.name }} — {{ ui.entity.speed }}.</li>
        <li>{{ LEGAL_THIRD_PARTIES.vercelWebAnalytics.name }} — {{ ui.entity.analytics }}.</li>
      </ul>
    </section>

    <section>
      <h2>{{ copy.dataTitle }}</h2>
      <p>
        {{ copy.data }}
        <RefonteLink to="/confidentialite">{{ copy.privacyLink }}</RefonteLink>.
      </p>
    </section>

    <section>
      <h2>{{ copy.liabilityTitle }}</h2>
      <p>{{ fill(copy.liability, { name: LEGAL_ENTITY.businessName }) }}</p>
    </section>

    <section>
      <h2>{{ copy.sourceTitle }}</h2>
      <p>
        {{ copy.source }}
        <a :href="LEGAL_ENTITY.pappersUrl" target="_blank" rel="noopener">Pappers</a>.
      </p>
    </section>
  </RefonteLegalPage>
</template>
