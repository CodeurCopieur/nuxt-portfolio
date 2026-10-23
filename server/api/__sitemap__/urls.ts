import { fetchPortfolioContent, getFallbackContent } from '../../utils/content'

export default defineSitemapEventHandler(async () => {
  const content = (await fetchPortfolioContent()) ?? getFallbackContent()
  const seen = new Set<string>()

  return content.sections.projets.flatMap((project) => {
    const slug = project.slug?.trim()
    if (!slug || seen.has(slug)) return []
    seen.add(slug)
    return [{ loc: `/projets/${slug}` }]
  })
})
