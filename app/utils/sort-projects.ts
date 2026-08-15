import type { PortfolioProject } from '~/types/portfolio'

export function sortProjectsByYear(
  projects: PortfolioProject[],
  order: 'desc' | 'asc' = 'desc'
): PortfolioProject[] {
  return [...projects].sort((a, b) => {
    const yearA = parseInt(a.year, 10) || 0
    const yearB = parseInt(b.year, 10) || 0
    if (yearA !== yearB) {
      return order === 'desc' ? yearB - yearA : yearA - yearB
    }
    return a.title.localeCompare(b.title, 'fr')
  })
}
