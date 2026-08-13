/**
 * Corrige les org tronquées "Projet per" → "Projet personnel" dans Supabase.
 * Usage: node scripts/fix-org-projet-personnel.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadEnv() {
  try {
    const raw = readFileSync(join(root, '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    /* ignore */
  }
}

loadEnv()

const supabase = createClient(
  process.env.NUXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const { data: broken, error: fetchError } = await supabase
  .from('portfolio_projects')
  .select('id, slug, title, org')
  .eq('org', 'Projet per')

if (fetchError) {
  console.error('[fix-org]', fetchError.message)
  process.exit(1)
}

if (!broken?.length) {
  console.log('[fix-org] Aucun projet avec org "Projet per"')
  process.exit(0)
}

console.log('[fix-org] Projets à corriger:')
for (const p of broken) {
  console.log(`  - ${p.slug} (${p.title})`)
}

const { error: updateError } = await supabase
  .from('portfolio_projects')
  .update({ org: 'Projet personnel' })
  .eq('org', 'Projet per')

if (updateError) {
  console.error('[fix-org]', updateError.message)
  process.exit(1)
}

console.log(`[fix-org] ✓ ${broken.length} projet(s) corrigé(s)`)
