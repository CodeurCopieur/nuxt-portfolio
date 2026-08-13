export interface CareerPinPalette {
  dot: string
  ring: string
  swatch: string
}

export const CAREER_PIN_COLORS: CareerPinPalette[] = [
  { dot: 'linear-gradient(135deg, #818cf8, #6366f1)', ring: 'rgba(99, 102, 241, 0.45)', swatch: '#6366f1' },
  { dot: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', ring: 'rgba(56, 189, 248, 0.45)', swatch: '#0ea5e9' },
  { dot: 'linear-gradient(135deg, #34d399, #10b981)', ring: 'rgba(16, 185, 129, 0.45)', swatch: '#10b981' },
  { dot: 'linear-gradient(135deg, #fbbf24, #f59e0b)', ring: 'rgba(245, 158, 11, 0.45)', swatch: '#f59e0b' },
  { dot: 'linear-gradient(135deg, #f472b6, #ec4899)', ring: 'rgba(236, 72, 153, 0.45)', swatch: '#ec4899' },
  { dot: 'linear-gradient(135deg, #fb7185, #f43f5e)', ring: 'rgba(244, 63, 94, 0.45)', swatch: '#f43f5e' }
]

export function getCareerPinPalette(level: number): CareerPinPalette {
  return CAREER_PIN_COLORS[(level - 1) % CAREER_PIN_COLORS.length]!
}
