import type { AppLocale } from '@/utils/locale'

export type UiCopy = {
  langGroup: string
  nav: {
    home: string
    projects: string
    services: string
    contact: string
    menu: string
    close: string
    primary: string
    themeToDark: string
    themeToLight: string
    themeDarkTitle: string
    themeLightTitle: string
    note: string
  }
  chapters: Record<string, string>
  hero: {
    line1: string
    line2: string
    line3: string
    available: string
    scroll: string
    years: string
    projects: string
  }
  intro: {
    label: string
    tail: string
    fromTo: string
    fromToVia: string
  }
  offers: {
    label: string
    title: string
    titleAccent: string
    more: string
    pageType: string
    tjmNote: string
    priceNote: string
  }
  works: {
    kicker: string
    title: string
    titleAccent: string
    archives: string
    selection: string
    featured: string
    lead: string
    view: string
    actProjects: string
    actFocus: string
    actList: string
  }
  expertise: {
    kicker: string
    title: string
    hint: string
    missions: string
    technologies: string
    domains: string
    actNumbers: string
    actRadar: string
    actDone: string
    actDetail: string
    categories: Record<string, string>
  }
  experience: {
    kicker: string
    title: string
    click: string
    scroll: string
    done: string
    pick: string
    mission: string
    context: string
    missions: string
    stack: string
    progress: string
    details: string
    actIntro: string
    actContext: string
    actMissions: string
    actStack: string
  }
  footer: {
    finale: string
    line1: string
    line2: string
    accent: string
    write: string
    form: string
    portfolio: string
    networks: string
    classic: string
    stack: string
    legalNav: string
  }
  contact: {
    label: string
    title: string
    titleAccent: string
    lead: string
    email: string
    location: string
    availability: string
    reply: string
    name: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    sending: string
    sendingLabel: string
    successTitle: string
    successDesc: string
    required: string
    sendError: string
    fallbackError: string
    pageTitle: string
  }
  a11y: {
    title: string
    lead: string
    close: string
    display: string
    contrast: string
    bigText: string
    underline: string
    motion: string
    color: string
    colorHint: string
    colorGroup: string
    standard: string
    deuteranopia: string
    protanopia: string
    tritanopia: string
    preview: string
    reset: string
    open: string
  }
  archive: {
    label: string
    title: string
    lead: string
    filter: string
    all: string
    countOne: string
    countMany: string
    pageTitle: string
  }
  case: {
    back: string
    stack: string
    tags: string
    live: string
    github: string
    missing: string
    fallback: string
  }
  legalNav: {
    mentions: string
    cgu: string
    privacy: string
    sitemap: string
  }
  legalChrome: {
    back: string
    kicker: string
    updated: string
    date: string
  }
  pricing: {
    kicker: string
    title: string
    titleAccent: string
    lead: string
    jump: string
    families: string
    rate: string
    onQuote: string
    pageType: string
    siteType: string
    conditions: string
    how: string
    intro: string
    termsType: string
    mission: string
    quote: string
    aside: string
    contact: string
    ctaMission: string
    ctaQuote: string
    pageTitle: string
    description: string
    ogDescription: string
  }
  seo: {
    homeTitle: string
    homeFallback: string
    roleFallback: string
    projectsDescription: string
    contactDescription: string
  }
  sitemap: {
    title: string
    lead: string
    pageTitle: string
    portfolio: string
    projects: string
    legal: string
    archive: string
    oldHome: string
    oldProjects: string
    oldContact: string
    contact: string
  }
  mentions: {
    title: string
    lead: string
    pageTitle: string
    publisher: string
    businessName: string
    tradeName: string
    legalForm: string
    siren: string
    siret: string
    vat: string
    registration: string
    activity: string
    naf: string
    address: string
    domiciliation: string
    created: string
    contact: string
    directorTitle: string
    director: string
    hostingTitle: string
    hosting: string
    website: string
    ipTitle: string
    ip: string
    thirdTitle: string
    dataTitle: string
    data: string
    privacyLink: string
    liabilityTitle: string
    liability: string
    sourceTitle: string
    source: string
  }
  entity: {
    legalForm: string
    activity: string
    rcs: string
    rne: string
    created: string
    country: string
    hostingCountry: string
    emailjs: string
    speed: string
    analytics: string
  }
  cgu: {
    title: string
    lead: string
    pageTitle: string
    s1: string
    p1: string
    s2: string
    p2: string
    s3: string
    p3: string
    s4: string
    p4: string
    s5: string
    p5: string
    s6: string
    p6: string
    s7: string
    p7: string
    s8: string
    p8: string
    s9: string
    p9: string
    privacyLink: string
    s10: string
    p10: string
    s11: string
    p11: string
  }
  privacy: {
    title: string
    lead: string
    pageTitle: string
    controllerTitle: string
    contact: string
    collectedTitle: string
    collectedIntro: string
    formItem: string
    techItem: string
    cookieItem: string
    purposesTitle: string
    purpose1: string
    purpose2: string
    purpose3: string
    purpose4: string
    basisTitle: string
    basis1: string
    basis2: string
    basis3: string
    recipientsTitle: string
    recipientsIntro: string
    vercel: string
    vercelPolicy: string
    emailjs: string
    emailjsSite: string
    noSale: string
    retentionTitle: string
    retention1: string
    retention2: string
    retention3: string
    rightsTitle: string
    rights: string
    rightsContact: string
    cnil: string
    cookiesTitle: string
    cookies: string
    securityTitle: string
    security: string
    changesTitle: string
    changes: string
  }
}

const fr: UiCopy = {
  langGroup: 'Langue du site',
  nav: {
    home: 'Accueil',
    projects: 'Projets',
    services: 'Prestations',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Fermer',
    primary: 'Navigation principale',
    themeToDark: 'Passer en thème sombre bleu roi',
    themeToLight: 'Passer en thème clair',
    themeDarkTitle: 'Thème sombre bleu roi',
    themeLightTitle: 'Thème clair',
    note: 'Front-end · Motion · Paris / Remote'
  },
  chapters: {
    Accueil: 'Accueil',
    Manifeste: 'Manifeste',
    Prestations: 'Prestations',
    Contact: 'Contact',
    Réalisations: 'Réalisations',
    'Savoir-faire': 'Savoir-faire',
    Projets: 'Projets',
    Expériences: 'Expériences',
    Légal: 'Légal',
    'Plan du site': 'Plan du site'
  },
  hero: {
    line1: 'Je conçois des',
    line2: 'interfaces',
    line3: 'qui tiennent la charge',
    available: 'Disponible en freelance',
    scroll: 'Scroll pour explorer',
    years: '{n}+ ans',
    projects: '{n} projets'
  },
  intro: {
    label: 'Manifeste',
    tail: '{years} ans à concevoir des interfaces qui tiennent la charge, sans jamais sacrifier le détail.',
    fromTo: 'De {first} à {last}',
    fromToVia: 'De {first} à {last}, en passant par {middle}'
  },
  offers: {
    label: 'Prestations',
    title: 'Mission',
    titleAccent: 'front-end',
    more: 'Voir plus',
    pageType: 'Type de page unique',
    tjmNote: 'TJM',
    priceNote: 'Tarif'
  },
  works: {
    kicker: '03 — Réalisations',
    title: 'Travaux',
    titleAccent: 'sélectionnés',
    archives: 'Archives →',
    selection: 'Sélection',
    featured: 'projets mis en avant',
    lead: 'Des interfaces pensées pour tenir la charge — du brief à la prod.',
    view: 'Voir le projet →',
    actProjects: '01 — Projets',
    actFocus: '02 — Focus {current}/{total}',
    actList: '03 — Liste'
  },
  expertise: {
    kicker: '04 — Savoir-faire',
    title: 'Compétences',
    hint: 'Cliquez une note du radar (A, B, C…) pour afficher le détail de la compétence.',
    missions: 'Missions',
    technologies: 'Technologies',
    domains: 'Domaines',
    actNumbers: '01 — Chiffres',
    actRadar: '02 — Radar',
    actDone: 'Fin — Parcours complet',
    actDetail: '03 — Détail',
    categories: {
      langages: 'Langages',
      frameworks: 'Frameworks',
      outils_dev: 'Outils',
      ui_animations: 'UI & motion',
      design: 'Design',
      environnements: 'Environnements',
      methodes: 'Méthodes',
      ia_cursor: 'IA',
      accessibilite: 'Accessibilité'
    }
  },
  experience: {
    kicker: '05 — Expériences',
    title: 'Expériences',
    click: 'Cliquez une carte pour explorer la mission.',
    scroll: 'Scrollez — les détails de chaque mission se dévoilent au fil du scroll.',
    done: 'Parcours complet — continuez vers le bas.',
    pick: 'Sélectionnez une entreprise pour explorer la mission.',
    mission: 'Mission',
    context: 'Contexte',
    missions: 'Missions',
    stack: 'Stack',
    progress: 'Progression du parcours {n} %',
    details: 'Détails',
    actIntro: '00 — Intro',
    actContext: '01 — Contexte',
    actMissions: '02 — Missions',
    actStack: '03 — Stack'
  },
  footer: {
    finale: 'Finale',
    line1: 'Travaillons',
    line2: 'ensemble sur votre',
    accent: 'prochain projet',
    write: "M'écrire",
    form: 'ou via le formulaire →',
    portfolio: 'Portfolio',
    networks: 'Réseaux',
    classic: 'Version classique',
    stack: 'Stack',
    legalNav: 'Informations légales'
  },
  contact: {
    label: 'Contact',
    title: 'Parlons de',
    titleAccent: 'votre projet',
    lead: 'Prêt à collaborer ? Décrivez vos idées et voyons comment je peux vous aider à les concrétiser.',
    email: 'Email',
    location: 'Localisation',
    availability: 'Disponibilité',
    reply: 'Réponse sous 24h',
    name: 'Nom complet *',
    namePlaceholder: 'Votre nom complet',
    emailLabel: 'Email *',
    emailPlaceholder: 'votre@email.com',
    message: 'Message *',
    messagePlaceholder: 'Décrivez votre projet, vos besoins ou posez-moi vos questions...',
    send: 'Envoyer le message',
    sending: 'Envoi en cours…',
    sendingLabel: 'Envoi…',
    successTitle: 'Message envoyé avec succès',
    successDesc: 'Je vous répondrai dans les plus brefs délais.',
    required: 'Veuillez remplir tous les champs obligatoires.',
    sendError: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
    fallbackError: 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.',
    pageTitle: 'Contact'
  },
  a11y: {
    title: 'Accessibilité',
    lead: 'Ajustez l’affichage pour mieux lire et distinguer les couleurs.',
    close: 'Fermer',
    display: 'Affichage',
    contrast: 'Contraste élevé',
    bigText: 'Texte plus grand',
    underline: 'Souligner les liens',
    motion: 'Réduire les animations',
    color: 'Vision des couleurs',
    colorHint: 'Palette adaptée au daltonisme (couleurs plus distinctes).',
    colorGroup: 'Vision des couleurs',
    standard: 'Standard',
    deuteranopia: 'Deutéranopie',
    protanopia: 'Protanopie',
    tritanopia: 'Tritanopie',
    preview: 'Aperçu des couleurs',
    reset: 'Réinitialiser',
    open: 'Accessibilité'
  },
  archive: {
    label: 'Archives',
    title: 'Tous les projets',
    lead: '{n} réalisations — filtrez par technologie pour cibler une stack.',
    filter: 'Filtrer par technologie',
    all: 'Tous',
    countOne: '{n} projet',
    countMany: '{n} projets',
    pageTitle: 'Projets'
  },
  case: {
    back: '← Retour aux projets',
    stack: 'Stack',
    tags: 'Tags',
    live: 'Voir en ligne →',
    github: 'GitHub →',
    missing: 'Projet introuvable',
    fallback: 'Projet'
  },
  legalNav: {
    mentions: 'Mentions légales',
    cgu: 'CGU',
    privacy: 'Confidentialité',
    sitemap: 'Plan du site'
  },
  legalChrome: {
    back: "← Retour à l'accueil",
    kicker: 'Informations légales',
    updated: 'Dernière mise à jour : {date}',
    date: '3 septembre 2026'
  },
  pricing: {
    kicker: '03 — Prestations',
    title: 'Offres',
    titleAccent: '& missions',
    lead: 'Forfaits chiffrés après brief, ou mission au TJM 500 € / jour.',
    jump: 'Voir les conditions',
    families: 'Familles d’offres',
    rate: 'Tarif',
    onQuote: 'Sur devis',
    pageType: 'Type de page unique',
    siteType: 'Type de site multipage',
    conditions: 'Conditions',
    how: 'Comment ça démarre',
    intro: 'Les règles suivent le cadre de l’onglet choisi : mission au TJM, ou devis pour les autres offres.',
    termsType: 'Type de conditions',
    mission: 'Mission',
    quote: 'Devis',
    aside: 'Facturation en HT (TVA selon régime). En cas d’annulation après démarrage, le travail déjà réalisé reste dû.',
    contact: 'Contact',
    ctaMission: 'Mission',
    ctaQuote: 'Devis',
    pageTitle: 'Prestations',
    description: 'Offres web sur devis et missions front Vue/Nuxt au TJM 500 €.',
    ogDescription: 'Landing, multipage, sur-mesure sur devis. Missions front Vue/Nuxt au TJM 500 €.'
  },
  seo: {
    homeTitle: '{name} — Développeur front-end freelance à Paris',
    homeFallback: 'Développeur front-end freelance à Paris. Interfaces Nuxt et Vue pour la banque, le luxe et la presse : rapides, accessibles et animées. 7 ans d’expérience.',
    roleFallback: 'Développeur Front-End',
    projectsDescription: 'Réalisations front-end : interfaces Nuxt, Vue et intégrations pour la presse, le luxe et la banque.',
    contactDescription: 'Écrire à Widdy Louis pour une mission front-end freelance, une landing ou un site sur devis.'
  },
  sitemap: {
    title: 'Plan du site',
    lead: "Vue d'ensemble de l'architecture et des pages accessibles sur le portfolio.",
    pageTitle: 'Plan du site',
    portfolio: 'Portfolio',
    projects: 'Projets',
    legal: 'Informations légales',
    archive: 'Version archivée',
    oldHome: 'Ancien portfolio',
    oldProjects: 'Projets (ancienne version)',
    oldContact: 'Contact (ancienne version)',
    contact: 'Contact'
  },
  mentions: {
    title: 'Mentions légales',
    lead: "Informations légales relatives à l'édition et à l'hébergement du site portfolio.",
    pageTitle: 'Mentions légales',
    publisher: 'Éditeur du site',
    businessName: 'Raison sociale',
    tradeName: 'Nom commercial',
    legalForm: 'Forme juridique',
    siren: 'SIREN',
    siret: 'SIRET (siège)',
    vat: 'Numéro de TVA intracommunautaire',
    registration: 'Immatriculation',
    activity: 'Activité',
    naf: 'code NAF {code}',
    address: 'Adresse du siège',
    domiciliation: 'Domiciliation',
    created: 'Date de création',
    contact: 'Contact',
    directorTitle: 'Directeur de la publication',
    director: '{name}, en qualité de chef d\'entreprise.',
    hostingTitle: 'Hébergement',
    hosting: 'Le site est hébergé par {name}, {address}.',
    website: 'Site web :',
    ipTitle: 'Propriété intellectuelle',
    ip: "L'ensemble des éléments composant le site {url} (textes, visuels, code source, identité graphique, animations) est la propriété exclusive de {name}, sauf mention contraire. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.",
    thirdTitle: 'Services tiers',
    dataTitle: 'Données personnelles',
    data: 'Pour en savoir plus sur la collecte et le traitement de vos données, consultez la',
    privacyLink: 'politique de confidentialité',
    liabilityTitle: 'Limitation de responsabilité',
    liability: "{name} s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Toutefois, elle ne saurait être tenue responsable des erreurs, omissions ou indisponibilités temporaires du service, ni des dommages résultant de l'utilisation du site ou de sites tiers accessibles via des liens hypertextes.",
    sourceTitle: "Source des informations d'entreprise",
    source: 'Informations légales issues du registre des entreprises, consultables sur'
  },
  entity: {
    legalForm: 'Entrepreneur individuel (micro-entreprise)',
    activity: 'Prestations de services en développement informatique : conception, création, intégration et maintenance de sites internet, applications web et mobiles, incluant le développement front-end, back-end et solutions digitales associées.',
    rcs: 'Non inscrit au RCS',
    rne: 'Inscrit au RNE',
    created: '19 août 2025',
    country: 'France',
    hostingCountry: 'États-Unis',
    emailjs: 'Envoi des messages du formulaire de contact',
    speed: 'Mesure anonymisée des performances du site',
    analytics: 'Mesure d’audience anonymisée (pages vues, visiteurs), sans cookies'
  },
  cgu: {
    title: "Conditions générales d'utilisation",
    lead: "Règles d'accès et d'utilisation du site portfolio.",
    pageTitle: "Conditions générales d'utilisation",
    s1: '1. Objet',
    p1: "Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités d'accès et d'utilisation du site {url}, édité par {name} ({form}), exerçant sous le nom {trade}.",
    s2: '2. Acceptation',
    p2: "L'accès et la navigation sur le site impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous êtes invité à ne pas utiliser le site.",
    s3: '3. Accès au site',
    p3: "Le site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. {name} se réserve le droit de suspendre, modifier ou interrompre le site à tout moment, sans préavis, notamment pour des raisons de maintenance ou de mise à jour.",
    s4: '4. Nature du site',
    p4: "Le site a une vocation informative et de présentation de compétences professionnelles. Il ne constitue pas une plateforme de vente en ligne. Les prestations de développement informatique proposées par {name} font l'objet de devis et de contrats distincts.",
    s5: '5. Propriété intellectuelle',
    p5: 'Tous les contenus présents sur le site (textes, images, logos, code, animations, mise en page) sont protégés par le droit de la propriété intellectuelle. Toute reproduction, diffusion ou exploitation non autorisée est strictement interdite.',
    s6: '6. Formulaire de contact',
    p6: "L'utilisateur s'engage à fournir des informations exactes lors de l'utilisation du formulaire de contact et à ne pas transmettre de contenus illicites, diffamatoires ou portant atteinte aux droits de tiers. {name} se réserve le droit de ne pas répondre aux messages ne respectant pas ces règles.",
    s7: '7. Liens hypertextes',
    p7: "Le site peut contenir des liens vers des sites tiers. {name} n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur politique de confidentialité.",
    s8: '8. Responsabilité',
    p8: "{name} met en œuvre tous les moyens raisonnables pour assurer un accès fiable au site, sans garantir une disponibilité permanente. L'utilisateur est seul responsable de l'usage qu'il fait du site et des équipements qu'il utilise pour y accéder.",
    s9: '9. Données personnelles',
    p9: 'Le traitement des données personnelles est décrit dans la',
    privacyLink: 'politique de confidentialité',
    s10: '10. Droit applicable',
    p10: "Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents seront ceux du ressort du siège social de l'éditeur : {address}.",
    s11: '11. Contact',
    p11: 'Pour toute question relative aux CGU :'
  },
  privacy: {
    title: 'Politique de confidentialité',
    lead: 'Comment vos données sont collectées, utilisées et protégées sur ce site.',
    pageTitle: 'Politique de confidentialité',
    controllerTitle: 'Responsable du traitement',
    contact: 'Contact :',
    collectedTitle: 'Données collectées',
    collectedIntro: 'Les données personnelles susceptibles d’être traitées sur {url} sont les suivantes :',
    formItem: 'Formulaire de contact : nom, adresse e-mail et contenu du message que vous choisissez de transmettre.',
    techItem: 'Données techniques : logs de connexion, adresse IP, type de navigateur, pages consultées et horodatages, collectés automatiquement par l’hébergeur et les outils de mesure d’audience.',
    cookieItem: 'Cookies et traceurs : un cookie technique mémorise la langue choisie (français, anglais ou espagnol). Le site peut aussi déposer des cookies strictement nécessaires. Vercel Web Analytics et Speed Insights mesurent l’audience et les performances sans cookies publicitaires.',
    purposesTitle: 'Finalités du traitement',
    purpose1: 'Répondre aux demandes envoyées via le formulaire de contact.',
    purpose2: 'Assurer la sécurité, la maintenance et le bon fonctionnement du site.',
    purpose3: 'Mesurer l’audience (pages vues) et les performances, afin d’améliorer l’expérience.',
    purpose4: 'Mémoriser la langue d’affichage choisie et respecter les obligations légales applicables.',
    basisTitle: 'Base légale',
    basis1: 'Intérêt légitime pour la sécurité du site et l’amélioration de l’expérience.',
    basis2: 'Exécution de mesures précontractuelles à votre demande (prise de contact).',
    basis3: 'Consentement lorsque requis pour certains traceurs non essentiels.',
    recipientsTitle: 'Destinataires et sous-traitants',
    recipientsIntro: 'Vos données peuvent être transmises aux prestataires suivants, dans la limite de leurs missions :',
    vercel: 'Vercel Inc. — hébergement du site, mesure d’audience (Web Analytics) et mesure de performance (Speed Insights)',
    vercelPolicy: 'politique de confidentialité',
    emailjs: '{name} — transmission des messages du formulaire de contact',
    emailjsSite: 'site web',
    noSale: 'Aucune donnée n’est vendue à des tiers.',
    retentionTitle: 'Durée de conservation',
    retention1: 'Messages de contact : jusqu’à 3 ans à compter du dernier échange.',
    retention2: 'Données techniques et logs : durée limitée conformément aux obligations de l’hébergeur.',
    retention3: 'Données de mesure d’audience : 30 jours pour Vercel Web Analytics (plan Hobby) ; durées propres à Vercel Speed Insights pour les métriques de performance. Le cookie de langue reste jusqu’à 12 mois, ou jusqu’à son effacement.',
    rightsTitle: 'Vos droits',
    rights: 'Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants : accès, rectification, effacement, limitation, opposition et portabilité de vos données lorsque applicable.',
    rightsContact: 'Pour exercer vos droits, contactez :',
    cnil: 'Vous pouvez également introduire une réclamation auprès de la CNIL',
    cookiesTitle: 'Cookies',
    cookies: 'Le site dépose un cookie de préférence de langue (portfolio-locale) pour réafficher le portfolio en français, anglais ou espagnol. Il peut aussi déposer des cookies strictement nécessaires à son fonctionnement. Vercel Web Analytics ne repose pas sur des cookies : il mesure les pages vues de façon anonymisée. Speed Insights mesure les performances. Vous pouvez configurer votre navigateur pour bloquer les scripts d’analyse ; cela n’empêche pas la navigation.',
    securityTitle: 'Sécurité',
    security: '{name} met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l’accès non autorisé, la perte ou la divulgation.',
    changesTitle: 'Modifications',
    changes: 'La présente politique peut être mise à jour pour refléter l’évolution du site ou de la réglementation. La date de dernière mise à jour figure en haut de cette page.'
  }
}

const en: UiCopy = {
  langGroup: 'Site language',
  nav: {
    home: 'Home',
    projects: 'Projects',
    services: 'Services',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    primary: 'Main navigation',
    themeToDark: 'Switch to royal-blue dark theme',
    themeToLight: 'Switch to light theme',
    themeDarkTitle: 'Royal-blue dark theme',
    themeLightTitle: 'Light theme',
    note: 'Front-end · Motion · Paris / Remote'
  },
  chapters: {
    Accueil: 'Home',
    Manifeste: 'Manifesto',
    Prestations: 'Services',
    Contact: 'Contact',
    Réalisations: 'Selected work',
    'Savoir-faire': 'Craft',
    Projets: 'Projects',
    Expériences: 'Experience',
    Légal: 'Legal',
    'Plan du site': 'Sitemap'
  },
  hero: {
    line1: 'I design',
    line2: 'interfaces',
    line3: 'that hold up',
    available: 'Available for freelance',
    scroll: 'Scroll to explore',
    years: '{n}+ years',
    projects: '{n} projects'
  },
  intro: {
    label: 'Manifesto',
    tail: '{years} years designing interfaces that hold up, without ever sacrificing the detail.',
    fromTo: 'From {first} to {last}',
    fromToVia: 'From {first} to {last}, via {middle}'
  },
  offers: {
    label: 'Services',
    title: 'Front-end',
    titleAccent: 'engagement',
    more: 'See more',
    pageType: 'Single-page type',
    tjmNote: 'Day rate',
    priceNote: 'Fee'
  },
  works: {
    kicker: '03 — Selected work',
    title: 'Selected',
    titleAccent: 'work',
    archives: 'Archive →',
    selection: 'Selection',
    featured: 'featured projects',
    lead: 'Interfaces built to hold up — from brief to production.',
    view: 'View project →',
    actProjects: '01 — Projects',
    actFocus: '02 — Focus {current}/{total}',
    actList: '03 — List'
  },
  expertise: {
    kicker: '04 — Craft',
    title: 'Skills',
    hint: 'Click a radar grade (A, B, C…) to show that skill in detail.',
    missions: 'Engagements',
    technologies: 'Technologies',
    domains: 'Domains',
    actNumbers: '01 — Figures',
    actRadar: '02 — Radar',
    actDone: 'End — Full path',
    actDetail: '03 — Detail',
    categories: {
      langages: 'Languages',
      frameworks: 'Frameworks',
      outils_dev: 'Tools',
      ui_animations: 'UI & motion',
      design: 'Design',
      environnements: 'Environments',
      methodes: 'Methods',
      ia_cursor: 'AI',
      accessibilite: 'Accessibility'
    }
  },
  experience: {
    kicker: '05 — Experience',
    title: 'Experience',
    click: 'Click a card to explore the engagement.',
    scroll: 'Scroll — each engagement unfolds as you move.',
    done: 'Path complete — keep going down.',
    pick: 'Select a company to explore the engagement.',
    mission: 'Engagement',
    context: 'Context',
    missions: 'Work',
    stack: 'Stack',
    progress: 'Career progress {n}%',
    details: 'Details',
    actIntro: '00 — Intro',
    actContext: '01 — Context',
    actMissions: '02 — Work',
    actStack: '03 — Stack'
  },
  footer: {
    finale: 'Finale',
    line1: "Let's work",
    line2: 'together on your',
    accent: 'next project',
    write: 'Email me',
    form: 'or use the form →',
    portfolio: 'Portfolio',
    networks: 'Links',
    classic: 'Classic version',
    stack: 'Stack',
    legalNav: 'Legal information'
  },
  contact: {
    label: 'Contact',
    title: "Let's talk about",
    titleAccent: 'your project',
    lead: 'Ready to collaborate? Describe your ideas and we can see how I can help bring them to life.',
    email: 'Email',
    location: 'Location',
    availability: 'Availability',
    reply: 'Reply within 24h',
    name: 'Full name *',
    namePlaceholder: 'Your full name',
    emailLabel: 'Email *',
    emailPlaceholder: 'you@email.com',
    message: 'Message *',
    messagePlaceholder: 'Describe your project, your needs, or ask a question...',
    send: 'Send message',
    sending: 'Sending…',
    sendingLabel: 'Sending…',
    successTitle: 'Message sent',
    successDesc: 'I will get back to you as soon as I can.',
    required: 'Please fill in every required field.',
    sendError: 'Something went wrong while sending. Please try again.',
    fallbackError: 'Something went wrong. Please try again or email me directly.',
    pageTitle: 'Contact'
  },
  a11y: {
    title: 'Accessibility',
    lead: 'Adjust the display so text and colors are easier to read.',
    close: 'Close',
    display: 'Display',
    contrast: 'High contrast',
    bigText: 'Larger text',
    underline: 'Underline links',
    motion: 'Reduce motion',
    color: 'Color vision',
    colorHint: 'Palette adapted for color blindness (more distinct colors).',
    colorGroup: 'Color vision',
    standard: 'Standard',
    deuteranopia: 'Deuteranopia',
    protanopia: 'Protanopia',
    tritanopia: 'Tritanopia',
    preview: 'Color preview',
    reset: 'Reset',
    open: 'Accessibility'
  },
  archive: {
    label: 'Archive',
    title: 'All projects',
    lead: '{n} pieces of work — filter by technology to focus on a stack.',
    filter: 'Filter by technology',
    all: 'All',
    countOne: '{n} project',
    countMany: '{n} projects',
    pageTitle: 'Projects'
  },
  case: {
    back: '← Back to projects',
    stack: 'Stack',
    tags: 'Tags',
    live: 'View live →',
    github: 'GitHub →',
    missing: 'Project not found',
    fallback: 'Project'
  },
  legalNav: {
    mentions: 'Legal notice',
    cgu: 'Terms of use',
    privacy: 'Privacy',
    sitemap: 'Sitemap'
  },
  legalChrome: {
    back: '← Back home',
    kicker: 'Legal information',
    updated: 'Last updated: {date}',
    date: '3 September 2026'
  },
  pricing: {
    kicker: '03 — Services',
    title: 'Offers',
    titleAccent: '& engagements',
    lead: 'Fixed scopes quoted after a brief, or a day-rate engagement at €500 / day.',
    jump: 'See the terms',
    families: 'Offer families',
    rate: 'Fee',
    onQuote: 'On quote',
    pageType: 'Single-page type',
    siteType: 'Multi-page site type',
    conditions: 'Terms',
    how: 'How it starts',
    intro: 'The rules follow the selected tab: a day-rate engagement, or a quote for the other offers.',
    termsType: 'Terms type',
    mission: 'Engagement',
    quote: 'Quote',
    aside: 'Invoiced excluding VAT (VAT depends on the tax regime). If you cancel after the start, work already done remains due.',
    contact: 'Contact',
    ctaMission: 'Engagement',
    ctaQuote: 'Quote',
    pageTitle: 'Services',
    description: 'Web offers on quote and Vue/Nuxt front-end engagements at a €500 day rate.',
    ogDescription: 'Landing pages, multi-page sites and custom work on quote. Vue/Nuxt front-end engagements at €500 / day.'
  },
  seo: {
    homeTitle: '{name} — Freelance front-end developer in Paris',
    homeFallback: 'Freelance front-end developer in Paris. Fast, accessible Nuxt and Vue interfaces for banking, luxury and press. 7 years of experience.',
    roleFallback: 'Front-end developer',
    projectsDescription: 'Front-end work: Nuxt and Vue interfaces, and integrations for press, luxury and banking.',
    contactDescription: 'Write to Widdy Louis about a freelance front-end engagement, a landing page or a quoted site.'
  },
  sitemap: {
    title: 'Sitemap',
    lead: 'Overview of the portfolio structure and the pages you can reach.',
    pageTitle: 'Sitemap',
    portfolio: 'Portfolio',
    projects: 'Projects',
    legal: 'Legal information',
    archive: 'Archived version',
    oldHome: 'Previous portfolio',
    oldProjects: 'Projects (previous version)',
    oldContact: 'Contact (previous version)',
    contact: 'Contact'
  },
  mentions: {
    title: 'Legal notice',
    lead: 'Legal information about the publisher and the hosting of this portfolio.',
    pageTitle: 'Legal notice',
    publisher: 'Site publisher',
    businessName: 'Registered name',
    tradeName: 'Trade name',
    legalForm: 'Legal form',
    siren: 'SIREN',
    siret: 'SIRET (registered office)',
    vat: 'EU VAT number',
    registration: 'Registration',
    activity: 'Activity',
    naf: 'NAF code {code}',
    address: 'Registered office',
    domiciliation: 'Domiciliation',
    created: 'Creation date',
    contact: 'Contact',
    directorTitle: 'Publication director',
    director: '{name}, as the business owner.',
    hostingTitle: 'Hosting',
    hosting: 'The site is hosted by {name}, {address}.',
    website: 'Website:',
    ipTitle: 'Intellectual property',
    ip: 'Every element of {url} (text, visuals, source code, visual identity, animations) is the exclusive property of {name}, unless stated otherwise. Any reproduction, representation or use, in whole or in part, without prior written permission is prohibited.',
    thirdTitle: 'Third-party services',
    dataTitle: 'Personal data',
    data: 'To learn how your data is collected and processed, read the',
    privacyLink: 'privacy policy',
    liabilityTitle: 'Limitation of liability',
    liability: '{name} works to keep the information on this site accurate. It cannot be held liable for errors, omissions or temporary unavailability, nor for damage resulting from use of the site or of third-party sites reached through links.',
    sourceTitle: 'Source of company information',
    source: 'Legal information from the business register, available on'
  },
  entity: {
    legalForm: 'Sole trader (micro-enterprise)',
    activity: 'IT development services: design, creation, integration and maintenance of websites, web and mobile applications, including front-end, back-end and related digital work.',
    rcs: 'Not registered with the RCS',
    rne: 'Registered with the RNE',
    created: '19 August 2025',
    country: 'France',
    hostingCountry: 'United States',
    emailjs: 'Delivery of contact-form messages',
    speed: 'Anonymous measurement of site performance',
    analytics: 'Anonymous audience measurement (page views, visitors), without cookies'
  },
  cgu: {
    title: 'Terms of use',
    lead: 'Rules for accessing and using this portfolio.',
    pageTitle: 'Terms of use',
    s1: '1. Purpose',
    p1: 'These terms of use define how {url} may be accessed and used. The site is published by {name} ({form}), trading as {trade}.',
    s2: '2. Acceptance',
    p2: 'Accessing and browsing the site means you fully accept these terms. If you do not accept them, please do not use the site.',
    s3: '3. Access',
    p3: 'The site is free for anyone with internet access. {name} may suspend, change or interrupt the site at any time, without notice, including for maintenance or updates.',
    s4: '4. Nature of the site',
    p4: 'The site presents professional work and information. It is not an online store. Development services offered by {name} are covered by separate quotes and contracts.',
    s5: '5. Intellectual property',
    p5: 'All content on the site (text, images, logos, code, animations, layout) is protected by intellectual-property law. Any unauthorized reproduction, distribution or use is strictly prohibited.',
    s6: '6. Contact form',
    p6: 'You agree to provide accurate information in the contact form and not to send unlawful, defamatory or third-party-infringing content. {name} may decline to answer messages that break these rules.',
    s7: '7. Hyperlinks',
    p7: 'The site may link to third-party sites. {name} does not control those sites and accepts no responsibility for their content or privacy practices.',
    s8: '8. Liability',
    p8: '{name} uses reasonable means to keep the site reliably available, without guaranteeing permanent uptime. You are solely responsible for how you use the site and for the equipment you use to reach it.',
    s9: '9. Personal data',
    p9: 'How personal data is processed is described in the',
    privacyLink: 'privacy policy',
    s10: '10. Governing law',
    p10: 'These terms are governed by French law. If a dispute cannot be settled amicably, the competent courts are those of the publisher’s registered office: {address}.',
    s11: '11. Contact',
    p11: 'For any question about these terms:'
  },
  privacy: {
    title: 'Privacy policy',
    lead: 'How your data is collected, used and protected on this site.',
    pageTitle: 'Privacy policy',
    controllerTitle: 'Data controller',
    contact: 'Contact:',
    collectedTitle: 'Data collected',
    collectedIntro: 'Personal data that may be processed on {url}:',
    formItem: 'Contact form: the name, email address and message you choose to send.',
    techItem: 'Technical data: connection logs, IP address, browser type, pages viewed and timestamps, collected automatically by the host and audience tools.',
    cookieItem: 'Cookies and trackers: a technical cookie stores the language you choose (French, English or Spanish). The site may also set cookies that are strictly required. Vercel Web Analytics and Speed Insights measure audience and performance without advertising cookies.',
    purposesTitle: 'Purposes',
    purpose1: 'Reply to requests sent through the contact form.',
    purpose2: 'Keep the site secure, maintained and working.',
    purpose3: 'Measure audience (page views) and performance, in order to improve the experience.',
    purpose4: 'Remember the display language you chose and meet applicable legal duties.',
    basisTitle: 'Legal basis',
    basis1: 'Legitimate interest in site security and a better experience.',
    basis2: 'Steps taken at your request before a contract (getting in touch).',
    basis3: 'Consent where it is required for non-essential trackers.',
    recipientsTitle: 'Recipients and processors',
    recipientsIntro: 'Your data may be shared with the following providers, only for their role:',
    vercel: 'Vercel Inc. — site hosting, audience measurement (Web Analytics) and performance measurement (Speed Insights)',
    vercelPolicy: 'privacy policy',
    emailjs: '{name} — delivery of contact-form messages',
    emailjsSite: 'website',
    noSale: 'No data is sold to third parties.',
    retentionTitle: 'Retention',
    retention1: 'Contact messages: up to 3 years after the last exchange.',
    retention2: 'Technical data and logs: a limited period, in line with the host’s obligations.',
    retention3: 'Audience data: 30 days for Vercel Web Analytics (Hobby plan); Speed Insights keeps performance metrics for its own periods. The language cookie lasts up to 12 months, or until you delete it.',
    rightsTitle: 'Your rights',
    rights: 'Under the GDPR and the French Data Protection Act, you have the right to access, rectify, erase, restrict, object to and, where applicable, port your data.',
    rightsContact: 'To exercise your rights, contact:',
    cnil: 'You can also lodge a complaint with the CNIL',
    cookiesTitle: 'Cookies',
    cookies: 'The site sets a language-preference cookie (portfolio-locale) so the portfolio stays in French, English or Spanish. It may also set cookies that are strictly required. Vercel Web Analytics does not rely on cookies: it measures page views anonymously. Speed Insights measures performance. You can block analytics scripts in your browser; browsing still works.',
    securityTitle: 'Security',
    security: '{name} uses appropriate technical and organizational measures to protect your data against unauthorized access, loss or disclosure.',
    changesTitle: 'Changes',
    changes: 'This policy may be updated as the site or the law changes. The last-updated date is at the top of this page.'
  }
}

const es: UiCopy = {
  langGroup: 'Idioma del sitio',
  nav: {
    home: 'Inicio',
    projects: 'Proyectos',
    services: 'Servicios',
    contact: 'Contacto',
    menu: 'Menú',
    close: 'Cerrar',
    primary: 'Navegación principal',
    themeToDark: 'Pasar al tema oscuro azul rey',
    themeToLight: 'Pasar al tema claro',
    themeDarkTitle: 'Tema oscuro azul rey',
    themeLightTitle: 'Tema claro',
    note: 'Front-end · Motion · París / Remoto'
  },
  chapters: {
    Accueil: 'Inicio',
    Manifeste: 'Manifiesto',
    Prestations: 'Servicios',
    Contact: 'Contacto',
    Réalisations: 'Trabajos',
    'Savoir-faire': 'Oficio',
    Projets: 'Proyectos',
    Expériences: 'Experiencia',
    Légal: 'Legal',
    'Plan du site': 'Mapa del sitio'
  },
  hero: {
    line1: 'Diseño',
    line2: 'interfaces',
    line3: 'que aguantan',
    available: 'Disponible como freelance',
    scroll: 'Desplázate para explorar',
    years: '{n}+ años',
    projects: '{n} proyectos'
  },
  intro: {
    label: 'Manifiesto',
    tail: '{years} años diseñando interfaces que aguantan, sin sacrificar el detalle.',
    fromTo: 'De {first} a {last}',
    fromToVia: 'De {first} a {last}, pasando por {middle}'
  },
  offers: {
    label: 'Servicios',
    title: 'Misión',
    titleAccent: 'front-end',
    more: 'Ver más',
    pageType: 'Tipo de página única',
    tjmNote: 'Tarifa día',
    priceNote: 'Precio'
  },
  works: {
    kicker: '03 — Trabajos',
    title: 'Trabajos',
    titleAccent: 'seleccionados',
    archives: 'Archivo →',
    selection: 'Selección',
    featured: 'proyectos destacados',
    lead: 'Interfaces pensadas para aguantar — del brief a producción.',
    view: 'Ver el proyecto →',
    actProjects: '01 — Proyectos',
    actFocus: '02 — Foco {current}/{total}',
    actList: '03 — Lista'
  },
  expertise: {
    kicker: '04 — Oficio',
    title: 'Competencias',
    hint: 'Haz clic en una nota del radar (A, B, C…) para ver el detalle de la competencia.',
    missions: 'Misiones',
    technologies: 'Tecnologías',
    domains: 'Ámbitos',
    actNumbers: '01 — Cifras',
    actRadar: '02 — Radar',
    actDone: 'Fin — Recorrido completo',
    actDetail: '03 — Detalle',
    categories: {
      langages: 'Lenguajes',
      frameworks: 'Frameworks',
      outils_dev: 'Herramientas',
      ui_animations: 'UI y motion',
      design: 'Diseño',
      environnements: 'Entornos',
      methodes: 'Métodos',
      ia_cursor: 'IA',
      accessibilite: 'Accesibilidad'
    }
  },
  experience: {
    kicker: '05 — Experiencia',
    title: 'Experiencia',
    click: 'Haz clic en una tarjeta para explorar la misión.',
    scroll: 'Desplázate: el detalle de cada misión aparece con el scroll.',
    done: 'Recorrido completo — sigue hacia abajo.',
    pick: 'Elige una empresa para explorar la misión.',
    mission: 'Misión',
    context: 'Contexto',
    missions: 'Misiones',
    stack: 'Stack',
    progress: 'Progreso del recorrido {n} %',
    details: 'Detalles',
    actIntro: '00 — Intro',
    actContext: '01 — Contexto',
    actMissions: '02 — Misiones',
    actStack: '03 — Stack'
  },
  footer: {
    finale: 'Final',
    line1: 'Trabajemos',
    line2: 'juntos en tu',
    accent: 'próximo proyecto',
    write: 'Escríbeme',
    form: 'o con el formulario →',
    portfolio: 'Portfolio',
    networks: 'Redes',
    classic: 'Versión clásica',
    stack: 'Stack',
    legalNav: 'Información legal'
  },
  contact: {
    label: 'Contacto',
    title: 'Hablemos de',
    titleAccent: 'tu proyecto',
    lead: '¿Listo para colaborar? Cuéntame tus ideas y vemos cómo puedo ayudarte a hacerlas realidad.',
    email: 'Email',
    location: 'Ubicación',
    availability: 'Disponibilidad',
    reply: 'Respuesta en 24 h',
    name: 'Nombre completo *',
    namePlaceholder: 'Tu nombre completo',
    emailLabel: 'Email *',
    emailPlaceholder: 'tu@email.com',
    message: 'Mensaje *',
    messagePlaceholder: 'Describe tu proyecto, tus necesidades o hazme una pregunta...',
    send: 'Enviar el mensaje',
    sending: 'Enviando…',
    sendingLabel: 'Enviando…',
    successTitle: 'Mensaje enviado',
    successDesc: 'Te responderé lo antes posible.',
    required: 'Completa todos los campos obligatorios.',
    sendError: 'Ha ocurrido un error al enviar. Inténtalo de nuevo.',
    fallbackError: 'Ha ocurrido un error. Inténtalo de nuevo o escríbeme directamente por email.',
    pageTitle: 'Contacto'
  },
  a11y: {
    title: 'Accesibilidad',
    lead: 'Ajusta la visualización para leer mejor y distinguir los colores.',
    close: 'Cerrar',
    display: 'Visualización',
    contrast: 'Contraste alto',
    bigText: 'Texto más grande',
    underline: 'Subrayar los enlaces',
    motion: 'Reducir las animaciones',
    color: 'Visión del color',
    colorHint: 'Paleta adaptada al daltonismo (colores más distintos).',
    colorGroup: 'Visión del color',
    standard: 'Estándar',
    deuteranopia: 'Deuteranopía',
    protanopia: 'Protanopía',
    tritanopia: 'Tritanopía',
    preview: 'Vista previa de colores',
    reset: 'Restablecer',
    open: 'Accesibilidad'
  },
  archive: {
    label: 'Archivo',
    title: 'Todos los proyectos',
    lead: '{n} trabajos — filtra por tecnología para acotar un stack.',
    filter: 'Filtrar por tecnología',
    all: 'Todos',
    countOne: '{n} proyecto',
    countMany: '{n} proyectos',
    pageTitle: 'Proyectos'
  },
  case: {
    back: '← Volver a los proyectos',
    stack: 'Stack',
    tags: 'Etiquetas',
    live: 'Ver en línea →',
    github: 'GitHub →',
    missing: 'Proyecto no encontrado',
    fallback: 'Proyecto'
  },
  legalNav: {
    mentions: 'Aviso legal',
    cgu: 'Condiciones de uso',
    privacy: 'Privacidad',
    sitemap: 'Mapa del sitio'
  },
  legalChrome: {
    back: '← Volver al inicio',
    kicker: 'Información legal',
    updated: 'Última actualización: {date}',
    date: '3 de septiembre de 2026'
  },
  pricing: {
    kicker: '03 — Servicios',
    title: 'Ofertas',
    titleAccent: 'y misiones',
    lead: 'Paquetes presupuestados tras el brief, o misión a 500 € / día.',
    jump: 'Ver las condiciones',
    families: 'Familias de ofertas',
    rate: 'Precio',
    onQuote: 'Bajo presupuesto',
    pageType: 'Tipo de página única',
    siteType: 'Tipo de sitio multipágina',
    conditions: 'Condiciones',
    how: 'Cómo empieza',
    intro: 'Las reglas siguen la pestaña elegida: misión a tarifa diaria, o presupuesto para el resto.',
    termsType: 'Tipo de condiciones',
    mission: 'Misión',
    quote: 'Presupuesto',
    aside: 'Facturación sin IVA (el IVA depende del régimen). Si cancelas después del inicio, el trabajo ya realizado sigue debido.',
    contact: 'Contacto',
    ctaMission: 'Misión',
    ctaQuote: 'Presupuesto',
    pageTitle: 'Servicios',
    description: 'Ofertas web bajo presupuesto y misiones front Vue/Nuxt a 500 € / día.',
    ogDescription: 'Landing, multipágina y a medida bajo presupuesto. Misiones front Vue/Nuxt a 500 € / día.'
  },
  seo: {
    homeTitle: '{name} — Desarrollador front-end freelance en París',
    homeFallback: 'Desarrollador front-end freelance en París. Interfaces Nuxt y Vue, rápidas y accesibles, para banca, lujo y prensa. 7 años de experiencia.',
    roleFallback: 'Desarrollador front-end',
    projectsDescription: 'Trabajos front-end: interfaces Nuxt y Vue, e integraciones para prensa, lujo y banca.',
    contactDescription: 'Escribir a Widdy Louis para una misión front-end freelance, una landing o un sitio bajo presupuesto.'
  },
  sitemap: {
    title: 'Mapa del sitio',
    lead: 'Vista general de la arquitectura y de las páginas accesibles del portfolio.',
    pageTitle: 'Mapa del sitio',
    portfolio: 'Portfolio',
    projects: 'Proyectos',
    legal: 'Información legal',
    archive: 'Versión archivada',
    oldHome: 'Portfolio anterior',
    oldProjects: 'Proyectos (versión anterior)',
    oldContact: 'Contacto (versión anterior)',
    contact: 'Contacto'
  },
  mentions: {
    title: 'Aviso legal',
    lead: 'Información legal sobre la edición y el alojamiento de este portfolio.',
    pageTitle: 'Aviso legal',
    publisher: 'Editor del sitio',
    businessName: 'Razón social',
    tradeName: 'Nombre comercial',
    legalForm: 'Forma jurídica',
    siren: 'SIREN',
    siret: 'SIRET (sede)',
    vat: 'Número de IVA intracomunitario',
    registration: 'Inscripción',
    activity: 'Actividad',
    naf: 'código NAF {code}',
    address: 'Dirección de la sede',
    domiciliation: 'Domiciliación',
    created: 'Fecha de creación',
    contact: 'Contacto',
    directorTitle: 'Director de la publicación',
    director: '{name}, en calidad de titular de la empresa.',
    hostingTitle: 'Alojamiento',
    hosting: 'El sitio está alojado por {name}, {address}.',
    website: 'Sitio web:',
    ipTitle: 'Propiedad intelectual',
    ip: 'El conjunto de elementos de {url} (textos, visuales, código fuente, identidad gráfica, animaciones) es propiedad exclusiva de {name}, salvo mención contraria. Queda prohibida cualquier reproducción, representación o explotación, total o parcial, sin autorización escrita previa.',
    thirdTitle: 'Servicios de terceros',
    dataTitle: 'Datos personales',
    data: 'Para saber más sobre la recogida y el tratamiento de tus datos, consulta la',
    privacyLink: 'política de privacidad',
    liabilityTitle: 'Limitación de responsabilidad',
    liability: '{name} procura que la información publicada sea exacta. No obstante, no puede responsabilizarse de errores, omisiones o indisponibilidades temporales, ni de los daños derivados del uso del sitio o de sitios de terceros accesibles mediante enlaces.',
    sourceTitle: 'Fuente de la información de la empresa',
    source: 'Información legal procedente del registro de empresas, consultable en'
  },
  entity: {
    legalForm: 'Empresario individual (microempresa)',
    activity: 'Servicios de desarrollo informático: concepción, creación, integración y mantenimiento de sitios web, aplicaciones web y móviles, incluido el desarrollo front-end, back-end y soluciones digitales asociadas.',
    rcs: 'No inscrito en el RCS',
    rne: 'Inscrito en el RNE',
    created: '19 de agosto de 2025',
    country: 'Francia',
    hostingCountry: 'Estados Unidos',
    emailjs: 'Envío de los mensajes del formulario de contacto',
    speed: 'Medición anonimizada del rendimiento del sitio',
    analytics: 'Medición de audiencia anonimizada (páginas vistas, visitantes), sin cookies'
  },
  cgu: {
    title: 'Condiciones de uso',
    lead: 'Reglas de acceso y de uso del portfolio.',
    pageTitle: 'Condiciones de uso',
    s1: '1. Objeto',
    p1: 'Estas condiciones de uso definen el acceso y el uso de {url}, editado por {name} ({form}), que opera bajo el nombre {trade}.',
    s2: '2. Aceptación',
    p2: 'Acceder y navegar por el sitio implica la aceptación plena de estas condiciones. Si no las aceptas, te pedimos que no uses el sitio.',
    s3: '3. Acceso al sitio',
    p3: 'El sitio es gratuito para cualquier persona con acceso a Internet. {name} puede suspender, modificar o interrumpir el sitio en cualquier momento, sin preaviso, en particular por mantenimiento o actualización.',
    s4: '4. Naturaleza del sitio',
    p4: 'El sitio tiene una finalidad informativa y de presentación de competencias profesionales. No es una tienda en línea. Los servicios de desarrollo informático de {name} se rigen por presupuestos y contratos aparte.',
    s5: '5. Propiedad intelectual',
    p5: 'Todos los contenidos del sitio (textos, imágenes, logotipos, código, animaciones, maquetación) están protegidos por el derecho de propiedad intelectual. Queda estrictamente prohibida cualquier reproducción, difusión o explotación no autorizada.',
    s6: '6. Formulario de contacto',
    p6: 'El usuario se compromete a facilitar datos exactos en el formulario de contacto y a no enviar contenidos ilícitos, difamatorios o que lesionen derechos de terceros. {name} puede no responder a los mensajes que no respeten estas reglas.',
    s7: '7. Enlaces',
    p7: 'El sitio puede contener enlaces a sitios de terceros. {name} no controla esos sitios y declina toda responsabilidad sobre su contenido o su política de privacidad.',
    s8: '8. Responsabilidad',
    p8: '{name} pone los medios razonables para un acceso fiable, sin garantizar una disponibilidad permanente. El usuario es el único responsable del uso que hace del sitio y del equipo con el que accede.',
    s9: '9. Datos personales',
    p9: 'El tratamiento de los datos personales se describe en la',
    privacyLink: 'política de privacidad',
    s10: '10. Ley aplicable',
    p10: 'Estas condiciones se rigen por el derecho francés. En caso de litigio, y a falta de acuerdo amistoso, serán competentes los tribunales del domicilio social del editor: {address}.',
    s11: '11. Contacto',
    p11: 'Para cualquier pregunta sobre estas condiciones:'
  },
  privacy: {
    title: 'Política de privacidad',
    lead: 'Cómo se recogen, usan y protegen tus datos en este sitio.',
    pageTitle: 'Política de privacidad',
    controllerTitle: 'Responsable del tratamiento',
    contact: 'Contacto:',
    collectedTitle: 'Datos recogidos',
    collectedIntro: 'Los datos personales que pueden tratarse en {url} son:',
    formItem: 'Formulario de contacto: nombre, correo electrónico y el mensaje que decides enviar.',
    techItem: 'Datos técnicos: registros de conexión, dirección IP, tipo de navegador, páginas consultadas y marcas de tiempo, recogidos automáticamente por el alojamiento y las herramientas de audiencia.',
    cookieItem: 'Cookies y rastreadores: una cookie técnica guarda el idioma elegido (francés, inglés o español). El sitio también puede depositar cookies estrictamente necesarias. Vercel Web Analytics y Speed Insights miden la audiencia y el rendimiento sin cookies publicitarias.',
    purposesTitle: 'Finalidades',
    purpose1: 'Responder a las solicitudes enviadas por el formulario de contacto.',
    purpose2: 'Garantizar la seguridad, el mantenimiento y el buen funcionamiento del sitio.',
    purpose3: 'Medir la audiencia (páginas vistas) y el rendimiento, para mejorar la experiencia.',
    purpose4: 'Recordar el idioma de visualización elegido y cumplir las obligaciones legales aplicables.',
    basisTitle: 'Base legal',
    basis1: 'Interés legítimo en la seguridad del sitio y la mejora de la experiencia.',
    basis2: 'Ejecución de medidas precontractuales a tu petición (toma de contacto).',
    basis3: 'Consentimiento cuando sea necesario para ciertos rastreadores no esenciales.',
    recipientsTitle: 'Destinatarios y encargados',
    recipientsIntro: 'Tus datos pueden comunicarse a los siguientes proveedores, dentro de su misión:',
    vercel: 'Vercel Inc. — alojamiento del sitio, medición de audiencia (Web Analytics) y de rendimiento (Speed Insights)',
    vercelPolicy: 'política de privacidad',
    emailjs: '{name} — transmisión de los mensajes del formulario de contacto',
    emailjsSite: 'sitio web',
    noSale: 'Ningún dato se vende a terceros.',
    retentionTitle: 'Plazo de conservación',
    retention1: 'Mensajes de contacto: hasta 3 años desde el último intercambio.',
    retention2: 'Datos técnicos y registros: plazo limitado conforme a las obligaciones del alojador.',
    retention3: 'Datos de audiencia: 30 días para Vercel Web Analytics (plan Hobby); plazos propios de Vercel Speed Insights para las métricas de rendimiento. La cookie de idioma dura hasta 12 meses, o hasta que la borres.',
    rightsTitle: 'Tus derechos',
    rights: 'Conforme al RGPD y a la ley francesa de informática y libertades, tienes derecho de acceso, rectificación, supresión, limitación, oposición y portabilidad de tus datos cuando proceda.',
    rightsContact: 'Para ejercer tus derechos, contacta:',
    cnil: 'También puedes presentar una reclamación ante la CNIL',
    cookiesTitle: 'Cookies',
    cookies: 'El sitio deposita una cookie de preferencia de idioma (portfolio-locale) para mostrar el portfolio en francés, inglés o español. También puede depositar cookies estrictamente necesarias. Vercel Web Analytics no se basa en cookies: mide las páginas vistas de forma anonimizada. Speed Insights mide el rendimiento. Puedes bloquear los scripts de análisis en tu navegador; la navegación sigue funcionando.',
    securityTitle: 'Seguridad',
    security: '{name} aplica medidas técnicas y organizativas adecuadas para proteger tus datos frente al acceso no autorizado, la pérdida o la divulgación.',
    changesTitle: 'Modificaciones',
    changes: 'Esta política puede actualizarse para reflejar la evolución del sitio o de la normativa. La fecha de la última actualización figura al inicio de esta página.'
  }
}

export const uiCopy: Record<AppLocale, UiCopy> = { fr, en, es }

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
}
