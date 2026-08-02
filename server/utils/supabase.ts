import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { assertAdminUser } from './admin-security'

let serverClient: SupabaseClient | null = null

export function useServerSupabase() {
  if (serverClient) return serverClient

  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.supabaseServiceRoleKey || config.public.supabaseAnonKey

  if (!url || !key) {
    throw new Error('Supabase non configuré : vérifiez NUXT_PUBLIC_SUPABASE_URL et NUXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  serverClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  return serverClient
}

export async function verifyAdminToken(event: Parameters<typeof getHeader>[0]) {
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    throw createError({ statusCode: 401, message: 'Session invalide' })
  }

  assertAdminUser(user)
  return user
}
