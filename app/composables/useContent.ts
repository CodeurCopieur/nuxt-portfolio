// composables/useContent.ts
import data from '@/data/content.json'

export function useContent() {
  // typing léger
  type SectionKey = 'a_propos' | 'experiences' | 'competences' | 'projets'
  return {
    meta: data.meta,
    sections: data.sections as Record<SectionKey, unknown>
  }
}
