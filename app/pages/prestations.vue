<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'
import { MISSION_OFFER, PAGE_UNIQUE, SITE_MULTIPAGE } from '@/data/refonte-offers'

definePageMeta({ layout: 'refonte' })

const { meta, sections } = useContent()
const { navigateTo } = useRefonteTransition()

useSeoMeta({
  title: computed(() => `Prestations — ${meta.value?.name ?? 'Portfolio'}`),
  description:
    'Offres web sur devis et missions front Vue/Nuxt au TJM 500 €.',
  ogTitle: computed(() => `Prestations — ${meta.value?.name ?? 'Portfolio'}`),
  ogDescription:
    'Landing, multipage, sur-mesure sur devis. Missions front Vue/Nuxt au TJM 500 €.',
  twitterCard: 'summary_large_image'
})

type Offer = {
  id: string
  name: string
  tagline: string
  showTjm?: boolean
  tjmFront?: string
  price?: string
  priceNote?: string
  unit?: string
  duration: string
  featured: boolean
  copy?: {
    hook: string
    lines: readonly string[]
    close: string
  }
  skillsTitle?: string
  billing?: string
  includes: readonly string[]
  stack: readonly string[]
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

function offerFromPane(
  pane: {
    id: string
    name: string
    tagline: string
    duration: string
    copy: Offer['copy']
    skillsTitle: string
    includes: readonly string[]
    stack: readonly string[]
    fit: string
  },
  featured: boolean
): Offer {
  return {
    id: pane.id,
    name: pane.name,
    tagline: pane.tagline,
    duration: pane.duration,
    featured,
    copy: pane.copy,
    skillsTitle: pane.skillsTitle,
    includes: pane.includes,
    stack: pane.stack,
    fit: pane.fit
  }
}

const categories: Category[] = [
  {
    id: 'mission',
    tab: 'Mission',
    num: MISSION_OFFER.num,
    kind: 'mission',
    lead: MISSION_OFFER.tagline,
    offers: [
      {
        id: 'mission',
        name: MISSION_OFFER.name,
        tagline: MISSION_OFFER.tagline,
        showTjm: true,
        tjmFront: MISSION_OFFER.tjm,
        priceNote: 'TJM',
        unit: MISSION_OFFER.unit,
        duration: MISSION_OFFER.duration,
        featured: true,
        copy: MISSION_OFFER.copy,
        skillsTitle: MISSION_OFFER.skillsTitle,
        billing: MISSION_OFFER.billing,
        includes: MISSION_OFFER.includes,
        stack: MISSION_OFFER.stack,
        fit: MISSION_OFFER.fit
      }
    ]
  },
  {
    id: 'onepage',
    tab: 'Page unique',
    num: PAGE_UNIQUE.num,
    kind: 'devis',
    lead: PAGE_UNIQUE.lead,
    offers: PAGE_UNIQUE.panes.map((pane, index) => offerFromPane(pane, index === 1))
  },
  {
    id: 'multipage',
    tab: 'Site multipage',
    num: SITE_MULTIPAGE.num,
    kind: 'devis',
    lead: SITE_MULTIPAGE.lead,
    offers: SITE_MULTIPAGE.panes.map((pane, index) => offerFromPane(pane, index === 1))
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

const activeId = ref<CategoryId>('mission')
const activeCategory = computed(
  () => categories.find((category) => category.id === activeId.value) ?? categories[0]
)
const accordionMode = ref(true)
const termsMode = computed(() => activeCategory.value.kind)
const activeTerms = computed(() =>
  termsMode.value === 'mission' ? termsMission : termsDevis
)

const switchSets = {
  onepage: PAGE_UNIQUE,
  multipage: SITE_MULTIPAGE
} as const

const switchSet = computed(() => switchSets[activeId.value as keyof typeof switchSets] ?? null)
const switchPaneId = ref(PAGE_UNIQUE.panes[0].id)
const switchLabel = computed(() =>
  activeId.value === 'multipage' ? 'Type de site multipage' : 'Type de page unique'
)

const visibleOffers = computed(() => {
  if (!switchSet.value) return activeCategory.value.offers
  return activeCategory.value.offers.filter((offer) => offer.id === switchPaneId.value)
})

function selectSwitchPane(id: string) {
  switchPaneId.value = id
}

function onSwitchPaneKeydown(event: KeyboardEvent, index: number) {
  const panes = switchSet.value?.panes
  if (!panes?.length) return

  let next = index
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % panes.length
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + panes.length) % panes.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = panes.length - 1
  else return

  event.preventDefault()
  switchPaneId.value = panes[next].id
  document.getElementById(`rf-pricing-switch-tab-${panes[next].id}`)?.focus()
}

const termsMission = [
  {
    title: 'Cadre',
    text: 'Mission au TJM : 500 € HT / jour. Facturation au réel.'
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
    text: 'Facturation en fin de chaque mois, au réel des jours effectués.'
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

const openOfferId = ref<string | null>(defaultOpenOfferId())

watch(activeId, (id) => {
  const set = switchSets[id as keyof typeof switchSets]
  if (set) switchPaneId.value = set.panes[0].id
  openOfferId.value = defaultOpenOfferId()
})

watch(switchPaneId, (id) => {
  if (switchSet.value && openOfferId.value) openOfferId.value = id
})

function defaultOpenOfferId() {
  return null
}

function isOfferOpen(id: string) {
  return !accordionMode.value || openOfferId.value === id
}

function toggleOffer(id: string) {
  if (!accordionMode.value) return
  openOfferId.value = openOfferId.value === id ? null : id
}

function selectCategory(id: CategoryId) {
  activeId.value = id
  if (!accordionMode.value) return
  nextTick(() => {
    document.getElementById(`rf-pricing-tab-${id}`)?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth'
    })
  })
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

onMounted(() => {
  const mq = window.matchMedia('(max-width: 899px)')
  const apply = () => {
    accordionMode.value = mq.matches
  }
  apply()
  mq.addEventListener('change', apply)
  onUnmounted(() => mq.removeEventListener('change', apply))
})
</script>

<template>
  <div class="rf-route">
    <div class="rf-page-ghost-wrap" aria-hidden="true">
      <span class="rf-page-ghost">03</span>
    </div>
    <div class="rf-pricing" data-scroll-section data-rf-chapter="Prestations">
    <header class="refonte-container rf-pricing__hero">
      <p class="refonte-label" v-reveal>03 — Prestations</p>
      <h1 class="refonte-display rf-pricing__title" v-reveal="{ delay: 50 }">
        Offres
        <span class="refonte-serif rf-pricing__title-accent">& missions</span>
      </h1>
      <p class="rf-pricing__lead" v-reveal="{ delay: 100 }">
        Forfaits chiffrés après brief, ou mission au TJM 500 € / jour.
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
        <p
          v-if="!switchSet"
          class="rf-pricing__panel-lead"
        >
          {{ activeCategory.lead }}
        </p>

        <div
          v-if="switchSet"
          class="rf-pricing__switch"
          role="tablist"
          :aria-label="switchLabel"
        >
          <button
            v-for="(pane, index) in switchSet.panes"
            :id="`rf-pricing-switch-tab-${pane.id}`"
            :key="pane.id"
            type="button"
            class="rf-pricing__switch-btn"
            role="tab"
            :aria-selected="switchPaneId === pane.id"
            :aria-controls="`rf-pricing-offer-${pane.id}`"
            :tabindex="switchPaneId === pane.id ? 0 : -1"
            :class="{ 'is-active': switchPaneId === pane.id }"
            @click="selectSwitchPane(pane.id)"
            @keydown="onSwitchPaneKeydown($event, index)"
          >
            {{ pane.name }}
          </button>
        </div>

        <div
          class="rf-pricing__cards"
          :class="{
            'is-single': visibleOffers.length === 1
          }"
        >
          <article
            v-for="offer in visibleOffers"
            :key="offer.id"
            class="rf-pricing__card"
            :class="{
              'is-featured': offer.featured,
              'is-open': isOfferOpen(offer.id)
            }"
          >
            <button
              type="button"
              class="rf-pricing__card-toggle"
              :aria-expanded="isOfferOpen(offer.id)"
              :aria-controls="`rf-pricing-offer-${offer.id}`"
              @click="toggleOffer(offer.id)"
            >
              <span class="rf-pricing__card-toggle-copy">
                <span class="rf-pricing__card-num" aria-hidden="true">{{ activeCategory.num }}</span>
                <h2 class="rf-pricing__card-name">{{ offer.name }}</h2>
                <p class="rf-pricing__card-tagline">{{ offer.tagline }}</p>
              </span>
              <span class="rf-pricing__card-icon" aria-hidden="true">{{
                isOfferOpen(offer.id) ? '×' : '+'
              }}</span>
            </button>

            <div
              :id="`rf-pricing-offer-${offer.id}`"
              class="rf-pricing__card-body"
              :hidden="!isOfferOpen(offer.id)"
            >
            <div class="rf-pricing__card-price">
              <template v-if="offer.showTjm && offer.tjmFront">
                <span class="rf-pricing__card-price-note">{{ offer.priceNote }}</span>
                <ul class="rf-pricing__tjm">
                  <li>
                    <span class="refonte-serif rf-pricing__tjm-value">{{ offer.tjmFront }}</span>
                    <span class="rf-pricing__tjm-unit">{{ offer.unit }}</span>
                  </li>
                </ul>
                <p class="rf-pricing__card-duration">{{ offer.duration }}</p>
              </template>
              <template v-else>
                <span class="rf-pricing__card-price-note">Tarif</span>
                <p class="rf-pricing__card-price-value rf-pricing__card-price-value--soft">
                  <span>Sur devis</span>
                </p>
                <p class="rf-pricing__card-duration">{{ offer.duration }}</p>
              </template>
            </div>

            <div v-if="offer.copy" class="rf-pricing__copy">
              <p class="rf-pricing__copy-hook">{{ offer.copy.hook }}</p>
              <p v-for="line in offer.copy.lines" :key="line" class="rf-pricing__copy-line">
                {{ line }}
              </p>
              <p class="rf-pricing__copy-close">{{ offer.copy.close }}</p>
            </div>

            <p v-if="offer.skillsTitle" class="rf-pricing__skills-title">{{ offer.skillsTitle }}</p>

            <ul class="rf-pricing__card-list">
              <li v-for="item in offer.includes" :key="item">{{ item }}</li>
            </ul>

            <div class="rf-pricing__card-stack">
              <span v-for="tech in offer.stack" :key="tech">{{ tech }}</span>
            </div>

            <p class="rf-pricing__card-fit">{{ offer.fit }}</p>
            <p v-if="offer.billing" class="rf-pricing__card-billing">{{ offer.billing }}</p>

            <a
              href="/contact"
              class="refonte-btn refonte-btn--ghost rf-pricing__cta"
              @click="goContact"
            >
              {{ offer.showTjm ? 'Mission' : 'Devis' }}
            </a>
            </div>
          </article>
        </div>
      </div>
    </div>

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
        Les règles suivent le cadre de l’onglet choisi : mission au TJM, ou devis pour les autres offres.
      </p>

      <div
        v-if="activeCategory.kind === 'devis'"
        class="rf-pricing__terms-switch"
        role="tablist"
        aria-label="Type de conditions"
      >
        <button
          type="button"
          class="rf-pricing__terms-tab"
          role="tab"
          :aria-selected="termsMode === 'mission'"
          :aria-disabled="termsMode !== 'mission'"
          :disabled="termsMode !== 'mission'"
          :class="{ 'is-active': termsMode === 'mission' }"
        >
          Mission
        </button>
        <button
          type="button"
          class="rf-pricing__terms-tab"
          role="tab"
          :aria-selected="termsMode === 'devis'"
          :aria-disabled="termsMode !== 'devis'"
          :disabled="termsMode !== 'devis'"
          :class="{ 'is-active': termsMode === 'devis' }"
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
      <a
        href="/contact"
        class="refonte-btn rf-pricing__note-cta"
        @click="goContact"
      >
        Contact
      </a>
    </section>
    </div>
  </div>
</template>

<style scoped>
.rf-pricing {
  position: relative;
  padding-block: clamp(2.5rem, 6vw, 4rem) clamp(4rem, 10vw, 7rem);
}

.rf-pricing__hero,
.rf-pricing__offers {
  position: relative;
  z-index: 1;
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
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  border-bottom: 1px solid var(--rf-line);
}

.rf-pricing__tabs-track::-webkit-scrollbar {
  display: none;
}

.rf-pricing__tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 1.25rem;
  min-width: min-content;
}

.rf-pricing__tab {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  padding: 0.2rem 0 0.5rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--rf-text-muted);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  transition:
    color 0.25s var(--rf-ease),
    border-color 0.25s var(--rf-ease),
    opacity 0.25s var(--rf-ease);
}

.rf-pricing__tab:hover:not(.is-active) {
  opacity: 0.85;
}

.rf-pricing__tab.is-active {
  color: var(--rf-text);
  border-bottom-color: var(--rf-accent);
}

.rf-pricing__tab-num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 0.78rem;
  color: var(--rf-accent);
}

.rf-pricing__tab-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.2;
  white-space: nowrap;
}

.rf-pricing__tab.is-active .rf-pricing__tab-label {
  color: var(--rf-text);
}

@media (min-width: 768px) {
  .rf-pricing__tabs-track {
    overflow: visible;
  }

  .rf-pricing__tabs {
    gap: 0.25rem;
    width: 100%;
  }

  .rf-pricing__tab {
    flex: 1 1 0;
    display: grid;
    gap: 0.15rem;
    padding: 0.85rem 1rem 1rem;
    transition:
      color 0.2s var(--rf-ease),
      border-color 0.2s var(--rf-ease),
      background 0.2s var(--rf-ease);
  }

  .rf-pricing__tab:hover:not(.is-active) {
    opacity: 1;
    color: var(--rf-text-soft);
    background: var(--rf-hover-wash);
  }

  .rf-pricing__tab.is-active {
    background: rgba(var(--rf-accent-rgb), 0.05);
  }

  .rf-pricing__tab-label {
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    white-space: normal;
  }
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

.rf-pricing__switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  width: 100%;
  max-width: 36rem;
  margin: 0 auto 1rem;
  padding: 0.25rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
}

.rf-pricing__switch-btn {
  min-width: 0;
  padding: 0.5rem 0.65rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--rf-text-muted);
  font-family: inherit;
  font-size: clamp(0.62rem, 1.7vw, 0.72rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  line-height: 1.2;
  cursor: pointer;
  transition:
    color 0.2s var(--rf-ease),
    background 0.2s var(--rf-ease);
}

.rf-pricing__switch-btn.is-active {
  background: rgba(var(--rf-accent-rgb), 0.16);
  color: var(--rf-accent);
}

.rf-pricing__switch-btn:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 2px;
}

.rf-pricing__cards {
  display: grid;
  gap: 1.15rem;
}

.rf-pricing__cards.is-single {
  max-width: none;
  margin-inline: 0;
  width: 100%;
}

@media (min-width: 900px) {
  .rf-pricing__cards {
    gap: 1.25rem;
  }

  .rf-pricing__cards.is-single {
    max-width: 36rem;
    margin-inline: auto;
  }

  .rf-pricing__cards:not(.is-single):not(.is-split) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }

  .rf-pricing__cards.is-split {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 1.5rem 2rem;
    max-width: none;
    margin-inline: 0;
    align-items: stretch;
    background: transparent;
  }
}

.rf-pricing__card {
  display: grid;
  align-content: start;
  gap: 0;
  color: var(--rf-text);
  padding: 0.95rem 1.1rem 1.05rem;
  border: 1px solid var(--rf-line);
  border-radius: var(--rf-radius);
  background: var(--rf-hover-wash);
}

.rf-pricing__card.is-featured {
  border-color: rgba(var(--rf-accent-rgb), 0.5);
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--rf-accent-rgb), 0.1), transparent 60%),
    var(--rf-hover-wash);
}

.rf-pricing__card-toggle {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.rf-pricing__card-toggle:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 3px;
  border-radius: 4px;
}

.rf-pricing__card-toggle-copy {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.rf-pricing__card-num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 0.82rem;
  color: var(--rf-accent);
}

.rf-pricing__card-icon {
  flex-shrink: 0;
  width: 1rem;
  margin-top: 0.15rem;
  color: var(--rf-text-muted);
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1;
  text-align: center;
}

.rf-pricing__card.is-open .rf-pricing__card-icon {
  color: var(--rf-accent);
  font-size: 1.35rem;
  font-weight: 200;
}

.rf-pricing__card-body {
  display: grid;
  gap: 1.1rem;
  padding-top: 0.75rem;
}

.rf-pricing__card-body[hidden] {
  display: none;
}

.rf-pricing__card.is-open .rf-pricing__card-body {
  display: grid;
}

@media (min-width: 900px) {
  .rf-pricing__card {
    min-height: 100%;
    padding: clamp(1.35rem, 3vw, 1.85rem);
  }

  .rf-pricing__card.is-featured {
    border-color: rgba(var(--rf-accent-rgb), 0.55);
    background:
      radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--rf-accent-rgb), 0.1), transparent 60%),
      var(--rf-hover-wash);
  }

  .rf-pricing__card-toggle {
    padding: 0;
    cursor: default;
    pointer-events: none;
  }

  .rf-pricing__card-icon {
    display: none;
  }

  .rf-pricing__card-body,
  .rf-pricing__card.is-open .rf-pricing__card-body,
  .rf-pricing__card-body[hidden] {
    display: grid !important;
    padding: 0;
  }
}

.rf-pricing__card-name {
  margin: 0;
  font-size: clamp(1.35rem, 2.6vw, 1.7rem);
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
  gap: 0.75rem 1.25rem;
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

.rf-pricing__how {
  display: grid;
  gap: 0.85rem;
  padding: 1.25rem 0 0.25rem;
  scroll-margin-top: calc(var(--rf-nav-h) + 1rem);
}

.rf-pricing__how .rf-pricing__note-title {
  margin: 0;
}

.rf-pricing__how .rf-pricing__terms {
  margin-top: 0;
}

.rf-pricing__how .rf-pricing__note-cta {
  margin-top: 0.15rem;
}

@media (min-width: 900px) {
  .rf-pricing__cards.is-split .rf-pricing__card,
  .rf-pricing__cards.is-split .rf-pricing__card.is-featured {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    border: none;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
  }

  .rf-pricing__how {
    display: grid;
    align-content: center;
    height: 100%;
    padding: 0;
    border: none;
  }
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

.rf-pricing__copy {
  display: grid;
  gap: 0.45rem;
  margin: 0 0 0.35rem;
}

.rf-pricing__copy-hook {
  margin: 0;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.25;
  color: var(--rf-text);
}

.rf-pricing__copy-line {
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--rf-text-soft);
}

.rf-pricing__copy-close {
  margin: 0.2rem 0 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.35;
  color: var(--rf-accent);
}

.rf-pricing__skills-title {
  margin: 0.2rem 0 0;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-pricing__card-billing {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--rf-text-soft);
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
  max-width: 100%;
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
  cursor: default;
}

.rf-pricing__terms-tab:disabled:not(.is-active) {
  cursor: not-allowed;
  opacity: 0.4;
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
  margin-top: 0.35rem;
  width: fit-content;
  justify-self: start;
}

.rf-pricing__note-cta:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .rf-pricing__jump-arrow {
    animation: none;
  }
}
</style>
