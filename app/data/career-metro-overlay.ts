/** Couleurs officielles RATP / Île-de-France Mobilités */
export const METRO_LINE_COLORS = {
  '1': '#FFBE00',
  '2': '#0064B0',
  '3': '#9B9836',
  '4': '#C04191',
  '6': '#6EC4E8',
  '8': '#CEADD2',
  A: '#E3051C',
  C: '#FFCE00'
} as const

export interface MetroLineSegment {
  id: string
  label: string
  color: string
  coords: [number, number][]
}

export interface MetroStation {
  id: string
  lat: number
  lng: number
  lines: { number: string; color: string }[]
}

/** Segments de lignes liés aux stations du parcours (géométrie simplifiée OSM) */
export const CAREER_METRO_LINES: MetroLineSegment[] = [
  {
    id: 'l1-defense-etoile',
    label: 'Ligne 1',
    color: METRO_LINE_COLORS['1'],
    coords: [
      [48.8919, 2.2413],
      [48.8888, 2.2495],
      [48.8845, 2.259],
      [48.8794, 2.2715],
      [48.8768, 2.2845],
      [48.8743, 2.2941]
    ]
  },
  {
    id: 'l8-balard-garigliano',
    label: 'Ligne 8',
    color: METRO_LINE_COLORS['8'],
    coords: [
      [48.8364, 2.2784],
      [48.8372, 2.2762],
      [48.8381, 2.2734],
      [48.8388, 2.2713]
    ]
  },
  {
    id: 'l3-reaumur',
    label: 'Ligne 3',
    color: METRO_LINE_COLORS['3'],
    coords: [
      [48.8662, 2.3455],
      [48.86625, 2.3526],
      [48.8663, 2.3595]
    ]
  },
  {
    id: 'l4-reaumur',
    label: 'Ligne 4',
    color: METRO_LINE_COLORS['4'],
    coords: [
      [48.8705, 2.3526],
      [48.86625, 2.3526],
      [48.862, 2.3526]
    ]
  },
  {
    id: 'l6-etoile',
    label: 'Ligne 6',
    color: METRO_LINE_COLORS['6'],
    coords: [
      [48.8743, 2.2941],
      [48.8728, 2.3015],
      [48.8715, 2.3085],
      [48.8702, 2.3155]
    ]
  },
  {
    id: 'rer-a-defense-etoile',
    label: 'RER A',
    color: METRO_LINE_COLORS.A,
    coords: [
      [48.8919, 2.2413],
      [48.8865, 2.255],
      [48.881, 2.272],
      [48.8775, 2.285],
      [48.8743, 2.2941]
    ]
  }
]

/** Stations du parcours professionnel */
export const CAREER_METRO_STATIONS: MetroStation[] = [
  {
    id: 'la-defense',
    lat: 48.8919,
    lng: 2.2413,
    lines: [
      { number: '1', color: METRO_LINE_COLORS['1'] },
      { number: 'A', color: METRO_LINE_COLORS.A }
    ]
  },
  {
    id: 'etoile',
    lat: 48.8743,
    lng: 2.2941,
    lines: [
      { number: '1', color: METRO_LINE_COLORS['1'] },
      { number: '2', color: METRO_LINE_COLORS['2'] },
      { number: '6', color: METRO_LINE_COLORS['6'] },
      { number: 'A', color: METRO_LINE_COLORS.A }
    ]
  },
  {
    id: 'reaumur',
    lat: 48.86625,
    lng: 2.3526,
    lines: [
      { number: '3', color: METRO_LINE_COLORS['3'] },
      { number: '4', color: METRO_LINE_COLORS['4'] }
    ]
  },
  {
    id: 'balard',
    lat: 48.8364,
    lng: 2.2784,
    lines: [{ number: '8', color: METRO_LINE_COLORS['8'] }]
  },
  {
    id: 'garigliano',
    lat: 48.8388,
    lng: 2.2713,
    lines: [{ number: 'C', color: METRO_LINE_COLORS.C }]
  }
]
