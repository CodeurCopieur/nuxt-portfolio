export interface DesktopWallpaper {
  id: string
  label: string
  swatch: string
  background: string
}

export const DEFAULT_WALLPAPER_ID = 'sonoma'

const SONOMA_BACKGROUND = [
  'radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 120, 80, 0.35), transparent 55%)',
  'radial-gradient(ellipse 90% 70% at 20% 60%, rgba(80, 140, 255, 0.4), transparent 50%)',
  'radial-gradient(ellipse 80% 60% at 80% 80%, rgba(180, 100, 255, 0.25), transparent 45%)',
  'radial-gradient(ellipse 60% 50% at 40% 30%, rgba(255, 200, 100, 0.15), transparent 40%)',
  'linear-gradient(160deg, #1a1040 0%, #2d1b69 25%, #1e3a5f 55%, #0f2847 100%)'
].join(', ')

export const DESKTOP_WALLPAPERS: DesktopWallpaper[] = [
  {
    id: 'sonoma',
    label: 'Sonoma',
    swatch: '#2d1b69',
    background: SONOMA_BACKGROUND
  },
  {
    id: 'violet',
    label: 'Violet',
    swatch: '#5b21b6',
    background: [
      'radial-gradient(ellipse 100% 70% at 80% 10%, rgba(167, 139, 250, 0.45), transparent 55%)',
      'radial-gradient(ellipse 80% 60% at 10% 80%, rgba(124, 58, 237, 0.35), transparent 50%)',
      'linear-gradient(155deg, #1e1033 0%, #4c1d95 45%, #2e1065 100%)'
    ].join(', ')
  },
  {
    id: 'ocean',
    label: 'Océan',
    swatch: '#0369a1',
    background: [
      'radial-gradient(ellipse 90% 70% at 70% 20%, rgba(56, 189, 248, 0.4), transparent 55%)',
      'radial-gradient(ellipse 70% 55% at 20% 70%, rgba(14, 165, 233, 0.3), transparent 48%)',
      'linear-gradient(160deg, #082f49 0%, #0c4a6e 40%, #164e63 100%)'
    ].join(', ')
  },
  {
    id: 'sunset',
    label: 'Sunset',
    swatch: '#ea580c',
    background: [
      'radial-gradient(ellipse 100% 75% at 60% 0%, rgba(251, 146, 60, 0.5), transparent 58%)',
      'radial-gradient(ellipse 80% 60% at 90% 90%, rgba(244, 63, 94, 0.35), transparent 50%)',
      'linear-gradient(165deg, #431407 0%, #9a3412 35%, #1c1917 100%)'
    ].join(', ')
  },
  {
    id: 'forest',
    label: 'Forêt',
    swatch: '#15803d',
    background: [
      'radial-gradient(ellipse 85% 65% at 30% 25%, rgba(74, 222, 128, 0.28), transparent 52%)',
      'radial-gradient(ellipse 70% 55% at 85% 75%, rgba(34, 197, 94, 0.22), transparent 48%)',
      'linear-gradient(155deg, #052e16 0%, #14532d 45%, #0f172a 100%)'
    ].join(', ')
  },
  {
    id: 'midnight',
    label: 'Minuit',
    swatch: '#0f172a',
    background: [
      'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(99, 102, 241, 0.18), transparent 55%)',
      'linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)'
    ].join(', ')
  }
]

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized.slice(0, 6)
  const int = Number.parseInt(full, 16)
  if (Number.isNaN(int)) return { r: 26, g: 16, b: 64 }
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => clampChannel(v).toString(16).padStart(2, '0')).join('')}`
}

function shade(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  const factor = amount >= 0 ? amount : 1 + amount
  if (amount >= 0) {
    return rgbToHex(r + (255 - r) * factor, g + (255 - g) * factor, b + (255 - b) * factor)
  }
  return rgbToHex(r * factor, g * factor, b * factor)
}

export function buildCustomWallpaperBackground(color: string): string {
  const base = color.startsWith('#') ? color : `#${color}`
  const light = shade(base, 0.22)
  const dark = shade(base, -0.38)
  const deep = shade(base, -0.58)

  return [
    `radial-gradient(ellipse 100% 75% at 75% 15%, ${light}88, transparent 58%)`,
    `radial-gradient(ellipse 80% 60% at 15% 75%, ${base}55, transparent 52%)`,
    `linear-gradient(160deg, ${deep} 0%, ${dark} 42%, ${base} 100%)`
  ].join(', ')
}

export function getWallpaperById(id: string): DesktopWallpaper | undefined {
  return DESKTOP_WALLPAPERS.find((wallpaper) => wallpaper.id === id)
}
