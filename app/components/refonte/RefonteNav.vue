<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'
import { PUBLIC_CONTACT_EMAIL } from '@/constants/contact'

const route = useRoute()
const { navigateTo } = useRefonteTransition()
const { scrollProgress, activeChapter, refresh, scroll } = useRefonteScroll()
const { mode: themeMode, toggle: toggleTheme } = useThemeMode()
const menuOpen = ref(false)
const contactEmail = PUBLIC_CONTACT_EMAIL

const links = [
  { to: '/', label: 'Accueil', num: '01' },
  { to: '/projets', label: 'Projets', num: '02' },
  { to: '/prestations', label: 'Prestations', num: '03' },
  { to: '/contact', label: 'Contact', num: '04' }
]

const scrollPct = computed(() => String(Math.round(scrollProgress.value * 100)).padStart(2, '0'))

const chapterLabel = computed(() => {
  const byRoute: Record<string, string> = {
    '/prestations': 'Prestations',
    '/contact': 'Contact',
    '/plan-du-site': 'Plan du site'
  }

  if (route.path.startsWith('/projets')) return 'Projets'
  if (route.path.startsWith('/mentions') || route.path.startsWith('/cgu') || route.path.startsWith('/confidentialite')) {
    return 'Légal'
  }

  return byRoute[route.path] ?? activeChapter.value
})

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

async function onNav(to: string, event?: MouseEvent) {
  event?.preventDefault()
  menuOpen.value = false
  await navigateTo(to)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

watch(() => route.path, () => {
  menuOpen.value = false
  nextTick(() => refresh())
})

function setMenuScrollLock(locked: boolean) {
  document.documentElement.classList.toggle('rf-menu-lock', locked)
  document.body.classList.toggle('rf-menu-lock', locked)

  const lenis = scroll.value?.lenisInstance
  if (locked) lenis?.stop()
  else {
    lenis?.start()
    nextTick(() => refresh())
  }
}

watch(menuOpen, setMenuScrollLock)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  setMenuScrollLock(false)
})
</script>

<template>
  <header class="refonte-nav">
    <div class="refonte-nav__progress" aria-hidden="true">
      <div class="refonte-nav__progress-fill" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>

    <div class="refonte-nav__bar">
      <a href="/" class="refonte-nav__logo" @click="onNav('/', $event)">
        Widdy<span class="refonte-nav__logo-dot">·</span>Louis
      </a>

      <div class="refonte-nav__actions">
        <p class="refonte-nav__chapter" aria-live="polite">{{ chapterLabel }}</p>
        <button
          type="button"
          class="refonte-nav__theme"
          :aria-label="themeMode === 'light' ? 'Passer en thème sombre bleu roi' : 'Passer en thème clair'"
          :aria-pressed="themeMode === 'light'"
          :title="themeMode === 'light' ? 'Thème sombre bleu roi' : 'Thème clair'"
          @click="toggleTheme"
        >
          <svg
            v-if="themeMode === 'light'"
            class="refonte-nav__theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
          <svg
            v-else
            class="refonte-nav__theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
          </svg>
        </button>
        <button
          type="button"
          class="refonte-nav__trigger"
          :class="{ 'is-open': menuOpen }"
          :aria-expanded="menuOpen"
          aria-controls="refonte-nav-overlay"
          @click="toggleMenu"
        >
          <span class="refonte-nav__trigger-pct">{{ scrollPct }}%</span>
          <span class="refonte-nav__trigger-label">{{ menuOpen ? 'Fermer' : 'Menu' }}</span>
          <span class="refonte-nav__trigger-icon" aria-hidden="true">
            <i /><i /><i />
          </span>
        </button>
      </div>
    </div>

    <Transition name="rf-overlay">
      <div v-if="menuOpen" id="refonte-nav-overlay" class="refonte-nav__overlay">
        <nav class="refonte-nav__overlay-links" aria-label="Navigation principale">
          <a
            v-for="(link, i) in [...links].reverse()"
            :key="link.to"
            :href="link.to"
            class="refonte-nav__overlay-link"
            :class="{ 'is-active': isActive(link.to) }"
            v-reveal="{ index: i, total: links.length, stagger: 70, distance: 34 }"
            @click="onNav(link.to, $event)"
          >
            <span class="refonte-nav__overlay-num">{{ link.num }}</span>
            <span class="refonte-nav__overlay-label refonte-serif">{{ link.label }}</span>
          </a>
        </nav>

        <div class="refonte-nav__overlay-foot">
          <a :href="`mailto:${contactEmail}`" class="refonte-nav__overlay-mail">
            {{ contactEmail }}
          </a>
          <p class="refonte-nav__overlay-note">Front-end · Motion · Paris / Remote</p>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.refonte-nav {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 100;
}

.refonte-nav__progress {
  height: 2px;
  background: var(--rf-nav-progress-track);
}

.refonte-nav__progress-fill {
  height: 100%;
  background: var(--rf-accent);
  transition: width 0.1s linear;
}

.refonte-nav__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  height: calc(var(--rf-nav-h) - 2px);
  padding-inline: max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right));
  max-width: var(--rf-container-max);
  margin-inline: auto;
  background: var(--rf-nav-bar-bg);
  backdrop-filter: blur(14px);
  transition: background 0.35s var(--rf-ease);
}

.refonte-nav__logo {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(1.05rem, 4vw, 1.4rem);
  color: var(--rf-text);
  text-decoration: none;
  white-space: nowrap;
}

.refonte-nav__logo-dot {
  color: var(--rf-accent);
  margin: 0 0.05em;
}

.refonte-nav__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.refonte-nav__chapter {
  margin: 0;
  max-width: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-accent);
  text-align: right;
}

@media (max-width: 479px) {
  .refonte-nav__chapter {
    max-width: 6.5rem;
    font-size: 0.62rem;
    letter-spacing: 0.04em;
  }
}

.refonte-nav__theme {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
  background: transparent;
  color: var(--rf-text);
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.3s var(--rf-ease), color 0.3s var(--rf-ease),
    transform 0.2s var(--rf-ease);
}

.refonte-nav__theme:hover {
  border-color: rgba(var(--rf-accent-rgb), 0.5);
  color: var(--rf-accent);
  transform: translateY(-1px);
}

.refonte-nav__theme-icon {
  width: 1.15rem;
  height: 1.15rem;
}

/* Thème clair : fond blanc plat + bordures visibles */
html.rf-light .refonte-nav__bar {
  background: var(--rf-nav-bar-bg);
  border-bottom: 1px solid var(--rf-line);
}

html.rf-light .refonte-nav__overlay {
  background-image: none;
  border-top: 1px solid var(--rf-line);
}

html.rf-light .refonte-nav__overlay-link {
  border-bottom-color: var(--rf-line);
}

.refonte-nav__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid var(--rf-line);
  border-radius: 999px;
  background: transparent;
  padding: 0.45rem 0.5rem 0.45rem 0.9rem;
  color: var(--rf-text);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.3s var(--rf-ease);
  flex-shrink: 0;
}

.refonte-nav__trigger:hover {
  border-color: rgba(var(--rf-accent-rgb), 0.5);
}

.refonte-nav__trigger-pct {
  font-size: 0.68rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--rf-text-muted);
}

.refonte-nav__trigger-label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.refonte-nav__trigger-icon {
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
  width: 1.4rem;
  height: 1.4rem;
  align-items: center;
  justify-content: center;
}

.refonte-nav__trigger-icon i {
  display: block;
  width: 100%;
  height: 1px;
  background: currentColor;
  transition: transform 0.3s var(--rf-ease), opacity 0.3s var(--rf-ease);
}

.refonte-nav__trigger.is-open .refonte-nav__trigger-icon i:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
}

.refonte-nav__trigger.is-open .refonte-nav__trigger-icon i:nth-child(2) {
  opacity: 0;
}

.refonte-nav__trigger.is-open .refonte-nav__trigger-icon i:nth-child(3) {
  transform: translateY(-4px) rotate(-45deg);
}

.refonte-nav__overlay {
  position: fixed;
  inset: 0;
  z-index: 98;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding-top: var(--rf-nav-h);
  padding-bottom: clamp(1.5rem, 5vw, 3rem);
  padding-inline: max(1.25rem, env(safe-area-inset-left));
  background: var(--rf-bg);
  background-image:
    radial-gradient(ellipse 55% 45% at 85% 0%, rgba(var(--rf-accent-rgb), 0.06), transparent 55%),
    linear-gradient(180deg, var(--rf-bg-soft), var(--rf-bg));
}

.refonte-nav__overlay-links {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 2vw, 1rem);
  padding-top: clamp(1.5rem, 5vw, 3rem);
}

.refonte-nav__overlay-link {
  display: flex;
  align-items: baseline;
  gap: 1.25rem;
  text-decoration: none;
  color: var(--rf-text-muted);
  padding-block: 0.5rem;
  border-bottom: 1px solid var(--rf-line);
  transition: color 0.3s var(--rf-ease);
}

.refonte-nav__overlay-link:hover,
.refonte-nav__overlay-link.is-active {
  color: var(--rf-text);
}

.refonte-nav__overlay-link:hover .refonte-nav__overlay-label,
.refonte-nav__overlay-link.is-active .refonte-nav__overlay-label {
  color: var(--rf-accent);
}

.refonte-nav__overlay-num {
  font-size: 0.85rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.refonte-nav__overlay-label {
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(2.5rem, 11vw, 6rem);
  line-height: 1;
  color: var(--rf-text);
  transition: color 0.3s var(--rf-ease);
}

.refonte-nav__overlay-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
}

.refonte-nav__overlay-mail {
  color: var(--rf-text-soft);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 600;
}

.refonte-nav__overlay-mail:hover {
  color: var(--rf-accent);
}

.refonte-nav__overlay-note {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-overlay-enter-active,
.rf-overlay-leave-active {
  transition: opacity 0.35s var(--rf-ease);
}

.rf-overlay-enter-from,
.rf-overlay-leave-to {
  opacity: 0;
}
</style>

<style>
html.rf-menu-lock,
body.rf-menu-lock {
  overflow: hidden;
  overscroll-behavior: none;
}

html.rf-menu-lock body {
  touch-action: none;
}
</style>
