<script setup lang="ts">
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'

const { meta, sections } = useContent()
const { bindScrollScrub } = useRefonteScroll()

const statementRef = ref<HTMLElement | null>(null)

const companies = computed(() => [...new Set(sections.value.experiences.map((exp) => exp.company))])

const statement = computed(() => {
  const list = companies.value
  const path = list.length > 1
    ? `De ${list[0]} à ${list[list.length - 1]}, en passant par ${list.slice(1, -1).join(', ') || list[0]}`
    : list[0] ?? ''
  return `${path} — ${meta.value.years_experience} ans à concevoir des interfaces qui tiennent la charge, sans jamais sacrifier le détail.`
})

const words = computed(() => statement.value.split(' '))

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  nextTick(() => {
    const el = statementRef.value
    if (!el) return
    const spans = Array.from(el.querySelectorAll('.rf-intro__word'))
    bindScrollScrub({
      trigger: el,
      targets: spans,
      from: { opacity: 0.14, filter: 'blur(3px)' },
      to: { opacity: 1, filter: 'blur(0px)' },
      start: 'top 82%',
      end: 'bottom 55%'
    })
  })
})
</script>

<template>
  <section id="rf-intro" class="rf-intro" data-scroll-section data-rf-chapter="Manifeste">
    <div class="refonte-container rf-intro__grid">
      <div class="rf-intro__side">
        <span class="rf-intro__ghost" aria-hidden="true">02</span>
        <p class="refonte-label" v-reveal>Manifeste</p>
      </div>

      <div class="rf-intro__main">
        <p ref="statementRef" class="rf-intro__statement">
          <span v-for="(word, i) in words" :key="i" class="rf-intro__word">{{ word }}&nbsp;</span>
        </p>

        <div class="rf-intro__about">
          <p class="rf-intro__bio" v-reveal>{{ sections.a_propos.bio }}</p>
          <ul class="rf-intro__highlights">
            <li
              v-for="(item, i) in sections.a_propos.highlights"
              :key="item"
              v-reveal="{ index: i, total: sections.a_propos.highlights.length, reverse: true, stagger: 90, axis: 'x' }"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rf-intro {
  padding-block: clamp(4rem, 10vw, 7rem);
}

@media (max-width: 767px) {
  .rf-intro {
    padding-block: 2.5rem;
  }

  .rf-intro__grid {
    gap: 1.5rem;
  }
}

.rf-intro__grid {
  display: grid;
  gap: clamp(2rem, 5vw, 3rem);
}

@media (min-width: 860px) {
  .rf-intro__grid {
    grid-template-columns: 9rem 1fr;
    gap: clamp(2.5rem, 5vw, 4rem);
  }
}

.rf-intro__side {
  position: relative;
}

@media (min-width: 860px) {
  .rf-intro__side {
    position: sticky;
    top: calc(var(--rf-nav-h) + 2rem);
    align-self: start;
    height: fit-content;
  }
}

.rf-intro__ghost {
  display: block;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1;
  color: var(--rf-text);
  opacity: 0.1;
  margin-bottom: 0.5rem;
}

.rf-intro__main {
  display: grid;
  gap: clamp(2.5rem, 6vw, 4rem);
}

.rf-intro__statement {
  margin: 0;
  max-width: 58rem;
  font-size: clamp(1.65rem, 4.2vw, 2.85rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--rf-text);
}

.rf-intro__word {
  display: inline-block;
  will-change: opacity, filter;
}

.rf-intro__about {
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  max-width: 42rem;
  padding-top: clamp(1rem, 3vw, 1.5rem);
  border-top: 1px solid var(--rf-line);
}

.rf-intro__bio {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--rf-text-soft);
}

.rf-intro__highlights {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
  font-size: 0.85rem;
  color: var(--rf-text-muted);
}

.rf-intro__highlights li {
  position: relative;
  padding-left: 1.1rem;
}

.rf-intro__highlights li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 0.4rem;
  height: 1px;
  background: var(--rf-accent);
}

@media (prefers-reduced-motion: reduce) {
  .rf-intro__word {
    opacity: 1 !important;
    filter: none !important;
  }
}
</style>
