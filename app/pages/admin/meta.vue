<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { supabase } = useAdminAuth()
const metaOpen = ref(false)
const aboutOpen = ref(false)
const savingMeta = ref(false)
const savingAbout = ref(false)
const metaMessage = ref<string | null>(null)
const aboutMessage = ref<string | null>(null)

const metaForm = reactive({
  name: '',
  role: '',
  years_experience: 0,
  location: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  tagline: ''
})

const aboutForm = reactive({
  bio: '',
  availability: ''
})

const highlights = ref<string[]>([])
const newHighlight = ref('')
const editingHighlightIndex = ref<number | null>(null)
const editingHighlightText = ref('')

const defaultHighlightSuggestions = [
  'TypeScript, Nuxt 3 / Vue 3, TailwindCSS, GSAP',
  'Accessibilité, SEO, mobile-first',
  'Animations maîtrisées (AOS, ScrollReveal, ScrollMagic, CSS)',
  'Culture design (Figma, Zeplin), TMA et optimisation'
]

const highlightsCount = computed(() => highlights.value.length)
const bioCharCount = computed(() => aboutForm.bio.length)

const highlightCatalog = computed(() => {
  const pool = new Set([...defaultHighlightSuggestions, ...highlights.value])
  return [...pool]
})

function addHighlight(label?: string) {
  const value = (label ?? newHighlight.value).trim()
  if (!value || highlights.value.includes(value)) return
  highlights.value.push(value)
  newHighlight.value = ''
}

function removeHighlight(index: number) {
  if (editingHighlightIndex.value === index) cancelEditHighlight()
  else if (editingHighlightIndex.value !== null && editingHighlightIndex.value > index) {
    editingHighlightIndex.value -= 1
  }
  highlights.value.splice(index, 1)
}

function startEditHighlight(index: number) {
  editingHighlightIndex.value = index
  editingHighlightText.value = highlights.value[index] ?? ''
}

function saveEditHighlight() {
  const index = editingHighlightIndex.value
  if (index === null) return

  const value = editingHighlightText.value.trim()
  if (!value) return

  const isDuplicate = highlights.value.some((item, i) => i !== index && item === value)
  if (isDuplicate) return

  highlights.value[index] = value
  cancelEditHighlight()
}

function cancelEditHighlight() {
  editingHighlightIndex.value = null
  editingHighlightText.value = ''
}

function toggleHighlightSuggestion(suggestion: string) {
  const index = highlights.value.indexOf(suggestion)
  if (index === -1) highlights.value.push(suggestion)
  else highlights.value.splice(index, 1)
}

function isHighlightSelected(suggestion: string) {
  return highlights.value.includes(suggestion)
}

const taglineCharCount = computed(() => metaForm.tagline.length)

const metaPreviewInitials = computed(() => {
  const parts = metaForm.name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
  }
  return metaForm.name.trim().slice(0, 2).toUpperCase() || '?'
})

onMounted(async () => {
  const [metaRes, aboutRes] = await Promise.all([
    supabase.from('portfolio_meta').select('*').eq('id', 1).maybeSingle(),
    supabase.from('portfolio_about').select('*').eq('id', 1).maybeSingle()
  ])

  if (metaRes.data) {
    Object.assign(metaForm, {
      name: metaRes.data.name,
      role: metaRes.data.role,
      years_experience: metaRes.data.years_experience,
      location: metaRes.data.location,
      email: metaRes.data.email,
      phone: metaRes.data.phone,
      linkedin: metaRes.data.linkedin,
      github: metaRes.data.github,
      tagline: metaRes.data.tagline
    })
  }

  if (aboutRes.data) {
    aboutForm.bio = aboutRes.data.bio
    aboutForm.availability = aboutRes.data.availability
    highlights.value = [...((aboutRes.data.highlights as string[]) ?? [])]
  }
})

async function saveMeta() {
  savingMeta.value = true
  metaMessage.value = null

  const { error } = await supabase.from('portfolio_meta').upsert({
    id: 1,
    ...metaForm,
    updated_at: new Date().toISOString()
  })

  savingMeta.value = false
  metaMessage.value = error ? error.message : 'Informations enregistrées'

  if (!error) await refreshNuxtData('portfolio-content')
}

async function saveAbout() {
  savingAbout.value = true
  aboutMessage.value = null

  const { error } = await supabase.from('portfolio_about').upsert({
    id: 1,
    bio: aboutForm.bio,
    highlights: [...highlights.value],
    availability: aboutForm.availability,
    updated_at: new Date().toISOString()
  })

  savingAbout.value = false
  aboutMessage.value = error ? error.message : 'À propos enregistré'

  if (!error) await refreshNuxtData('portfolio-content')
}
</script>

<template>
  <div class="space-y-4">
    <div class="mb-2">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profil</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Informations personnelles et présentation du portfolio.
      </p>
    </div>

    <!-- Accordéon Meta -->
    <section class="accordion">
      <button
        type="button"
        class="accordion-header"
        :aria-expanded="metaOpen"
        @click="metaOpen = !metaOpen"
      >
        <div class="flex items-center gap-3 min-w-0 text-left">
          <span class="accordion-chevron" :class="{ 'accordion-chevron--open': metaOpen }" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </span>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
              <span v-if="metaForm.name" class="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 truncate max-w-[180px]">
                {{ metaForm.name }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              Nom, rôle, contact, liens sociaux
            </p>
          </div>
        </div>
      </button>

      <div v-show="metaOpen" class="accordion-body">
        <p
          v-if="metaMessage"
          class="mb-4 px-4 py-3 rounded-xl text-sm border"
          :class="metaMessage.includes('enregistr')
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'"
        >
          {{ metaMessage }}
        </p>

        <form class="meta-form space-y-5 w-full" @submit.prevent="saveMeta">
          <!-- Identité -->
          <section class="form-card form-card--identity">
            <div class="form-card-header">
              <div>
                <h3 class="form-card-title">Identité</h3>
                <p class="form-card-hint">Nom et rôle affichés en grand sur la page d'accueil.</p>
              </div>
            </div>

            <div class="meta-preview mb-5">
              <div class="meta-preview-avatar" aria-hidden="true">{{ metaPreviewInitials }}</div>
              <div class="min-w-0 flex-1">
                <p class="meta-preview-name">{{ metaForm.name || 'Votre nom' }}</p>
                <p class="meta-preview-role">{{ metaForm.role || 'Votre rôle' }}</p>
                <p v-if="metaForm.tagline" class="meta-preview-tagline">{{ metaForm.tagline }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">Nom *</label>
                <input v-model="metaForm.name" class="admin-input" required placeholder="Prénom Nom">
              </div>
              <div>
                <label class="admin-label">Rôle *</label>
                <input v-model="metaForm.role" class="admin-input" required placeholder="Développeur Front-End">
              </div>
            </div>

            <div class="mt-4">
              <div class="flex items-center justify-between gap-2 mb-1">
                <label class="admin-label mb-0">Tagline</label>
                <span class="char-badge">{{ taglineCharCount }} car.</span>
              </div>
              <input
                v-model="metaForm.tagline"
                class="admin-input"
                placeholder="Interfaces rapides, accessibles et animées…"
              >
            </div>
          </section>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <!-- Parcours -->
            <section class="form-card form-card--profile">
              <div class="form-card-header">
                <div>
                  <h3 class="form-card-title">Parcours</h3>
                  <p class="form-card-hint">Informations complémentaires du profil.</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="admin-label">Années d'expérience (affichage manuel)</label>
                  <input
                    v-model.number="metaForm.years_experience"
                    type="number"
                    min="0"
                    class="admin-input"
                    placeholder="7"
                  >
                  <p class="field-note">Champ meta — le parcours sur l'accueil est calculé depuis les expériences.</p>
                </div>
                <div>
                  <label class="admin-label">Localisation</label>
                  <input v-model="metaForm.location" class="admin-input" placeholder="Paris / Remote">
                </div>
              </div>
            </section>

            <!-- Contact -->
            <section class="form-card form-card--contact">
              <div class="form-card-header">
                <div>
                  <h3 class="form-card-title">Contact</h3>
                  <p class="form-card-hint">Coordonnées pour la page contact et le footer.</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="admin-label">Email</label>
                  <input v-model="metaForm.email" type="email" class="admin-input" placeholder="email@exemple.com">
                  <a
                    v-if="metaForm.email"
                    :href="`mailto:${metaForm.email}`"
                    class="field-link"
                  >
                    Tester : mailto:{{ metaForm.email }}
                  </a>
                </div>
                <div>
                  <label class="admin-label">Téléphone</label>
                  <input v-model="metaForm.phone" type="tel" class="admin-input" placeholder="06 12 34 56 78">
                  <a
                    v-if="metaForm.phone"
                    :href="`tel:${metaForm.phone.replace(/\s/g, '')}`"
                    class="field-link"
                  >
                    Tester : {{ metaForm.phone }}
                  </a>
                </div>
              </div>
            </section>
          </div>

          <!-- Réseaux -->
          <section class="form-card form-card--social">
            <div class="form-card-header">
              <div>
                <h3 class="form-card-title">Réseaux & liens</h3>
                <p class="form-card-hint">Profils publics affichés sur le portfolio.</p>
              </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="admin-label">LinkedIn</label>
                <input v-model="metaForm.linkedin" type="url" class="admin-input" placeholder="https://linkedin.com/in/...">
                <a
                  v-if="metaForm.linkedin"
                  :href="metaForm.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-preview social-preview--linkedin"
                >
                  LinkedIn ↗
                </a>
              </div>
              <div>
                <label class="admin-label">GitHub</label>
                <input v-model="metaForm.github" type="url" class="admin-input" placeholder="https://github.com/...">
                <a
                  v-if="metaForm.github"
                  :href="metaForm.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-preview social-preview--github"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </section>

          <div class="flex justify-end sticky bottom-0 pt-2 pb-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <button type="submit" :disabled="savingMeta" class="save-btn">
              {{ savingMeta ? 'Enregistrement…' : 'Enregistrer les informations' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Accordéon À propos -->
    <section class="accordion">
      <button
        type="button"
        class="accordion-header"
        :aria-expanded="aboutOpen"
        @click="aboutOpen = !aboutOpen"
      >
        <div class="flex items-center gap-3 min-w-0 text-left">
          <span class="accordion-chevron" :class="{ 'accordion-chevron--open': aboutOpen }" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </span>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">À propos</h2>
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {{ highlightsCount }} point(s)
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              Bio, points forts et disponibilité
            </p>
          </div>
        </div>
      </button>

      <div v-show="aboutOpen" class="accordion-body">
        <p
          v-if="aboutMessage"
          class="mb-4 px-4 py-3 rounded-xl text-sm border"
          :class="aboutMessage.includes('enregistr')
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800'"
        >
          {{ aboutMessage }}
        </p>

        <form class="about-form space-y-5" @submit.prevent="saveAbout">
          <!-- Bio -->
          <section class="form-card">
            <div class="form-card-header">
              <div>
                <h3 class="form-card-title">Bio</h3>
                <p class="form-card-hint">Texte principal affiché dans la section hero du site.</p>
              </div>
              <span class="char-badge">{{ bioCharCount }} car.</span>
            </div>
            <textarea
              v-model="aboutForm.bio"
              rows="6"
              class="admin-textarea"
              required
              placeholder="Présentez votre parcours, votre approche et ce que vous apportez aux projets…"
            />
          </section>

          <!-- Points forts -->
          <section class="form-card form-card--highlights">
            <div class="form-card-header">
              <div>
                <h3 class="form-card-title">Points forts</h3>
                <p class="form-card-hint">Affichés sous la bio sur la page d'accueil.</p>
              </div>
              <span class="char-badge">{{ highlightsCount }} sélectionné(s)</span>
            </div>

            <div v-if="highlights.length" class="selected-highlights mb-4">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Affichés sur le site</p>
              <ul class="space-y-2">
                <li
                  v-for="(item, index) in highlights"
                  :key="index"
                  class="highlight-row"
                >
                  <span class="highlight-dot" aria-hidden="true" />

                  <div v-if="editingHighlightIndex === index" class="flex-1 flex flex-col sm:flex-row gap-2">
                    <input
                      v-model="editingHighlightText"
                      type="text"
                      class="admin-input admin-input--sm flex-1"
                      autofocus
                      @keydown.enter.prevent="saveEditHighlight()"
                      @keydown.esc.prevent="cancelEditHighlight()"
                    >
                    <div class="flex gap-1 shrink-0">
                      <button type="button" class="mini-btn mini-btn--save" @click="saveEditHighlight">
                        OK
                      </button>
                      <button type="button" class="mini-btn mini-btn--ghost" @click="cancelEditHighlight">
                        Annuler
                      </button>
                    </div>
                  </div>

                  <template v-else>
                    <span class="flex-1 text-sm text-gray-800 dark:text-gray-200">{{ item }}</span>
                    <div class="flex gap-1 shrink-0">
                      <button
                        type="button"
                        class="highlight-action highlight-action--edit"
                        aria-label="Modifier ce point fort"
                        @click="startEditHighlight(index)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                          <path d="m2.695 14.763-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="highlight-action highlight-action--delete"
                        aria-label="Retirer ce point fort"
                        @click="removeHighlight(index)"
                      >
                        ×
                      </button>
                    </div>
                  </template>
                </li>
              </ul>
            </div>

            <div class="add-highlight-box">
              <input
                v-model="newHighlight"
                type="text"
                class="admin-input flex-1"
                placeholder="Ajouter un point fort"
                autocomplete="off"
                @keydown.enter.prevent="addHighlight()"
              >
              <button type="button" class="add-chip-btn" :disabled="!newHighlight.trim()" @click="addHighlight()">
                + Ajouter
              </button>
            </div>

            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">Suggestions — cliquer pour sélectionner</p>
            <div class="highlight-grid">
              <button
                v-for="suggestion in highlightCatalog"
                :key="suggestion"
                type="button"
                class="highlight-chip"
                :class="{ 'highlight-chip--selected': isHighlightSelected(suggestion) }"
                @click="toggleHighlightSuggestion(suggestion)"
              >
                <span class="highlight-chip-check" aria-hidden="true">
                  <svg v-if="isHighlightSelected(suggestion)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span class="text-left text-sm">{{ suggestion }}</span>
              </button>
            </div>
          </section>

          <!-- Disponibilité -->
          <section class="form-card form-card--availability">
            <div class="form-card-header">
              <div>
                <h3 class="form-card-title">Disponibilité</h3>
                <p class="form-card-hint">Badge affiché en haut de la page d'accueil.</p>
              </div>
            </div>
            <input
              v-model="aboutForm.availability"
              class="admin-input"
              placeholder="Ex. Freelance — missions courte ou moyenne durée"
            >
            <p v-if="aboutForm.availability" class="availability-preview">
              <span class="availability-dot" aria-hidden="true" />
              {{ aboutForm.availability }}
            </p>
          </section>

          <div class="flex justify-end sticky bottom-0 pt-2 pb-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
            <button type="submit" :disabled="savingAbout" class="save-btn">
              {{ savingAbout ? 'Enregistrement…' : 'Enregistrer à propos' }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.accordion {
  @apply rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm;
}

.accordion-header {
  @apply w-full flex items-center px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors;
}

.accordion-chevron {
  @apply text-gray-400 transition-transform duration-200 shrink-0;
}

.accordion-chevron--open {
  transform: rotate(90deg);
}

.accordion-body {
  @apply px-4 pb-5 pt-1 border-t border-gray-100 dark:border-gray-800;
}

.admin-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

.admin-input {
  @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40;
}

.admin-textarea {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 text-sm leading-relaxed resize-y min-h-[140px];
}

.about-form {
  @apply w-full;
}

.meta-form {
  @apply w-full;
}

.form-card--identity {
  @apply border-sky-100 dark:border-sky-900/40 from-sky-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-sky-950/20;
}

.form-card--profile {
  @apply border-violet-100 dark:border-violet-900/30 from-violet-50/20 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-violet-950/10;
}

.form-card--contact {
  @apply border-emerald-100 dark:border-emerald-900/30 from-emerald-50/30 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/10;
}

.form-card--social {
  @apply border-indigo-100 dark:border-indigo-900/40 from-indigo-50/30 via-white to-sky-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20;
}

.meta-preview {
  @apply flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/60 border border-sky-100 dark:border-sky-900/40;
}

.meta-preview-avatar {
  @apply w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white text-lg font-bold shadow-md;
}

.meta-preview-name {
  @apply text-xl font-bold text-gray-900 dark:text-white truncate;
}

.meta-preview-role {
  @apply text-sm font-medium text-sky-600 dark:text-sky-400 mt-0.5 truncate;
}

.meta-preview-tagline {
  @apply text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2;
}

.field-note {
  @apply mt-1.5 text-xs text-gray-500 dark:text-gray-400;
}

.field-link {
  @apply inline-block mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate max-w-full;
}

.social-preview {
  @apply inline-flex mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors;
}

.social-preview--linkedin {
  @apply bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 dark:text-sky-300 dark:bg-sky-900/30;
}

.social-preview--github {
  @apply bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700;
}

.form-card {
  @apply p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-900 dark:to-gray-800/80;
}

.form-card--highlights {
  @apply border-indigo-100 dark:border-indigo-900/40 from-indigo-50/40 via-white to-sky-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20;
}

.form-card--availability {
  @apply border-emerald-100 dark:border-emerald-900/30 from-emerald-50/30 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/10;
}

.form-card-header {
  @apply flex items-start justify-between gap-3 mb-4;
}

.form-card-title {
  @apply text-sm font-bold text-gray-900 dark:text-white;
}

.form-card-hint {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-0.5;
}

.char-badge {
  @apply shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300;
}

.selected-highlights {
  @apply p-3 rounded-xl bg-white/80 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-900/40;
}

.highlight-row {
  @apply flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700;
}

.admin-input--sm {
  @apply py-2 text-sm;
}

.highlight-action {
  @apply w-8 h-8 flex items-center justify-center rounded-lg transition-colors;
}

.highlight-action--edit {
  @apply text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20;
}

.highlight-action--delete {
  @apply text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-lg leading-none;
}

.mini-btn {
  @apply px-3 py-2 rounded-lg text-xs font-semibold transition-colors;
}

.mini-btn--save {
  @apply bg-indigo-600 text-white hover:bg-indigo-700;
}

.mini-btn--ghost {
  @apply border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800;
}

.highlight-dot {
  @apply w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2;
}

.add-highlight-box {
  @apply flex flex-col sm:flex-row gap-2 p-3 rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700;
}

.add-chip-btn {
  @apply shrink-0 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-sky-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-600 hover:to-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed;
}

.highlight-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-2;
}

.highlight-chip {
  @apply flex items-start gap-2 p-3 rounded-xl border text-left transition-all duration-150;
  @apply border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  @apply hover:border-indigo-300 dark:hover:border-indigo-700;
}

.highlight-chip--selected {
  @apply border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 ring-1 ring-indigo-400/30;
}

.highlight-chip-check {
  @apply w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900;
}

.highlight-chip--selected .highlight-chip-check {
  @apply border-indigo-500 bg-indigo-500 text-white;
}

.availability-preview {
  @apply mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-sm font-medium;
}

.availability-dot {
  @apply w-2 h-2 rounded-full bg-sky-500 animate-pulse;
}

.save-btn {
  @apply px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50;
}
</style>
