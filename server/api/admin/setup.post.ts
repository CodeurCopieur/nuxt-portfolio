import { createClient } from '@supabase/supabase-js'
import { assertAdminUser, assertRateLimit, getClientIp } from '../../utils/admin-security'

export default defineEventHandler(async (event) => {
  if (import.meta.prod) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }

  const config = useRuntimeConfig()
  const setupSecret = getHeader(event, 'x-admin-setup-secret')

  if (!config.adminSetupSecret || setupSecret !== config.adminSetupSecret) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  assertRateLimit(`admin-setup:${getClientIp(event)}`, 3, 60 * 60 * 1000)

  const body = await readBody<{ email?: string; password?: string }>(event)

  if (!config.public.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({ statusCode: 500, message: 'Supabase non configuré' })
  }

  const email = (body.email || 'wigame446@gmail.com').trim().toLowerCase()
  const password = body.password

  assertAdminUser({ email })

  if (!password || password.length < 12) {
    throw createError({ statusCode: 400, message: 'Mot de passe requis (min. 12 caractères)' })
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: existing } = await supabase.auth.admin.listUsers()
  const oldUser = existing?.users?.find((u) => u.email?.toLowerCase() === email)
  if (oldUser) {
    await supabase.auth.admin.deleteUser(oldUser.id)
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true, message: `Compte admin créé : ${email}`, userId: data.user?.id }
})
