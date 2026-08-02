import { verifyAdminToken, useServerSupabase } from '../../utils/supabase'
import fallbackData from '../../../app/data/content.json'
import type { PortfolioContent } from '~/types/portfolio'

export default defineEventHandler(async (event) => {
  await verifyAdminToken(event)

  const data = fallbackData as PortfolioContent
  const supabase = useServerSupabase()

  const { error: metaError } = await supabase.from('portfolio_meta').upsert({
    id: 1,
    name: data.meta.name,
    role: data.meta.role,
    years_experience: data.meta.years_experience,
    location: data.meta.location,
    email: data.meta.email,
    phone: data.meta.phone,
    linkedin: data.meta.links.linkedin,
    github: data.meta.links.github,
    tagline: data.meta.tagline,
    updated_at: new Date().toISOString()
  })

  if (metaError) throw createError({ statusCode: 500, message: metaError.message })

  const { error: aboutError } = await supabase.from('portfolio_about').upsert({
    id: 1,
    bio: data.sections.a_propos.bio,
    highlights: data.sections.a_propos.highlights,
    availability: data.sections.a_propos.availability,
    updated_at: new Date().toISOString()
  })

  if (aboutError) throw createError({ statusCode: 500, message: aboutError.message })

  const { error: competencesError } = await supabase.from('portfolio_competences').upsert({
    id: 1,
    ...data.sections.competences,
    updated_at: new Date().toISOString()
  })

  if (competencesError) throw createError({ statusCode: 500, message: competencesError.message })

  await supabase.from('portfolio_experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const experiences = data.sections.experiences.map((exp, index) => ({
    sort_order: index,
    company: exp.company,
    location: exp.location,
    role: exp.role,
    period: exp.period,
    date_debut: exp.date_debut,
    date_fin: exp.date_fin,
    summary: exp.summary,
    missions: exp.missions,
    stack: exp.stack,
    tags: exp.tags,
    clients: exp.clients ?? [],
    links: exp.links
  }))

  const { error: expError } = await supabase.from('portfolio_experiences').insert(experiences)
  if (expError) throw createError({ statusCode: 500, message: expError.message })

  await supabase.from('portfolio_projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const usedSlugs = new Set<string>()
  const projects = data.sections.projets.map((p, index) => {
    let slug = p.slug
    if (usedSlugs.has(slug)) {
      let suffix = 2
      while (usedSlugs.has(`${slug}-${suffix}`)) suffix++
      slug = `${slug}-${suffix}`
    }
    usedSlugs.add(slug)

    return {
      sort_order: index,
      slug,
      title: p.title,
      org: p.org,
      year: p.year,
      stack: p.stack,
      tags: p.tags,
      summary: p.summary,
      link: p.link ?? null,
      github: p.github ?? null,
      featured_slot: index < 3 ? index + 1 : null
    }
  })

  const { error: projError } = await supabase.from('portfolio_projects').insert(projects)
  if (projError) throw createError({ statusCode: 500, message: `Projets : ${projError.message}` })

  await supabase.from('portfolio_tech_filters').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const filters = (data.sections.filtres_technologies ?? []).map((label, index) => ({
    sort_order: index,
    label,
    updated_at: new Date().toISOString()
  }))

  const { error: filtersError } = await supabase.from('portfolio_tech_filters').insert(filters)
  if (filtersError) throw createError({ statusCode: 500, message: `Filtres : ${filtersError.message}` })

  return {
    success: true,
    message: 'Données importées depuis content.json',
    counts: {
      experiences: experiences.length,
      projects: projects.length,
      filters: filters.length
    }
  }
})
