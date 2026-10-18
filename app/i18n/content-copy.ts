import type { AppLocale } from '@/utils/locale'

export type ProjectCopy = {
  title: string
  summary: string
  tags: string[]
}

export type ExperienceCopy = {
  role: string
  period: string
  summary: string
  missions: string[]
  tags: string[]
}

export type ContentCopy = {
  meta: { role: string, tagline: string, location: string }
  about: { bio: string, highlights: string[], availability: string }
  experiences: Record<string, ExperienceCopy>
  projects: Record<string, ProjectCopy>
}

const en: ContentCopy = {
  meta: {
    role: 'Front-end developer & web integrator',
    tagline: 'Fast, accessible interfaces, animated just enough.',
    location: 'Paris / Remote'
  },
  about: {
    bio: 'I care about building interfaces that are fast and accessible. I have worked in demanding environments — banking, luxury, press — and contributed to ambitious products. Across those experiences I pay close attention to performance, visual craft, accessibility constraints and responsive design. I keep learning so the work stays sharp.',
    highlights: [
      'TypeScript, Nuxt 3 / Vue 3, TailwindCSS, GSAP',
      'Accessibility, SEO, mobile-first',
      'Controlled motion (AOS, ScrollReveal, ScrollMagic, CSS)',
      'Design culture (Figma, Zeplin), maintenance and optimization'
    ],
    availability: 'Freelance — short or medium engagements'
  },
  experiences: {
    'Le Point': {
      role: 'Web integrator',
      period: 'Nov. 2017 – Feb. 2020',
      summary: 'Responsive integration, newsletters, A/B testing with Adobe Tag Manager, CMS QA.',
      missions: [
        'Project coordination: task planning in JIRA.',
        'Integration & email: newsletter builds (CMS + PHP) · mobile-first pages and sections with tracking',
        'Page and section integration with tracking',
        'Newsletter programming (CMS + Twig)',
        'A/B testing: shipping components through Adobe Tag Manager with the marketing team'
      ],
      tags: ['Integration', 'A/B testing', 'Newsletter']
    },
    Cyllene: {
      role: 'Web integrator',
      period: 'Aug. 2020 – Feb. 2021',
      summary: 'Zeplin integration, GSAP animated pages, SEO/GDPR, JSON extracts for forms.',
      missions: [
        'Project coordination: tasks in JIRA plus an internal platform',
        'Integration & motion: Zeplin analysis → animated pages (GSAP, vanilla JavaScript)',
        'Clients: Uriage · Nuxe · LesVoyagesFr',
        'Front-end HTML/CSS/jQuery lead',
        'Animated pages (GSAP, vanilla JS)',
        'SEO optimization and GDPR setup'
      ],
      tags: ['Agency', 'SEO', 'GDPR', 'Animation']
    },
    Mazarine: {
      role: 'Front-end developer',
      period: 'Mar. 2021 – Aug. 2021',
      summary: 'Animated pages (GSAP), SEO/GDPR work, JSON extraction for a search engine.',
      missions: [
        'Project coordination: tasks in JIRA plus an internal platform',
        'Integration & motion: Zeplin mockups → animated pages (GSAP, vanilla JavaScript)',
        'Clients: Balmain Sneakers · Opéra de Paris · Studio Acacia · Hôtel Salomon de Rothschild · Ritz Paris · Numéro Magazine',
        'Semantic optimization (headings, Search Console), GDPR (Tarteaucitron, OneTrust)',
        'Maintenance: JavaScript fixes and improvements',
        'Agile: daily stand-ups and ongoing communication on Microsoft Teams (remote-friendly)'
      ],
      tags: ['Luxury', 'Culture', 'CMS', 'Animation']
    },
    'Société Générale': {
      role: 'Front-end web developer',
      period: 'Jan. 2022 – Aug. 2025',
      summary: 'With the Stream Run team, then POI: dynamic display tools, a claims AI assistant, usage analytics, a savings simulator, and design-system integration.',
      missions: [
        'Project coordination: task planning in JIRA.',
        'JavaScript: two internal tools for dynamic campaign display, an AI assistant to generate and review illustrated claims, an analytics script for user behavior, a savings simulator with tax rules',
        'UI integration: Figma mockups (design system, landing page) and JavaScript maintenance.'
      ],
      tags: ['Banking', 'Dashboard', 'Simulator', 'Analytics', 'Design system']
    }
  },
  projects: {
    'react_creer-des-composants-courants': {
      title: 'Reusable React component library',
      summary: 'A reusable UI component library built with React 18 and Tailwind CSS, meant to speed up modern layouts. Each component is isolated, configurable and documented so the front-end stays visually consistent and easier to maintain. The work focuses on composition, variants (state, size, color) and baseline accessibility (HTML semantics, focus, contrast). A modular JavaScript architecture makes the library easy to drop into larger apps and to standardize interface patterns across personal projects.',
      tags: ['React', 'UI components', 'Design system', 'Tailwind CSS', 'Front-end']
    },
    'select-agences-js-poo': {
      title: 'Bank branch selector — OOP architecture',
      summary: 'A front-end for choosing bank branches, written in vanilla JavaScript with an object-oriented architecture (classes, encapsulation, separated responsibilities). JSON data loads asynchronously with XMLHttpRequest, then enters the DOM through lazy loading so the first paint stays light. The project looks at how to structure domain code (models, services, UI components), handle user events and style a complex control in SCSS. It is a case study in perceived performance, readable code and a select that can grow without falling over.',
      tags: ['JavaScript', 'OOP', 'DOM', 'AJAX', 'Lazy loading', 'SCSS']
    },
    'tmdb-movie-app-search-filter-pagination': {
      title: 'Interactive film catalog — TMDB API',
      summary: 'A responsive film-discovery app built on The Movie Database (TMDB) API: catalogs, detail pages and rich metadata. The interface offers live search, genre filters, pagination and smooth movement between views, all in native JavaScript with no framework. REST calls go through the Fetch API, with a clear split between data, filtering and DOM rendering. The project shows third-party API integration, client-side state and browsing experiences built for a large catalog.',
      tags: ['JavaScript', 'REST API', 'Responsive', 'Search', 'Pagination', 'Cinema']
    },
    'styled-selects-price-calculator': {
      title: 'Styled selects and a dynamic price calculator',
      summary: 'A JavaScript module that restyles native `<select>` elements and pairs them with a price calculator driven by the chosen criteria, including age band. ES6+ source is transpiled to ES5 with Babel for wider browser support, with a build pipeline and a watch script. The approach emphasizes precise DOM work, localStorage persistence and reusable components that do not depend on a framework. Published on CodePen, it shows UI micro-interactions and self-contained front-end business logic.',
      tags: ['JavaScript', 'DOM', 'Babel', 'Calculator', 'UI components', 'CodePen']
    },
    'javascript-dom-optimization-agency-selector': {
      title: 'High-performance branch selector — DOM optimization',
      summary: 'A performance-focused rebuild of a bank branch selector that can hold hundreds of options without hurting the experience. It uses an ES6+ OOP architecture, Fetch API data loading and batched DOM inserts to cut reflows and improve Time to Interactive. The project compares progressive rendering strategies and the trade-off between simple markup and perceived smoothness. DOM scale and maintainable code are treated as product requirements.',
      tags: ['JavaScript', 'Performance', 'OOP', 'DOM', 'Fetch API', 'Optimization']
    },
    'vue-lazy-loading-search-sorting': {
      title: 'Filtering, sorting and pagination — Vue.js',
      summary: 'A Vue.js app for rich list patterns: text search, multi-criteria sort, pagination and client-side lazy loading. The full dataset loads once and is filtered in the browser, so different strategies can be compared without extra network latency. Vue Router structures the views and SCSS keeps the layout modular and responsive. It is a reusable base for dashboards, catalogs or light back-offices where the interface has to stay reactive.',
      tags: ['Vue.js', 'Search', 'Sorting', 'Pagination', 'Lazy loading', 'Front-end']
    },
    'film-library-vuex-vueRouter': {
      title: 'Film library — Vuex & Vue Router',
      summary: 'A film-library app in Vue.js, with application state in Vuex and navigation in Vue Router. You can browse a catalog, open a film and keep a favorites list in the global store. Views, mutations/actions and presentational components stay separate, which makes the feature set easier to grow. Tailwind CSS speeds up the responsive layout. A solid demonstration of Vue 3 SPA patterns.',
      tags: ['Vue.js', 'Vuex', 'Vue Router', 'SPA', 'Favorites', 'Catalog']
    },
    'landing-page_gsap-scrolltrigger': {
      title: 'Animated landing page — GSAP ScrollTrigger & CSS Grid',
      summary: 'An immersive landing page animated on scroll with GSAP ScrollTrigger and an advanced CSS Grid layout. Animation sequences follow scroll progress and reveal copy, visuals and calls to action step by step. The project explores timing, easing, section pinning and CSS/JS animation performance on desktop and mobile. Semantic HTML and a clear SCSS split keep the code readable despite the motion complexity.',
      tags: ['GSAP', 'ScrollTrigger', 'Animation', 'Landing page', 'CSS Grid', 'Motion design']
    },
    'landing-page_gsap-scrolltrigger-2': {
      title: 'Narrative landing page — GSAP ScrollTrigger (v2)',
      summary: 'A second vertical-storytelling landing page driven by GSAP and ScrollTrigger. This version takes a different art direction: new parallax sequences, type transitions and elements revealed as you scroll. JavaScript isolates reusable timelines and tunes breakpoints so motion adapts to mobile viewports. It consolidates a motion-prototyping method: static layouts first, then progressive animation for a premium result.',
      tags: ['GSAP', 'ScrollTrigger', 'Landing page', 'Parallax', 'Responsive', 'Animation']
    },
    'landing-page_gsap-scrolltrigger-3': {
      title: 'Editorial landing page — GSAP ScrollTrigger (v3)',
      summary: 'A third GSAP ScrollTrigger study, aimed at a quieter, more typographic editorial experience. Motion supports the hierarchy and guides attention without crowding the interface. Semantic HTML, modular SCSS and GSAP scripts split by section make the effects easy to iterate. It closes a series of scroll-storytelling labs, a skill that transfers directly to premium sites in banking, luxury and media.',
      tags: ['GSAP', 'ScrollTrigger', 'Typography', 'Landing page', 'Motion design', 'Front-end']
    },
    'animated-navigation_jquery-gsap': {
      title: 'Animated navigation — jQuery & GSAP',
      summary: 'A minimal animated navigation menu: jQuery for DOM interactions, GSAP for fluid transitions. Micro-interactions (open, hover, active state) are tuned so the interface stays easy to scan. The project compares an imperative jQuery approach with reusable GSAP timelines. It is a base for animated headers on brochure sites where visual restraint and a subtle motion signature have to coexist.',
      tags: ['GSAP', 'jQuery', 'Navigation', 'Animation', 'UI', 'Menu']
    },
    'animated-navigation_gsap': {
      title: 'Animated navigation — vanilla GSAP',
      summary: 'A spare navigation menu animated entirely with GSAP, with no jQuery. Closed, open and focus states run on short timelines and controlled easings for a high-end feel. Vanilla JavaScript keeps the bundle lighter and easier to maintain. SCSS structures layers, z-index and complementary CSS transitions. A reference for moving older navigation patterns onto a more current stack.',
      tags: ['GSAP', 'Navigation', 'Vanilla JS', 'Animation', 'SCSS', 'UI']
    },
    'fullscreen-menu_gsap': {
      title: 'Responsive fullscreen menu — GSAP & Pug',
      summary: 'A responsive fullscreen menu with GSAP animation and Pug templating to speed up the markup. Opening and closing stagger the links, the kind of immersive moment you see on premium creative and institutional sites. Mobile-first SCSS keeps the menu usable on phone and tablet. The project combines an HTML preprocessor, motion design and accessibility basics (focus trap, ARIA, keyboard close).',
      tags: ['GSAP', 'Menu', 'Fullscreen', 'Responsive', 'Pug', 'Animation']
    },
    'full-page-menu_gsap': {
      title: 'Full-page navigation menu — GSAP',
      summary: 'A menu that takes the whole viewport, with careful GSAP transitions between the content view and the navigation layer. Text and background animations stay in sync so the shift feels deep and continuous. Timeline configuration, user events and modular SCSS stay separate. Agencies often ask for this pattern on brand-led sites that need a memorable navigation without giving up performance.',
      tags: ['GSAP', 'Navigation', 'Full page', 'Motion design', 'SCSS', 'UI']
    },
    'animation-florale-stylisee-gsap-css': {
      title: 'Stylized floral animation — GSAP & CSS',
      summary: 'A creative study of floral motion: GSAP for organic movement, CSS for textures, gradients and masks. Sequences stage gradual appearances, slight rotations and even loops for a decorative, high-end result. It shows how JavaScript animation and modern CSS (transform, filter, clip-path) complement each other. A fit for a hero or a branding module in lifestyle, beauty or editorial work.',
      tags: ['GSAP', 'CSS', 'Animation', 'Illustration', 'Motion design', 'Creative']
    },
    'form-validation-javascript': {
      title: 'Form validation framework — JavaScript',
      summary: 'A reusable vanilla-JavaScript form validator that adapts to several forms through configuration and native HTML attributes. Rules (required, email format, length, fields that must agree) live in modular functions, with accessible visual feedback and contextual error messages. It builds on HTML5 constraints and improves the client experience before submit. A solid base for conversion flows — contact, signup, simulators — in banking or e-commerce.',
      tags: ['JavaScript', 'Validation', 'Forms', 'Accessibility', 'UX', 'Vanilla JS']
    },
    'disney-clone-tailwind': {
      title: 'Streaming interface — Disney+ clone (Vue & Tailwind)',
      summary: 'A faithful rebuild of the Disney+ interface in Vue.js and Tailwind CSS: content grid, carousels, main navigation and the dark art direction typical of OTT platforms. Vue Router and Vuex structure navigation and global state (profile selection, simulated favorites). Tailwind speeds up the responsive layout and keeps spacing, color and type consistent. The project shows how to read a market-reference UI and rebuild it cleanly with a composable modern stack.',
      tags: ['Vue.js', 'Tailwind CSS', 'UI clone', 'Streaming', 'Responsive', 'Design system']
    },
    'simulateur-epargne-sg': {
      title: 'Savings simulators section — Société Générale',
      summary: 'Front-end integration of the savings-simulators section on Société Générale’s retail site, inside an OpenText CMS and under strict banking requirements (compliance, performance, accessibility). JavaScript for navigation between simulators, GSAP to support the journeys, and SCSS aligned with the group guidelines. Agile teamwork (Jira), code review and iterative delivery on Windows. A complex financial module inside a legacy ecosystem, with a fluid user experience.',
      tags: ['Banking', 'Simulator', 'Savings', 'OpenText', 'GSAP', 'Integration']
    },
    'simulateur-epargne-sg-livret-a': {
      title: 'Livret A simulator — Société Générale',
      summary: 'Design and development of the Livret A simulator so retail customers can estimate returns, caps and deposit scenarios under current rules. JavaScript/jQuery implements the business rules, input validation and live results, integrated in the OpenText CMS. Code quality is tracked in SonarQube (tech debt, coverage, vulnerabilities), with GitHub Copilot speeding repetitive tasks while human review stays in place. Delivered in an agile cycle with Jira, functional tests and coordination with banking product teams.',
      tags: ['Banking', 'Livret A', 'Simulator', 'SonarQube', 'OpenText', 'Regulatory']
    },
    'simulateur-epargne-sg-livret-jeune': {
      title: 'Livret Jeune simulator — Société Générale',
      summary: 'The simulator for Livret Jeune, adapted to that product’s constraints (eligibility, caps, tax treatment). The JavaScript calculation engine turns business rules into tested, maintainable front-end logic, with contextual help so the user knows what to do next. OpenText integration, SonarQube quality checks and a Git/GitHub workflow in a distributed team. It extends Société Générale’s simulator offer with a clearer path that matches regulatory expectations and banking UX standards.',
      tags: ['Banking', 'Livret Jeune', 'Simulator', 'JavaScript', 'OpenText', 'Agile']
    },
    'ouvrir-compte-bancaire-en-ligne': {
      title: 'Online account-opening journey — SG',
      summary: 'Front-end rebuild and integration of the “Open a bank account online” page on Société Générale’s retail site. Semantic HTML, interactive JavaScript components and visual consistency in SCSS/CSS inside the OpenText CMS. The conversion path was tightened: information hierarchy, calls to action, responsive behavior and browser support. Coordinated in Jira with product, design and back-office teams. A representative retail-banking customer-acquisition page.',
      tags: ['Banking', 'Conversion', 'OpenText', 'Integration', 'Responsive', 'Customer journey']
    },
    'balmain-sneakers-landing': {
      title: 'Balmain sneakers landing — animated integration',
      summary: 'Maintenance and front-end integration of a sneakers landing page for Balmain, in a Drupal/React environment with high-end GSAP motion. Zeplin design files were followed closely, including the luxury guidelines (type, spacing, visual rhythm), through to a careful production release. Motion supports the product story without hurting perceived performance. Close work with the Mazarine agency in a demanding international fashion and luxury context.',
      tags: ['Luxury', 'Balmain', 'GSAP', 'React', 'Drupal', 'Integration']
    },
    numero: {
      title: 'Editorial updates — Numéro Magazine',
      summary: 'Front-end maintenance and evolution of the Numéro Magazine site (Drupal/Twig): article-page updates, an editorial search form and GDPR compliance with Tarteaucitron. HTML/SCSS/JS integration of design components, with care for editorial density, press type grids and multilingual constraints. Ongoing maintenance at Mazarine, with continuous delivery and magazine publishing deadlines. A demonstration of adapting to an enterprise CMS and premium media requirements.',
      tags: ['Press', 'Drupal', 'Twig', 'GDPR', 'Editorial', 'Mazarine']
    },
    'opera-de-paris': {
      title: 'Subscription pages — Opéra de Paris',
      summary: 'Integration of subscription pages and related content for the Opéra de Paris, in a Drupal/Twig ecosystem built around ticketing and audience relations. HTML templates, modular SCSS and JavaScript interactions present offers, prices and the subscription path. Institutional identity, stronger accessibility and cross-browser support. A premium cultural project: complex institutional needs turned into clear, elegant interfaces.',
      tags: ['Culture', 'Opéra de Paris', 'Drupal', 'Subscriptions', 'Integration', 'Institutional']
    },
    'groupe-cyllene': {
      title: 'Corporate site rebuild — Groupe Cyllene',
      summary: 'A from-scratch rebuild of groupe-cyllene.com: mobile-first, subtle GSAP motion and a jQuery/SCSS front-end architecture. Institutional page templates (about, subsidiaries, contact) were rebuilt with a spare, professional art direction. Scroll performance, media lazy loading and a consistent responsive journey across the site. A B2B corporate project that shows integration rigor on a group brochure site.',
      tags: ['Rebuild', 'Corporate', 'GSAP', 'Mobile-first', 'jQuery', 'SCSS']
    },
    'experience-lepoint': {
      title: '“Expérience Le Point” landing page',
      summary: 'From-scratch integration of the “Expérience Le Point” landing page, an editorial showcase of the group’s world and formats. CSS/JavaScript animation, semantic HTML and responsive layouts for desktop, tablet and mobile. Collaboration with Le Point teams via Jira, inside a demanding press maintenance cycle. Event pages with a strong visual impact, produced in an in-house CMS.',
      tags: ['Press', 'Le Point', 'Landing page', 'Animation', 'Responsive', 'Maintenance']
    },
    'lepoint-elections-municipales': {
      title: '2020 municipal elections section — Le Point',
      summary: 'The 2020 municipal-elections section on lepoint.fr: Twig templates, HTML/CSS/JS integration and editorial data-visualization components. Homepage modules, thematic packages and cross-links were built to make the coverage easier to find. Coordinated with the newsroom and technical teams during a fast news cycle and tight publishing constraints. A representative high-traffic event section.',
      tags: ['Press', 'Elections', 'Le Point', 'Twig', 'News', 'Integration']
    },
    'lepoint-afrique': {
      title: 'Africa section rebuild — Le Point',
      summary: 'Migration and rebuild of the Africa section and its subsections on lepoint.fr, with restructured Twig templates and updated CSS/JS. Editorial readability, navigation between sections and perceived mobile performance were improved. Close work with editorial teams so the title’s journalistic identity stayed intact. An international project about running a high-volume, multi-section site.',
      tags: ['Press', 'Africa', 'Rebuild', 'Twig', 'Le Point', 'Editorial']
    },
    'lepoint-vin': {
      title: 'Wine section — Le Point',
      summary: 'Editorial components for Le Point’s wine section: tasting layouts, producer features, article grids and recommendation modules. Twig/HTML/CSS/JS within the press guidelines and the group’s SEO constraints. Load times and images were tuned for a premium audience that cares about reading quality. A niche project about adapting UI to specialized content.',
      tags: ['Press', 'Wine', 'Le Point', 'Twig', 'Editorial', 'SEO']
    },
    'lepoint-montres': {
      title: 'Watches section — Le Point',
      summary: 'Front-end integration of the watches section on lepoint.fr, with components for high-end watch journalism (product sheets, comparisons, galleries). Careful styling for photography and editorial type, compatible with the in-house CMS and the Jira workflow. Advanced responsive design for mobile reading, an important audience for lifestyle sections. Precision integration for a premium press universe.',
      tags: ['Press', 'Watches', 'Lifestyle', 'Twig', 'Le Point', 'Integration']
    }
  }
}

const es: ContentCopy = {
  meta: {
    role: 'Desarrollador front-end e integrador web',
    tagline: 'Interfaces rápidas, accesibles y animadas (solo lo justo).',
    location: 'París / Remoto'
  },
  about: {
    bio: 'Me interesa crear interfaces rápidas y accesibles. He trabajado en entornos exigentes (banca, lujo, prensa) y he contribuido a proyectos ambiciosos. Con esa experiencia cuido el rendimiento, el grafismo, las exigencias de accesibilidad y el diseño responsive. Sigo formándome para afinar el trabajo.',
    highlights: [
      'TypeScript, Nuxt 3 / Vue 3, TailwindCSS, GSAP',
      'Accesibilidad, SEO, mobile-first',
      'Animaciones controladas (AOS, ScrollReveal, ScrollMagic, CSS)',
      'Cultura de diseño (Figma, Zeplin), mantenimiento y optimización'
    ],
    availability: 'Freelance — misiones cortas o de duración media'
  },
  experiences: {
    'Le Point': {
      role: 'Integrador web',
      period: 'Nov. 2017 – Feb. 2020',
      summary: 'Integración responsive, newsletters, pruebas A/B con Adobe Tag Manager, receta CMS.',
      missions: [
        'Coordinación del proyecto: organización de tareas en JIRA.',
        'Integración y emailing: programación de newsletters (CMS + PHP) · páginas y secciones mobile-first con tracking',
        'Integración de páginas y secciones con tracking',
        'Programación de newsletters (CMS + Twig)',
        'Pruebas A/B: despliegue de componentes con Adobe Tag Manager junto al equipo de marketing'
      ],
      tags: ['Integración', 'Pruebas A/B', 'Newsletter']
    },
    Cyllene: {
      role: 'Integrador web',
      period: 'Ago. 2020 – Feb. 2021',
      summary: 'Integración Zeplin, páginas animadas con GSAP, SEO/RGPD, extracciones JSON para formularios.',
      missions: [
        'Coordinación del proyecto: tareas en JIRA y plataforma interna',
        'Integración y animación: análisis Zeplin → páginas animadas (GSAP, JavaScript nativo)',
        'Clientes: Uriage · Nuxe · LesVoyagesFr',
        'Referente front HTML/CSS/jQuery',
        'Creación de páginas animadas (GSAP, JS nativo)',
        'Optimización SEO y puesta en marcha del RGPD'
      ],
      tags: ['Agencia', 'SEO', 'RGPD', 'Animación']
    },
    Mazarine: {
      role: 'Desarrollador front-end',
      period: 'Mar. 2021 – Ago. 2021',
      summary: 'Páginas animadas (GSAP), optimizaciones SEO/RGPD, extracción JSON para un motor de búsqueda.',
      missions: [
        'Coordinación del proyecto: tareas en JIRA y plataforma interna',
        'Integración y animación: maquetas Zeplin → páginas animadas (GSAP, JavaScript nativo)',
        'Clientes: Balmain Sneakers · Opéra de Paris · Studio Acacia · Hôtel Salomon de Rothschild · Ritz Paris · Magazine Numéro',
        'Optimización semántica (encabezados, Search Console), RGPD (Tarteaucitron, OneTrust)',
        'Mantenimiento: correcciones y evoluciones JS',
        'Agile: stand-ups diarios y comunicación continua en Microsoft Teams (compatible con el teletrabajo)'
      ],
      tags: ['Lujo', 'Cultura', 'CMS', 'Animación']
    },
    'Société Générale': {
      role: 'Desarrollador web front-end',
      period: 'Ene. 2022 – Ago. 2025',
      summary: 'En los equipos Stream Run y luego POI: herramientas de visualización dinámica, asistente de IA para claims, analítica de uso, simulador de ahorro e integración de maquetas (design system).',
      missions: [
        'Coordinación del proyecto: organización de tareas en JIRA.',
        'JS: 2 herramientas internas de visualización dinámica de campañas, asistente de IA para generar y evaluar claims ilustrados, script de analítica del comportamiento, simulador de ahorro con reglas fiscales',
        'Integración UI: maquetas Figma (design system, landing) y mantenimiento / correcciones JS.'
      ],
      tags: ['Banca', 'Dashboard', 'Simulador', 'Analítica', 'Design system']
    }
  },
  projects: {
    'react_creer-des-composants-courants': {
      title: 'Biblioteca de componentes React reutilizables',
      summary: 'Diseño y desarrollo de una biblioteca de componentes UI reutilizables con React 18 y Tailwind CSS, pensada para acelerar la maquetación de interfaces modernas. Cada componente está aislado, es configurable y está documentado para favorecer la coherencia visual y el mantenimiento del front-end. El proyecto insiste en la composición, las variantes (estados, tamaños, colores) y una accesibilidad de base (semántica HTML, foco, contrastes). La arquitectura JavaScript modular facilita la integración en aplicaciones más amplias y sirve para estandarizar patrones de interfaz.',
      tags: ['React', 'Componentes UI', 'Design system', 'Tailwind CSS', 'Front-end']
    },
    'select-agences-js-poo': {
      title: 'Selector de sucursales bancarias — arquitectura POO',
      summary: 'Aplicación front-end para elegir sucursales bancarias, en JavaScript vanilla con arquitectura orientada a objetos (clases, encapsulación, responsabilidades separadas). Los datos JSON se cargan de forma asíncrona con XMLHttpRequest y se inyectan en el DOM con lazy loading para limitar el primer render. El proyecto explora la estructura del código de negocio (modelos, servicios, componentes UI), los eventos de usuario y el estilo avanzado en SCSS. Es un caso para conciliar rendimiento percibido, código legible y un select que puede crecer.',
      tags: ['JavaScript', 'POO', 'DOM', 'AJAX', 'Lazy loading', 'SCSS']
    },
    'tmdb-movie-app-search-filter-pagination': {
      title: 'Catálogo de cine interactivo — API TMDB',
      summary: 'Aplicación web responsive para descubrir películas con la API de The Movie Database (TMDB): catálogos, fichas y metadatos. La interfaz ofrece búsqueda en tiempo real, filtro por géneros, paginación y una navegación fluida, todo en JavaScript nativo sin framework. El consumo REST pasa por Fetch API, con una separación clara entre datos, filtrado y render del DOM. Demuestra la integración de APIs de terceros, el estado en el cliente y experiencias de consulta con mucho contenido.',
      tags: ['JavaScript', 'API REST', 'Responsive', 'Búsqueda', 'Paginación', 'Cine']
    },
    'styled-selects-price-calculator': {
      title: 'Selects estilizados y calculadora de precios dinámica',
      summary: 'Módulo JavaScript para personalizar los `<select>` nativos, unido a una calculadora de precio según los criterios elegidos (en particular la franja de edad). El código ES6+ se transpila a ES5 con Babel para ampliar la compatibilidad, con pipeline de build y script de watch. Destaca la manipulación fina del DOM, la persistencia en localStorage y componentes reutilizables independientes del framework. Publicado en CodePen, ilustra microinteracciones UI y lógica de negocio front-end autónoma.',
      tags: ['JavaScript', 'DOM', 'Babel', 'Calculadora', 'Componentes UI', 'CodePen']
    },
    'javascript-dom-optimization-agency-selector': {
      title: 'Selector de sucursales de alto rendimiento — optimización del DOM',
      summary: 'Reconstrucción orientada al rendimiento de un selector de sucursales capaz de gestionar cientos de opciones sin degradar la experiencia. Se apoya en una arquitectura POO en ES6+, carga de datos con Fetch API e inserción del DOM por lotes para reducir reflows y mejorar el Time to Interactive. El proyecto compara estrategias de render progresivo y el equilibrio entre un markup simple y una fluidez percibida. La escala del DOM y el mantenimiento del código se tratan como requisitos de producto.',
      tags: ['JavaScript', 'Rendimiento', 'POO', 'DOM', 'Fetch API', 'Optimización']
    },
    'vue-lazy-loading-search-sorting': {
      title: 'Filtrado, orden y paginación — Vue.js',
      summary: 'Aplicación Vue.js dedicada a listas ricas: búsqueda de texto, orden multicriterio, paginación y lazy loading en el cliente. El dataset completo se carga una vez y se filtra en el front, lo que permite comparar estrategias sin latencia de red extra. Vue Router estructura las vistas y SCSS asegura un estilo modular y responsive. Es una base reutilizable para paneles, catálogos o back-offices ligeros donde la interfaz debe seguir siendo reactiva.',
      tags: ['Vue.js', 'Búsqueda', 'Orden', 'Paginación', 'Lazy loading', 'Front-end']
    },
    'film-library-vuex-vueRouter': {
      title: 'Biblioteca de películas — Vuex y Vue Router',
      summary: 'Aplicación de biblioteca de películas con Vue.js, el estado en Vuex y la navegación en Vue Router. El usuario recorre un catálogo, consulta el detalle de una película y gestiona favoritos en el store global. La arquitectura separa vistas, mutaciones/acciones y componentes de presentación. Tailwind CSS acelera la maquetación responsive. Un proyecto para demostrar el ecosistema Vue 3 y patrones SPA profesionales.',
      tags: ['Vue.js', 'Vuex', 'Vue Router', 'SPA', 'Favoritos', 'Catálogo']
    },
    'landing-page_gsap-scrolltrigger': {
      title: 'Landing animada — GSAP ScrollTrigger y CSS Grid',
      summary: 'Landing inmersiva animada con el scroll gracias a ScrollTrigger de GSAP, combinada con una maquetación CSS Grid avanzada. Las secuencias siguen el progreso del scroll para revelar contenidos, visuales y llamadas a la acción. El proyecto explora el timing, el easing, el pinning de secciones y el rendimiento de las animaciones CSS/JS en escritorio y móvil. Se cuida el HTML semántico y el corte del SCSS para que el código siga siendo legible.',
      tags: ['GSAP', 'ScrollTrigger', 'Animación', 'Landing page', 'CSS Grid', 'Motion design']
    },
    'landing-page_gsap-scrolltrigger-2': {
      title: 'Landing narrativa — GSAP ScrollTrigger (v2)',
      summary: 'Segunda iteración de una landing con storytelling vertical, pilotada por GSAP y ScrollTrigger. Esta versión explora otra dirección artística: nuevas secuencias de parallax, transiciones tipográficas y revelaciones a lo largo del scroll. El JavaScript aísla timelines reutilizables y ajusta los breakpoints para adaptar las animaciones al móvil. Consolida un método de prototipado motion: primero maquetas estáticas, luego orquestación progresiva.',
      tags: ['GSAP', 'ScrollTrigger', 'Landing page', 'Parallax', 'Responsive', 'Animación']
    },
    'landing-page_gsap-scrolltrigger-3': {
      title: 'Landing editorial — GSAP ScrollTrigger (v3)',
      summary: 'Tercera exploración de GSAP ScrollTrigger, orientada a una experiencia editorial más minimalista y tipográfica. Las animaciones acentúan la jerarquía y guían la atención sin saturar la interfaz. HTML semántico, SCSS modular y scripts GSAP por sección permiten iterar rápido. Cierra una serie de laboratorios de scroll storytelling, una competencia directamente trasladable a sitios premium de banca, lujo y medios.',
      tags: ['GSAP', 'ScrollTrigger', 'Tipografía', 'Landing page', 'Motion design', 'Front-end']
    },
    'animated-navigation_jquery-gsap': {
      title: 'Navegación animada — jQuery y GSAP',
      summary: 'Menú de navegación minimalista: jQuery para las interacciones del DOM y GSAP para transiciones fluidas. Las microinteracciones (apertura, hover, estado activo) están calibradas para reforzar la lectura. El proyecto compara el enfoque imperativo de jQuery con timelines GSAP reutilizables. Sirve de base para cabeceras animadas en sitios vitrina, donde la sobriedad visual convive con una firma motion sutil.',
      tags: ['GSAP', 'jQuery', 'Navegación', 'Animación', 'UI', 'Menú']
    },
    'animated-navigation_gsap': {
      title: 'Navegación animada — GSAP vanilla',
      summary: 'Menú de navegación sobrio animado por completo con GSAP, sin jQuery. Los estados cerrado, abierto y foco se orquestan con timelines cortas y easings controlados. El JavaScript vanilla aligera el bundle y facilita el mantenimiento. El SCSS estructura capas, z-index y transiciones CSS complementarias. Una referencia para modernizar patrones de navegación antiguos.',
      tags: ['GSAP', 'Navegación', 'Vanilla JS', 'Animación', 'SCSS', 'UI']
    },
    'fullscreen-menu_gsap': {
      title: 'Menú a pantalla completa responsive — GSAP y Pug',
      summary: 'Menú a pantalla completa responsive con animaciones GSAP y plantillas Pug para acelerar el markup. La apertura y el cierre acompañan los enlaces con animaciones escalonadas, una experiencia típica de sitios creativos e institucionales premium. El SCSS mobile-first garantiza la ergonomía táctil en móvil y tableta. El proyecto combina preprocesador HTML, motion design y buenas prácticas de accesibilidad (focus trap, ARIA, cierre por teclado).',
      tags: ['GSAP', 'Menú', 'Pantalla completa', 'Responsive', 'Pug', 'Animación']
    },
    'full-page-menu_gsap': {
      title: 'Menú de navegación a página completa — GSAP',
      summary: 'Menú que ocupa todo el viewport, con transiciones GSAP cuidadas entre la vista de contenido y la capa de navegación. Las animaciones de texto y de fondo están sincronizadas para dar profundidad y continuidad. El código separa la configuración de las timelines, los eventos y los estilos SCSS modulares. Es un patrón habitual en agencia para sitios con una identidad de marca fuerte, sin sacrificar el rendimiento.',
      tags: ['GSAP', 'Navegación', 'Página completa', 'Motion design', 'SCSS', 'UI']
    },
    'animation-florale-stylisee-gsap-css': {
      title: 'Animación floral estilizada — GSAP y CSS',
      summary: 'Estudio creativo de una animación floral: GSAP para el movimiento orgánico y CSS para texturas, degradados y máscaras. Las secuencias ponen en escena apariciones progresivas, rotaciones sutiles y bucles armónicos. El proyecto muestra la complementariedad entre la animación JavaScript y las propiedades CSS modernas (transform, filter, clip-path). Ideal como hero o módulo de branding para universos lifestyle, belleza o editorial.',
      tags: ['GSAP', 'CSS', 'Animación', 'Ilustración', 'Motion design', 'Creativo']
    },
    'form-validation-javascript': {
      title: 'Framework de validación de formularios — JavaScript',
      summary: 'Sistema reutilizable de validación de formularios en JavaScript vanilla, adaptable a varios formularios mediante configuración y atributos HTML nativos. Las reglas (obligatorio, email, longitud, coherencia entre campos) están centralizadas, con retornos visuales accesibles y mensajes de error contextuales. Se apoya en las restricciones HTML5 y enriquece la experiencia antes del envío. Una base sólida para recorridos de conversión (contacto, registro, simuladores) en banca o e-commerce.',
      tags: ['JavaScript', 'Validación', 'Formularios', 'Accesibilidad', 'UX', 'Vanilla JS']
    },
    'disney-clone-tailwind': {
      title: 'Interfaz de streaming — clon de Disney+ (Vue y Tailwind)',
      summary: 'Reproducción fiel de la interfaz de Disney+ en Vue.js con Tailwind CSS: rejilla de contenidos, carruseles, navegación principal y la dirección artística oscura de las plataformas OTT. Vue Router y Vuex estructuran la navegación y el estado global (perfiles, favoritos simulados). Tailwind acelera la maquetación responsive y la coherencia de espacios, colores y tipografías. El proyecto demuestra la capacidad de analizar una UI de referencia y reconstruirla con una stack moderna.',
      tags: ['Vue.js', 'Tailwind CSS', 'Clon UI', 'Streaming', 'Responsive', 'Design system']
    },
    'simulateur-epargne-sg': {
      title: 'Sección de simuladores de ahorro — Société Générale',
      summary: 'Integración front-end de la sección de simuladores de ahorro en el espacio de particulares de Société Générale, en un CMS OpenText y con exigencias bancarias estrictas (conformidad, rendimiento, accesibilidad). JavaScript para la navegación entre simuladores, animaciones GSAP y SCSS alineado con la carta del grupo. Trabajo ágil (Jira), revisiones de código y entregas iterativas en Windows. Módulos financieros complejos dentro de un ecosistema legacy, con una experiencia fluida.',
      tags: ['Banca', 'Simulador', 'Ahorro', 'OpenText', 'GSAP', 'Integración']
    },
    'simulateur-epargne-sg-livret-a': {
      title: 'Simulador Livret A — Société Générale',
      summary: 'Diseño y desarrollo del simulador Livret A para que los particulares estimen rendimientos, topes y escenarios de ingresos según la normativa vigente. JavaScript/jQuery implementa las reglas de negocio, las validaciones y los resultados en tiempo real, integrado en el CMS OpenText. La calidad se sigue en SonarQube (deuda técnica, cobertura, vulnerabilidades), con GitHub Copilot para acelerar tareas repetitivas sin perder la revisión humana. Entrega ágil con Jira, pruebas funcionales y coordinación con los equipos de negocio.',
      tags: ['Banca', 'Livret A', 'Simulador', 'SonarQube', 'OpenText', 'Normativo']
    },
    'simulateur-epargne-sg-livret-jeune': {
      title: 'Simulador Livret Jeune — Société Générale',
      summary: 'Desarrollo del simulador del Livret Jeune, adaptado a las restricciones de ese producto (elegibilidad, topes, fiscalidad). El motor de cálculo JavaScript traduce las reglas de negocio a una lógica front testeada y mantenible, con mensajes de ayuda contextuales. Integración OpenText, control de calidad SonarQube y flujo Git/GitHub en un equipo distribuido. Refuerza la oferta de simuladores de SG con un recorrido pedagógico alineado con la normativa y los estándares UX bancarios.',
      tags: ['Banca', 'Livret Jeune', 'Simulador', 'JavaScript', 'OpenText', 'Agile']
    },
    'ouvrir-compte-bancaire-en-ligne': {
      title: 'Recorrido de apertura de cuenta en línea — SG',
      summary: 'Reconstrucción e integración front-end de la página «Abrir una cuenta bancaria en línea» en el sitio de particulares de Société Générale. HTML semántico, componentes JavaScript interactivos y coherencia visual SCSS/CSS dentro del CMS OpenText. Se optimizó el recorrido de conversión: jerarquía, llamadas a la acción, responsive y compatibilidad de navegadores. Coordinación en Jira con negocio, diseño y back-office. Un proyecto representativo de la captación digital en banca minorista.',
      tags: ['Banca', 'Conversión', 'OpenText', 'Integración', 'Responsive', 'Recorrido cliente']
    },
    'balmain-sneakers-landing': {
      title: 'Landing de sneakers Balmain — integración animada',
      summary: 'Mantenimiento e integración front-end de una landing de sneakers para Balmain, en Drupal/React con animaciones GSAP de alta gama. Se retomaron los entregables Zeplin, con un respeto milimétrico de la carta de lujo (tipografías, espacios, ritmo visual) hasta la puesta en producción. El motion refuerza el relato del producto sin comprometer el rendimiento percibido. Colaboración estrecha con la agencia Mazarine en un contexto internacional de moda y lujo.',
      tags: ['Lujo', 'Balmain', 'GSAP', 'React', 'Drupal', 'Integración']
    },
    numero: {
      title: 'Evoluciones editoriales — Numéro Magazine',
      summary: 'Mantenimiento y evolución front-end del sitio de Numéro Magazine (Drupal/Twig): páginas de artículo, formulario de búsqueda editorial y conformidad RGPD con Tarteaucitron. Integración HTML/SCSS/JS de los componentes de diseño, con atención a la densidad editorial, las rejillas tipográficas de prensa y las restricciones multilingües. Trabajo de mantenimiento en Mazarine, con entregas continuas y los plazos de una revista. Adaptación a un CMS enterprise y a las exigencias de un medio premium.',
      tags: ['Prensa', 'Drupal', 'Twig', 'RGPD', 'Editorial', 'Mazarine']
    },
    'opera-de-paris': {
      title: 'Páginas de abonos — Opéra de Paris',
      summary: 'Integración de las páginas de abonos y contenidos asociados del Opéra de Paris, en un ecosistema Drupal/Twig orientado a la taquilla y la relación con el público. Plantillas HTML, estilos SCSS modulares e interacciones JavaScript para presentar ofertas, tarifas y el recorrido de suscripción. Identidad institucional, accesibilidad reforzada y compatibilidad entre navegadores. Un proyecto cultural premium: necesidades institucionales complejas traducidas en interfaces claras y elegantes.',
      tags: ['Cultura', 'Opéra de Paris', 'Drupal', 'Abonos', 'Integración', 'Institucional']
    },
    'groupe-cyllene': {
      title: 'Reconstrucción del sitio corporativo — Groupe Cyllene',
      summary: 'Reconstrucción desde cero de groupe-cyllene.com, con enfoque mobile-first, animaciones GSAP sutiles y arquitectura front jQuery/SCSS. Se reconstruyeron las plantillas institucionales (presentación, filiales, contacto) con una dirección artística sobria y profesional. Rendimiento del scroll, lazy loading de medios y coherencia responsive en todo el recorrido. Un proyecto corporativo B2B que pone por delante el rigor de integración en un sitio vitrina de grupo.',
      tags: ['Reconstrucción', 'Corporativo', 'GSAP', 'Mobile-first', 'jQuery', 'SCSS']
    },
    'experience-lepoint': {
      title: 'Landing «Expérience Le Point»',
      summary: 'Integración desde cero de la landing «Expérience Le Point», un escaparate editorial del universo y los formatos del grupo. Animaciones CSS/JavaScript, HTML semántico y versiones responsive para escritorio, tableta y móvil. Colaboración con los equipos de Le Point vía Jira, en un mantenimiento de prensa exigente en plazos y calidad. Páginas de evento con fuerte impacto visual, producidas en un CMS propio.',
      tags: ['Prensa', 'Le Point', 'Landing page', 'Animación', 'Responsive', 'Mantenimiento']
    },
    'lepoint-elections-municipales': {
      title: 'Sección Elecciones municipales 2020 — Le Point',
      summary: 'Creación de la sección de las elecciones municipales de 2020 en lepoint.fr: plantillas Twig, integración HTML/CSS/JS y componentes de visualización de datos editorial. Módulos de portada, dosieres temáticos y enlaces transversales para facilitar el descubrimiento de los contenidos. Coordinación con la redacción y los equipos técnicos en un contexto de actualidad y de publicación rápida. Una sección de evento representativa del tráfico de un medio.',
      tags: ['Prensa', 'Elecciones', 'Le Point', 'Twig', 'Actualidad', 'Integración']
    },
    'lepoint-afrique': {
      title: 'Reconstrucción de la sección África — Le Point',
      summary: 'Migración y reconstrucción de la sección África y sus subsecciones en lepoint.fr, con plantillas Twig reestructuradas y estilos CSS/JS modernizados. Se mejoró la legibilidad editorial, la navegación entre secciones y el rendimiento percibido en móvil. Trabajo estrecho con los equipos editoriales para respetar la identidad periodística. Un proyecto internacional de sitios con muchas secciones y un gran volumen de contenidos.',
      tags: ['Prensa', 'África', 'Reconstrucción', 'Twig', 'Le Point', 'Editorial']
    },
    'lepoint-vin': {
      title: 'Sección Vino — Le Point',
      summary: 'Integración de componentes editoriales de la sección Vino de Le Point: maquetas de cata, dosieres de productores, rejillas de artículos y módulos de recomendación. Desarrollo Twig/HTML/CSS/JS dentro de la carta de prensa y las restricciones SEO del grupo. Tiempos de carga e imágenes optimizados para un público premium sensible a la calidad de lectura. Un proyecto de nicho sobre cómo adaptar la UI a contenidos especializados.',
      tags: ['Prensa', 'Vino', 'Le Point', 'Twig', 'Editorial', 'SEO']
    },
    'lepoint-montres': {
      title: 'Sección Relojes — Le Point',
      summary: 'Integración front-end de la sección Relojes en lepoint.fr, con componentes para artículos de relojería de alta gama (fichas, comparativas, galerías). Estilo cuidado para fotografías y tipografías editoriales, compatible con el CMS propio y el flujo Jira. Diseño responsive avanzado para la consulta móvil, importante en las secciones lifestyle. Precisión de integración para un universo premium de la prensa.',
      tags: ['Prensa', 'Relojes', 'Lifestyle', 'Twig', 'Le Point', 'Integración']
    }
  }
}

export const contentCopy: Partial<Record<AppLocale, ContentCopy>> = { en, es }
