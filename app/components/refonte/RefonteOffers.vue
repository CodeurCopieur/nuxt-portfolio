<script setup lang="ts">
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'
import { MISSION_OFFER, PAGE_UNIQUE } from '@/data/refonte-offers'

const { bindScrollScrub, ready, refresh } = useRefonteScroll()
const { navigateTo } = useRefonteTransition()

const sectionRef = ref<HTMLElement | null>(null)

async function goPrestations(event?: MouseEvent) {
  event?.preventDefault()
  await navigateTo('/prestations')
}

let scrubCleanups: Array<() => void> = []

const cards = [
  {
    num: MISSION_OFFER.num,
    name: MISSION_OFFER.name,
    kind: 'mission' as const,
    tagline: MISSION_OFFER.tagline,
    lead: '',
    copy: MISSION_OFFER.copy,
    skillsTitle: MISSION_OFFER.skillsTitle,
    skills: [...MISSION_OFFER.includes],
    stack: [...MISSION_OFFER.stack],
    note: 'TJM',
    prices: [
      { value: MISSION_OFFER.tjm, unit: MISSION_OFFER.unit, label: '' }
    ],
    duration: MISSION_OFFER.duration,
    billing: MISSION_OFFER.billing,
    fit: MISSION_OFFER.fit,
    panes: [] as typeof PAGE_UNIQUE.panes[number][]
  },
  {
    num: PAGE_UNIQUE.num,
    name: PAGE_UNIQUE.name,
    kind: 'page' as const,
    tagline: PAGE_UNIQUE.tagline,
    lead: PAGE_UNIQUE.lead,
    copy: null,
    skillsTitle: '',
    skills: [] as string[],
    stack: [] as string[],
    note: 'Tarif',
    prices: [] as Array<{ value: string, unit: string, label: string }>,
    duration: '',
    billing: '',
    fit: '',
    panes: [...PAGE_UNIQUE.panes]
  }
]

function bindScrub() {
  scrubCleanups.forEach((fn) => fn())
  scrubCleanups = []
  if (!import.meta.client) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const section = sectionRef.value
  if (!section) return

  const nodes = Array.from(section.querySelectorAll<HTMLElement>('.rf-offers__card'))
  nodes.forEach((card, index) => {
    const cleanup = bindScrollScrub({
      trigger: card,
      targets: card,
      from: { y: 36 + index * 16 },
      to: { y: 0 },
      start: 'top 92%',
      end: 'top 58%'
    })
    scrubCleanups.push(cleanup)
  })
}

function bindWhenReady() {
  nextTick(() => {
    bindScrub()
    refresh()
  })
}

onMounted(bindWhenReady)
watch(ready, (isReady) => {
  if (isReady) bindWhenReady()
})

onUnmounted(() => {
  scrubCleanups.forEach((fn) => fn())
})

const accordionMode = ref(true)
const openCardKind = ref<string | null>(null)

function isCardOpen(kind: string) {
  return !accordionMode.value || openCardKind.value === kind
}

function toggleCard(kind: string) {
  if (!accordionMode.value) return
  openCardKind.value = openCardKind.value === kind ? null : kind
  nextTick(() => refresh())
}

onMounted(() => {
  const mq = window.matchMedia('(max-width: 959px)')
  const apply = () => {
    accordionMode.value = mq.matches
  }
  apply()
  mq.addEventListener('change', apply)
  onUnmounted(() => mq.removeEventListener('change', apply))
})

const pagePaneId = ref('landing')

const pageCard = computed(() => cards.find((card) => card.kind === 'page'))
const activePagePane = computed(
  () => pageCard.value?.panes.find((pane) => pane.id === pagePaneId.value) ?? pageCard.value?.panes[0]
)

function selectPagePane(id: string) {
  pagePaneId.value = id
}

function onPagePaneKeydown(event: KeyboardEvent, index: number) {
  const panes = pageCard.value?.panes ?? []
  if (!panes.length) return

  let next = index
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % panes.length
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + panes.length) % panes.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = panes.length - 1
  else return

  event.preventDefault()
  pagePaneId.value = panes[next].id
  document.getElementById(`rf-offers-tab-${panes[next].id}`)?.focus()
}
</script>

<template>
  <section
    id="rf-offers"
    ref="sectionRef"
    class="rf-offers"
    data-scroll-section
    data-rf-chapter="Prestations"
  >
    <div class="refonte-container">
      <header class="rf-offers__head">
        <p class="refonte-label" v-reveal>Prestations</p>
        <h2 class="refonte-display rf-offers__title" v-reveal="{ delay: 60 }">
          Mission
          <span class="refonte-serif rf-offers__title-accent">front-end</span>
        </h2>
        <p class="rf-offers__lead" v-reveal="{ delay: 110 }">
          Vue 3 / Nuxt 4, TypeScript, intégration soignée. Landing et landing + backend
          ci-dessous — tarifs et conditions sur la page Prestations.
        </p>
      </header>

      <div class="rf-offers__grid">
        <article
          v-for="(card, index) in cards"
          :key="card.name"
          class="rf-offers__card"
          :class="{
            'is-mission': card.kind === 'mission',
            'is-pages': card.kind === 'page',
            'is-open': isCardOpen(card.kind)
          }"
          :aria-labelledby="`rf-offers-card-${card.kind}`"
          v-reveal="{ index, total: cards.length, stagger: 110, distance: 40 }"
        >
          <button
            type="button"
            class="rf-offers__toggle"
            :aria-expanded="isCardOpen(card.kind)"
            :aria-controls="`rf-offers-body-${card.kind}`"
            @click="toggleCard(card.kind)"
          >
            <span class="rf-offers__toggle-copy">
              <span class="rf-offers__num" aria-hidden="true">{{ card.num }}</span>
              <h3 :id="`rf-offers-card-${card.kind}`" class="rf-offers__name">{{ card.name }}</h3>
              <p v-if="card.kind === 'mission'" class="rf-offers__tagline">{{ card.tagline }}</p>
            </span>
            <span class="rf-offers__icon" aria-hidden="true">{{
              isCardOpen(card.kind) ? '×' : '+'
            }}</span>
          </button>

          <div
            :id="`rf-offers-body-${card.kind}`"
            class="rf-offers__body-wrap"
            :hidden="!isCardOpen(card.kind)"
          >
          <template v-if="card.kind === 'mission'">
            <div v-if="card.copy" class="rf-offers__copy">
              <p class="rf-offers__hook">{{ card.copy.hook }}</p>
              <p v-for="line in card.copy.lines" :key="line" class="rf-offers__line">{{ line }}</p>
              <p class="rf-offers__close">{{ card.copy.close }}</p>
            </div>
            <p v-if="card.skillsTitle" class="rf-offers__skills-title">{{ card.skillsTitle }}</p>
            <ul class="rf-offers__skills">
              <li v-for="skill in card.skills" :key="skill">{{ skill }}</li>
            </ul>
            <div class="rf-offers__stack">
              <span v-for="tech in card.stack" :key="tech">{{ tech }}</span>
            </div>
            <p class="rf-offers__duration">{{ card.duration }}</p>
            <p class="rf-offers__fit">{{ card.fit }}</p>
          </template>

          <template v-else>
            <div
              class="rf-offers__switch"
              role="tablist"
              aria-label="Type de page unique"
            >
              <button
                v-for="(pane, paneIndex) in card.panes"
                :id="`rf-offers-tab-${pane.id}`"
                :key="pane.id"
                type="button"
                class="rf-offers__switch-btn"
                role="tab"
                :aria-selected="pagePaneId === pane.id"
                :aria-controls="`rf-offers-panel-${pane.id}`"
                :tabindex="pagePaneId === pane.id ? 0 : -1"
                :class="{ 'is-active': pagePaneId === pane.id }"
                @click="selectPagePane(pane.id)"
                @keydown="onPagePaneKeydown($event, paneIndex)"
              >
                {{ pane.name }}
              </button>
            </div>

            <section
              v-if="activePagePane"
              :id="`rf-offers-panel-${activePagePane.id}`"
              class="rf-offers__pane"
              role="tabpanel"
              :aria-labelledby="`rf-offers-tab-${activePagePane.id}`"
            >
              <div class="rf-offers__copy">
                <p class="rf-offers__hook">{{ activePagePane.copy.hook }}</p>
                <p v-for="line in activePagePane.copy.lines" :key="line" class="rf-offers__line">
                  {{ line }}
                </p>
                <p class="rf-offers__close">{{ activePagePane.copy.close }}</p>
              </div>
              <p class="rf-offers__skills-title">{{ activePagePane.skillsTitle }}</p>
              <ul class="rf-offers__skills">
                <li v-for="skill in activePagePane.includes" :key="skill">{{ skill }}</li>
              </ul>
              <div class="rf-offers__stack">
                <span v-for="tech in activePagePane.stack" :key="tech">{{ tech }}</span>
              </div>
              <p class="rf-offers__duration">{{ activePagePane.duration }}</p>
              <p class="rf-offers__fit">{{ activePagePane.fit }}</p>
            </section>
          </template>
          </div>
        </article>
      </div>

      <div class="rf-offers__more-wrap" v-reveal="{ delay: 160 }">
        <a
          href="/prestations"
          class="refonte-btn rf-offers__more"
          @click="goPrestations"
        >
          Voir plus
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rf-offers {
  padding-block: clamp(3.5rem, 9vw, 6.5rem);
}

.rf-offers__head {
  display: grid;
  gap: 0.7rem;
  max-width: 42rem;
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
}

.rf-offers__title {
  margin: 0;
  font-size: clamp(2.1rem, 5.5vw, 3.4rem);
  line-height: 1.05;
}

.rf-offers__title-accent {
  color: var(--rf-accent);
}

.rf-offers__lead {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--rf-text-soft);
}

.rf-offers__grid {
  display: grid;
  gap: 1.15rem;
}

@media (min-width: 960px) {
  .rf-offers__grid {
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }

  .rf-offers__card {
    min-height: 100%;
    padding: clamp(1.35rem, 3vw, 1.85rem);
  }

  .rf-offers__toggle {
    cursor: default;
    pointer-events: none;
  }

  .rf-offers__icon {
    display: none;
  }

  .rf-offers__body-wrap,
  .rf-offers__body-wrap[hidden] {
    display: grid !important;
    padding-top: 0.55rem;
  }
}

.rf-offers__card.is-pages {
  gap: 0;
}

.rf-offers__card.is-mission {
  gap: 0;
  border-color: rgba(var(--rf-accent-rgb), 0.5);
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--rf-accent-rgb), 0.1), transparent 60%),
    var(--rf-hover-wash);
}

.rf-offers__switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.25rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
}

.rf-offers__switch-btn {
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

.rf-offers__switch-btn.is-active {
  background: rgba(var(--rf-accent-rgb), 0.16);
  color: var(--rf-accent);
}

.rf-offers__switch-btn:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 2px;
}

.rf-offers__pane {
  display: grid;
  align-content: start;
  gap: 0.45rem;
  min-width: 0;
}

.rf-offers__pane-tagline {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--rf-text-muted);
}

.rf-offers__pane-price {
  margin: 0;
}

.rf-offers__pane .rf-offers__value {
  font-size: clamp(1.25rem, 2.4vw, 1.55rem);
}

.rf-offers__pane .rf-offers__note {
  margin-top: 0.35rem;
  padding-top: 0.55rem;
}

.rf-offers__card {
  display: grid;
  align-content: start;
  gap: 0;
  min-height: 0;
  padding: 0.95rem 1.1rem 1.05rem;
  border: 1px solid var(--rf-line);
  border-radius: var(--rf-radius);
  background: var(--rf-hover-wash);
  will-change: transform;
}

.rf-offers__toggle {
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

.rf-offers__toggle:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 3px;
  border-radius: 4px;
}

.rf-offers__toggle-copy {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
  flex: 1;
}

.rf-offers__icon {
  flex-shrink: 0;
  width: 1rem;
  margin-top: 0.15rem;
  color: var(--rf-text-muted);
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1;
  text-align: center;
}

.rf-offers__card.is-open .rf-offers__icon {
  color: var(--rf-accent);
  font-size: 1.35rem;
}

.rf-offers__body-wrap {
  display: grid;
  gap: 0.55rem;
  padding-top: 0.75rem;
}

.rf-offers__body-wrap[hidden] {
  display: none;
}

.rf-offers__copy {
  display: grid;
  gap: 0.45rem;
  margin: 0.45rem 0 0.15rem;
  max-width: 34rem;
}

.rf-offers__hook {
  margin: 0;
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.25;
  color: var(--rf-text);
}

.rf-offers__line {
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--rf-text-soft);
}

.rf-offers__close {
  margin: 0.2rem 0 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.35;
  color: var(--rf-accent);
}

.rf-offers__body {
  margin: 0.15rem 0 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--rf-text-soft);
}

.rf-offers__skills-title {
  margin: 0.45rem 0 0;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-offers__skills {
  margin: 0.2rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.4rem;
}

.rf-offers__skills li {
  position: relative;
  padding-left: 1.05rem;
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--rf-text-soft);
}

.rf-offers__skills li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: var(--rf-accent);
}

.rf-offers__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.15rem;
}

.rf-offers__stack span {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 0.32rem 0.6rem;
  border: 1px solid rgba(var(--rf-accent-rgb), 0.4);
  border-radius: 999px;
  color: var(--rf-accent);
}

.rf-offers__num {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: 0.82rem;
  color: var(--rf-accent);
}

.rf-offers__name {
  margin: 0;
  font-size: clamp(1.35rem, 2.6vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.rf-offers__tagline {
  margin: 0;
  font-size: 0.9rem;
  color: var(--rf-text-muted);
  line-height: 1.45;
}

.rf-offers__note {
  margin-top: 0.65rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--rf-line);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-offers__prices {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.45rem 1.1rem;
}

.rf-offers__prices li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem 0.45rem;
}

.rf-offers__value {
  font-size: clamp(1.7rem, 3.5vw, 2.25rem);
  line-height: 1;
  color: var(--rf-accent);
}

.rf-offers__unit {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--rf-text-soft);
}

.rf-offers__meta {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-offers__duration {
  margin: 0.15rem 0 0;
  font-size: 0.78rem;
  color: var(--rf-text-muted);
}

.rf-offers__billing {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--rf-text-soft);
}

.rf-offers__fit {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--rf-text-soft);
}

.rf-offers__more-wrap {
  display: flex;
  justify-content: center;
  margin-top: 1.75rem;
}

.rf-offers__more:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .rf-offers__card {
    will-change: auto;
    transform: none;
  }
}
</style>
