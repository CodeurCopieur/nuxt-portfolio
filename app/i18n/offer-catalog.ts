import { MISSION_OFFER, PAGE_UNIQUE, SITE_MULTIPAGE } from '@/data/refonte-offers'
import type { AppLocale } from '@/utils/locale'

export type OfferCopy = {
  hook: string
  lines: readonly string[]
  close: string
}

export type OfferPane = {
  id: string
  name: string
  tagline: string
  duration: string
  copy: OfferCopy
  skillsTitle: string
  includes: readonly string[]
  stack: readonly string[]
  fit: string
  price: string
}

export type OfferCatalog = {
  mission: {
    num: string
    name: string
    tagline: string
    copy: OfferCopy
    skillsTitle: string
    includes: readonly string[]
    stack: readonly string[]
    tjm: string
    unit: string
    duration: string
    billing: string
    fit: string
  }
  page: {
    num: string
    name: string
    tagline: string
    lead: string
    panes: readonly OfferPane[]
  }
  site: {
    num: string
    name: string
    tagline: string
    lead: string
    panes: readonly OfferPane[]
  }
  custom: {
    tab: string
    num: string
    lead: string
    name: string
    tagline: string
    duration: string
    includes: readonly string[]
    stack: readonly string[]
    fit: string
  }
  termsMission: readonly { title: string, text: string }[]
  termsDevis: readonly { title: string, text: string }[]
}

const french: OfferCatalog = {
  mission: MISSION_OFFER,
  page: PAGE_UNIQUE,
  site: SITE_MULTIPAGE,
  custom: {
    tab: 'Sur-mesure',
    num: '04',
    lead: 'Motion, parcours riches, CMS ou contraintes fortes — chiffrage après brief.',
    name: 'Projet complexe',
    tagline: 'Motion, parcours, exigences fortes.',
    duration: '6 semaines et +',
    includes: [
      'Storytelling au scroll (GSAP / scrub)',
      'Parcours multi-étapes ou app front',
      'Intégration CMS / Twig / Drupal si besoin',
      'Perf, a11y et SEO exigeants',
      'Design system léger & composants réutilisables',
      'TMA / itérations post-livraison',
      'Cadence Agile, points réguliers'
    ],
    stack: ['GSAP', 'Nuxt 4', 'Drupal / Twig', 'A11y'],
    fit: 'Agences, produits, refontes premium.'
  },
  termsMission: [
    { title: 'Cadre', text: 'Mission au TJM : 500 € HT / jour. Facturation au réel.' },
    { title: 'Accord', text: 'Un échange (brief + disponibilités) fixe le démarrage. Pas d’acompte forfaitaire : engagement au temps.' },
    { title: 'Démarrage', text: 'La mission démarre à la date convenue, après confirmation écrite (mail ou contrat de mission).' },
    { title: 'Facturation', text: 'Facturation en fin de chaque mois, au réel des jours effectués.' }
  ],
  termsDevis: [
    { title: 'Brief', text: 'Objectifs, contenus, délais et contraintes. Le devis découle de ce périmètre.' },
    { title: 'Devis visé', text: 'Acceptation par signature ou « bon pour accord ». Ce visa formalise la commande.' },
    { title: 'Acompte', text: 'Acompte de 40 % HT à la commande, déduit de la facture finale. Ce n’est pas des arrhes.' },
    { title: 'Démarrage & solde', text: 'Travaux après devis visé + acompte. Solde (60 %) à la livraison des livrables.' }
  ]
}

const english: OfferCatalog = {
  mission: {
    num: '01',
    name: 'Engagement',
    tagline: 'Vue / Nuxt front-end — sprint or ongoing.',
    copy: {
      hook: 'I build the interface.',
      lines: [
        'Vue 3 components, Nuxt 4 pages, Pinia state, TypeScript.',
        'From Figma to production — responsive, accessible, GSAP motion.'
      ],
      close: 'Extra hands on a team, or ownership of a feature.'
    },
    skillsTitle: 'What I take on',
    includes: [
      'Vue 3 / Nuxt 4 UI: components, routing, Pinia',
      'Figma → production, semantic HTML',
      'Mobile-first responsive, SCSS or Tailwind',
      'Micro-interactions and GSAP animation',
      'Baseline accessibility, technical SEO, performance',
      'Forms, CRUD, notifications — a light back-end if needed'
    ],
    stack: ['Vue 3', 'Nuxt 4', 'TypeScript', 'Pinia', 'GSAP', 'Tailwind / SCSS'],
    tjm: '500',
    unit: '€ / day',
    duration: 'Sprint or ongoing',
    billing: 'Invoiced at the end of each month, for the days actually worked.',
    fit: 'A feature, a POC, extra capacity, product support.'
  },
  page: {
    num: '02',
    name: 'Single page',
    tagline: 'One page, one message, one CTA.',
    lead: 'A landing page built to convert — static, or wired to a light back-end. Quoted after a brief.',
    panes: [
      {
        id: 'landing',
        name: 'Landing page',
        tagline: 'One page, one message, one CTA.',
        copy: {
          hook: 'One page, built to convert.',
          lines: [
            'Hero, offer, proof, contact — a single path that reads clearly on mobile.',
            'Figma → production in Vue / Nuxt: semantics, responsive layout, SEO, light motion.'
          ],
          close: 'Quoted after a brief, launch included.'
        },
        skillsTitle: 'What I deliver',
        includes: [
          'A single path: hero → offer → proof → CTA',
          'Figma integration, semantic HTML, mobile-first',
          'Micro-interactions (hover, light scroll, GSAP if needed)',
          'Technical SEO: title, meta, Open Graph, baseline performance',
          'Contact form (EmailJS / mailto)',
          'Launch (Vercel or equivalent)'
        ],
        stack: ['Vue 3', 'Nuxt 4', 'Tailwind / SCSS', 'GSAP', 'SEO'],
        price: 'On quote',
        duration: '3 – 7 days',
        fit: 'An offer launch, an event, a campaign, a waiting page.'
      },
      {
        id: 'landing-backend',
        name: 'Landing + back-end',
        tagline: 'The same page, with living content.',
        copy: {
          hook: 'The landing page, with a light back-end.',
          lines: [
            'Editable copy, leads and a waitlist — without rebuilding the page for every campaign.',
            'Nuxt 4 + Supabase or Firebase: data, forms, notifications.'
          ],
          close: 'Ready to grow into a multi-page site.'
        },
        skillsTitle: 'What I deliver',
        includes: [
          'Everything in the landing-page pack',
          'Dynamic content (offers, dates, FAQ) without a republish for every typo',
          'Light back-end: Supabase or Firebase (data, files, auth if needed)',
          'A simple admin: copy, leads, waitlist',
          'Advanced forms, anti-spam, email notifications',
          'A Nuxt structure ready to become multi-page'
        ],
        stack: ['Nuxt 4', 'Vue 3', 'Pinia', 'Supabase', 'Firebase'],
        price: 'On quote',
        duration: '1 – 2 weeks',
        fit: 'Lead generation, a waitlist, a launch with content that changes.'
      }
    ]
  },
  site: {
    num: '03',
    name: 'Multi-page site',
    tagline: 'A clear, fast, careful presence.',
    lead: 'Several pages to present the offer — with or without an admin and dynamic data. Quoted after a brief.',
    panes: [
      {
        id: 'vitrine',
        name: 'Brochure site',
        tagline: 'A clear, fast, careful presence.',
        copy: {
          hook: 'A site that presents the offer.',
          lines: [
            'Up to 5 pages, a readable path: home, offer, about, contact.',
            'Figma → production in Vue / Nuxt: semantics, responsive layout, SEO, light motion.'
          ],
          close: 'Quoted after a brief, launch and a short handover included.'
        },
        skillsTitle: 'What I deliver',
        includes: [
          'Multi-page (up to 5 pages): home, offer, about, contact…',
          'Figma integration, semantic HTML, mobile-first',
          'Micro-interactions and light animation (GSAP if needed)',
          'Technical SEO: title, meta, Open Graph, baseline performance',
          'A starting point for accessibility (semantics, keyboard, contrast)',
          'Contact form (EmailJS / mailto)',
          'Launch and a short handover'
        ],
        stack: ['Vue 3', 'Nuxt 4', 'Tailwind / SCSS', 'GSAP', 'SEO'],
        price: 'On quote',
        duration: '1 – 2 weeks',
        fit: 'Independents, studios, brand launches.'
      },
      {
        id: 'vitrine-backend',
        name: 'Brochure site + back-end',
        tagline: 'Living content, without a heavy platform.',
        copy: {
          hook: 'The brochure site, with a light back-end.',
          lines: [
            'Editable pages, offers and content — without a rebuild for every update.',
            'Nuxt 4 + Supabase or Firebase: data, admin, forms, auth if needed.'
          ],
          close: 'A catalog, a client portfolio, offers that change.'
        },
        skillsTitle: 'What I deliver',
        includes: [
          'Everything in the brochure-site pack',
          'Dynamic content (pages, offers, news) without a republish for every typo',
          'Light back-end: Supabase or Firebase (data, files, auth if needed)',
          'A simple admin / CRUD',
          'Advanced forms, anti-spam, email notifications',
          'A Nuxt structure ready to grow'
        ],
        stack: ['Nuxt 4', 'Vue 3', 'Pinia', 'Supabase', 'Firebase'],
        price: 'On quote',
        duration: '2 – 4 weeks',
        fit: 'Offers that change, a catalog, a client portfolio.'
      }
    ]
  },
  custom: {
    tab: 'Custom',
    num: '04',
    lead: 'Motion, richer journeys, a CMS or hard constraints — priced after a brief.',
    name: 'Complex project',
    tagline: 'Motion, journeys, high expectations.',
    duration: '6 weeks and up',
    includes: [
      'Scroll storytelling (GSAP / scrub)',
      'Multi-step journeys or a front-end app',
      'CMS / Twig / Drupal integration if needed',
      'Demanding performance, accessibility and SEO',
      'A light design system and reusable components',
      'Maintenance / iterations after delivery',
      'An agile cadence, regular check-ins'
    ],
    stack: ['GSAP', 'Nuxt 4', 'Drupal / Twig', 'A11y'],
    fit: 'Agencies, products, premium rebuilds.'
  },
  termsMission: [
    { title: 'Frame', text: 'Day-rate engagement: €500 excl. VAT / day. Invoiced for time actually worked.' },
    { title: 'Agreement', text: 'A conversation (brief + availability) sets the start. No flat deposit: the commitment is time.' },
    { title: 'Start', text: 'The engagement starts on the agreed date, after written confirmation (email or a contract).' },
    { title: 'Invoicing', text: 'Invoiced at the end of each month, for the days actually worked.' }
  ],
  termsDevis: [
    { title: 'Brief', text: 'Goals, content, timing and constraints. The quote follows that scope.' },
    { title: 'Signed quote', text: 'Accepted by signature or a written go-ahead. That approval is the order.' },
    { title: 'Deposit', text: 'A 40% excl. VAT deposit on order, deducted from the final invoice. It is not a forfeited booking fee.' },
    { title: 'Start & balance', text: 'Work begins after the approved quote and the deposit. The balance (60%) is due when the deliverables are handed over.' }
  ]
}

const spanish: OfferCatalog = {
  mission: {
    num: '01',
    name: 'Misión',
    tagline: 'Front-end Vue / Nuxt — sprint o régimen.',
    copy: {
      hook: 'Construyo la interfaz.',
      lines: [
        'Componentes Vue 3, páginas Nuxt 4, estado Pinia, TypeScript.',
        'De Figma a producción — responsive, accesible, motion con GSAP.'
      ],
      close: 'Refuerzo de equipo o responsabilidad de una feature.'
    },
    skillsTitle: 'Lo que asumo',
    includes: [
      'UI Vue 3 / Nuxt 4: componentes, routing, Pinia',
      'Integración Figma → producción, HTML semántico',
      'Responsive mobile-first, SCSS o Tailwind',
      'Microinteracciones y animaciones GSAP',
      'Accesibilidad de base, SEO técnico, rendimiento',
      'Formularios, CRUD, notificaciones — un back ligero si hace falta'
    ],
    stack: ['Vue 3', 'Nuxt 4', 'TypeScript', 'Pinia', 'GSAP', 'Tailwind / SCSS'],
    tjm: '500',
    unit: '€ / día',
    duration: 'Sprint o régimen',
    billing: 'Facturación a fin de cada mes, según los días realmente trabajados.',
    fit: 'Una feature, un POC, refuerzo de equipo, acompañamiento de producto.'
  },
  page: {
    num: '02',
    name: 'Página única',
    tagline: 'Una página, un mensaje, un CTA.',
    lead: 'Una landing para convertir — estática o conectada a un back ligero. Presupuesto tras el brief.',
    panes: [
      {
        id: 'landing',
        name: 'Landing page',
        tagline: 'Una página, un mensaje, un CTA.',
        copy: {
          hook: 'Una página para convertir.',
          lines: [
            'Hero, oferta, prueba, contacto — un solo recorrido, legible en móvil.',
            'Figma → producción en Vue / Nuxt: semántica, responsive, SEO, motion ligero.'
          ],
          close: 'Presupuesto tras el brief, puesta en línea incluida.'
        },
        skillsTitle: 'Lo que entrego',
        includes: [
          'Recorrido único: hero → oferta → prueba → CTA',
          'Integración Figma, HTML semántico, mobile-first',
          'Microinteracciones (hover, scroll ligero, GSAP si hace falta)',
          'SEO técnico: title, meta, Open Graph, rendimiento de base',
          'Formulario de contacto (EmailJS / mailto)',
          'Puesta en línea (Vercel o equivalente)'
        ],
        stack: ['Vue 3', 'Nuxt 4', 'Tailwind / SCSS', 'GSAP', 'SEO'],
        price: 'Bajo presupuesto',
        duration: '3 – 7 días',
        fit: 'Lanzamiento de oferta, evento, campaña, página de espera.'
      },
      {
        id: 'landing-backend',
        name: 'Landing + backend',
        tagline: 'La misma página, con contenido vivo.',
        copy: {
          hook: 'La landing, con un back ligero.',
          lines: [
            'Textos, leads y lista de espera editables — sin rehacer la página en cada campaña.',
            'Nuxt 4 + Supabase o Firebase: datos, formularios, notificaciones.'
          ],
          close: 'Lista para crecer hacia un sitio multipágina.'
        },
        skillsTitle: 'Lo que entrego',
        includes: [
          'Todo el pack Landing page',
          'Contenido dinámico (ofertas, fechas, FAQ) sin republicar por cada errata',
          'Backend ligero: Supabase o Firebase (datos, archivos, auth si hace falta)',
          'Admin simple: textos, leads, lista de espera',
          'Formularios avanzados, antispam, notificaciones por email',
          'Estructura Nuxt lista para evolucionar a multipágina'
        ],
        stack: ['Nuxt 4', 'Vue 3', 'Pinia', 'Supabase', 'Firebase'],
        price: 'Bajo presupuesto',
        duration: '1 – 2 semanas',
        fit: 'Generación de leads, lista de espera, lanzamiento con contenido que se mueve.'
      }
    ]
  },
  site: {
    num: '03',
    name: 'Sitio multipágina',
    tagline: 'Presencia clara, rápida y cuidada.',
    lead: 'Varias páginas para presentar la oferta — con o sin admin / datos dinámicos. Presupuesto tras el brief.',
    panes: [
      {
        id: 'vitrine',
        name: 'Sitio vitrina',
        tagline: 'Presencia clara, rápida y cuidada.',
        copy: {
          hook: 'Un sitio para presentar la oferta.',
          lines: [
            'Hasta 5 páginas, un recorrido legible: inicio, oferta, acerca de, contacto.',
            'Figma → producción en Vue / Nuxt: semántica, responsive, SEO, motion ligero.'
          ],
          close: 'Presupuesto tras el brief, puesta en línea y una formación corta.'
        },
        skillsTitle: 'Lo que entrego',
        includes: [
          'Multipágina (hasta 5 páginas): inicio, oferta, acerca de, contacto…',
          'Integración Figma, HTML semántico, mobile-first',
          'Microinteracciones y animaciones ligeras (GSAP si hace falta)',
          'SEO técnico: title, meta, Open Graph, rendimiento de base',
          'Accesibilidad de partida (semántica, teclado, contrastes)',
          'Formulario de contacto (EmailJS / mailto)',
          'Puesta en línea y formación corta'
        ],
        stack: ['Vue 3', 'Nuxt 4', 'Tailwind / SCSS', 'GSAP', 'SEO'],
        price: 'Bajo presupuesto',
        duration: '1 – 2 semanas',
        fit: 'Autónomos, estudios, lanzamientos de marca.'
      },
      {
        id: 'vitrine-backend',
        name: 'Sitio vitrina + backend',
        tagline: 'Contenido vivo, sin una plataforma pesada.',
        copy: {
          hook: 'El vitrina, con un back ligero.',
          lines: [
            'Páginas, ofertas y contenidos editables — sin rehacerlo todo en cada actualización.',
            'Nuxt 4 + Supabase o Firebase: datos, admin, formularios, auth si hace falta.'
          ],
          close: 'Catálogo, portfolio de cliente, ofertas que cambian.'
        },
        skillsTitle: 'Lo que entrego',
        includes: [
          'Todo el pack Sitio vitrina',
          'Contenido dinámico (páginas, ofertas, actualidad) sin republicar por cada errata',
          'Backend ligero: Supabase o Firebase (datos, archivos, auth si hace falta)',
          'Espacio admin / CRUD simple',
          'Formularios avanzados, antispam, notificaciones por email',
          'Estructura Nuxt lista para evolucionar'
        ],
        stack: ['Nuxt 4', 'Vue 3', 'Pinia', 'Supabase', 'Firebase'],
        price: 'Bajo presupuesto',
        duration: '2 – 4 semanas',
        fit: 'Ofertas que cambian, catálogo, portfolio de cliente.'
      }
    ]
  },
  custom: {
    tab: 'A medida',
    num: '04',
    lead: 'Motion, recorridos ricos, CMS o restricciones fuertes — presupuesto tras el brief.',
    name: 'Proyecto complejo',
    tagline: 'Motion, recorridos, exigencias altas.',
    duration: '6 semanas o más',
    includes: [
      'Storytelling con scroll (GSAP / scrub)',
      'Recorrido de varios pasos o app front',
      'Integración CMS / Twig / Drupal si hace falta',
      'Rendimiento, accesibilidad y SEO exigentes',
      'Design system ligero y componentes reutilizables',
      'Mantenimiento / iteraciones tras la entrega',
      'Cadencia ágil, puntos regulares'
    ],
    stack: ['GSAP', 'Nuxt 4', 'Drupal / Twig', 'A11y'],
    fit: 'Agencias, productos, reconstrucciones premium.'
  },
  termsMission: [
    { title: 'Marco', text: 'Misión a tarifa diaria: 500 € sin IVA / día. Facturación según el tiempo real.' },
    { title: 'Acuerdo', text: 'Una conversación (brief + disponibilidad) fija el inicio. Sin anticipo a tanto alzado: el compromiso es el tiempo.' },
    { title: 'Inicio', text: 'La misión empieza en la fecha acordada, tras una confirmación escrita (email o contrato).' },
    { title: 'Facturación', text: 'Facturación a fin de cada mes, según los días realmente trabajados.' }
  ],
  termsDevis: [
    { title: 'Brief', text: 'Objetivos, contenidos, plazos y restricciones. El presupuesto sale de ese perímetro.' },
    { title: 'Presupuesto aceptado', text: 'Aceptación por firma o por un «conforme». Ese visto bueno formaliza el pedido.' },
    { title: 'Anticipo', text: 'Anticipo del 40 % sin IVA al pedido, descontado de la factura final. No son arras.' },
    { title: 'Inicio y saldo', text: 'El trabajo empieza tras el presupuesto aceptado y el anticipo. El saldo (60 %) se paga a la entrega.' }
  ]
}

const catalogs: Record<AppLocale, OfferCatalog> = {
  fr: french,
  en: english,
  es: spanish
}

export function getOfferCatalog(locale: AppLocale) {
  return catalogs[locale]
}
