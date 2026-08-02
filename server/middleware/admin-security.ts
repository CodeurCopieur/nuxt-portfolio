import { applyAdminSecurityHeaders, assertRateLimit, getClientIp } from '../utils/admin-security'

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    applyAdminSecurityHeaders(event)
  }

  if (path.startsWith('/api/admin')) {
    const ip = getClientIp(event)
    assertRateLimit(`admin-api:${ip}`, 120, 15 * 60 * 1000)
  }

  if (path === '/admin/login' && getMethod(event) === 'POST') {
    const ip = getClientIp(event)
    assertRateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000)
  }
})
