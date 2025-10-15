<!-- pages/contact.vue -->
<script setup lang="ts">
const { meta } = useContent()

useHead({
  title: `Contact — ${meta.name}`
})

const form = reactive({ name: '', email: '', message: '' })
const loading = ref(false)
const success = ref<boolean|null>(null)
const errorMessage = ref('')

// Configuration EmailJS (remplacez par vos vraies valeurs)
const EMAILJS_SERVICE_ID = 'service_dinz4nd'
const EMAILJS_TEMPLATE_ID = 'template_z6ywdca'
const EMAILJS_PUBLIC_KEY = 'PzyeC_3pPptaLgGuF'

async function submit() {
  loading.value = true
  success.value = null
  errorMessage.value = ''
  
  try {
    // Validation des champs
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      errorMessage.value = 'Veuillez remplir tous les champs obligatoires.'
      return
    }

    // Import dynamique d'EmailJS
    const emailjs = await import('@emailjs/browser')
    
    // Envoyer l'email
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
        to_name: 'Boss', // Votre nom
        reply_to: form.email
      },
      EMAILJS_PUBLIC_KEY
    )
    
    console.log('Email envoyé avec succès:', result)
    success.value = true
    
    // Réinitialiser le formulaire
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (e) {
    console.error('Erreur lors de l\'envoi:', e)
    success.value = false
    errorMessage.value = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 overflow-hidden">
      <!-- Éléments décoratifs -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-sky-200/30 dark:bg-sky-800/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Contactez <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Moi</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Prêt à collaborer sur votre prochain projet ? Parlons de vos idées et voyons comment je peux vous aider à les concrétiser.
        </p>
        <div class="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span class="flex items-center gap-2">
            <div class="w-2 h-2 bg-sky-500 rounded-full"></div>
            Réponse rapide
          </span>
          <span class="flex items-center gap-2">
            <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
            Projet sur mesure
          </span>
        </div>
      </div>
    </section>

    <!-- Formulaire Section -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Informations de contact -->
          <div class="space-y-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Parlons de votre <span class="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Projet</span>
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Que vous ayez une idée précise ou que vous souhaitiez simplement explorer les possibilités, je suis là pour vous accompagner.
              </p>
            </div>

            <!-- Informations de contact -->
            <div class="space-y-6">
              <div class="flex items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div class="w-12 h-12 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p class="text-gray-600 dark:text-gray-400">louis@example.com</p>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div class="w-12 h-12 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Localisation</h3>
                  <p class="text-gray-600 dark:text-gray-400">Paris, France</p>
                </div>
              </div>

              <div class="flex items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div class="w-12 h-12 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">Disponibilité</h3>
                  <p class="text-gray-600 dark:text-gray-400">Réponse sous 24h</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulaire -->
          <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl">
            <form @submit.prevent="submit" class="space-y-6" novalidate>
              <!-- Nom -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Nom complet *
                </label>
                <input 
                  v-model="form.name" 
                  required 
                  type="text"
                  class="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 dark:focus:ring-sky-500/50 dark:focus:border-sky-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Votre nom complet"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Email *
                </label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required 
                  class="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 dark:focus:ring-sky-500/50 dark:focus:border-sky-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="votre@email.com"
                />
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Message *
                </label>
                <textarea 
                  v-model="form.message" 
                  rows="5" 
                  required 
                  class="w-full px-4 py-3 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 dark:focus:ring-sky-500/50 dark:focus:border-sky-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                  placeholder="Décrivez votre projet, vos besoins ou posez-moi vos questions..."
                ></textarea>
              </div>

              <!-- Bouton d'envoi -->
              <button 
                :disabled="loading" 
                class="w-full px-6 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span v-if="!loading" class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Envoyer le message
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <LoadingPulse label="Envoi…" />
                  Envoi en cours...
                </span>
              </button>

              <!-- Messages de statut -->
              <div v-if="success === true" class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-green-800 dark:text-green-200 font-medium">Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.</p>
                </div>
              </div>
              
              <div v-else-if="success === false" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-red-800 dark:text-red-200 font-medium">{{ errorMessage || 'Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.' }}</p>
                </div>
              </div>

              <!-- Message d'erreur de validation -->
              <div v-if="errorMessage && success !== true" class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <p class="text-orange-800 dark:text-orange-200 font-medium">{{ errorMessage }}</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>