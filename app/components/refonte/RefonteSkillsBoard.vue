<script setup lang="ts">
import { useContent } from '@/composables/useContent'
import { COMPETENCE_CATEGORIES, sortCompetenceCategories } from '~/data/competence-categories'
import {
  categoryAvg,
  colorForSkillCategory,
  ratingTier,
  skillRating
} from '~/utils/skill-ratings'

const { sections } = useContent()
const activeKey = ref<string | null>(null)

const categoryDefs = computed(() => {
  if (sections.value.competences_categories?.length) {
    return sections.value.competences_categories
  }

  const order = sections.value.competences_order ?? []
  const builtinKeys = new Set(COMPETENCE_CATEGORIES.map((cat) => cat.key))
  const customDefs = order
    .filter((key) => !builtinKeys.has(key))
    .map((key, index) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
      hint: 'Compétences…',
      description: '',
      accent: ['rose', 'cyan', 'lime', 'amber'][index % 4]!,
      gradient: [
        'from-rose-500 to-red-600',
        'from-cyan-500 to-blue-600',
        'from-lime-500 to-green-600',
        'from-amber-500 to-yellow-600'
      ][index % 4]!
    }))

  return sortCompetenceCategories(order, customDefs)
})

const categories = computed(() => {
  const competences = sections.value.competences
  const cats = categoryDefs.value
    .map((cat) => ({
      ...cat,
      skills: competences[cat.key] ?? []
    }))
    .filter((cat) => cat.skills.length > 0)

  const accessIndex = cats.findIndex((cat) => cat.key === 'accessibilite')
  if (accessIndex <= 0) return cats
  const next = [...cats]
  const [access] = next.splice(accessIndex, 1)
  return [access!, ...next]
})

const totalSkills = computed(() =>
  categories.value.reduce((sum, cat) => sum + cat.skills.length, 0)
)

const globalAvg = computed(() => {
  const cats = categories.value
  if (!cats.length) return 0
  const sum = cats.reduce((acc, cat) => acc + categoryAvg(cat.key, cat.skills), 0)
  return Math.round(sum / cats.length)
})

const activeCategory = computed(() => {
  const cats = categories.value
  if (!cats.length) return null
  const key = activeKey.value
  if (key) return cats.find((cat) => cat.key === key) ?? cats[0]!
  return cats[0]!
})

const activeSkills = computed(() => {
  const cat = activeCategory.value
  if (!cat) return []
  return cat.skills.map((skill, index) => ({
    skill,
    rating: skillRating(skill, cat.key, index),
    tier: ratingTier(skillRating(skill, cat.key, index))
  }))
})

watch(
  categories,
  (cats) => {
    if (!cats.length) {
      activeKey.value = null
      return
    }
    if (!activeKey.value || !cats.some((cat) => cat.key === activeKey.value)) {
      activeKey.value = cats[0]!.key
    }
  },
  { immediate: true }
)

function selectCategory(key: string) {
  activeKey.value = key
}

function barWidth(rating: number) {
  return `${Math.round((rating / 20) * 100)}%`
}
</script>

<template>
  <div v-if="activeCategory" class="rf-skills">
    <header class="rf-skills__head">
      <div class="rf-skills__head-main">
        <p class="rf-skills__eyebrow">Fiche de puissance</p>
        <p class="rf-skills__stats">
          <strong>{{ totalSkills }}</strong> compétences ·
          <strong>{{ categories.length }}</strong> domaines
        </p>
      </div>
      <div class="rf-skills__global">
        <span class="rf-skills__global-label">PWR</span>
        <span class="rf-skills__global-value">{{ globalAvg }}</span>
        <span class="rf-skills__global-max">/20</span>
      </div>
    </header>

    <div class="rf-skills__domains" role="tablist" aria-label="Domaines de compétences">
      <button
        v-for="cat in categories"
        :id="`rf-skill-tab-${cat.key}`"
        :key="cat.key"
        type="button"
        role="tab"
        class="rf-skills__domain"
        :class="{ 'is-active': activeKey === cat.key }"
        :aria-selected="activeKey === cat.key"
        :aria-controls="`rf-skill-panel-${cat.key}`"
        :style="{ '--cat-color': colorForSkillCategory(cat.key) }"
        @click="selectCategory(cat.key)"
      >
        <span class="rf-skills__domain-pwr">{{ categoryAvg(cat.key, cat.skills) }}</span>
        <span class="rf-skills__domain-label">{{ cat.label }}</span>
      </button>
    </div>

    <article
      :id="`rf-skill-panel-${activeCategory.key}`"
      class="rf-skills__panel"
      role="tabpanel"
      :aria-labelledby="`rf-skill-tab-${activeCategory.key}`"
      :style="{ '--cat-color': colorForSkillCategory(activeCategory.key) }"
    >
      <header class="rf-skills__panel-head">
        <div>
          <h3 class="rf-skills__panel-title">{{ activeCategory.label }}</h3>
          <p class="rf-skills__panel-meta">
            {{ activeCategory.skills.length }} techno{{ activeCategory.skills.length > 1 ? 's' : '' }}
          </p>
        </div>
        <div class="rf-skills__panel-score">
          <span class="rf-skills__panel-score-val">
            {{ categoryAvg(activeCategory.key, activeCategory.skills) }}
          </span>
          <span class="rf-skills__panel-score-max">/20</span>
        </div>
      </header>

      <ul class="rf-skills__meters">
        <li
          v-for="item in activeSkills"
          :key="item.skill"
          class="rf-skills__meter"
          :class="`rf-skills__meter--${item.tier}`"
        >
          <span class="rf-skills__meter-name">{{ item.skill }}</span>
          <div class="rf-skills__meter-track" aria-hidden="true">
            <div class="rf-skills__meter-fill" :style="{ width: barWidth(item.rating) }" />
          </div>
          <span class="rf-skills__meter-val">{{ item.rating }}</span>
        </li>
      </ul>
    </article>
  </div>
</template>

<style scoped>
.rf-skills {
  display: grid;
  gap: 0;
  color: var(--rf-text);
}

.rf-skills__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--rf-line);
}

.rf-skills__eyebrow {
  margin: 0 0 0.2rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-skills__stats {
  margin: 0;
  font-size: 0.9rem;
  color: var(--rf-text-soft);
}

.rf-skills__stats strong {
  font-family: var(--rf-sans);
  font-weight: 700;
  color: var(--rf-text);
}

.rf-skills__global {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  font-family: var(--rf-serif);
  line-height: 1;
}

.rf-skills__global-label {
  font-family: var(--rf-sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--rf-text-muted);
}

.rf-skills__global-value {
  font-size: 3rem;
  font-style: italic;
  color: var(--rf-accent);
}

.rf-skills__global-max {
  font-family: var(--rf-sans);
  font-size: 0.9rem;
  color: var(--rf-text-muted);
}

.rf-skills__domains {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.4rem;
  padding: 1.25rem 0;
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid var(--rf-line);
}

.rf-skills__domains::-webkit-scrollbar {
  display: none;
}

.rf-skills__domain {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  padding: 0.2rem 0 0.5rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.25s var(--rf-ease),
    opacity 0.25s var(--rf-ease);
}

.rf-skills__domain:hover {
  opacity: 0.85;
}

.rf-skills__domain.is-active {
  border-color: var(--cat-color, var(--rf-accent));
}

.rf-skills__domain-pwr {
  font-family: var(--rf-sans);
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  color: var(--cat-color, var(--rf-text-muted));
}

.rf-skills__domain.is-active .rf-skills__domain-pwr {
  color: var(--rf-accent);
}

.rf-skills__domain-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--rf-text-muted);
  line-height: 1.2;
  transition: color 0.25s var(--rf-ease);
}

.rf-skills__domain.is-active .rf-skills__domain-label {
  color: var(--rf-text);
}

.rf-skills__panel {
  padding: clamp(1.5rem, 4vw, 2.25rem) 0 0;
}

.rf-skills__panel-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
}

.rf-skills__panel-title {
  margin: 0;
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(1.5rem, 3.5vw, 2.15rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--rf-text);
}

.rf-skills__panel-meta {
  margin: 0.4rem 0 0;
  font-size: 0.78rem;
  color: var(--rf-text-muted);
}

.rf-skills__panel-score {
  display: flex;
  align-items: baseline;
  gap: 0.1rem;
  font-family: var(--rf-sans);
  font-weight: 700;
  line-height: 1;
}

.rf-skills__panel-score-val {
  font-size: 1.75rem;
  color: var(--cat-color, var(--rf-accent));
}

.rf-skills__panel-score-max {
  font-size: 0.85rem;
  color: var(--rf-text-muted);
}

.rf-skills__meters {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.9rem;
}

.rf-skills__meter {
  display: grid;
  grid-template-columns: minmax(7rem, 1.1fr) minmax(0, 2fr) 2rem;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 559px) {
  .rf-skills__meter {
    grid-template-columns: 1fr 2.5rem;
    grid-template-rows: auto auto;
  }

  .rf-skills__meter-track {
    grid-column: 1 / -1;
  }
}

.rf-skills__meter-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--rf-text-soft);
  line-height: 1.25;
}

.rf-skills__meter-track {
  height: 4px;
  border-radius: 999px;
  background: var(--rf-line);
  overflow: hidden;
}

.rf-skills__meter-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--cat-color, var(--rf-accent));
  transition: width 0.6s var(--rf-ease);
}

.rf-skills__meter--elite .rf-skills__meter-fill {
  background: var(--rf-accent);
}

.rf-skills__meter-val {
  font-family: ui-monospace, monospace;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: right;
  color: var(--rf-text-muted);
  font-variant-numeric: tabular-nums;
}

.rf-skills__meter--elite .rf-skills__meter-val {
  color: var(--rf-accent);
}
</style>
