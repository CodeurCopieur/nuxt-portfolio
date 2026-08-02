export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { supabase } = useAdminAuth()

  const allowed = String(config.public.adminAllowedEmails || 'wigame446@gmail.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'INITIAL_SESSION') return

    const user = useState<{ email?: string; id?: string } | null>('admin-user')

    if (!session?.user) {
      user.value = null
      return
    }

    const email = session.user.email?.trim().toLowerCase()
    if (!email || !allowed.includes(email)) {
      await supabase.auth.signOut()
      user.value = null
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        await navigateTo('/admin/login')
      }
      return
    }

    user.value = session.user
  })
})
