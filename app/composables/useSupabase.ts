import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function useSupabaseClient() {
  if (import.meta.server) {
    const config = useRuntimeConfig()
    return createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  }

  if (!client) {
    const config = useRuntimeConfig()
    client = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    })
  }

  return client
}

export function useAdminAuth() {
  const supabase = useSupabaseClient()
  const config = useRuntimeConfig()
  const user = useState<{ email?: string; id?: string } | null>('admin-user', () => null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getAllowedEmails(): string[] {
    const raw = String(config.public.adminAllowedEmails || 'wigame446@gmail.com')
    return raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  }

  function isAllowedEmail(email?: string | null) {
    if (!email) return false
    return getAllowedEmails().includes(email.trim().toLowerCase())
  }

  async function initSession() {
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      if (!isAllowedEmail(session.user.email)) {
        await supabase.auth.signOut()
        user.value = null
        return null
      }
      user.value = session.user
      return session
    }

    user.value = null
    return null
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
      loading.value = false
      error.value = 'Configuration Supabase manquante. Vérifiez les variables sur Vercel puis redéployez.'
      return false
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!isAllowedEmail(normalizedEmail)) {
      loading.value = false
      error.value = import.meta.dev
        ? `Email non autorisé. Utilisez : ${getAllowedEmails().join(', ')}`
        : 'Identifiants invalides'
      return false
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    })

    if (authError || !data.session) {
      loading.value = false
      if (import.meta.dev && authError?.message) {
        error.value = authError.message
      } else if (authError?.message?.toLowerCase().includes('email not confirmed')) {
        error.value = 'Compte non confirmé. Vérifiez votre email ou confirmez l’utilisateur dans Supabase.'
      } else {
        error.value = 'Identifiants invalides'
      }
      return false
    }

    if (!isAllowedEmail(data.user?.email)) {
      await supabase.auth.signOut()
      loading.value = false
      error.value = 'Identifiants invalides'
      return false
    }

    user.value = data.user
    loading.value = false
    return true
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    await navigateTo('/admin/login')
  }

  async function getAccessToken() {
    const session = await initSession()
    return session?.access_token ?? null
  }

  return { supabase, user, loading, error, initSession, login, logout, getAccessToken }
}

export function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean)
}

export function arrayToLines(arr: string[] | undefined): string {
  return (arr ?? []).join('\n')
}

export function csvToArray(text: string): string[] {
  return text.split(',').map((s) => s.trim()).filter(Boolean)
}

export function arrayToCsv(arr: string[] | undefined): string {
  return (arr ?? []).join(', ')
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
