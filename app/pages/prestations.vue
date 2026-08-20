<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'

definePageMeta({ layout: 'refonte' })

const { meta, sections } = useContent()
const { navigateTo } = useRefonteTransition()

useSeoMeta({
  title: computed(() => `Prestations — ${meta.value?.name ?? 'Portfolio'}`),
  description:
    'Tarifs indicatifs : page unique, site multipage (avec ou sans backend), et projets sur-mesure (Nuxt, Vue, motion, Supabase).',
  ogTitle: computed(() => `Prestations — ${meta.value?.name ?? 'Portfolio'}`),
  ogDescription:
    'Tarifs indicatifs : page unique, site multipage (avec ou sans backend), et projets sur-mesure.',
  twitterCard: 'summary_large_image'
})

type Offer = {
  id: string
  name: string
  tagline: string
  price: string
  priceNote: string
  unit: string
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
  offers: Offer[]
}

const categories: Category[] = [
  {
    id: 'onepage',
    tab: 'Page unique',
    num: '01',
    lead: 'Une seule page pour convertir — version statique ou branchée à un backend léger.',
    offers: [
      {
        id: 'landing',
        name: 'Landing page',
        tagline: 'Une page, un message, un CTA.',
        price: '450',
        priceNote: 'à partir de',
        unit: '€',
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
        price: '900',
        priceNote: 'à partir de',
        unit: '€',
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
        stack: ['Nuxt 4', 'Vue 3', 'Supabase', 'Pinia'],
        fit: 'Lead gen, waitlist, contenu qui change souvent.'
      }
    ]
  },
  {
    id: 'multipage',
    tab: 'Site multipage',
    num: '02',
    lead: 'Plusieurs pages pour présenter l’offre — avec ou sans admin / données dynamiques.',
    offers: [
      {
        id: 'vitrine',
        name: 'Site vitrine',
        tagline: 'Présence claire, rapide, soignée.',
        price: '900',
        priceNote: 'à partir de',
        unit: '€',
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
        price: '1 800',
        priceNote: 'à partir de',
        unit: '€',
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
        stack: ['Nuxt 4', 'Vue 3', 'Supabase', 'Pinia'],
        fit: 'Offres qui changent, catalogue, portfolio client.'
      }
    ]
  },
  {
    id: 'custom',
    tab: 'Sur-mesure',
    num: '03',
    lead: 'Motion, parcours riches, CMS ou contraintes fortes — chiffrage après brief.',
    offers: [
      {
        id: 'complexe',
        name: 'Projet complexe',
        tagline: 'Motion, parcours, exigences fortes.',
        price: 'Sur devis',
        priceNote: 'budget type',
        unit: '',
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

const activeId = ref<CategoryId>('onepage')
const activeCategory = computed(
  () => categories.find((category) => category.id === activeId.value) ?? categories[0]
)

const extras = [
  { label: 'Motion / GSAP poussé', value: 'à partir de 600 €' },
  { label: 'Page additionnelle', value: 'à partir de 250 €' },
  { label: 'Maintenance mensuelle', value: 'à partir de 180 € / mois' },
  { label: 'Audit a11y ou perf', value: 'à partir de 450 €' }
]

/** Conditions commerciales communes (acompte ≠ arrhes). */
const DEPOSIT_RATE = 0.4

const paymentTerms = [
  {
    title: 'Devis visé',
    text: 'Le devis est accepté par signature ou « bon pour accord ». Ce visa formalise la commande.'
  },
  {
    title: 'Acompte à la commande',
    text: 'Un acompte de 40 % du montant HT est versé à la signature. Il est déduit de la facture finale.'
  },
  {
    title: 'Démarrage de mission',
    text: 'La mission commence uniquement après devis visé et réception de l’acompte.'
  },
  {
    title: 'Solde à la livraison',
    text: 'Le solde (60 %) est dû à la livraison / réception des livrables, sauf échéancier convenu au devis.'
  }
]

function parsePriceEuro(price: string): number | null {
  const digits = price.replace(/\s/g, '').replace(/[^\d]/g, '')
  if (!digits) return null
  return Number.parseInt(digits, 10)
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}

function depositLabel(offer: Offer): string {
  const total = parsePriceEuro(offer.price)
  if (total == null) {
    return 'Acompte 40 % HT à la commande · solde à la livraison (selon devis)'
  }
  const deposit = Math.round(total * DEPOSIT_RATE)
  const balance = total - deposit
  return `Acompte ${formatEuro(deposit)} HT (40 %) · solde ${formatEuro(balance)} HT`
}

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
        Tarifs
        <span class="refonte-serif rf-pricing__title-accent">clairs</span>
      </h1>
      <p class="rf-pricing__lead" v-reveal="{ delay: 100 }">
        Trois familles d’offres — Vue / Nuxt 4, motion, intégration soignée et backends légers
        (Supabase / Firebase). Montants indicatifs HT. Mission démarrée après devis visé
        (« bon pour accord ») et versement de l’acompte.
      </p>
      <p class="rf-pricing__availability" v-reveal="{ delay: 140 }">
        {{ sections.a_propos.availability }}
      </p>
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
              <span class="rf-pricing__card-price-note">{{ offer.priceNote }}</span>
              <p class="rf-pricing__card-price-value">
                <span class="refonte-serif">{{ offer.price }}</span>
                <span v-if="offer.unit" class="rf-pricing__card-price-unit">{{ offer.unit }}</span>
              </p>
              <p class="rf-pricing__card-duration">{{ offer.duration }}</p>
              <p class="rf-pricing__card-deposit">
                {{ depositLabel(offer) }}
              </p>
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
              class="refonte-btn"
              :class="offer.featured ? '' : 'refonte-btn--ghost'"
              @click="goContact"
            >
              Demander un devis
            </a>
          </article>
        </div>
      </div>
    </div>

    <section class="refonte-container rf-pricing__extras">
      <div class="rf-pricing__extras-head" v-reveal>
        <p class="refonte-label">Options</p>
        <h2 class="refonte-display rf-pricing__extras-title">À la carte</h2>
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

    <section class="refonte-container rf-pricing__note" v-reveal>
      <p class="refonte-label">Conditions</p>
      <h2 class="refonte-display rf-pricing__note-title">
        Devis visé → acompte → mission
      </h2>
      <p class="rf-pricing__note-intro">
        Chaque projet commence par un brief (objectifs, contenus, délais). Le tarif final dépend
        du volume, du motion, des intégrations et des contenus fournis. Ensuite :
      </p>
      <ol class="rf-pricing__terms">
        <li v-for="term in paymentTerms" :key="term.title">
          <strong>{{ term.title }}</strong>
          <span>{{ term.text }}</span>
        </li>
      </ol>
      <p class="rf-pricing__terms-aside">
        L’acompte n’est pas des arrhes : en cas d’annulation après démarrage, les sommes
        correspondant au travail déjà réalisé restent dues. Facturation en HT (TVA selon régime).
      </p>
      <a href="/contact" class="refonte-link rf-pricing__note-cta" @click="goContact">
        Parler de votre projet →
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
  background: rgba(255, 255, 255, 0.03);
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
  opacity: 0.7;
}

.rf-pricing__tab-label {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.rf-pricing__panel {
  display: grid;
  gap: 1.25rem;
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

@media (min-width: 900px) {
  .rf-pricing__cards:not(.is-single) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }

  .rf-pricing__cards.is-single {
    max-width: 36rem;
  }
}

.rf-pricing__card {
  display: grid;
  grid-template-rows: auto auto 1fr auto auto auto;
  gap: 1.1rem;
  padding: clamp(1.35rem, 3vw, 1.75rem);
  border: 1px solid var(--rf-line);
  border-radius: var(--rf-radius);
  background: rgba(255, 255, 255, 0.03);
  color: var(--rf-text);
}

.rf-pricing__card.is-featured {
  border-color: rgba(var(--rf-accent-rgb), 0.55);
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--rf-accent-rgb), 0.1), transparent 60%),
    rgba(255, 255, 255, 0.04);
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

.rf-pricing__card-deposit {
  margin: 0.55rem 0 0;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.01em;
  color: var(--rf-accent);
}

.rf-pricing__card-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}

.rf-pricing__card-list li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--rf-text-soft);
}

.rf-pricing__card-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: var(--rf-accent);
}

.rf-pricing__card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.rf-pricing__card-stack span {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.28rem 0.55rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
  color: var(--rf-text-muted);
}

.rf-pricing__card-fit {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--rf-text-muted);
}

.rf-pricing__card .refonte-btn {
  justify-self: start;
  margin-top: 0.15rem;
}

.rf-pricing__extras {
  margin-top: clamp(3.5rem, 8vw, 5rem);
  padding-top: clamp(2rem, 4vw, 2.75rem);
  border-top: 1px solid var(--rf-line);
}

.rf-pricing__extras-title {
  margin: 0.35rem 0 0;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.rf-pricing__extras-list {
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}

.rf-pricing__extras-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding-block: 1rem;
  border-bottom: 1px solid var(--rf-line);
  font-size: 0.95rem;
  color: var(--rf-text-soft);
}

.rf-pricing__extras-value {
  font-weight: 700;
  color: var(--rf-accent);
  font-variant-numeric: tabular-nums;
}

.rf-pricing__note {
  margin-top: clamp(3rem, 7vw, 4.5rem);
  display: grid;
  gap: 0.85rem;
  max-width: 44rem;
}

.rf-pricing__note-title {
  margin: 0;
  font-size: clamp(1.5rem, 3.5vw, 2.15rem);
}

.rf-pricing__note-intro,
.rf-pricing__terms-aside {
  margin: 0;
  line-height: 1.65;
  color: var(--rf-text-soft);
}

.rf-pricing__terms {
  margin: 0.35rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.85rem;
  counter-reset: rf-term;
}

.rf-pricing__terms li {
  display: grid;
  gap: 0.25rem;
  padding-left: 2.1rem;
  position: relative;
  counter-increment: rf-term;
}

.rf-pricing__terms li::before {
  content: counter(rf-term, decimal-leading-zero);
  position: absolute;
  left: 0;
  top: 0.1em;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--rf-accent);
}

.rf-pricing__terms strong {
  font-size: 0.92rem;
  color: var(--rf-text);
}

.rf-pricing__terms span {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--rf-text-soft);
}

.rf-pricing__terms-aside {
  font-size: 0.82rem;
  color: var(--rf-text-muted);
}

.rf-pricing__note-cta {
  margin-top: 0.5rem;
  font-weight: 700;
  color: var(--rf-accent);
  width: fit-content;
}
</style>
