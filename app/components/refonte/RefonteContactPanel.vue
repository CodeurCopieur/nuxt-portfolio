<script setup lang="ts">
import { PUBLIC_CONTACT_EMAIL } from '@/constants/contact'

const { meta, sections } = useContent()

const form = reactive({ name: '', email: '', message: '' })
const loading = ref(false)
const success = ref<boolean | null>(null)
const errorMessage = ref('')

const EMAILJS_SERVICE_ID = 'service_dinz4nd'
const EMAILJS_TEMPLATE_ID = 'template_z6ywdca'
const EMAILJS_PUBLIC_KEY = 'PzyeC_3pPptaLgGuF'

async function submit() {
  loading.value = true
  success.value = null
  errorMessage.value = ''

  try {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
      return
    }

    const emailjs = await import('@emailjs/browser')
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
        to_name: meta.value.name,
        reply_to: form.email
      },
      EMAILJS_PUBLIC_KEY
    )

    success.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch {
    success.value = false
    errorMessage.value = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="refonte-contact-page">
    <!-- Hero -->
    <section class="refonte-contact-hero" data-scroll-section>
      <div class="refonte-contact-hero__glow refonte-contact-hero__glow--a" aria-hidden="true" />
      <div class="refonte-contact-hero__glow refonte-contact-hero__glow--b" aria-hidden="true" />

      <div class="refonte-container refonte-contact-hero__inner">
        <h1 class="refonte-display refonte-contact-hero__title">
          Contactez <span class="refonte-gradient-text">Moi</span>
        </h1>
        <p class="refonte-contact-hero__lead">
          Prêt à collaborer sur votre prochain projet ? Parlons de vos idées et voyons comment je peux vous aider à les concrétiser.
        </p>
        <div class="refonte-contact-hero__badges">
          <span class="refonte-contact-hero__badge">
            <span class="refonte-contact-hero__dot refonte-contact-hero__dot--a" />
            Réponse rapide
          </span>
          <span class="refonte-contact-hero__badge">
            <span class="refonte-contact-hero__dot refonte-contact-hero__dot--b" />
            Projet sur mesure
          </span>
        </div>
      </div>
    </section>

    <!-- Infos + formulaire -->
    <section class="refonte-contact-body" data-scroll-section>
      <div class="refonte-container refonte-contact-body__grid">
        <!-- Colonne gauche -->
        <div class="refonte-contact-info">
          <div class="refonte-contact-info__intro">
            <h2 class="refonte-display refonte-contact-info__title">
              Parlons de votre <span class="refonte-gradient-text">Projet</span>
            </h2>
            <p class="refonte-contact-info__text">
              Que vous ayez une idée précise ou que vous souhaitiez simplement explorer les possibilités, je suis là pour vous accompagner.
            </p>
          </div>

          <div class="refonte-contact-info__cards">
            <article class="refonte-contact-card refonte-card">
              <div class="refonte-contact-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3>Email</h3>
                <a :href="`mailto:${PUBLIC_CONTACT_EMAIL}`">{{ PUBLIC_CONTACT_EMAIL }}</a>
              </div>
            </article>

            <article class="refonte-contact-card refonte-card">
              <div class="refonte-contact-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3>Localisation</h3>
                <p>{{ meta.location }}</p>
              </div>
            </article>

            <article class="refonte-contact-card refonte-card">
              <div class="refonte-contact-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3>Disponibilité</h3>
                <p>Réponse sous 24h · {{ sections.a_propos.availability }}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- Colonne droite : formulaire -->
        <div class="refonte-contact-form-wrap refonte-card">
          <form class="refonte-contact-form" novalidate @submit.prevent="submit">
            <div class="refonte-contact-form__field">
              <label for="refonte-contact-name">Nom complet *</label>
              <input
                id="refonte-contact-name"
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                placeholder="Votre nom complet"
              >
            </div>

            <div class="refonte-contact-form__field">
              <label for="refonte-contact-email">Email *</label>
              <input
                id="refonte-contact-email"
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="votre@email.com"
              >
            </div>

            <div class="refonte-contact-form__field">
              <label for="refonte-contact-message">Message *</label>
              <textarea
                id="refonte-contact-message"
                v-model="form.message"
                rows="5"
                required
                placeholder="Décrivez votre projet, vos besoins ou posez-moi vos questions..."
              />
            </div>

            <button type="submit" class="refonte-contact-form__submit" :disabled="loading">
              <span v-if="!loading" class="refonte-contact-form__submit-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Envoyer le message
              </span>
              <span v-else class="refonte-contact-form__submit-inner">
                <LoadingPulse label="Envoi…" />
                Envoi en cours…
              </span>
            </button>

            <div v-if="success === true" class="refonte-contact-alert refonte-contact-alert--ok">
              <p>Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.</p>
            </div>

            <div v-else-if="success === false" class="refonte-contact-alert refonte-contact-alert--err">
              <p>{{ errorMessage || 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.' }}</p>
            </div>

            <div v-if="errorMessage && success === null" class="refonte-contact-alert refonte-contact-alert--warn">
              <p>{{ errorMessage }}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.refonte-gradient-text {
  color: var(--rf-accent);
  font-style: italic;
}

/* Hero */
.refonte-contact-hero {
  position: relative;
  padding: clamp(3rem, 8vw, 5rem) 0;
  overflow: hidden;
  text-align: center;
}

.refonte-contact-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.refonte-contact-hero__glow--a {
  width: 18rem;
  height: 18rem;
  top: -4rem;
  left: -2rem;
  background: rgba(184, 67, 47, 0.12);
}

.refonte-contact-hero__glow--b {
  width: 22rem;
  height: 22rem;
  bottom: -6rem;
  right: -3rem;
  background: rgba(74, 107, 93, 0.14);
}

.refonte-contact-hero__inner {
  position: relative;
  z-index: 1;
}

.refonte-contact-hero__title {
  font-size: clamp(2.5rem, 7vw, 4rem);
  margin-bottom: 1rem;
}

.refonte-contact-hero__lead {
  max-width: 42rem;
  margin: 0 auto 1.5rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--rf-muted);
}

.refonte-contact-hero__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 1.5rem;
  font-size: 0.82rem;
  color: var(--rf-muted);
}

.refonte-contact-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.refonte-contact-hero__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
}

.refonte-contact-hero__dot--a { background: var(--rf-accent); }
.refonte-contact-hero__dot--b { background: var(--rf-sage); }

/* Body grid */
.refonte-contact-body {
  padding: clamp(2rem, 6vw, 4rem) 0 clamp(3rem, 8vw, 5rem);
}

.refonte-contact-body__grid {
  display: grid;
  gap: 2.5rem;
}

@media (min-width: 1024px) {
  .refonte-contact-body__grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
}

/* Colonne infos */
.refonte-contact-info__title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  margin-bottom: 0.75rem;
}

.refonte-contact-info__text {
  font-size: 1rem;
  line-height: 1.65;
  color: var(--rf-ink-soft);
  margin-bottom: 2rem;
  max-width: 36ch;
}

.refonte-contact-info__cards {
  display: grid;
  gap: 1rem;
}

.refonte-contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.refonte-contact-card__icon {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.85rem;
  background: rgba(184, 67, 47, 0.08);
  color: var(--rf-accent);
}

.refonte-contact-card__icon svg {
  width: 1.4rem;
  height: 1.4rem;
}

.refonte-contact-card h3 {
  font-size: 0.92rem;
  font-weight: 700;
  margin-bottom: 0.15rem;
}

.refonte-contact-card p,
.refonte-contact-card a {
  font-size: 0.88rem;
  color: var(--rf-muted);
  margin: 0;
  text-decoration: none;
}

.refonte-contact-card a:hover {
  color: var(--rf-accent);
}

/* Formulaire */
.refonte-contact-form-wrap {
  padding: 1.75rem;
}

.refonte-contact-form {
  display: grid;
  gap: 1.25rem;
}

.refonte-contact-form__field {
  display: grid;
  gap: 0.45rem;
}

.refonte-contact-form__field label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--rf-ink);
}

.refonte-contact-form__field input,
.refonte-contact-form__field textarea {
  width: 100%;
  border: 1px solid var(--rf-line);
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.55);
  color: var(--rf-ink);
  font: inherit;
  resize: none;
}

.refonte-contact-form__field input:focus,
.refonte-contact-form__field textarea:focus {
  outline: 2px solid rgba(184, 67, 47, 0.3);
  border-color: var(--rf-accent);
}

.refonte-contact-form__field input::placeholder,
.refonte-contact-form__field textarea::placeholder {
  color: rgba(122, 114, 104, 0.75);
}

.refonte-contact-form__submit {
  width: 100%;
  border: none;
  border-radius: 0.85rem;
  padding: 0.95rem 1.25rem;
  background: var(--rf-ink);
  color: var(--rf-paper);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.2s ease;
}

.refonte-contact-form__submit:hover:not(:disabled) {
  background: var(--rf-accent);
  transform: translateY(-1px);
}

.refonte-contact-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refonte-contact-form__submit-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.refonte-contact-form__submit-inner svg {
  width: 1.1rem;
  height: 1.1rem;
}

.refonte-contact-alert {
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  font-size: 0.88rem;
  line-height: 1.5;
}

.refonte-contact-alert p { margin: 0; }

.refonte-contact-alert--ok {
  background: rgba(74, 107, 93, 0.12);
  border: 1px solid rgba(74, 107, 93, 0.25);
  color: var(--rf-sage);
}

.refonte-contact-alert--err {
  background: rgba(184, 67, 47, 0.1);
  border: 1px solid rgba(184, 67, 47, 0.25);
  color: var(--rf-accent-deep);
}

.refonte-contact-alert--warn {
  background: rgba(184, 149, 74, 0.12);
  border: 1px solid rgba(184, 149, 74, 0.28);
  color: #7a5c1e;
}
</style>
