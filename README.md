# 🚀 Portfolio Widdy Louis - Développeur Front-End

Portfolio moderne et performant développé avec **Nuxt 3**, présentant mon parcours professionnel, mes compétences et mes projets en tant que développeur Front-End & Intégrateur Web.

## ✨ Fonctionnalités

- 🎨 **Design moderne** avec glassmorphism et animations fluides
- 🌙 **Mode sombre/clair** avec toggle automatique
- 📱 **Responsive design** optimisé mobile-first
- ⚡ **Performance optimisée** avec Nuxt 3 et Vite
- 🎭 **Animations GSAP** pour une expérience immersive
- 🔍 **SEO optimisé** avec meta tags et schema.org
- 📧 **Formulaire de contact** fonctionnel avec EmailJS
- 🎯 **Filtrage d'expériences** par technologies
- 🎪 **Slider de projets** avec navigation intuitive

## 🛠️ Technologies utilisées

### Frontend
- **Nuxt 3** - Framework Vue.js full-stack
- **Vue 3** - Framework JavaScript progressif
- **TypeScript** - Typage statique
- **TailwindCSS** - Framework CSS utility-first
- **GSAP** - Animations avancées
- **Pinia** - Gestion d'état

### Outils & Services
- **EmailJS** - Envoi d'emails côté client
- **VueUse** - Utilitaires Vue.js
- **Nuxt SEO** - Optimisation SEO
- **Netlify** - Déploiement et hosting

## 📁 Structure du projet

```
nuxt-porfolio/
├── app/
│   ├── components/          # Composants Vue réutilisables
│   │   ├── Ui/             # Composants UI de base
│   │   ├── ExperienceFilter.vue
│   │   ├── ExperienceList.vue
│   │   ├── HeroAbout.vue
│   │   ├── ProjectCard.vue
│   │   ├── ProjectSlider.vue
│   │   └── SkillsCloud.vue
│   ├── data/
│   │   └── content.json    # Données du portfolio
│   ├── pages/              # Pages de l'application
│   │   ├── index.vue       # Page d'accueil
│   │   ├── contact.vue     # Page de contact
│   │   └── projets/        # Pages des projets
│   ├── plugins/            # Plugins Nuxt
│   │   ├── gsap.client.ts  # Plugin GSAP
│   │   └── vueuse.client.ts
│   ├── store/              # Store Pinia
│   │   └── useFilters.ts   # Gestion des filtres
│   └── assets/
│       └── css/
│           └── base.css    # Styles globaux
├── public/                 # Assets statiques
├── nuxt.config.ts          # Configuration Nuxt
├── tailwind.config.js      # Configuration TailwindCSS
└── netlify.toml           # Configuration Netlify
```

## 🚀 Installation et développement

### Prérequis
- **Node.js** >= 20.19.0
- **npm** >= 10.0.0

### Installation

```bash
# Cloner le repository
git clone <votre-repo>
cd nuxt-porfolio

# Installer les dépendances
npm install
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

### Build et déploiement

```bash
# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Générer une version statique
npm run generate
```

## 📊 Données du portfolio

Le contenu du portfolio est géré via le fichier `app/data/content.json` qui contient :

- **Informations personnelles** (nom, rôle, contact)
- **Expériences professionnelles** avec dates, missions, technologies
- **Compétences techniques** organisées par catégories
- **Projets réalisés** avec descriptions et liens

### Structure des données

```json
{
  "meta": {
    "name": "Widdy Louis",
    "role": "Développeur Front-End & Intégrateur Web",
    "email": "louiswiddy49@gmail.com",
    "links": {
      "linkedin": "https://www.linkedin.com/in/widdy-louis/",
      "github": "https://github.com/CodeurCopieur"
    }
  },
  "sections": {
    "experiences": [...],
    "competences": {...},
    "projets": [...]
  }
}
```

## 🎨 Composants principaux

### ExperienceFilter
Filtrage des expériences par technologies avec interface moderne et animations.

### ProjectSlider
Slider de projets avec navigation par pagination et autoplay, responsive selon la taille d'écran.

### SkillsCloud
Nuage de compétences animé avec GSAP pour une présentation dynamique.

### Contact Form
Formulaire de contact fonctionnel avec validation et envoi via EmailJS.

## 🌐 Déploiement

Le projet est configuré pour un déploiement sur **Netlify** :

- **Build command** : `npm run build`
- **Publish directory** : `.output/public`
- **Node.js version** : 20.19.0

### Configuration Netlify

```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "20.19.0"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 📱 Responsive Design

Le portfolio est optimisé pour tous les appareils :
- **Mobile** : 1 projet par slide, navigation tactile
- **Tablet** : 2 projets par slide
- **Desktop** : 3 projets par slide, navigation complète

## 🎯 Performance

- **Lazy loading** des composants
- **Optimisation des images** avec Nuxt Image
- **Code splitting** automatique
- **Minification** CSS/JS en production
- **Cache** optimisé pour Netlify

## 🔧 Configuration EmailJS

Pour configurer l'envoi d'emails, créez un compte EmailJS et mettez à jour les variables dans `pages/contact.vue` :

```javascript
const EMAILJS_SERVICE_ID = 'votre_service_id'
const EMAILJS_TEMPLATE_ID = 'votre_template_id'
const EMAILJS_PUBLIC_KEY = 'votre_public_key'
```

## 📄 Licence

Ce projet est privé et destiné à un usage personnel.

## 👨‍💻 Auteur

**Widdy Louis** - Développeur Front-End & Intégrateur Web
- 📧 Email : louiswiddy49@gmail.com
- 💼 LinkedIn : [Widdy Louis](https://www.linkedin.com/in/widdy-louis/)
- 🐙 GitLab : [CodeurCopieur](https://gitlab.com/codwerk)

---

*Portfolio développé avec ❤️ et Nuxt 3*
