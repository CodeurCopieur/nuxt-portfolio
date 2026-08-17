import { PUBLIC_CONTACT_EMAIL } from '@/constants/contact'

/** Informations légales de l'entreprise — source : registre RNE / Pappers. */
export const LEGAL_ENTITY = {
  businessName: 'LOUIS STANDLEY',
  tradeName: 'Widdy Louis',
  legalForm: 'Entrepreneur individuel (micro-entreprise)',
  siren: '990 443 889',
  siret: '990 443 889 00011',
  vatNumber: 'FR34990443889',
  address: {
    line1: '60 rue François Ier',
    postalCode: '75008',
    city: 'Paris',
    country: 'France'
  },
  activity:
    'Prestations de services en développement informatique : conception, création, intégration et maintenance de sites internet, applications web et mobiles, incluant le développement front-end, back-end et solutions digitales associées.',
  nafCode: '62.01Z',
  director: 'Louis Standley',
  domiciliation: 'LegalPlace',
  rcsStatus: 'Non inscrit au RCS',
  rneStatus: 'Inscrit au RNE',
  creationDate: '19 août 2025',
  phone: '06 22 85 31 21',
  email: PUBLIC_CONTACT_EMAIL,
  pappersUrl: 'https://www.pappers.fr/entreprise/louis-standley-990443889'
} as const

export const LEGAL_HOSTING = {
  name: 'Vercel Inc.',
  address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  website: 'https://vercel.com'
} as const

export const LEGAL_THIRD_PARTIES = {
  emailjs: {
    name: 'EmailJS',
    purpose: 'Envoi des messages du formulaire de contact',
    website: 'https://www.emailjs.com'
  },
  vercelAnalytics: {
    name: 'Vercel Speed Insights',
    purpose: 'Mesure anonymisée des performances du site',
    website: 'https://vercel.com/docs/speed-insights'
  }
} as const

export const LEGAL_PAGES = [
  { to: '/refonte/mentions-legales', label: 'Mentions légales' },
  { to: '/refonte/cgu', label: 'CGU' },
  { to: '/refonte/confidentialite', label: 'Confidentialité' },
  { to: '/refonte/plan-du-site', label: 'Plan du site' }
] as const

export const LEGAL_LAST_UPDATED = '15 août 2026'

export function formatLegalAddress() {
  const { line1, postalCode, city, country } = LEGAL_ENTITY.address
  return `${line1}, ${postalCode} ${city}, ${country}`
}
