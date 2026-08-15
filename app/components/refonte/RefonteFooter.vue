<script setup lang="ts">
import { PUBLIC_CONTACT_EMAIL } from '@/constants/contact'

const { meta, sections } = useContent()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="refonte-footer" data-scroll-section>
    <div class="refonte-container refonte-footer__grid">
      <div>
        <p class="refonte-label">Portfolio</p>
        <h2 class="refonte-display refonte-footer__title">{{ meta.name }}</h2>
        <p class="refonte-footer__role">{{ meta.role }}</p>
      </div>

      <div>
        <p class="refonte-label">Contact</p>
        <ul class="refonte-footer__list">
          <li>{{ meta.location }}</li>
          <li><a :href="`mailto:${PUBLIC_CONTACT_EMAIL}`">{{ PUBLIC_CONTACT_EMAIL }}</a></li>
          <li>{{ meta.phone }}</li>
        </ul>
      </div>

      <div>
        <p class="refonte-label">Stack phare</p>
        <ul class="refonte-footer__tags">
          <li v-for="item in sections.a_propos.highlights.slice(0, 3)" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div>
        <p class="refonte-label">Réseaux</p>
        <ul class="refonte-footer__list">
          <li v-if="meta.links.linkedin">
            <a :href="meta.links.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          </li>
          <li v-if="meta.links.github">
            <a :href="meta.links.github" target="_blank" rel="noopener">GitHub</a>
          </li>
          <li><NuxtLink to="/">Version classique</NuxtLink></li>
        </ul>
      </div>
    </div>

    <div class="refonte-container refonte-footer__bottom">
      <p>© {{ year }} {{ meta.name }} — Refonte expérimentale</p>
      <p>{{ sections.a_propos.availability }}</p>
    </div>
  </footer>
</template>

<style scoped>
.refonte-footer {
  padding: 4rem 0 2rem;
  border-top: 1px solid var(--rf-line);
  background: linear-gradient(180deg, transparent, rgba(26, 22, 18, 0.03));
}

.refonte-footer__grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .refonte-footer__grid {
    grid-template-columns: 1.4fr repeat(3, 1fr);
  }
}

.refonte-footer__title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.35rem 0;
}

.refonte-footer__role {
  color: var(--rf-muted);
  max-width: 22ch;
}

.refonte-footer__list,
.refonte-footer__tags {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  display: grid;
  gap: 0.45rem;
  font-size: 0.92rem;
}

.refonte-footer__list a {
  color: var(--rf-ink);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.refonte-footer__list a:hover {
  border-color: var(--rf-accent);
}

.refonte-footer__tags li {
  font-size: 0.82rem;
  color: var(--rf-ink-soft);
}

.refonte-footer__bottom {
  margin-top: 3rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--rf-line);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--rf-muted);
}
</style>
