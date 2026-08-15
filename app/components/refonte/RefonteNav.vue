<script setup lang="ts">
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'

const route = useRoute()
const { navigateTo } = useRefonteTransition()
const menuOpen = ref(false)

const links = [
  { to: '/refonte', label: 'Accueil' },
  { to: '/refonte/projets', label: 'Projets' },
  { to: '/refonte/contact', label: 'Contact' }
]

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

watch(() => route.path, () => {
  menuOpen.value = false
})

function onResize() {
  if (window.innerWidth >= 640) menuOpen.value = false
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<template>
  <header class="refonte-nav">
    <div class="refonte-nav__bar">
      <a href="/refonte" class="refonte-nav__logo refonte-display" @click="onNav('/refonte', $event)">
        Widdy<span class="refonte-nav__dot">.</span>Dev
      </a>

      <!-- Desktop -->
      <nav class="refonte-nav__links refonte-nav__links--desktop" aria-label="Navigation principale">
        <a
          v-for="link in links"
          :key="link.to"
          :href="link.to"
          class="refonte-link"
          :class="{ 'is-active': isActive(link.to) }"
          @click="onNav(link.to, $event)"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Mobile -->
      <button
        type="button"
        class="refonte-nav__burger"
        :aria-expanded="menuOpen"
        aria-controls="refonte-nav-menu"
        aria-label="Menu"
        @click="toggleMenu"
      >
        <span :class="{ 'is-open': menuOpen }" />
      </button>
    </div>

    <nav
      id="refonte-nav-menu"
      class="refonte-nav__panel"
      :class="{ 'is-open': menuOpen }"
      aria-label="Navigation mobile"
    >
      <a
        v-for="link in links"
        :key="`m-${link.to}`"
        :href="link.to"
        class="refonte-nav__panel-link"
        :class="{ 'is-active': isActive(link.to) }"
        @click="onNav(link.to, $event)"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>
</template>

<style scoped>
.refonte-nav {
  position: fixed;
  top: 0;
  inset-inline: 0;
  z-index: 100;
  border-bottom: 1px solid var(--rf-line);
  background: rgba(235, 228, 214, 0.92);
  backdrop-filter: blur(16px);
}

.refonte-nav__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  height: var(--rf-nav-h);
  padding-inline: max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right));
  max-width: 76rem;
  margin-inline: auto;
}

.refonte-nav__logo {
  font-size: clamp(1rem, 4.5vw, 1.35rem);
  font-weight: 600;
  color: var(--rf-ink);
  text-decoration: none;
  min-width: 0;
  white-space: nowrap;
}

.refonte-nav__dot {
  color: var(--rf-accent);
}

.refonte-nav__links--desktop {
  display: none;
  align-items: center;
  gap: 1.75rem;
  font-size: 0.92rem;
  font-weight: 600;
}

.refonte-nav__burger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid var(--rf-line);
  border-radius: 0.65rem;
  background: var(--rf-paper);
  cursor: pointer;
  flex-shrink: 0;
}

.refonte-nav__burger span,
.refonte-nav__burger span::before,
.refonte-nav__burger span::after {
  display: block;
  width: 1.1rem;
  height: 2px;
  background: var(--rf-ink);
  border-radius: 1px;
  transition: transform 0.25s var(--rf-ease), opacity 0.2s ease;
}

.refonte-nav__burger span {
  position: relative;
}

.refonte-nav__burger span::before,
.refonte-nav__burger span::after {
  content: '';
  position: absolute;
  left: 0;
}

.refonte-nav__burger span::before {
  top: -6px;
}

.refonte-nav__burger span::after {
  top: 6px;
}

.refonte-nav__burger span.is-open {
  background: transparent;
}

.refonte-nav__burger span.is-open::before {
  top: 0;
  transform: rotate(45deg);
}

.refonte-nav__burger span.is-open::after {
  top: 0;
  transform: rotate(-45deg);
}

.refonte-nav__panel {
  display: grid;
  gap: 0;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.35s var(--rf-ease), opacity 0.25s ease;
  border-top: 1px solid transparent;
}

.refonte-nav__panel.is-open {
  max-height: 12rem;
  opacity: 1;
  border-top-color: var(--rf-line);
}

.refonte-nav__panel-link {
  display: block;
  padding: 0.9rem 1rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--rf-ink-soft);
  text-decoration: none;
  border-bottom: 1px solid var(--rf-line);
}

.refonte-nav__panel-link:last-child {
  border-bottom: none;
}

.refonte-nav__panel-link.is-active {
  color: var(--rf-accent);
  background: rgba(184, 67, 47, 0.06);
}

@media (min-width: 640px) {
  .refonte-nav__links--desktop {
    display: flex;
  }

  .refonte-nav__burger,
  .refonte-nav__panel {
    display: none;
  }
}
</style>
