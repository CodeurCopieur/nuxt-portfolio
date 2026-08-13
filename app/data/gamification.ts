export type ZoneId = 'home' | 'parcours' | 'projets' | 'contact'

export interface ZoneDef {
  id: ZoneId
  label: string
  icon: string
  path: string
  xp: number
  questTitle: string
  questDescription: string
}

export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  xp: number
}

export interface HomeSectionDef {
  id: string
  title: string
  xp: number
}

export const ZONES: ZoneDef[] = [
  {
    id: 'home',
    label: 'Camp de base',
    icon: '🏠',
    path: '/',
    xp: 30,
    questTitle: 'Arriver au camp',
    questDescription: 'Découvrir la page d\'accueil et le profil de Widdy'
  },
  {
    id: 'parcours',
    label: 'Carte du parcours',
    icon: '🗺️',
    path: '/univers',
    xp: 50,
    questTitle: 'Explorer la carte',
    questDescription: 'Visiter les lieux de travail et la progression RPG'
  },
  {
    id: 'projets',
    label: 'Portfolio projets',
    icon: '📂',
    path: '/projets',
    xp: 50,
    questTitle: 'Entrer dans l\'arsenal',
    questDescription: 'Parcourir la galerie de projets'
  },
  {
    id: 'contact',
    label: 'Guilde du contact',
    icon: '📬',
    path: '/contact',
    xp: 50,
    questTitle: 'Rejoindre la guilde',
    questDescription: 'Atteindre la page contact'
  }
]

export const HOME_SECTIONS: HomeSectionDef[] = [
  { id: 'projects', title: 'Projets récents', xp: 25 },
  { id: 'skills', title: 'Compétences', xp: 25 },
  { id: 'experiences', title: 'Parcours pro', xp: 25 }
]

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_steps', title: 'Premiers pas', description: 'Visiter l\'accueil', icon: '👣', xp: 20 },
  { id: 'map_explorer', title: 'Cartographe', description: 'Explorer le parcours interactif', icon: '🧭', xp: 40 },
  { id: 'mission_hunter', title: 'Chasseur de missions', description: 'Visiter la page projets', icon: '🎯', xp: 40 },
  { id: 'skill_reader', title: 'Lecteur de stats', description: 'Découvrir les compétences sur l\'accueil', icon: '📖', xp: 30 },
  { id: 'timeline_master', title: 'Historien', description: 'Consulter le parcours professionnel', icon: '📜', xp: 30 },
  { id: 'project_scout', title: 'Éclaireur', description: 'Consulter 1 projet en détail', icon: '🔍', xp: 35 },
  { id: 'project_veteran', title: 'Vétéran', description: 'Consulter 3 projets différents', icon: '🛡️', xp: 60 },
  { id: 'project_legend', title: 'Légende des missions', description: 'Consulter tous les projets', icon: '👑', xp: 100 },
  { id: 'guild_member', title: 'Membre de la guilde', description: 'Atteindre la page contact', icon: '✉️', xp: 40 },
  { id: 'final_quest', title: 'Quête finale', description: 'Envoyer un message de contact', icon: '🏆', xp: 150 },
  { id: 'full_clear', title: '100 % exploré', description: 'Compléter toutes les zones et quêtes', icon: '💎', xp: 200 }
]

export const LEVEL_THRESHOLDS = [0, 80, 200, 380, 600, 900, 1300]

export const VISITOR_TITLES = [
  'Visiteur',
  'Explorateur',
  'Recruteur curieux',
  'Expert portfolio',
  'Maître recruteur',
  'Légende RH',
  'Champion ultime'
]

export function getLevelFromXp(xp: number): number {
  let level = 1
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  return level
}

export function getXpForLevel(level: number): { current: number; next: number; progress: number } {
  const idx = Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)
  const current = LEVEL_THRESHOLDS[idx] ?? 0
  const next = LEVEL_THRESHOLDS[idx + 1] ?? current + 200
  return {
    current,
    next,
    progress: next > current ? ((level === LEVEL_THRESHOLDS.length ? 100 : 0)) : 100
  }
}

export function getLevelProgress(xp: number): { level: number; current: number; next: number; ratio: number; title: string } {
  const level = getLevelFromXp(xp)
  const idx = level - 1
  const current = LEVEL_THRESHOLDS[idx] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[idx + 1]
  if (nextThreshold === undefined) {
    return {
      level,
      current,
      next: current,
      ratio: 1,
      title: VISITOR_TITLES[Math.min(level - 1, VISITOR_TITLES.length - 1)] ?? VISITOR_TITLES[0]
    }
  }
  const ratio = Math.min(1, (xp - current) / (nextThreshold - current))
  return {
    level,
    current,
    next: nextThreshold,
    ratio,
    title: VISITOR_TITLES[Math.min(level - 1, VISITOR_TITLES.length - 1)] ?? VISITOR_TITLES[0]
  }
}

export function getZoneByPath(path: string): ZoneDef | undefined {
  if (path === '/') return ZONES.find((z) => z.id === 'home')
  if (path === '/univers') return ZONES.find((z) => z.id === 'parcours')
  if (path === '/projets') return ZONES.find((z) => z.id === 'projets')
  if (path === '/contact') return ZONES.find((z) => z.id === 'contact')
  return undefined
}

export function getZoneQuest(zoneId: ZoneId): ZoneDef | undefined {
  return ZONES.find((z) => z.id === zoneId)
}
