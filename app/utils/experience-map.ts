import type { PortfolioExperience } from '~/types/portfolio'

export interface MapPin {
  id: string
  company: string
  location: string
  lat: number
  lng: number
  experience: PortfolioExperience
  level: number
}

/** Coordonnées GPS réelles (OpenStreetMap / RATP) */
const COMPANY_COORDS: Record<string, { lat: number; lng: number; label?: string }> = {
  'Société Générale': { lat: 48.8919, lng: 2.2413, label: 'La Défense — SG' },
  Mazarine: { lat: 48.8743343, lng: 2.2940558, label: 'Charles de Gaulle — Étoile' },
  Cyllene: { lat: 48.8662481, lng: 2.3526084, label: 'Réaumur — Sébastopol' },
  'Le Point': { lat: 48.8363968, lng: 2.278379, label: 'Balard — Le Point' },
  'France Télévision': { lat: 48.8388048, lng: 2.2712769, label: 'Pont du Garigliano — France TV' },
  'France Télévisions': { lat: 48.8388048, lng: 2.2712769, label: 'Pont du Garigliano — France TV' }
}

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'La Défense': { lat: 48.8919, lng: 2.2413 },
  Balard: { lat: 48.8363968, lng: 2.278379 },
  Garigliano: { lat: 48.83861, lng: 2.27 },
  'Pont du Garigliano': { lat: 48.8388048, lng: 2.2712769 },
  'Balard / Garigliano': { lat: 48.8376, lng: 2.2748 },
  'Esplanade Henri de France': { lat: 48.8388048, lng: 2.2712769 },
  'Réaumur — Sébastopol': { lat: 48.8662481, lng: 2.3526084 },
  'Charles de Gaulle — Étoile': { lat: 48.8743343, lng: 2.2940558 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Remote: { lat: 48.8566, lng: 2.3522 },
  'Île-de-France': { lat: 48.85, lng: 2.35 },
  'Paris / Remote': { lat: 48.8566, lng: 2.3522 }
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function isFranceTelevision(company: string): boolean {
  const n = normalizeText(company)
  return n.includes('france') && (n.includes('television') || n.includes('tele'))
}

function isLePoint(company: string): boolean {
  return normalizeText(company) === 'le point'
}

function resolveCoords(exp: PortfolioExperience): { lat: number; lng: number } {
  if (COMPANY_COORDS[exp.company]) {
    return COMPANY_COORDS[exp.company]
  }

  if (isFranceTelevision(exp.company)) {
    return COMPANY_COORDS['France Télévision']!
  }

  if (isLePoint(exp.company)) {
    return COMPANY_COORDS['Le Point']!
  }

  if (LOCATION_COORDS[exp.location]) {
    return LOCATION_COORDS[exp.location]
  }

  const location = normalizeText(exp.location)
  if (location.includes('garigliano') || location.includes('henri de france')) {
    return LOCATION_COORDS['Pont du Garigliano']!
  }
  if (location.includes('balard')) {
    return LOCATION_COORDS.Balard!
  }
  if (location.includes('defense')) {
    return LOCATION_COORDS['La Défense']!
  }

  return LOCATION_COORDS.Paris!
}

/** Centre carte — Grand Paris */
export const MAP_DEFAULT_CENTER: [number, number] = [48.865, 2.32]
export const MAP_DEFAULT_ZOOM = 12

export function parseExperienceDate(date: string): number {
  const [month, year] = date.split('/').map(Number)
  if (!month || !year) return 0
  return year * 12 + month
}

export function sortExperiencesChronologically(
  experiences: PortfolioExperience[]
): PortfolioExperience[] {
  return [...experiences].sort((a, b) => {
    const byDate = parseExperienceDate(a.date_debut) - parseExperienceDate(b.date_debut)
    if (byDate !== 0) return byDate
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })
}

export function getExperienceLevel(index: number): number {
  return index + 1
}

export function buildMapPins(experiences: PortfolioExperience[]): MapPin[] {
  const sorted = sortExperiencesChronologically(experiences)

  return sorted.map((exp, index) => {
    const coords = resolveCoords(exp)
    return {
      id: `exp-${index}-${exp.company.replace(/\s+/g, '-').toLowerCase()}`,
      company: exp.company,
      location: exp.location,
      lat: coords.lat,
      lng: coords.lng,
      experience: exp,
      level: getExperienceLevel(index)
    }
  })
}

export function findPinById(pins: MapPin[], pinId: string): MapPin | undefined {
  return pins.find((p) => p.id === pinId)
}

export function findPinIndex(pins: MapPin[], company: string): number {
  return pins.findIndex((p) => p.company === company)
}

export function computeCharacterStats(
  experiences: PortfolioExperience[],
  upToIndex: number
) {
  const slice = experiences.slice(0, upToIndex + 1)
  const stacks = new Set<string>()
  let missions = 0

  for (const exp of slice) {
    exp.stack?.forEach((s) => stacks.add(s))
    missions += exp.missions?.length ?? 0
  }

  const level = upToIndex + 1
  const xp = slice.length * 100 + stacks.size * 8 + missions * 5
  const maxXp = Math.max(experiences.length * 100 + 80, xp)

  return {
    level,
    xp,
    maxXp,
    power: Math.min(100, 20 + level * 15 + stacks.size * 2),
    frontEnd: Math.min(100, 15 + stacks.size * 4),
    animation: Math.min(
      100,
      slice.filter((e) =>
        e.stack?.some((s) => /gsap|animation|css/i.test(s))
      ).length * 25
    ),
    leadership: Math.min(
      100,
      slice.filter((e) => /jira|pilotage|agile/i.test(e.summary + (e.missions?.join(' ') ?? ''))).length * 30
    ),
    skillsUnlocked: stacks.size,
    experiencesCompleted: slice.length
  }
}
