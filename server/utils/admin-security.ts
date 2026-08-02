const buckets = new Map<string, { count: number; resetAt: number }>()

export function assertRateLimit(key: string, maxAttempts: number, windowMs: number) {
  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs }
  }

  bucket.count += 1
  buckets.set(key, bucket)

  if (bucket.count > maxAttempts) {
    throw createError({
      statusCode: 429,
      message: 'Trop de tentatives. Réessayez dans quelques minutes.'
    })
  }
}

export function getClientIp(event: Parameters<typeof getHeader>[0]): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export function getAllowedAdminEmails(): string[] {
  const config = useRuntimeConfig()
  const raw = config.adminAllowedEmails || config.public.adminAllowedEmails || ''
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const allowed = getAllowedAdminEmails()
  if (!allowed.length) return false
  return allowed.includes(email.trim().toLowerCase())
}

export function assertAdminUser(user: { email?: string | null }) {
  if (!isAllowedAdminEmail(user.email)) {
    throw createError({ statusCode: 403, message: 'Accès admin non autorisé' })
  }
}

export function applyAdminSecurityHeaders(event: Parameters<typeof setHeader>[0]) {
  setHeader(event, 'X-Frame-Options', 'DENY')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')
  setHeader(event, 'Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  setHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin')
  setHeader(event, 'Cross-Origin-Resource-Policy', 'same-site')
}
