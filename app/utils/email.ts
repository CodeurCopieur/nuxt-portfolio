const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Adresse au format nom@domaine.tld. Ne confirme pas que la boîte existe. */
export function isEmailAddress(value: string) {
  const email = value.trim()
  if (!email || email.length > 254) return false
  if (!EMAIL_PATTERN.test(email)) return false

  const at = email.lastIndexOf('@')
  const local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  if (!domain || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false
  return true
}

/** Champs lus par le modèle EmailJS : {{name}}, {{email}}, {{time}}, {{message}}. */
export function contactMailParams(name: string, email: string, message: string, toName: string) {
  const time = new Date().toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris'
  })
  const cleanName = name.trim()

  return {
    name: cleanName,
    email,
    time,
    message,
    from_name: cleanName,
    from_email: email,
    to_name: toName,
    reply_to: email
  }
}
