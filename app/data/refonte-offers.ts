export const MISSION_OFFER = {
  num: '01',
  name: 'Mission',
  tagline: 'Front-end Vue / Nuxt — sprint ou régie.',
  copy: {
    hook: 'Je construis l’interface.',
    lines: [
      'Composants Vue 3, pages Nuxt 4, state Pinia, TypeScript.',
      'Du Figma à la prod — responsive, accessible, motion GSAP.'
    ],
    close: 'Renfort d’équipe ou prise en charge d’une feature.'
  },
  skillsTitle: 'Ce que je prends en charge',
  includes: [
    'UI Vue 3 / Nuxt 4 : composants, routing, Pinia',
    'Intégration Figma → production, HTML sémantique',
    'Responsive mobile-first, SCSS ou Tailwind',
    'Micro-interactions et animations GSAP',
    'Accessibilité de base, SEO technique, perf',
    'Formulaires, CRUD, notifications — back léger si besoin'
  ],
  stack: ['Vue 3', 'Nuxt 4', 'TypeScript', 'Pinia', 'GSAP', 'Tailwind / SCSS'],
  tjm: '500',
  unit: '€ / jour',
  duration: 'Sprint ou régie',
  billing: 'Facturation en fin de chaque mois, au réel des jours effectués.',
  fit: 'Feature, POC, renfort d’équipe, accompagnement produit.'
} as const

export const PAGE_UNIQUE = {
  num: '02',
  name: 'Page unique',
  tagline: 'Une page, un message, un CTA.',
  lead: 'Landing pour convertir — statique ou branchée à un back léger. Devis après brief.',
  panes: [
    {
      id: 'landing',
      name: 'Landing page',
      tagline: 'Une page, un message, un CTA.',
      copy: {
        hook: 'Une page pour convertir.',
        lines: [
          'Hero, offre, preuve, contact — un seul parcours, lisible sur mobile.',
          'Figma → prod en Vue / Nuxt : sémantique, responsive, SEO, motion léger.'
        ],
        close: 'Devis après brief, mise en ligne incluse.'
      },
      skillsTitle: 'Ce que je livre',
      includes: [
        'Parcours unique : hero → offre → preuve → CTA',
        'Intégration Figma, HTML sémantique, mobile-first',
        'Micro-interactions (hover, scroll léger, GSAP si besoin)',
        'SEO technique : title, meta, Open Graph, perf de base',
        'Formulaire de contact (EmailJS / mailto)',
        'Mise en ligne (Vercel ou équivalent)'
      ],
      stack: ['Vue 3', 'Nuxt 4', 'Tailwind / SCSS', 'GSAP', 'SEO'],
      price: 'Sur devis',
      duration: '3 – 7 jours',
      fit: 'Lancement d’offre, event, campagne, page d’attente.'
    },
    {
      id: 'landing-backend',
      name: 'Landing + backend',
      tagline: 'Même page, contenu vivant.',
      copy: {
        hook: 'La landing, avec un back léger.',
        lines: [
          'Textes, leads et waitlist éditables — sans tout recoder à chaque campagne.',
          'Nuxt 4 + Supabase ou Firebase : data, formulaires, notifications.'
        ],
        close: 'Prête à grandir vers un site multipage.'
      },
      skillsTitle: 'Ce que je livre',
      includes: [
        'Tout le pack Landing page',
        'Contenu dynamique (offres, dates, FAQ) sans republier à chaque typo',
        'Backend léger : Supabase ou Firebase (data, fichiers, auth si besoin)',
        'Admin simple : textes, leads, liste d’attente',
        'Formulaires avancés, anti-spam, notifications mail',
        'Structure Nuxt prête à évoluer vers un multipage'
      ],
      stack: ['Nuxt 4', 'Vue 3', 'Pinia', 'Supabase', 'Firebase'],
      price: 'Sur devis',
      duration: '1 – 2 semaines',
      fit: 'Lead gen, waitlist, lancement avec contenu qui bouge.'
    }
  ]
} as const

export const SITE_MULTIPAGE = {
  num: '03',
  name: 'Site multipage',
  tagline: 'Présence claire, rapide, soignée.',
  lead: 'Plusieurs pages pour présenter l’offre — avec ou sans admin / données dynamiques. Devis après brief.',
  panes: [
    {
      id: 'vitrine',
      name: 'Site vitrine',
      tagline: 'Présence claire, rapide, soignée.',
      copy: {
        hook: 'Un site pour présenter l’offre.',
        lines: [
          'Jusqu’à 5 pages, un parcours lisible : accueil, offre, à propos, contact.',
          'Figma → prod en Vue / Nuxt : sémantique, responsive, SEO, motion léger.'
        ],
        close: 'Devis après brief, mise en ligne et formation courte.'
      },
      skillsTitle: 'Ce que je livre',
      includes: [
        'Multipage (jusqu’à 5 pages) : accueil, offre, à propos, contact…',
        'Intégration Figma, HTML sémantique, mobile-first',
        'Micro-interactions et animations légères (GSAP si besoin)',
        'SEO technique : title, meta, Open Graph, perf de base',
        'Accessibilité de départ (sémantique, clavier, contrastes)',
        'Formulaire de contact (EmailJS / mailto)',
        'Mise en ligne et formation courte'
      ],
      stack: ['Vue 3', 'Nuxt 4', 'Tailwind / SCSS', 'GSAP', 'SEO'],
      price: 'Sur devis',
      duration: '1 – 2 semaines',
      fit: 'Indépendants, studios, lancements de marque.'
    },
    {
      id: 'vitrine-backend',
      name: 'Site vitrine + backend',
      tagline: 'Contenu vivant, sans usine à gaz.',
      copy: {
        hook: 'Le vitrine, avec un back léger.',
        lines: [
          'Pages, offres et contenus éditables — sans tout recoder à chaque MAJ.',
          'Nuxt 4 + Supabase ou Firebase : data, admin, formulaires, auth si besoin.'
        ],
        close: 'Catalogue, portfolio client, offres qui changent.'
      },
      skillsTitle: 'Ce que je livre',
      includes: [
        'Tout le pack Site vitrine',
        'Contenu dynamique (pages, offres, actualités) sans republier à chaque typo',
        'Backend léger : Supabase ou Firebase (data, fichiers, auth si besoin)',
        'Espace admin / CRUD simple',
        'Formulaires avancés, anti-spam, notifications mail',
        'Structure Nuxt prête à évoluer'
      ],
      stack: ['Nuxt 4', 'Vue 3', 'Pinia', 'Supabase', 'Firebase'],
      price: 'Sur devis',
      duration: '2 – 4 semaines',
      fit: 'Offres qui changent, catalogue, portfolio client.'
    }
  ]
} as const
