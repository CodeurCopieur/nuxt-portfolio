<script setup lang="ts">
import ThemeToggle from '@/components/Ui/ThemeToggle.vue'
import Container from '@/components/Ui/Container.vue'
import PageTransition from '@/components/PageTransition.vue'
import ScrollAnimations from '@/components/ScrollAnimations.vue'
import CustomCursor from '@/components/CustomCursor.vue'

const route = useRoute()
const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Curseur personnalisé -->
    <CustomCursor />
    <!-- Header moderne -->
    <header 
      :class="[
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm'
      ]"
    >
      <Container class="flex items-center justify-between py-4">
        <!-- Logo -->
        <NuxtLink 
          to="/" 
          class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hover:from-sky-600 hover:to-indigo-600 dark:hover:from-sky-400 dark:hover:to-indigo-400 transition-all duration-300"
        >
          Widdy<span class="text-sky-500">.Dev</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink 
            to="/" 
            :class="[
              'relative px-3 py-2 text-sm font-medium transition-colors duration-300',
              route.path === '/' 
                ? 'text-sky-600 dark:text-sky-400' 
                : 'text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400'
            ]"
          >
            Accueil
            <div 
              v-if="route.path === '/'"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
            ></div>
          </NuxtLink>
          
          <NuxtLink 
            to="/projets" 
            :class="[
              'relative px-3 py-2 text-sm font-medium transition-colors duration-300',
              route.path.startsWith('/projets') 
                ? 'text-sky-600 dark:text-sky-400' 
                : 'text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400'
            ]"
          >
            Projets
            <div 
              v-if="route.path.startsWith('/projets')"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
            ></div>
          </NuxtLink>
          
          <NuxtLink 
            to="/contact" 
            :class="[
              'relative px-3 py-2 text-sm font-medium transition-colors duration-300',
              route.path === '/contact' 
                ? 'text-sky-600 dark:text-sky-400' 
                : 'text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400'
            ]"
          >
            Contact
            <div 
              v-if="route.path === '/contact'"
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
            ></div>
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <!-- CTA Contact -->
          <NuxtLink 
            to="/contact" 
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Contact
          </NuxtLink>
          
          <ThemeToggle />
        </div>
      </Container>
    </header>

    <!-- Contenu principal avec transitions et animations de scroll -->
    <main class="flex-1">
      <PageTransition>
        <ScrollAnimations>
          <slot />
        </ScrollAnimations>
      </PageTransition>
    </main>

    <!-- Footer moderne -->
    <footer class="mt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
      <Container class="py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Informations -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Widdy Louis</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Développeur Front-End passionné par la création d'interfaces performantes et accessibles.
            </p>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div class="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              Disponible pour missions freelance
            </div>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>📍 Paris / Remote</p>
              <a href="mailto:louiswiddy49@gmail.com" class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                📧 louiswiddy49@gmail.com
              </a>
              <p>📱 06 22 85 31 21</p>
            </div>
          </div>

          <!-- Technologies utilisées -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Technologies</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Stack moderne utilisée pour ce portfolio
            </p>
            <div class="grid grid-cols-2 gap-3">
              <!-- Nuxt 3 -->
              <div class="flex items-center justify-center p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 group">
                <span class="text-sm font-bold text-white">Nuxt 3</span>
              </div>

              <!-- Vue 3 -->
              <div class="flex items-center justify-center p-3 bg-gradient-to-br from-green-500 to-green-700 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 group">
                <span class="text-sm font-bold text-white">Vue 3</span>
              </div>

              <!-- TypeScript -->
              <div class="flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 group">
                <span class="text-sm font-bold text-white">TS</span>
              </div>

              <!-- TailwindCSS -->
              <div class="flex items-center justify-center p-3 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg hover:from-cyan-500 hover:to-cyan-700 transition-all duration-300 group">
                <span class="text-sm font-bold text-white">Tailwind</span>
              </div>

              <!-- GSAP -->
              <div class="flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-300 group">
                <span class="text-sm font-bold text-white">GSAP</span>
              </div>

              <!-- Swiper -->
              <div class="flex items-center justify-center p-3 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg hover:from-orange-600 hover:to-orange-800 transition-all duration-300 group">
                <span class="text-sm font-bold text-white">Swiper</span>
              </div>
            </div>
          </div>

          <!-- Liens sociaux -->
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Réseaux</h3>
            <div class="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/widdy-louis/" 
                target="_blank" 
                rel="noopener"
                class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-all duration-300 hover:scale-105"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              
              <a 
                href="https://github.com/CodeurCopieur" 
                target="_blank" 
                rel="noopener"
                class="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-all duration-300 hover:scale-105"
              >
                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} Widdy Louis — Tous droits réservés.</p>
        </div>
      </Container>
    </footer>
  </div>
</template>
