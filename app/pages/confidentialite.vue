<script setup lang="ts">
import { formatLegalAddress, LEGAL_ENTITY, LEGAL_THIRD_PARTIES } from '@/constants/legal'

definePageMeta({ layout: 'refonte' })

const { meta } = useContent()
const siteUrl = computed(() => useRequestURL().origin)

useHead({
  title: computed(() => `Politique de confidentialité — ${meta.value?.name ?? 'Portfolio'}`)
})
</script>

<template>
  <RefonteLegalPage
    title="Politique de confidentialité"
    lead="Comment vos données sont collectées, utilisées et protégées sur ce site."
  >
    <section>
      <h2>Responsable du traitement</h2>
      <p>
        {{ LEGAL_ENTITY.businessName }} — {{ LEGAL_ENTITY.legalForm }}<br>
        {{ formatLegalAddress() }}<br>
        Contact :
        <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>
        · {{ LEGAL_ENTITY.phone }}
      </p>
    </section>

    <section>
      <h2>Données collectées</h2>
      <p>Les données personnelles susceptibles d'être traitées sur {{ siteUrl }} sont les suivantes :</p>
      <ul>
        <li>
          <strong>Formulaire de contact</strong> : nom, adresse e-mail et contenu du message que vous
          choisissez de transmettre.
        </li>
        <li>
          <strong>Données techniques</strong> : logs de connexion, adresse IP, type de navigateur,
          pages consultées et horodatages, collectés automatiquement par l'hébergeur et les outils de
          mesure d'audience.
        </li>
        <li>
          <strong>Cookies et traceurs</strong> : cookies techniques nécessaires au fonctionnement du site
          et traceurs de performance (Vercel Speed Insights).
        </li>
      </ul>
    </section>

    <section>
      <h2>Finalités du traitement</h2>
      <ul>
        <li>Répondre aux demandes envoyées via le formulaire de contact.</li>
        <li>Assurer la sécurité, la maintenance et le bon fonctionnement du site.</li>
        <li>Mesurer les performances et améliorer l'expérience utilisateur.</li>
        <li>Respecter les obligations légales applicables.</li>
      </ul>
    </section>

    <section>
      <h2>Base légale</h2>
      <ul>
        <li>Intérêt légitime pour la sécurité du site et l'amélioration de l'expérience.</li>
        <li>Exécution de mesures précontractuelles à votre demande (prise de contact).</li>
        <li>Consentement lorsque requis pour certains traceurs non essentiels.</li>
      </ul>
    </section>

    <section>
      <h2>Destinataires et sous-traitants</h2>
      <p>Vos données peuvent être transmises aux prestataires suivants, dans la limite de leurs missions :</p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — hébergement du site et mesure de performance
          (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">politique de confidentialité</a>).
        </li>
        <li>
          <strong>{{ LEGAL_THIRD_PARTIES.emailjs.name }}</strong> — transmission des messages du formulaire
          de contact
          (<a :href="LEGAL_THIRD_PARTIES.emailjs.website" target="_blank" rel="noopener">site web</a>).
        </li>
      </ul>
      <p>Aucune donnée n'est vendue à des tiers.</p>
    </section>

    <section>
      <h2>Durée de conservation</h2>
      <ul>
        <li>Messages de contact : jusqu'à 3 ans à compter du dernier échange.</li>
        <li>Données techniques et logs : durée limitée conformément aux obligations de l'hébergeur.</li>
        <li>Données de mesure d'audience : selon la durée définie par Vercel Speed Insights.</li>
      </ul>
    </section>

    <section>
      <h2>Vos droits</h2>
      <p>
        Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique
        et Libertés, vous disposez des droits suivants : accès, rectification, effacement, limitation,
        opposition et portabilité de vos données lorsque applicable.
      </p>
      <p>
        Pour exercer vos droits, contactez :
        <a :href="`mailto:${LEGAL_ENTITY.email}`">{{ LEGAL_ENTITY.email }}</a>.
        Vous pouvez également introduire une réclamation auprès de la CNIL
        (<a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>).
      </p>
    </section>

    <section>
      <h2>Cookies</h2>
      <p>
        Le site peut déposer des cookies strictement nécessaires à son fonctionnement ainsi que des
        traceurs de performance. Vous pouvez configurer votre navigateur pour refuser les cookies non
        essentiels. Le refus de certains traceurs peut limiter certaines fonctionnalités d'analyse.
      </p>
    </section>

    <section>
      <h2>Sécurité</h2>
      <p>
        {{ LEGAL_ENTITY.businessName }} met en œuvre des mesures techniques et organisationnelles
        appropriées pour protéger vos données contre l'accès non autorisé, la perte ou la divulgation.
      </p>
    </section>

    <section>
      <h2>Modifications</h2>
      <p>
        La présente politique peut être mise à jour pour refléter l'évolution du site ou de la
        réglementation. La date de dernière mise à jour figure en haut de cette page.
      </p>
    </section>
  </RefonteLegalPage>
</template>
