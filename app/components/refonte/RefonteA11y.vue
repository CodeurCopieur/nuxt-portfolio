<script setup lang="ts">
import { useRefonteA11y, type RfCvdMode } from '@/composables/refonte/useRefonteA11y'

const { prefs, setFlag, setCvd, reset } = useRefonteA11y()

const open = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const displayToggles = [
  { key: 'contrast' as const, label: 'Contraste élevé' },
  { key: 'bigText' as const, label: 'Texte plus grand' },
  { key: 'underline' as const, label: 'Souligner les liens' },
  { key: 'motion' as const, label: 'Réduire les animations' }
]

const cvdModes: Array<{ id: RfCvdMode, label: string }> = [
  { id: 'standard', label: 'Standard' },
  { id: 'deuteranopia', label: 'Deutéranopie' },
  { id: 'protanopia', label: 'Protanopie' },
  { id: 'tritanopia', label: 'Tritanopie' }
]

function openPanel() {
  open.value = true
  nextTick(() => {
    panelRef.value?.querySelector<HTMLButtonElement>('.rf-a11y__close')?.focus()
  })
}

function closePanel() {
  open.value = false
  nextTick(() => triggerRef.value?.focus())
}

function togglePanel() {
  if (open.value) closePanel()
  else openPanel()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    closePanel()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="rf-a11y">
    <svg class="rf-a11y__filters" aria-hidden="true" focusable="false" width="0" height="0">
      <filter id="rf-cvd-deuteranopia">
        <feColorMatrix
          type="matrix"
          values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="rf-cvd-protanopia">
        <feColorMatrix
          type="matrix"
          values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="rf-cvd-tritanopia">
        <feColorMatrix
          type="matrix"
          values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"
        />
      </filter>
    </svg>

    <div
      v-if="open"
      id="rf-a11y-panel"
      ref="panelRef"
      class="rf-a11y__panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rf-a11y-title"
    >
      <header class="rf-a11y__head">
        <div>
          <h2 id="rf-a11y-title" class="rf-a11y__title">Accessibilité</h2>
          <p class="rf-a11y__lead">
            Ajustez l’affichage pour mieux lire et distinguer les couleurs.
          </p>
        </div>
        <button type="button" class="rf-a11y__close" @click="closePanel">
          Fermer
        </button>
      </header>

      <p class="rf-a11y__section">Affichage</p>
      <ul class="rf-a11y__toggles">
        <li v-for="item in displayToggles" :key="item.key">
          <button
            type="button"
            class="rf-a11y__row"
            role="switch"
            :aria-checked="prefs[item.key]"
            @click="setFlag(item.key, !prefs[item.key])"
          >
            <span>{{ item.label }}</span>
            <span class="rf-a11y__box" aria-hidden="true" />
          </button>
        </li>
      </ul>

      <p class="rf-a11y__section">Vision des couleurs</p>
      <p class="rf-a11y__hint">
        Palette adaptée au daltonisme (couleurs plus distinctes).
      </p>
      <div class="rf-a11y__cvd" role="radiogroup" aria-label="Vision des couleurs">
        <button
          v-for="mode in cvdModes"
          :key="mode.id"
          type="button"
          class="rf-a11y__cvd-btn"
          role="radio"
          :aria-checked="prefs.cvd === mode.id"
          :class="{ 'is-active': prefs.cvd === mode.id }"
          @click="setCvd(mode.id)"
        >
          {{ mode.label }}
        </button>
      </div>

      <p class="rf-a11y__preview">
        <span class="rf-a11y__dot rf-a11y__dot--1" />
        <span class="rf-a11y__dot rf-a11y__dot--2" />
        <span class="rf-a11y__dot rf-a11y__dot--3" />
        Aperçu des couleurs
      </p>

      <button type="button" class="rf-a11y__reset" @click="reset">
        Réinitialiser
      </button>
    </div>

    <button
      ref="triggerRef"
      type="button"
      class="rf-a11y__fab"
      :aria-expanded="open"
      aria-controls="rf-a11y-panel"
      @click="togglePanel"
    >
      <span class="rf-a11y__fab-icon" aria-hidden="true">i</span>
      Accessibilité
    </button>
  </div>
</template>

<style scoped>
.rf-a11y {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(4.5rem, calc(env(safe-area-inset-bottom) + 3.5rem));
  z-index: 140;
  display: grid;
  justify-items: end;
  gap: 0.75rem;
}

.rf-a11y__filters {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.rf-a11y__fab {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.05rem 0.7rem 0.75rem;
  border: none;
  border-radius: 999px;
  background: var(--rf-ink);
  color: #ffffff;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow: var(--rf-shadow);
}

html.rf-light .rf-a11y__fab {
  background: var(--rf-ink);
}

.rf-a11y__fab:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 3px;
}

.rf-a11y__fab-icon {
  display: grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 999px;
  border: 1.5px solid currentColor;
  font-size: 0.72rem;
  font-style: italic;
  font-family: var(--rf-serif);
}

.rf-a11y__panel {
  width: min(22.5rem, calc(100vw - 2rem));
  padding: 1.15rem 1.15rem 1.25rem;
  border-radius: 1.15rem;
  background: var(--rf-paper);
  color: var(--rf-ink);
  box-shadow: var(--rf-shadow-soft);
}

html:not(.rf-light) .rf-a11y__panel {
  background: var(--rf-bg-soft);
  color: var(--rf-text);
  border: 1px solid var(--rf-line);
}

.rf-a11y__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.rf-a11y__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.rf-a11y__lead {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--rf-muted-ink);
}

html:not(.rf-light) .rf-a11y__lead {
  color: var(--rf-text-muted);
}

.rf-a11y__close {
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: 0.15rem 0;
  color: inherit;
  font: inherit;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
}

.rf-a11y__close:focus-visible,
.rf-a11y__row:focus-visible,
.rf-a11y__cvd-btn:focus-visible,
.rf-a11y__reset:focus-visible {
  outline: 2px solid var(--rf-accent);
  outline-offset: 2px;
}

.rf-a11y__section {
  margin: 0 0 0.45rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--rf-muted-ink);
}

html:not(.rf-light) .rf-a11y__section {
  color: var(--rf-text-muted);
}

.rf-a11y__toggles {
  margin: 0 0 1.1rem;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.45rem;
}

.rf-a11y__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: 0.72rem 0.85rem;
  border: none;
  border-radius: 0.85rem;
  background: #ffffff;
  color: inherit;
  font: inherit;
  font-size: 0.92rem;
  text-align: left;
  cursor: pointer;
}

html:not(.rf-light) .rf-a11y__row {
  background: rgba(255, 255, 255, 0.06);
}

.rf-a11y__box {
  flex-shrink: 0;
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 0.28rem;
  border: 1.5px solid var(--rf-muted-ink);
  background: transparent;
}

.rf-a11y__row[aria-checked='true'] .rf-a11y__box {
  border-color: var(--rf-accent);
  background: var(--rf-accent);
  box-shadow: inset 0 0 0 2px #ffffff;
}

.rf-a11y__hint {
  margin: 0 0 0.55rem;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--rf-muted-ink);
}

html:not(.rf-light) .rf-a11y__hint {
  color: var(--rf-text-muted);
}

.rf-a11y__cvd {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
}

.rf-a11y__cvd-btn {
  padding: 0.62rem 0.5rem;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: inherit;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

html:not(.rf-light) .rf-a11y__cvd-btn {
  background: rgba(255, 255, 255, 0.06);
}

.rf-a11y__cvd-btn.is-active {
  background: var(--rf-ink);
  color: #ffffff;
}

html:not(.rf-light) .rf-a11y__cvd-btn.is-active {
  background: var(--rf-text);
  color: var(--rf-bg);
}

.rf-a11y__preview {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0.85rem 0 0.9rem;
  font-size: 0.78rem;
  color: var(--rf-muted-ink);
}

html:not(.rf-light) .rf-a11y__preview {
  color: var(--rf-text-muted);
}

.rf-a11y__dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
}

.rf-a11y__dot--1 {
  background: #e08a72;
}

.rf-a11y__dot--2 {
  background: #8b4d3b;
}

.rf-a11y__dot--3 {
  background: #8fb8a8;
}

.rf-a11y__reset {
  padding: 0.5rem 0.95rem;
  border: 1px solid var(--rf-line-ink);
  border-radius: 999px;
  background: #ffffff;
  color: inherit;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

html:not(.rf-light) .rf-a11y__reset {
  background: transparent;
  border-color: var(--rf-line);
  color: var(--rf-text);
}
</style>
