import type { CompetenceCategoryDef } from '~/data/competence-categories'

export interface PortfolioMeta {
  name: string
  role: string
  years_experience: number
  location: string
  email: string
  phone: string
  links: {
    linkedin: string
    github: string
  }
  tagline: string
}

export interface PortfolioAbout {
  bio: string
  highlights: string[]
  availability: string
}

export interface PortfolioExperience {
  id?: string
  sort_order?: number
  company: string
  location: string
  role: string
  period: string
  date_debut: string
  date_fin: string
  summary: string
  missions: string[]
  stack: string[]
  tags: string[]
  clients?: string[]
  links: string[]
}

export interface PortfolioCompetences {
  langages: string[]
  frameworks: string[]
  outils_dev: string[]
  ui_animations: string[]
  design: string[]
  environnements: string[]
  methodes: string[]
  ia_cursor: string[]
  [key: string]: string[]
}

export type { CompetenceCategoryDef }

export interface PortfolioProject {
  id?: string
  sort_order?: number
  slug: string
  title: string
  org: string
  year: string
  stack: string[]
  tags: string[]
  summary: string
  link?: string
  github?: string
  featured_slot?: number | null
  experience_id?: string | null
}

export interface TechFilter {
  id?: string
  sort_order?: number
  label: string
  visible?: boolean
}

export interface PortfolioContent {
  meta: PortfolioMeta
  sections: {
    a_propos: PortfolioAbout
    experiences: PortfolioExperience[]
    competences: PortfolioCompetences
    competences_order: string[]
    competences_categories?: CompetenceCategoryDef[]
    projets: PortfolioProject[]
    filtres_technologies: string[]
  }
}
