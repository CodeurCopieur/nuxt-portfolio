export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  // La session est dans localStorage → vérification côté client uniquement
  if (import.meta.server) return

  const { initSession } = useAdminAuth()
  const session = await initSession()

  if (!session) {
    return navigateTo('/admin/login')
  }
})
