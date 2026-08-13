export type DesktopAppId = 'about' | 'parcours' | 'skills' | 'projets' | 'mail' | 'project' | 'experience'

export interface DesktopAppDef {
  id: DesktopAppId
  title: string
  icon: string
  subtitle: string
  defaultWidth: number
  defaultHeight: number
  minWidth: number
  minHeight: number
  /** Dégradé barre de titre (style univers futuriste) */
  windowGradient: string
  windowGlow: string
}

export const DESKTOP_APPS: DesktopAppDef[] = [
  {
    id: 'about',
    title: 'À propos de Widdy',
    icon: '👤',
    subtitle: 'Profil & bio',
    defaultWidth: 520,
    defaultHeight: 560,
    minWidth: 380,
    minHeight: 400,
    windowGradient: 'linear-gradient(90deg, #22d3ee 0%, #3b82f6 50%, #818cf8 100%)',
    windowGlow: 'rgba(34, 211, 238, 0.45)'
  },
  {
    id: 'parcours',
    title: 'Carte Parcours',
    icon: '🗺️',
    subtitle: 'Lieux de travail',
    defaultWidth: 1280,
    defaultHeight: 820,
    minWidth: 900,
    minHeight: 560,
    windowGradient: 'linear-gradient(90deg, #34d399 0%, #14b8a6 50%, #06b6d4 100%)',
    windowGlow: 'rgba(52, 211, 153, 0.45)'
  },
  {
    id: 'skills',
    title: 'Compétences',
    icon: '⚡',
    subtitle: 'Radar technique',
    defaultWidth: 1320,
    defaultHeight: 900,
    minWidth: 1020,
    minHeight: 660,
    windowGradient: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
    windowGlow: 'rgba(129, 140, 248, 0.45)'
  },
  {
    id: 'projets',
    title: 'Projets',
    icon: '📂',
    subtitle: 'Portfolio projets',
    defaultWidth: 1280,
    defaultHeight: 820,
    minWidth: 1020,
    minHeight: 560,
    windowGradient: 'linear-gradient(90deg, #fbbf24 0%, #f97316 50%, #fb7185 100%)',
    windowGlow: 'rgba(251, 191, 36, 0.45)'
  },
  {
    id: 'mail',
    title: 'Mail',
    icon: '✉️',
    subtitle: 'Contact',
    defaultWidth: 720,
    defaultHeight: 580,
    minWidth: 480,
    minHeight: 420,
    windowGradient: 'linear-gradient(90deg, #fb7185 0%, #f43f5e 50%, #ec4899 100%)',
    windowGlow: 'rgba(244, 63, 94, 0.4)'
  },
  {
    id: 'project',
    title: 'Projet',
    icon: '⚔️',
    subtitle: 'Détail projet',
    defaultWidth: 640,
    defaultHeight: 520,
    minWidth: 480,
    minHeight: 380,
    windowGradient: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 50%, #6366f1 100%)',
    windowGlow: 'rgba(56, 189, 248, 0.45)'
  },
  {
    id: 'experience',
    title: 'Expérience',
    icon: '📍',
    subtitle: 'Détail parcours',
    defaultWidth: 480,
    defaultHeight: 620,
    minWidth: 400,
    minHeight: 440,
    windowGradient: 'linear-gradient(90deg, #f87171 0%, #ef4444 50%, #f97316 100%)',
    windowGlow: 'rgba(248, 113, 113, 0.4)'
  }
]

export function getDesktopApp(id: DesktopAppId): DesktopAppDef {
  return DESKTOP_APPS.find((a) => a.id === id) ?? DESKTOP_APPS[0]
}

export const DESKTOP_ICONS: { appId: DesktopAppId; label: string }[] = [
  { appId: 'about', label: 'Widdy' },
  { appId: 'parcours', label: 'Parcours' },
  { appId: 'skills', label: 'Compétences' },
  { appId: 'projets', label: 'Projets' },
  { appId: 'mail', label: 'Mail' }
]
