import type { PortfolioContent, PortfolioProject } from '~/types/portfolio'
import fallbackData from '@/data/content.json'
import { sortExperiencesChronologically } from '~/utils/experience-map'

function withSortedExperiences(content: PortfolioContent): PortfolioContent {
  return {
    ...content,
    sections: {
      ...content.sections,
      experiences: sortExperiencesChronologically(content.sections.experiences)
    }
  }
}

export function getRecentProjects(projets: PortfolioProject[]): PortfolioProject[] {
  const featured = projets
    .filter((p) => p.featured_slot != null)
    .sort((a, b) => (a.featured_slot ?? 99) - (b.featured_slot ?? 99))

  if (featured.length > 0) return featured.slice(0, 3)
  return projets.slice(0, 3)
}

export function useContent() {
  const { data } = useFetch<PortfolioContent>('/api/content', {
    key: 'portfolio-content',
    default: () => withSortedExperiences(fallbackData as PortfolioContent)
  })

  const meta = computed(() => data.value!.meta)
  const sections = computed(() => data.value!.sections)
  const recentProjects = computed(() => getRecentProjects(sections.value.projets))

  return { meta, sections, recentProjects, data }
}
