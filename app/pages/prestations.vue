<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'

definePageMeta({ layout: 'refonte' })

const { meta, sections } = useContent()
const { navigateTo } = useRefonteTransition()

useSeoMeta({
  title: computed(() => `Prestations — ${meta.value?.name ?? 'Portfolio'}`),
  description:
    'Offres web sur devis et missions front Vue/Nuxt (TJM 500 €), avec Supabase ou Firebase si besoin (TJM 600 €).',
  ogTitle: computed(() => `Prestations — ${meta.value?.name ?? 'Portfolio'}`),
  ogDescription:
    'Landing, multipage, sur-mesure sur devis. Missions au TJM 500 € (front) ou 600 € (avec back léger).',
  twitterCard: 'summary_large_image'
})

type Offer = {
  id: string
  name: string
  tagline: string
  showTjm?: boolean
  /** Affichage TJM dual front / back */
  tjmFront?: string
  tjmBack?: string
  price?: string
  priceNote?: string
  unit?: string
  duration: string
  featured: boolean
  includes: string[]
  stack: string[]
  fit: string
}

type Category = {
  id: string
  tab: string
  num: string
  lead: string
  kind: 'mission' | 'devis'
  offers: Offer[]
}

const MISSION_INCLUDES = [
  'Front Vue 3 / Nuxt 4 (UI, composants, state)',
  'Responsive, micro-interactions, accessibilité de base',
  'Si besoin : Supabase ou Firebase (auth, data, admin)',
  'Intégration Figma → production',
  'Formulaires, notifications, CRUD simple',
  'Missions courtes ou longues — même cadre'
]

const MISSION_STACK = [
  'Vue 3',
  'Nuxt 4',
  'TypeScript',
  'Pinia',
  'Supabase',
  'Firebase',
  'Tailwind / SCSS',
  'GSAP'
]

const categories: Category[] = [
  {
    id: 'mission',
    tab: 'Mission',
    num: '01',
    kind: 'mission',
    lead: 'Je prends des missions courtes ou longues. Front Vue / Nuxt — et back léger (Supabase / Firebase) si le besoin est là.',
    offers: [
      {
        id: 'mission',
        name: 'Mission',
        tagline: 'Courte ou longue — même cadre.',
        showTjm: true,
        tjmFront: '500',
        tjmBack: '600',
        priceNote: 'TJM',
        unit: '€ / jour',
        duration: 'Sprint ou régie',
        featured: true,
        includes: MISSION_INCLUDES,
        stack: MISSION_STACK,
        fit: 'Feature, POC, renfort d’équipe, accompagnement produit.'
      }
    ]
  },
  {
    id: 'onepage',
    tab: 'Page unique',
    num: '02',
    kind: 'devis',
    lead: 'Une seule page pour convertir — version statique ou branchée à un backend léger. Devis après brief.',
    offers: [
      {
        id: 'landing',
        name: 'Landing page',
        tagline: 'Une page, un message, un CTA.',
        duration: '3 – 7 jours',
        featured: false,
        includes: [
          'Une page unique (hero → offre → contact)',
          'Intégration responsive (mobile → desktop)',
          'Micro-interactions légères',
          'SEO technique de base + balises',
          'Formulaire de contact (EmailJS / mailto)',
          'Mise en ligne'
        ],
        stack: ['HTML / SCSS', 'Vue ou Nuxt 4', 'Tailwind', 'SEO'],
        fit: 'Lancement d’offre, event, campagne ciblée.'
      },
      {
        id: 'landing-backend',
        name: 'Landing + backend',
        tagline: 'Même page, contenu vivant.',
        duration: '1 – 2 semaines',
        featured: true,
        includes: [
          'Tout le pack Landing page',
          'Nuxt 4 + contenu dynamique',
          'Backend léger (Supabase ou Firebase)',
          'Admin simple (éditer textes / leads)',
          'Formulaire avancé & notifications',
          'Structure prête à évoluer vers un multipage'
        ],
        stack: ['Nuxt 4', 'Vue 3', 'Supabase', 'Firebase', 'Pinia'],
        fit: 'Lead gen, waitlist, contenu qui change souvent.'
      }
    ]
  },
  {
    id: 'multipage',
    tab: 'Site multipage',
    num: '03',
    kind: 'devis',
    lead: 'Plusieurs pages pour présenter l’offre — avec ou sans admin / données dynamiques. Devis après brief.',
    offers: [
      {
        id: 'vitrine',
        name: 'Site vitrine',
        tagline: 'Présence claire, rapide, soignée.',
        duration: '1 – 2 semaines',
        featured: false,
        includes: [
          'Multipage (jusqu’à 5 pages)',
          'Intégration responsive (mobile → desktop)',
          'Animations légères & micro-interactions',
          'SEO technique de base + balises',
          'Accessibilité de départ (sémantique, clavier)',
          'Formulaire de contact (EmailJS / mailto)',
          'Mise en ligne & formation courte'
        ],
        stack: ['HTML / SCSS', 'Vue ou Nuxt 4', 'Tailwind', 'SEO'],
        fit: 'Indépendants, studios, lancements de marque.'
      },
      {
        id: 'vitrine-backend',
        name: 'Site vitrine + backend',
        tagline: 'Contenu vivant, sans usine à gaz.',
        duration: '2 – 4 semaines',
        featured: true,
        includes: [
          'Tout le pack Site vitrine',
          'Nuxt 4 + données dynamiques',
          'Backend léger (Supabase ou Firebase)',
          'Espace admin / CRUD simple',
          'Auth basique si besoin',
          'Formulaires avancés & notifications',
          'Structure prête à évoluer'
        ],
        stack: ['Nuxt 4', 'Vue 3', 'Supabase', 'Firebase', 'Pinia'],
        fit: 'Offres qui changent, catalogue, portfolio client.'
      }
    ]
  },
  {
    id: 'custom',
    tab: 'Sur-mesure',
    num: '04',
    kind: 'devis',
    lead: 'Motion, parcours riches, CMS ou contraintes fortes — chiffrage après brief.',
    offers: [
      {
        id: 'complexe',
        name: 'Projet complexe',
        tagline: 'Motion, parcours, exigences fortes.',
        duration: '6 semaines et +',
        featured: false,
        includes: [
          'Storytelling au scroll (GSAP / scrub)',
          'Parcours multi-étapes ou app front',
          'Intégration CMS / Twig / Drupal si besoin',
          'Perf, a11y et SEO exigeants',
          'Design system léger & composants réutilisables',
          'TMA / itérations post-livraison',
          'Cadence Agile, points réguliers'
        ],
        stack: ['GSAP', 'Nuxt 4', 'Drupal / Twig', 'A11y'],
        fit: 'Agences, produits, refontes premium.'
      }
    ]
  }
]

type CategoryId = (typeof categories)[number]['id']
type TermsMode = 'mission' | 'devis'

const activeId = ref<CategoryId>('mission')
const activeCategory = computed(
  () => categories.find((category) => category.id === activeId.value) ?? categories[0]
)
const showExtras = computed(() => activeCategory.value.kind === 'devis')

const termsMode = ref<TermsMode>('mission')
const activeTerms = computed(() =>
  termsMode.value === 'mission' ? termsMission : termsDevis
)

const extras = [
  { label: 'Motion / GSAP poussé', value: 'Sur devis' },
  { label: 'Page additionnelle', value: 'Sur devis' },
  { label: 'Maintenance mensuelle', value: 'Sur devis' },
  { label: 'Audit a11y ou perf', value: 'Sur devis' }
]

const termsMission = [
  {
    title: 'Cadre',
    text: 'Mission au TJM : 500 € HT / jour en front, 600 € HT / jour si éléments back (Supabase / Firebase). Facturation au réel.'
  },
  {
    title: 'Accord',
    text: 'Un échange (brief + disponibilités) fixe le démarrage. Pas d’acompte forfaitaire : engagement au temps.'
  },
  {
    title: 'Démarrage',
    text: 'La mission démarre à la date convenue, après confirmation écrite (mail ou contrat de mission).'
  },
  {
    title: 'Facturation',
    text: 'Facturation périodique (semaine / quinzaine / mois) ou en fin de mission, selon l’accord.'
  }
]

const termsDevis = [
  {
    title: 'Brief',
    text: 'Objectifs, contenus, délais et contraintes. Le devis découle de ce périmètre.'
  },
  {
    title: 'Devis visé',
    text: 'Acceptation par signature ou « bon pour accord ». Ce visa formalise la commande.'
  },
  {
    title: 'Acompte',
    text: 'Acompte de 40 % HT à la commande, déduit de la facture finale. Ce n’est pas des arrhes.'
  },
  {
    title: 'Démarrage & solde',
    text: 'Travaux après devis visé + acompte. Solde (60 %) à la livraison des livrables.'
  }
]

watch(activeId, (id) => {
  const cat = categories.find((c) => c.id === id)
  if (cat) termsMode.value = cat.kind
})

function selectCategory(id: CategoryId) {
  activeId.value = id
}

function onTabKeydown(event: KeyboardEvent, index: number) {
  const last = categories.length - 1
  let next = index

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = index === last ? 0 : index + 1
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = index === 0 ? last : index - 1
  } else if (event.key === 'Home') {
    next = 0
  } else if (event.key === 'End') {
    next = last
  } else {
    return
  }

  event.preventDefault()
  selectCategory(categories[next].id)
  nextTick(() => {
    document.getElementById(`rf-pricing-tab-${categories[next].id}`)?.focus()
  })
}

function scrollToConditions(event?: MouseEvent) {
  event?.preventDefault()
  document.getElementById('rf-pricing-conditions')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

async function goContact(event?: MouseEvent) {
  event?.preventDefault()
  await navigateTo('/contact')
}
</script>

<template>
  <div class="rf-pricing" data-scroll-section data-rf-chapter="Prestations">
    <header class="refonte-container rf-pricing__hero">
      <p class="refonte-label" v-reveal>04 — Prestations</p>
      <h1 class="refonte-display rf-pricing__title" v-reveal="{ delay: 50 }">
        Offres
        <span class="refonte-serif rf-pricing__title-accent">& missions</span>
      </h1>
      <p class="rf-pricing__lead" v-reveal="{ delay: 100 }">
        Forfaits chiffrés après brief, ou mission au TJM
        (500 € front · 600 € avec back léger Supabase / Firebase).
      </p>
      <p class="rf-pricing__availability" v-reveal="{ delay: 140 }">
        {{ sections.a_propos.availability }}
      </p>
      <a
        href="#rf-pricing-conditions"
        class="rf-pricing__jump"
        v-reveal="{ delay: 180 }"
        @click="scrollToConditions"
      >
        <span>Voir les conditions</span>
        <span class="rf-pricing__jump-arrow" aria-hidden="true" />
      </a>
    </header>

    <div class="refonte-container rf-pricing__offers" v-reveal="{ delay: 160 }">
      <div class="rf-pricing__tabs-track">
        <div class="rf-pricing__tabs" role="tablist" aria-label="Familles d’offres">
          <button
            v-for="(category, index) in categories"
            :id="`rf-pricing-tab-${category.id}`"
            :key="category.id"
            type="button"
            class="rf-pricing__tab"
            role="tab"
            :aria-selected="activeId === category.id"
            :aria-controls="`rf-pricing-panel-${category.id}`"
            :tabindex="activeId === category.id ? 0 : -1"
            :class="{ 'is-active': activeId === category.id }"
            @click="selectCategory(category.id)"
            @keydown="onTabKeydown($event, index)"
          >
            <span class="rf-pricing__tab-num">{{ category.num }}</span>
            <span class="rf-pricing__tab-label">{{ category.tab }}</span>
          </button>
        </div>
      </div>

      <div
        :id="`rf-pricing-panel-${activeCategory.id}`"
        class="rf-pricing__panel"
        role="tabpanel"
        :aria-labelledby="`rf-pricing-tab-${activeCategory.id}`"
      >
        <p class="rf-pricing__panel-lead">{{ activeCategory.lead }}</p>

        <div
          class="rf-pricing__cards"
          :class="{ 'is-single': activeCategory.offers.length === 1 }"
        >
          <article
            v-for="offer in activeCategory.offers"
            :key="offer.id"
            class="rf-pricing__card"
            :class="{ 'is-featured': offer.featured }"
          >
            <header class="rf-pricing__card-head">
              <h2 class="rf-pricing__card-name">{{ offer.name }}</h2>
              <p class="rf-pricing__card-tagline">{{ offer.tagline }}</p>
            </header>

            <div class="rf-pricing__card-price">
              <template v-if="offer.showTjm && offer.tjmFront && offer.tjmBack">
                <span class="rf-pricing__card-price-note">{{ offer.priceNote }}</span>
                <ul class="rf-pricing__tjm">
                  <li>
                    <span class="refonte-serif rf-pricing__tjm-value">{{ offer.tjmFront }}</span>
                    <span class="rf-pricing__tjm-unit">{{ offer.unit }}</span>
                    <span class="rf-pricing__tjm-label">front</span>
                  </li>
                  <li>
                    <span class="refonte-serif rf-pricing__tjm-value">{{ offer.tjmBack }}</span>
                    <span class="rf-pricing__tjm-unit">{{ offer.unit }}</span>
                    <span class="rf-pricing__tjm-label">avec back</span>
                  </li>
                </ul>
              </template>
              <template v-else>
                <span class="rf-pricing__card-price-note">Tarif</span>
                <p class="rf-pricing__card-price-value rf-pricing__card-price-value--soft">
                  <span>Sur devis</span>
                </p>
              </template>
              <p class="rf-pricing__card-duration">{{ offer.duration }}</p>
            </div>

            <ul class="rf-pricing__card-list">
              <li v-for="item in offer.includes" :key="item">{{ item }}</li>
            </ul>

            <div class="rf-pricing__card-stack">
              <span v-for="tech in offer.stack" :key="tech">{{ tech }}</span>
            </div>

            <p class="rf-pricing__card-fit">{{ offer.fit }}</p>

            <a
              href="/contact"
              class="refonte-btn rf-pricing__cta"
              :class="offer.featured ? '' : 'refonte-btn--ghost'"
              @click="goContact"
            >
              {{ offer.showTjm ? 'Mission' : 'Devis' }}
            </a>
          </article>
        </div>
      </div>
    </div>

    <section
      v-if="showExtras"
      class="refonte-container rf-pricing__extras"
    >
      <div class="rf-pricing__extras-head" v-reveal>
        <p class="refonte-label">Options</p>
        <h2 class="refonte-display rf-pricing__extras-title">À la carte</h2>
        <p class="rf-pricing__extras-lead">
          Uniquement pour les offres sur devis — chiffrées avec le brief.
        </p>
      </div>
      <ul class="rf-pricing__extras-list">
        <li
          v-for="(extra, i) in extras"
          :key="extra.label"
          class="rf-pricing__extras-row"
          v-reveal="{ index: i, total: extras.length, stagger: 55 }"
        >
          <span>{{ extra.label }}</span>
          <span class="rf-pricing__extras-value">{{ extra.value }}</span>
        </li>
      </ul>
    </section>

    <section
      id="rf-pricing-conditions"
      class="refonte-container rf-pricing__note"
      v-reveal
    >
      <p class="refonte-label">Conditions</p>
      <h2 class="refonte-display rf-pricing__note-title">
        Comment ça démarre
      </h2>
      <p class="rf-pricing__note-intro">
        Les règles ne sont pas les mêmes selon le cadre. Choisissez le mode qui correspond :
      </p>

      <div class="rf-pricing__terms-switch" role="tablist" aria-label="Type de conditions">
        <button
          type="button"
          class="rf-pricing__terms-tab"
          role="tab"
          :aria-selected="termsMode === 'mission'"
          :class="{ 'is-active': termsMode === 'mission' }"
          @click="termsMode = 'mission'"
        >
          Mission
        </button>
        <button
          type="button"
          class="rf-pricing__terms-tab"
          role="tab"
          :aria-selected="termsMode === 'devis'"
          :class="{ 'is-active': termsMode === 'devis' }"
          @click="termsMode = 'devis'"
        >
          Devis
        </button>
      </div>

      <ol class="rf-pricing__terms">
        <li v-for="term in activeTerms" :key="term.title">
          <strong>{{ term.title }}</strong>
          <span>{{ term.text }}</span>
        </li>
      </ol>
      <p class="rf-pricing__terms-aside">
        Facturation en HT (TVA selon régime). En cas d’annulation après démarrage, le travail
        déjà réalisé reste dû.
      </p>
      <a href="/contact" class="refonte-link rf-pricing__note-cta" @click="goContact">
        Contact →
      </a>
    </section>
  </div>
</template>

<style scoped>
.rf-pricing {
  padding-block: clamp(2.5rem, 6vw, 4rem) clamp(4rem, 10vw, 7rem);
}

.rf-pricing__hero {
  display: grid;
  gap: 0.85rem;
  max-width: 42rem;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
}

.rf-pricing__title {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  line-height: 1;
}

.rf-pricing__title-accent {
  color: var(--rf-accent);
}

.rf-pricing__lead {
  margin: 0.35rem 0 0;
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--rf-text-soft);
}

.rf-pricing__availability {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-pricing__jump {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.35rem;
  width: fit-content;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-accent);
  text-decoration: none;
}

.rf-pricing__jump-arrow {
  width: 0.55rem;
  height: 0.55rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  animation: rf-pricing-bounce 1.4s var(--rf-ease) infinite;
}

@keyframes rf-pricing-bounce {
  0%,
  100% {
    transform: rotate(45deg) translate(0, 0);
    opacity: 0.55;
  }
  50% {
    transform: rotate(45deg) translate(2px, 3px);
    opacity: 1;
  }
}

.rf-pricing__offers {
  display: grid;
  gap: 1.5rem;
}

.rf-pricing__tabs-track {
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid var(--rf-line);
}

.rf-pricing__tabs-track::-webkit-scrollbar {
  display: none;
}

.rf-pricing__tabs {
  display: flex;
  gap: 0.25rem;
  min-width: min-content;
}

.rf-pricing__tab {
  display: grid;
  gap: 0.15rem;
  flex: 1 1 0;
  min-width: 8rem;
  padding: 0.85rem 1rem 1rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--rf-text-muted);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition:
    color 0.2s var(--rf-ease),
    border-color 0.2s var(--rf-ease),
    background 0.2s var(--rf-ease);
}

.rf-pricing__tab:hover:not(.is-active) {
  color: var(--rf-text-soft);
  background: var(--rf-hover-wash);
}

.rf-pricing__tab.is-active {
  color: var(--rf-text);
  border-bottom-color: var(--rf-accent);
  background: rgba(var(--rf-accent-rgb), 0.05);
}

.rf-pricing__tab-num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 0.78rem;
  color: var(--rf-accent);
}

.rf-pricing__tab-label {
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.rf-pricing__panel {
  display: grid;
  gap: 1.25rem;
  padding-top: 1.35rem;
}

.rf-pricing__panel-lead {
  margin: 0;
  max-width: 48rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--rf-text-soft);
}

.rf-pricing__cards {
  display: grid;
  gap: 1.25rem;
}

.rf-pricing__cards.is-single {
  max-width: 36rem;
  margin-inline: auto;
  width: 100%;
}

@media (min-width: 900px) {
  .rf-pricing__cards:not(.is-single) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }
}

.rf-pricing__card {
  display: grid;
  grid-template-rows: auto auto 1fr auto auto auto;
  gap: 1.1rem;
  padding: clamp(1.35rem, 3vw, 1.75rem);
  border: 1px solid var(--rf-line);
  border-radius: var(--rf-radius);
  background: var(--rf-hover-wash);
  color: var(--rf-text);
}

.rf-pricing__card.is-featured {
  border-color: rgba(var(--rf-accent-rgb), 0.55);
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--rf-accent-rgb), 0.1), transparent 60%),
    var(--rf-hover-wash);
  box-shadow: 0 0 0 1px rgba(var(--rf-accent-rgb), 0.12);
}

.rf-pricing__card-head {
  display: grid;
  gap: 0.3rem;
}

.rf-pricing__card-name {
  margin: 0;
  font-size: clamp(1.25rem, 2.4vw, 1.55rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.rf-pricing__card-tagline {
  margin: 0;
  font-size: 0.88rem;
  color: var(--rf-text-muted);
  line-height: 1.45;
}

.rf-pricing__card-price-note {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-pricing__card-price-value {
  margin: 0.2rem 0 0;
  font-size: clamp(2.3rem, 5vw, 3.1rem);
  line-height: 1;
  color: var(--rf-accent);
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.rf-pricing__tjm {
  margin: 0.45rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}

.rf-pricing__tjm li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.5rem;
}

.rf-pricing__tjm-value {
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  line-height: 1;
  color: var(--rf-accent);
}

.rf-pricing__tjm-unit {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--rf-text-soft);
}

.rf-pricing__tjm-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-pricing__card-price-value--soft {
  font-size: clamp(1.45rem, 3vw, 1.85rem);
  font-family: var(--rf-sans);
  font-weight: 700;
  color: var(--rf-text-soft);
}

.rf-pricing__card-price-unit {
  font-family: var(--rf-sans);
  font-size: 1rem;
  font-weight: 700;
  color: var(--rf-text-soft);
}

.rf-pricing__card-duration {
  margin: 0.45rem 0 0;
  font-size: 0.78rem;
  color: var(--rf-text-muted);
}

.rf-pricing__cta {
  width: fit-content;
  justify-self: start;
  padding-inline: 1.25rem;
  background: var(--rf-text);
  color: var(--rf-bg);
  border: 1px solid var(--rf-text);
}

.rf-pricing__cta:hover {
  background: var(--rf-accent);
  border-color: var(--rf-accent);
  color: #ffffff;
  transform: translateY(-2px);
}

.rf-pricing__cta.refonte-btn--ghost {
  background: transparent;
  color: var(--rf-text);
  border: 1px solid var(--rf-text);
}

.rf-pricing__cta.refonte-btn--ghost:hover {
  background: var(--rf-text);
  color: var(--rf-bg);
  border-color: var(--rf-text);
}

.rf-pricing__card-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.45rem;
}

.rf-pricing__card-list li {
  position: relative;
  padding-left: 1.1rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--rf-text-soft);
}

.rf-pricing__card-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--rf-accent);
}

.rf-pricing__card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.rf-pricing__card-stack span {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.3rem 0.6rem;
  border: 1px solid rgba(var(--rf-accent-rgb), 0.4);
  border-radius: 999px;
  color: var(--rf-accent);
}

.rf-pricing__card-fit {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--rf-text-muted);
}

.rf-pricing__extras {
  margin-top: clamp(3rem, 8vw, 5rem);
  display: grid;
  gap: 1.25rem;
}

.rf-pricing__extras-title {
  margin: 0.35rem 0 0;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.rf-pricing__extras-lead {
  margin: 0.45rem 0 0;
  font-size: 0.88rem;
  color: var(--rf-text-muted);
}

.rf-pricing__extras-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--rf-line);
}

.rf-pricing__extras-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--rf-line);
  font-size: 0.92rem;
}

.rf-pricing__extras-value {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--rf-text-muted);
}

.rf-pricing__note {
  margin-top: clamp(3rem, 8vw, 5rem);
  display: grid;
  gap: 0.85rem;
  max-width: 40rem;
  scroll-margin-top: calc(var(--rf-nav-h) + 1rem);
}

.rf-pricing__note-title {
  margin: 0;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.rf-pricing__note-intro {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--rf-text-soft);
}

.rf-pricing__terms-switch {
  display: inline-flex;
  gap: 0.35rem;
  padding: 0.25rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
  width: fit-content;
}

.rf-pricing__terms-tab {
  padding: 0.45rem 1rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--rf-text-muted);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    color 0.2s var(--rf-ease),
    background 0.2s var(--rf-ease);
}

.rf-pricing__terms-tab.is-active {
  background: rgba(var(--rf-accent-rgb), 0.16);
  color: var(--rf-accent);
}

.rf-pricing__terms {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.85rem;
}

.rf-pricing__terms li {
  display: grid;
  gap: 0.25rem;
}

.rf-pricing__terms strong {
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--rf-accent);
}

.rf-pricing__terms span {
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--rf-text-soft);
}

.rf-pricing__terms-aside {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--rf-text-muted);
}

.rf-pricing__note-cta {
  margin-top: 0.5rem;
  justify-self: start;
}

@media (prefers-reduced-motion: reduce) {
  .rf-pricing__jump-arrow {
    animation: none;
  }
}
</style>
