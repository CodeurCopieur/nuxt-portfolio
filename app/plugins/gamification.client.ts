import { useGamificationStore } from '@/store/useGamification'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const gamification = useGamificationStore()

  gamification.hydrate()

  router.afterEach((to) => {
    if (!to.path.startsWith('/game')) return

    let totalProjects = 0
    try {
      const { sections } = useContent()
      totalProjects = sections.value.projets.length
    } catch {
      totalProjects = 0
    }

    gamification.handleRoute(to.path, to.params as Record<string, string>, totalProjects)
  })
})
