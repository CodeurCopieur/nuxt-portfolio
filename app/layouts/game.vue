<script setup lang="ts">
import ThemeToggle from '@/components/Ui/ThemeToggle.vue'
import Container from '@/components/Ui/Container.vue'
import PageTransition from '@/components/PageTransition.vue'
import ScrollAnimations from '@/components/ScrollAnimations.vue'
import CustomCursor from '@/components/CustomCursor.vue'
import GamificationHud from '@/components/gamification/GamificationHud.vue'
import AchievementToast from '@/components/gamification/AchievementToast.vue'
import { useGamificationStore } from '@/store/useGamification'

const route = useRoute()
const gamification = useGamificationStore()
const isScrolled = ref(false)

onMounted(() => {
  gamification.hydrate()
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})

const navItems = [
  { to: '/game', label: 'Camp', icon: '🏠', zone: 'home' as const, match: (p: string) => p === '/game' },
  { to: '/game/parcours', label: 'Carte', icon: '🗺️', zone: 'parcours' as const, match: (p: string) => p === '/game/parcours' },
  { to: '/game/projets', label: 'Projets', icon: '📂', zone: 'projets' as const, match: (p: string) => p.startsWith('/game/projets') },
  { to: '/game/contact', label: 'Guilde', icon: '📬', zone: 'contact' as const, match: (p: string) => p === '/game/contact' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <CustomCursor />

    <header
      :class="[
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-amber-200/40 dark:border-amber-800/30'
          : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm'
      ]"
    >
      <Container class="flex items-center justify-between py-4">
        <NuxtLink
          to="/game"
          class="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-300 bg-clip-text text-transparent"
        >
          Widdy<span class="text-sky-500">.Game</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="[
              'relative px-3 py-2 text-sm font-medium transition-colors duration-300 flex items-center gap-1.5',
              item.match(route.path)
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
            ]"
          >
            <span class="text-xs">{{ item.icon }}</span>
            {{ item.label }}
            <span
              v-if="gamification.visitedZones.includes(item.zone)"
              class="text-[10px] text-emerald-500"
            >✓</span>
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="hidden sm:inline-flex text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
          >
            ← Site classique
          </NuxtLink>
          <ThemeToggle />
        </div>
      </Container>
    </header>

    <main class="flex-1">
      <PageTransition>
        <ScrollAnimations>
          <slot />
        </ScrollAnimations>
      </PageTransition>
    </main>

    <ClientOnly>
      <GamificationHud />
      <AchievementToast />
    </ClientOnly>
  </div>
</template>
