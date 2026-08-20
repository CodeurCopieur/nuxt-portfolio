<script setup lang="ts">
import { formatLegalAddress, LEGAL_ENTITY } from '@/constants/legal'

definePageMeta({ layout: 'refonte' })

const { meta } = useContent()
const siteUrl = computed(() => useRequestURL().origin)

useHead({
  title: computed(() => `Conditions générales d'utilisation — ${meta.value?.name ?? 'Portfolio'}`)
})
</script>

<template>
  <RefonteLegalPage
    title="Conditions générales d'utilisation"
    lead="Règles d'accès et d'utilisation du site portfolio."
  >
    <section>
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités
        d'accès et d'utilisation du site {{ siteUrl }}, édité par {{ LEGAL_ENTITY.businessName }}
        ({{ LEGAL_ENTITY.legalForm }}), exerçant sous le nom {{ LEGAL_ENTITY.tradeName }}.
      </p>
    </section>

    <section>
      <h2>2. Acceptation</h2>
      <p>
        L'accès et la navigation sur le site impliquent l'acceptation pleine et entière des présentes
        CGU. Si vous n'acceptez pas ces conditions, vous êtes invité à ne pas utiliser le site.
      </p>
    </section>

    <section>
      <h2>3. Accès au site</h2>
      <p>
        Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet.
        {{ LEGAL_ENTITY.businessName }} se réserve le droit de suspendre, modifier ou interrompre le site
        à tout moment, sans préavis, notamment pour des raisons de maintenance ou de mise à jour.
      </p>
    </section>

    <section>
      <h2>4. Nature du site</h2>
      <p>
        Le site a une vocation informative et de présentation de compétences professionnelles. Il ne
        constitue pas une plateforme de vente en ligne. Les prestations de développement informatique
        proposées par {{ LEGAL_ENTITY.businessName }} font l'objet de devis et de contrats distincts.
      </p>
    </section>

    <section>
      <h2>5. Propriété intellectuelle</h2>
      <p>
        Tous les contenus présents sur le site (textes, images, logos, code, animations, mise en page)
        sont protégés par le droit de la propriété intellectuelle. Toute reproduction, diffusion ou
        exploitation non autorisée est strictement interdite.
      </p>
    </section>

    <section>
      <h2>6. Formulaire de contact</h2>
      <p>
        L'utilisateur s'engage à fournir des informations exactes lors de l'utilisation du formulaire
        de contact et à ne pas transmettre de contenus illicites, diffamatoires ou portant atteinte aux
        droits de tiers. {{ LEGAL_ENTITY.businessName }} se réserve le droit de ne pas répondre aux
        messages ne respectant pas ces règles.
      </p>
    </section>

    <section>
      <h2>7. Liens hypertextes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers. {{ LEGAL_ENTITY.businessName }} n'exerce
        aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur
        politique de confidentialité.
      </p>
    </section>

    <section>
      <h2>8. Responsabilité</h2>
      <p>
        {{ LEGAL_ENTITY.businessName }} met en œuvre tous les moyens raisonnables pour assurer un accès
        fiable au site, sans garantir une disponibilité permanente. L'utilisateur est seul responsable
        de l'usage qu'il fait du site et des équipements qu'il utilise pour y accéder.
      </p>
    </section>

    <section>
      <h2>9. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans la
        <RefonteLink to="/confidentialite">politique de confidentialité</RefonteLink>.
      </p>
    </section>

    <section>
      <h2>10. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution
        amiable, les tribunaux compétents seront ceux du ressort du siège social de l'éditeur :
        {{ formatLegalAddress() }}.
      </p>
    </section>

    <section>
      <h2>11. Contact</h2>
      <p>
        Pour toute question relative aux CGU :
        <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>.
      </p>
    </section>
  </RefonteLegalPage>
</template>
