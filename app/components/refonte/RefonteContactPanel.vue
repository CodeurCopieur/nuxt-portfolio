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
  <div class="rf-contact">
    <span class="rf-contact__ghost" aria-hidden="true">03</span>

    <section class="refonte-container rf-contact__head refonte-section" data-scroll-section>
      <p class="refonte-label" v-reveal>Contact</p>
      <h1 class="refonte-display rf-contact__title" v-reveal="{ delay: 60 }">
        Parlons de <span class="refonte-serif rf-contact__title-serif">votre projet</span>
      </h1>
      <p class="rf-contact__lead" v-reveal="{ delay: 120 }">
        Prêt à collaborer ? Décrivez vos idées et voyons comment je peux vous aider à les concrétiser.
      </p>
    </section>

    <section class="refonte-container rf-contact__grid refonte-section" data-scroll-section>
      <aside class="rf-contact__info">
        <div class="rf-contact__info-item" v-reveal="{ index: 0, total: 3, stagger: 90 }">
          <span class="refonte-label">Email</span>
          <a :href="`mailto:${PUBLIC_CONTACT_EMAIL}`">{{ PUBLIC_CONTACT_EMAIL }}</a>
        </div>
        <div class="rf-contact__info-item" v-reveal="{ index: 1, total: 3, stagger: 90 }">
          <span class="refonte-label">Localisation</span>
          <p>{{ meta.location }}</p>
        </div>
        <div class="rf-contact__info-item" v-reveal="{ index: 2, total: 3, stagger: 90 }">
          <span class="refonte-label">Disponibilité</span>
          <p>Réponse sous 24h · {{ sections.a_propos.availability }}</p>
        </div>
      </aside>

      <form class="rf-contact__form" novalidate @submit.prevent="submit">
        <div class="rf-contact__field" v-reveal="{ index: 0, total: 4, stagger: 70 }">
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

        <div class="rf-contact__field" v-reveal="{ index: 1, total: 4, stagger: 70 }">
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

        <div class="rf-contact__field" v-reveal="{ index: 2, total: 4, stagger: 70 }">
          <label for="refonte-contact-message">Message *</label>
          <textarea
            id="refonte-contact-message"
            v-model="form.message"
            rows="5"
            required
            placeholder="Décrivez votre projet, vos besoins ou posez-moi vos questions..."
          />
        </div>

        <button
          type="submit"
          class="rf-contact__submit"
          :disabled="loading"
          v-reveal="{ index: 3, total: 4, stagger: 70 }"
        >
          <span v-if="!loading">Envoyer le message</span>
          <span v-else class="rf-contact__submit-loading">
            <LoadingPulse label="Envoi…" />
            Envoi en cours…
          </span>
        </button>

        <div v-if="success === true" class="rf-contact__alert rf-contact__alert--ok">
          <p>Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.</p>
        </div>

        <div v-else-if="success === false" class="rf-contact__alert rf-contact__alert--err">
          <p>{{ errorMessage || 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.' }}</p>
        </div>

        <div v-if="errorMessage && success === null" class="rf-contact__alert rf-contact__alert--warn">
          <p>{{ errorMessage }}</p>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.rf-contact {
  position: relative;
  overflow: clip;
}

.rf-contact__ghost {
  position: absolute;
  top: -1rem;
  right: max(0.5rem, calc((100vw - var(--rf-container-max)) / -2));
  font-family: var(--rf-serif);
  font-style: italic;
  font-size: clamp(5rem, 16vw, 13rem);
  line-height: 1;
  color: var(--rf-text);
  opacity: 0.05;
  pointer-events: none;
}

.rf-contact__head {
  position: relative;
  padding-bottom: clamp(2rem, 5vw, 3rem);
}

.rf-contact__title {
  margin: 0.35rem 0 0.75rem;
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  max-width: 20ch;
}

.rf-contact__title-serif {
  color: var(--rf-accent);
}

.rf-contact__lead {
  max-width: 44ch;
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.65;
  color: var(--rf-text-soft);
}

.rf-contact__grid {
  position: relative;
  padding-top: clamp(2rem, 5vw, 3rem);
  border-top: 1px solid var(--rf-line);
  display: grid;
  gap: clamp(2.5rem, 6vw, 3.5rem);
}

@media (min-width: 960px) {
  .rf-contact__grid {
    grid-template-columns: 1fr 1.4fr;
  }
}

.rf-contact__info {
  display: grid;
  gap: clamp(1.75rem, 4vw, 2.5rem);
  align-content: start;
}

@media (min-width: 960px) {
  .rf-contact__info {
    position: sticky;
    top: calc(var(--rf-nav-h) + 2rem);
  }
}

.rf-contact__info-item {
  display: grid;
  gap: 0.35rem;
}

.rf-contact__info-item a,
.rf-contact__info-item p {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--rf-text);
  text-decoration: none;
}

.rf-contact__info-item a:hover {
  color: var(--rf-accent);
}

.rf-contact__form {
  display: grid;
  gap: 1.35rem;
  align-content: start;
}

.rf-contact__field {
  display: grid;
  gap: 0.5rem;
}

.rf-contact__field label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--rf-text-muted);
}

.rf-contact__field input,
.rf-contact__field textarea {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid var(--rf-line);
  border-radius: 0;
  padding: 0.75rem 0;
  background: transparent;
  color: var(--rf-text);
  font: inherit;
  resize: none;
  transition: border-color 0.3s var(--rf-ease);
}

.rf-contact__field input:focus,
.rf-contact__field textarea:focus {
  outline: none;
  border-color: var(--rf-accent);
}

.rf-contact__field input::placeholder,
.rf-contact__field textarea::placeholder {
  color: var(--rf-text-muted);
}

.rf-contact__submit {
  justify-self: start;
  margin-top: 0.5rem;
  border: none;
  border-radius: 999px;
  padding: 0.95rem 1.75rem;
  background: var(--rf-accent);
  color: var(--rf-ink);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.25s var(--rf-ease), transform 0.2s var(--rf-ease);
}

.rf-contact__submit:hover:not(:disabled) {
  background: var(--rf-accent-deep);
  transform: translateY(-2px);
}

.rf-contact__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rf-contact__submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.rf-contact__alert {
  padding: 0.85rem 1rem;
  border-radius: 0.65rem;
  font-size: 0.88rem;
  line-height: 1.5;
}

.rf-contact__alert p {
  margin: 0;
}

.rf-contact__alert--ok {
  background: rgba(138, 154, 120, 0.14);
  border: 1px solid rgba(138, 154, 120, 0.35);
  color: var(--rf-sage);
}

.rf-contact__alert--err {
  background: rgba(var(--rf-accent-deep-rgb), 0.12);
  border: 1px solid rgba(var(--rf-accent-deep-rgb), 0.32);
  color: var(--rf-accent);
}

.rf-contact__alert--warn {
  background: rgba(194, 172, 130, 0.14);
  border: 1px solid rgba(194, 172, 130, 0.35);
  color: var(--rf-gold);
}
</style>
