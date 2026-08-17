<script setup lang="ts">
import { PUBLIC_CONTACT_EMAIL } from '@/constants/contact'
import { LEGAL_PAGES } from '@/constants/legal'
import { useRefonteTransition } from '@/composables/refonte/useRefonteTransition'

const { meta, sections } = useContent()
const { navigateTo } = useRefonteTransition()
const route = useRoute()
const year = new Date().getFullYear()
const footerRef = ref<HTMLElement | null>(null)

const isLegalPage = computed(() => LEGAL_PAGES.some((page) => route.path === page.to))

async function goContact(event: MouseEvent) {
  event.preventDefault()
  await navigateTo('/refonte/contact')
}
</script>

<template>
  <footer
    ref="footerRef"
    class="refonte-footer refonte-section"
    :class="{ 'refonte-footer--legal': isLegalPage }"
    data-scroll-section
    data-rf-chapter="Contact"
  >
    <div v-if="!isLegalPage" class="refonte-container refonte-footer__climax">
      <p class="rf-movement__num" v-reveal>Finale</p>
      <h2 class="refonte-display refonte-footer__hero" v-reveal="{ delay: 60 }">
        Travaillons<br>ensemble sur votre <span class="refonte-footer__hero-accent">prochain projet</span>
      </h2>
      <p class="refonte-footer__pitch" v-reveal="{ delay: 120 }">
        {{ sections.a_propos.availability }}
      </p>

      <div class="refonte-footer__cta" v-reveal="{ delay: 170 }">
        <a :href="`mailto:${PUBLIC_CONTACT_EMAIL}`" class="refonte-btn refonte-footer__email">
          M'écrire
        </a>
        <a href="/refonte/contact" class="refonte-footer__form-link" @click="goContact">
          ou via le formulaire →
        </a>
      </div>
    </div>

    <div class="refonte-container refonte-footer__meta" :class="{ 'refonte-footer__meta--solo': isLegalPage }">
      <div v-reveal="{ index: 0, total: 3, reverse: true, stagger: 80 }">
        <p class="refonte-label">Portfolio</p>
        <p class="refonte-footer__name">{{ meta.name }}</p>
        <p class="refonte-footer__role">{{ meta.role }} · {{ meta.location }}</p>
      </div>

      <div v-reveal="{ index: 1, total: 3, reverse: true, stagger: 80 }">
        <p class="refonte-label">Réseaux</p>
        <ul class="refonte-footer__links">
          <li v-if="meta.links.linkedin">
            <a :href="meta.links.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          </li>
          <li v-if="meta.links.github">
            <a :href="meta.links.github" target="_blank" rel="noopener">GitHub</a>
          </li>
          <li><NuxtLink to="/">Version classique</NuxtLink></li>
        </ul>
      </div>

      <div v-reveal="{ index: 2, total: 3, reverse: true, stagger: 80 }">
        <p class="refonte-label">Stack</p>
        <ul class="refonte-footer__tags">
          <li v-for="item in sections.a_propos.highlights.slice(0, 4)" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="refonte-container refonte-footer__bottom">
      <p>© {{ year }} {{ meta.name }}</p>
      <nav class="refonte-footer__legal" aria-label="Informations légales">
        <RefonteLink
          v-for="page in LEGAL_PAGES"
          :key="page.to"
          :to="page.to"
          class="refonte-footer__legal-link"
        >
          {{ page.label }}
        </RefonteLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.refonte-footer {
  padding-block: clamp(5rem, 14vw, 9rem) clamp(2rem, 5vw, 3rem);
  border-top: 1px solid var(--rf-line);
  background:
    radial-gradient(ellipse 70% 55% at 50% 0%, rgba(var(--rf-accent-rgb), 0.08), transparent 60%),
    linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.28));
  color: var(--rf-text);
}

.refonte-footer--legal {
  padding-block: clamp(1.25rem, 3vw, 1.75rem) clamp(1rem, 2.5vw, 1.25rem);
}

.refonte-footer--legal .refonte-footer__bottom {
  margin-top: 1.25rem;
  padding-top: 0.75rem;
}

.refonte-footer__meta--solo {
  padding-top: 0;
  border-top: none;
}

.refonte-footer__climax {
  display: grid;
  gap: var(--rf-block-gap);
  margin-bottom: clamp(3rem, 8vw, 5rem);
}

.refonte-footer__hero {
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  margin: 0.75rem 0 0.5rem;
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.refonte-footer__hero-accent {
  color: var(--rf-accent);
  font-family: var(--rf-serif);
  font-style: italic;
  font-weight: 400;
}

.refonte-footer__pitch {
  max-width: 46ch;
}

.refonte-footer__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 0.5rem;
}

.refonte-footer__email {
  box-shadow: none;
}

.refonte-footer__form-link {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--rf-text-muted);
  text-decoration: none;
  transition: color 0.25s var(--rf-ease);
}

.refonte-footer__form-link:hover {
  color: var(--rf-accent);
}

.refonte-footer__meta {
  display: grid;
  gap: var(--rf-block-gap);
  padding-top: 2rem;
  border-top: 1px solid var(--rf-line);
}

@media (min-width: 768px) {
  .refonte-footer__meta {
    grid-template-columns: 1.2fr 1fr 1fr;
  }
}

.refonte-footer__name {
  font-family: var(--rf-sans);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0.35rem 0 0.15rem;
}

.refonte-footer__role {
  font-size: 0.88rem;
  color: var(--rf-text-soft);
  margin: 0;
}

.refonte-footer__links,
.refonte-footer__tags {
  list-style: none;
  padding: 0;
  margin: 0.65rem 0 0;
  display: grid;
  gap: 0.45rem;
  font-size: 0.88rem;
}

.refonte-footer__links a {
  color: var(--rf-text-soft);
  text-decoration: none;
  transition: color 0.2s var(--rf-ease);
}

.refonte-footer__links a:hover {
  color: var(--rf-accent);
}

.refonte-footer__tags li {
  color: var(--rf-text-soft);
  font-size: 0.82rem;
}

.refonte-footer__bottom {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--rf-line);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem 1.25rem;
  font-size: 0.72rem;
  color: var(--rf-text-soft);
}

.refonte-footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
}

.refonte-footer__legal-link {
  color: var(--rf-text-soft);
  text-decoration: none;
  font-weight: 600;
}

.refonte-footer__legal-link:hover {
  color: var(--rf-accent);
}
</style>
