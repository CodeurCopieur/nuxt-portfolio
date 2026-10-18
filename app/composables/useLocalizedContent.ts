import { contentCopy } from '@/i18n/content-copy'
import type { PortfolioContent, PortfolioExperience, PortfolioProject } from '~/types/portfolio'
import { getFeaturedWorks, getRecentProjects, useContent } from '@/composables/useContent'

function localizeExperience(experience: PortfolioExperience, locale: 'en' | 'es') {
  const copy = contentCopy[locale]?.experiences[experience.company]
  if (!copy) return experience
  return { ...experience, ...copy }
}

function localizeProject(project: PortfolioProject, locale: 'en' | 'es') {
  const copy = contentCopy[locale]?.projects[project.slug]
  if (!copy) return project
  return { ...project, ...copy }
}

export function localizePortfolio(content: PortfolioContent, locale: 'fr' | 'en' | 'es'): PortfolioContent {
  if (locale === 'fr') return content
  const copy = contentCopy[locale]
  if (!copy) return content

  return {
    ...content,
    meta: { ...content.meta, ...copy.meta },
    sections: {
      ...content.sections,
      a_propos: { ...content.sections.a_propos, ...copy.about },
      experiences: content.sections.experiences.map((experience) => localizeExperience(experience, locale)),
      projets: content.sections.projets.map((project) => localizeProject(project, locale))
    }
  }
}

/** Contenu public du portfolio, dans la langue choisie. L’admin reste sur la source française. */
export function useLocalizedContent() {
  const { meta, sections } = useContent()
  const { locale } = useLocale()

  const localized = computed(() => localizePortfolio({
    meta: meta.value,
    sections: sections.value
  }, locale.value))

  return {
    meta: computed(() => localized.value.meta),
    sections: computed(() => localized.value.sections),
    recentProjects: computed(() => getRecentProjects(localized.value.sections.projets)),
    featuredWorks: computed(() => getFeaturedWorks(localized.value.sections.projets))
  }
}
