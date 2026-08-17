<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'
import { useRefonteScroll } from '@/composables/refonte/useRefonteScroll'
import { PUBLIC_CONTACT_EMAIL } from '@/constants/contact'

const route = useRoute()
const { navigateTo } = useRefonteTransition()
const { scrollProgress, activeChapter, refresh } = useRefonteScroll()
const menuOpen = ref(false)
const contactEmail = PUBLIC_CONTACT_EMAIL

const links = [
  { to: '/refonte', label: 'Accueil', num: '01' },
  { to: '/refonte/projets', label: 'Projets', num: '02' },
  { to: '/refonte/prestations', label: 'Prestations', num: '03' },
  { to: '/refonte/contact', label: 'Contact', num: '04' }
]

const scrollPct = computed(() => String(Math.round(scrollProgress.value * 100)).padStart(2, '0'))

const chapterLabel = computed(() => {
  const byRoute: Record<string, string> = {
    '/refonte/prestations': 'Prestations',
    '/refonte/contact': 'Contact',
    '/refonte/plan-du-site': 'Plan du site'
  }

  if (route.path.startsWith('/refonte/projets')) return 'Projets'
  if (route.path.startsWith('/refonte/mentions') || route.path.startsWith('/refonte/cgu') || route.path.startsWith('/refonte/confidentialite')) {
    return 'Légal'
  }

  return byRoute[route.path] ?? activeChapter.value
})

function isActive(path: string) {
  if (path === '/refonte') return route.path === '/refonte'
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

watch(menuOpen, (open) => {
  document.documentElement.classList.toggle('rf-menu-lock', open)
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.documentElement.classList.remove('rf-menu-lock')
})
</script>

<template>
  <header class="refonte-nav">
    <div class="refonte-nav__progress" aria-hidden="true">
      <div class="refonte-nav__progress-fill" :style="{ width: `${scrollProgress * 100}%` }" />
    </div>

    <div class="refonte-nav__bar">
      <a href="/refonte" class="refonte-nav__logo" @click="onNav('/refonte', $event)">
        Widdy<span class="refonte-nav__logo-dot">·</span>Louis
      </a>

      <div class="refonte-nav__actions">
        <p class="refonte-nav__chapter" aria-live="polite">{{ chapterLabel }}</p>
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
  background: rgba(255, 255, 255, 0.08);
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
  background: rgba(20, 19, 16, 0.72);
  backdrop-filter: blur(14px);
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
html.rf-menu-lock {
  overflow: hidden;
}
</style>
