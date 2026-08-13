import type { MapPin } from '~/utils/experience-map'

export const COMMUTE_HOME_AULNAY = {
  label: 'Aulnay-sous-Bois',
  lat: 48.9381,
  lng: 2.494
} as const

export const COMMUTE_HOME_BOBIGNY = {
  label: 'Bobigny',
  lat: 48.9086,
  lng: 2.4392
} as const

export const COMMUTE_HOME_PARIS_19 = {
  label: 'Paris 19e',
  lat: 48.8817,
  lng: 2.3922
} as const

export type CommuteHome = typeof COMMUTE_HOME_AULNAY | typeof COMMUTE_HOME_BOBIGNY | typeof COMMUTE_HOME_PARIS_19

export type CommuteHomeKey = 'aulnay' | 'bobigny' | 'paris19'

export interface CommuteLeg {
  legId: string
  pinId: string
  company: string
  location: string
  level: number
  fromKey: CommuteHomeKey
  fromLabel: string
  distanceKm: number
}

function isSocieteGenerale(company: string): boolean {
  const n = company
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
  return n.includes('societe generale') || n === 'sg'
}

/** Mazarine → Aulnay · SG → Aulnay, Paris 19e, Bobigny · France TV (5+) → Bobigny · reste → Aulnay */
export function getCommuteOrigins(pin: MapPin): readonly CommuteHome[] {
  if (isSocieteGenerale(pin.company)) {
    return [COMMUTE_HOME_AULNAY, COMMUTE_HOME_PARIS_19, COMMUTE_HOME_BOBIGNY] as const
  }
  if (pin.level >= 5) {
    return [COMMUTE_HOME_BOBIGNY] as const
  }
  return [COMMUTE_HOME_AULNAY] as const
}

function homeKey(label: string): CommuteHomeKey {
  if (label === COMMUTE_HOME_BOBIGNY.label) return 'bobigny'
  if (label === COMMUTE_HOME_PARIS_19.label) return 'paris19'
  return 'aulnay'
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function buildCommuteLegs(pins: MapPin[]): CommuteLeg[] {
  const legs: CommuteLeg[] = []

  for (const pin of pins) {
    for (const origin of getCommuteOrigins(pin)) {
      const fromKey = homeKey(origin.label)
      const distanceKm = haversineKm(origin.lat, origin.lng, pin.lat, pin.lng)
      legs.push({
        legId: `${pin.id}-${fromKey}`,
        pinId: pin.id,
        company: pin.company,
        location: pin.location,
        level: pin.level,
        fromKey,
        fromLabel: origin.label,
        distanceKm: Math.round(distanceKm * 10) / 10
      })
    }
  }

  return legs
}

export function formatDistanceKm(km: number): string {
  return km.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}
