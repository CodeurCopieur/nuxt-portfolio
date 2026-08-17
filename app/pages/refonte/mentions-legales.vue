<script setup lang="ts">
import {
  formatLegalAddress,
  LEGAL_ENTITY,
  LEGAL_HOSTING,
  LEGAL_THIRD_PARTIES
} from '@/constants/legal'

definePageMeta({ layout: 'refonte' })

const { meta } = useContent()
const siteUrl = computed(() => useRequestURL().origin)

useHead({
  title: computed(() => `Mentions légales — ${meta.value?.name ?? 'Portfolio'}`)
})
</script>

<template>
  <RefonteLegalPage
    title="Mentions légales"
    lead="Informations légales relatives à l'édition et à l'hébergement du site portfolio."
  >
    <section>
      <h2>Éditeur du site</h2>
      <dl>
        <div>
          <dt>Raison sociale</dt>
          <dd>{{ LEGAL_ENTITY.businessName }}</dd>
        </div>
        <div>
          <dt>Nom commercial</dt>
          <dd>{{ LEGAL_ENTITY.tradeName }}</dd>
        </div>
        <div>
          <dt>Forme juridique</dt>
          <dd>{{ LEGAL_ENTITY.legalForm }}</dd>
        </div>
        <div>
          <dt>SIREN</dt>
          <dd>{{ LEGAL_ENTITY.siren }}</dd>
        </div>
        <div>
          <dt>SIRET (siège)</dt>
          <dd>{{ LEGAL_ENTITY.siret }}</dd>
        </div>
        <div>
          <dt>Numéro de TVA intracommunautaire</dt>
          <dd>{{ LEGAL_ENTITY.vatNumber }}</dd>
        </div>
        <div>
          <dt>Immatriculation</dt>
          <dd>{{ LEGAL_ENTITY.rneStatus }} · {{ LEGAL_ENTITY.rcsStatus }}</dd>
        </div>
        <div>
          <dt>Activité</dt>
          <dd>{{ LEGAL_ENTITY.activity }} (code NAF {{ LEGAL_ENTITY.nafCode }})</dd>
        </div>
        <div>
          <dt>Adresse du siège</dt>
          <dd>{{ formatLegalAddress() }}</dd>
        </div>
        <div>
          <dt>Domiciliation</dt>
          <dd>{{ LEGAL_ENTITY.domiciliation }}</dd>
        </div>
        <div>
          <dt>Date de création</dt>
          <dd>{{ LEGAL_ENTITY.creationDate }}</dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>
            <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>
            · {{ LEGAL_ENTITY.phone }}
          </dd>
        </div>
      </dl>
    </section>

    <section>
      <h2>Directeur de la publication</h2>
      <p>{{ LEGAL_ENTITY.director }}, en qualité de chef d'entreprise.</p>
    </section>

    <section>
      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par {{ LEGAL_HOSTING.name }}, {{ LEGAL_HOSTING.address }}.
        Site web :
        <a :href="LEGAL_HOSTING.website" target="_blank" rel="noopener">{{ LEGAL_HOSTING.website }}</a>.
      </p>
    </section>

    <section>
      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments composant le site {{ siteUrl }} (textes, visuels, code source,
        identité graphique, animations) est la propriété exclusive de {{ LEGAL_ENTITY.businessName }},
        sauf mention contraire. Toute reproduction, représentation ou exploitation, totale ou
        partielle, sans autorisation écrite préalable est interdite.
      </p>
    </section>

    <section>
      <h2>Services tiers</h2>
      <ul>
        <li>
          {{ LEGAL_THIRD_PARTIES.emailjs.name }} — {{ LEGAL_THIRD_PARTIES.emailjs.purpose }}.
        </li>
        <li>
          {{ LEGAL_THIRD_PARTIES.vercelAnalytics.name }} — {{ LEGAL_THIRD_PARTIES.vercelAnalytics.purpose }}.
        </li>
      </ul>
    </section>

    <section>
      <h2>Données personnelles</h2>
      <p>
        Pour en savoir plus sur la collecte et le traitement de vos données, consultez la
        <RefonteLink to="/refonte/confidentialite">politique de confidentialité</RefonteLink>.
      </p>
    </section>

    <section>
      <h2>Limitation de responsabilité</h2>
      <p>
        {{ LEGAL_ENTITY.businessName }} s'efforce d'assurer l'exactitude des informations diffusées
        sur ce site. Toutefois, elle ne saurait être tenue responsable des erreurs, omissions ou
        indisponibilités temporaires du service, ni des dommages résultant de l'utilisation du site
        ou de sites tiers accessibles via des liens hypertextes.
      </p>
    </section>

    <section>
      <h2>Source des informations d'entreprise</h2>
      <p>
        Informations légales issues du registre des entreprises, consultables sur
        <a :href="LEGAL_ENTITY.pappersUrl" target="_blank" rel="noopener">Pappers</a>.
      </p>
    </section>
  </RefonteLegalPage>
</template>
