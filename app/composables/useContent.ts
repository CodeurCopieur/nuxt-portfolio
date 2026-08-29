import type { PortfolioContent, PortfolioProject } from '~/types/portfolio'
import fallbackData from '@/data/content.json'
import { sortExperiencesChronologically } from '~/utils/experience-map'
import { sortProjectsByYear } from '~/utils/sort-projects'

/** Nombre max de projets dans « Travaux sélectionnés » (accueil refonte). */
export const FEATURED_WORKS_LIMIT = 6

function withSortedExperiences(content: PortfolioContent): PortfolioContent {
  return {
    ...content,
    sections: {
      ...content.sections,
      experiences: sortExperiencesChronologically(content.sections.experiences)
    }
  }
}

/** Projets mis en avant : ordre strict des slots admin (1 → N). */
export function getFeaturedWorks(
  projets: PortfolioProject[],
  limit = FEATURED_WORKS_LIMIT
): PortfolioProject[] {
  const featured = projets
    .filter((p) => {
      const slot = Number(p.featured_slot)
      return Number.isFinite(slot) && slot > 0
    })
    .sort((a, b) => Number(a.featured_slot) - Number(b.featured_slot))

  if (featured.length > 0) return featured.slice(0, limit)
  return sortProjectsByYear(projets).slice(0, limit)
}

/** Ancienne home `/old` — 3 projets max. */
export function getRecentProjects(projets: PortfolioProject[]): PortfolioProject[] {
  return getFeaturedWorks(projets, 3)
}

export function useContent() {
  const fallback = withSortedExperiences(fallbackData as PortfolioContent)

  const { data } = useFetch<PortfolioContent>('/api/content', {
    key: 'portfolio-content',
    default: () => fallback
  })

  const meta = computed(() => data.value?.meta ?? fallback.meta)
  const sections = computed(() => data.value?.sections ?? fallback.sections)
  const recentProjects = computed(() => getRecentProjects(sections.value.projets))
  const featuredWorks = computed(() => getFeaturedWorks(sections.value.projets))

  return { meta, sections, recentProjects, featuredWorks, data }
}
