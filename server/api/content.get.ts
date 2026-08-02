import { fetchPortfolioContent, getFallbackContent } from '../utils/content'

export default defineEventHandler(async () => {
  const content = await fetchPortfolioContent()
  return content ?? getFallbackContent()
})
