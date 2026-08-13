/**
 * Synchronise titres, descriptions et stacks enrichis vers Supabase
 * et met à jour app/data/content.json (fallback local).
 *
 * Usage: node scripts/sync-projects-to-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  const envPath = join(root, '.env')
  try {
    const raw = readFileSync(envPath, 'utf8')
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
    console.warn('[sync] Fichier .env introuvable — variables d\'environnement système uniquement')
  }
}

loadEnv()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('[sync] NUXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const enrichedPath = join(__dirname, 'projects-enriched.json')
const contentPath = join(root, 'app', 'data', 'content.json')
const updates = JSON.parse(readFileSync(enrichedPath, 'utf8'))

async function syncSupabase() {
  let ok = 0
  let fail = 0

  for (const item of updates) {
    const { slug, title, summary, stack, tags } = item
    const { data, error } = await supabase
      .from('portfolio_projects')
      .update({ title, summary, stack, tags })
      .eq('slug', slug)
      .select('id, slug')

    if (error) {
      console.error(`[sync] ✗ ${slug}: ${error.message}`)
      fail++
      continue
    }

    if (!data?.length) {
      console.warn(`[sync] ⚠ ${slug}: aucune ligne trouvée dans Supabase`)
      fail++
      continue
    }

    console.log(`[sync] ✓ ${slug}`)
    ok++
  }

  return { ok, fail }
}

function syncContentJson() {
  const content = JSON.parse(readFileSync(contentPath, 'utf8'))
  const bySlug = Object.fromEntries(updates.map((u) => [u.slug, u]))

  content.sections.projets = content.sections.projets.map((p) => {
    const u = bySlug[p.slug]
    if (!u) return p
    return {
      ...p,
      title: u.title,
      summary: u.summary,
      stack: u.stack,
      tags: u.tags
    }
  })

  writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
  console.log('[sync] content.json mis à jour')
}

async function main() {
  console.log(`[sync] ${updates.length} projets à synchroniser…`)
  const { ok, fail } = await syncSupabase()
  syncContentJson()
  console.log(`[sync] Terminé — ${ok} OK, ${fail} échecs`)
  if (fail > 0) process.exit(1)
}

main().catch((err) => {
  console.error('[sync] Erreur fatale:', err)
  process.exit(1)
})
