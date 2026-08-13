/**
 * Fusionne TailwindCSS / Tailwind CSS en une seule entrée dans Supabase.
 * Usage: node scripts/dedupe-competences-tailwind.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv() {
  try {
    for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const eq = t.indexOf('=')
      if (eq === -1) continue
      const k = t.slice(0, eq).trim()
      let v = t.slice(eq + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      if (!process.env[k]) process.env[k] = v
    }
  } catch {
    console.warn('[dedupe] .env introuvable')
  }
}

function normalizeSkill(label) {
  const trimmed = String(label).trim()
  if (/^tailwind\s*css$/i.test(trimmed) || trimmed === 'TailwindCSS') return 'Tailwind CSS'
  return trimmed
}

function dedupeSkills(skills) {
  const seen = new Set()
  const result = []
  for (const skill of skills ?? []) {
    const norm = normalizeSkill(skill)
    const key = norm.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(norm)
    }
  }
  return result
}

loadEnv()

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const { data, error } = await supabase
  .from('portfolio_competences')
  .select('*')
  .eq('id', 1)
  .maybeSingle()

if (error) {
  console.error(error)
  process.exit(1)
}

const categories = [
  'langages',
  'frameworks',
  'outils_dev',
  'ui_animations',
  'design',
  'environnements',
  'methodes',
  'ia_cursor'
]

const payload = { id: 1, updated_at: new Date().toISOString() }
for (const key of categories) {
  payload[key] = dedupeSkills(data?.[key])
}

const { error: upErr } = await supabase.from('portfolio_competences').upsert(payload)
if (upErr) {
  console.error(upErr)
  process.exit(1)
}

console.log('[dedupe] ui_animations:', payload.ui_animations.join(', '))
