import type { PortfolioContent } from '~/types/portfolio'
import { resolveCompetencesOrder } from '../../app/data/competence-categories'
import fallbackData from '../../app/data/content.json'

export async function fetchPortfolioContent(): Promise<PortfolioContent | null> {
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    return null
  }

  try {
    const supabase = useServerSupabase()

    const [metaRes, aboutRes, competencesRes, experiencesRes, projectsRes, filtersRes] = await Promise.all([
      supabase.from('portfolio_meta').select('*').eq('id', 1).maybeSingle(),
      supabase.from('portfolio_about').select('*').eq('id', 1).maybeSingle(),
      supabase.from('portfolio_competences').select('*').eq('id', 1).maybeSingle(),
      supabase.from('portfolio_experiences').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('portfolio_tech_filters').select('*').order('sort_order', { ascending: true })
    ])

    if (metaRes.error || aboutRes.error || competencesRes.error) {
      console.warn('[content] Erreur Supabase:', metaRes.error || aboutRes.error || competencesRes.error)
      return null
    }

    if (!metaRes.data) return null

    const meta = metaRes.data
    const about = aboutRes.data
    const competences = competencesRes.data

    return {
      meta: {
        name: meta.name,
        role: meta.role,
        years_experience: meta.years_experience,
        location: meta.location,
        email: meta.email,
        phone: meta.phone,
        links: { linkedin: meta.linkedin, github: meta.github },
        tagline: meta.tagline
      },
      sections: {
        a_propos: {
          bio: about?.bio ?? '',
          highlights: (about?.highlights as string[]) ?? [],
          availability: about?.availability ?? ''
        },
        experiences: (experiencesRes.data ?? []).map((exp) => ({
          id: exp.id,
          sort_order: exp.sort_order,
          company: exp.company,
          location: exp.location,
          role: exp.role,
          period: exp.period,
          date_debut: exp.date_debut,
          date_fin: exp.date_fin,
          summary: exp.summary,
          missions: exp.missions as string[],
          stack: exp.stack as string[],
          tags: exp.tags as string[],
          clients: exp.clients as string[],
          links: exp.links as string[]
        })),
        competences: {
          langages: (competences?.langages as string[]) ?? [],
          frameworks: (competences?.frameworks as string[]) ?? [],
          outils_dev: (competences?.outils_dev as string[]) ?? [],
          ui_animations: (competences?.ui_animations as string[]) ?? [],
          design: (competences?.design as string[]) ?? [],
          environnements: (competences?.environnements as string[]) ?? [],
          methodes: (competences?.methodes as string[]) ?? [],
          ia_cursor: (competences?.ia_cursor as string[]) ?? []
        },
        competences_order: resolveCompetencesOrder(competences?.categories_order as string[] | undefined),
        projets: (projectsRes.data ?? []).map((p) => ({
          id: p.id,
          sort_order: p.sort_order,
          slug: p.slug,
          title: p.title,
          org: p.org,
          year: p.year,
          stack: p.stack as string[],
          tags: p.tags as string[],
          summary: p.summary,
          link: p.link ?? undefined,
          github: p.github ?? undefined,
          featured_slot: p.featured_slot ?? null
        })),
        filtres_technologies: filtersRes.error
          ? []
          : (filtersRes.data ?? [])
              .filter((f) => f.visible !== false)
              .map((f) => f.label as string)
      }
    }
  } catch (err) {
    console.warn('[content] Impossible de charger depuis Supabase:', err)
    return null
  }
}

export function getFallbackContent(): PortfolioContent {
  return fallbackData as PortfolioContent
}
