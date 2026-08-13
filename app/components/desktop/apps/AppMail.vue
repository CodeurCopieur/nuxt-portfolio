<script setup lang="ts">
import { useGamificationStore } from '@/store/useGamification'

const { meta } = useContent()
const gamification = useGamificationStore()

const folder = ref<'inbox' | 'compose'>('inbox')
const form = reactive({ name: '', email: '', message: '' })
const loading = ref(false)
const success = ref<boolean | null>(null)
const errorMessage = ref('')

const EMAILJS_SERVICE_ID = 'service_dinz4nd'
const EMAILJS_TEMPLATE_ID = 'template_z6ywdca'
const EMAILJS_PUBLIC_KEY = 'PzyeC_3pPptaLgGuF'

const inboxMessages = computed(() => [
  {
    id: 'welcome',
    from: 'Widdy',
    subject: 'Bienvenue sur WiddyOS Mail',
    preview: 'Explorez le bureau, gagnez de l\'XP et envoyez-moi un message pour la quête finale…',
    date: 'Aujourd\'hui',
    unread: true
  },
  {
    id: 'quest',
    from: 'Système',
    subject: '🏆 Quête finale — +150 XP',
    preview: 'Composez un nouveau message pour débloquer le succès ultime et contacter Widdy.',
    date: 'Quête',
    unread: !gamification.contactSent
  }
])

async function submit() {
  loading.value = true
  success.value = null
  errorMessage.value = ''

  try {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      errorMessage.value = 'Veuillez remplir tous les champs.'
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
        to_name: 'Boss',
        reply_to: form.email
      },
      EMAILJS_PUBLIC_KEY
    )

    success.value = true
    gamification.completeContactQuest()
    form.name = ''
    form.email = ''
    form.message = ''
    folder.value = 'inbox'
  } catch {
    success.value = false
    errorMessage.value = 'Erreur d\'envoi. Réessayez.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app-mail flex h-full min-h-[400px] text-white">
    <aside class="w-44 shrink-0 border-r border-white/10 bg-black/20 p-3 flex flex-col gap-1">
      <button
        type="button"
        class="w-full py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-semibold transition-colors mb-3"
        @click="folder = 'compose'"
      >
        ✏️ Nouveau
      </button>
      <button
        type="button"
        class="w-full py-2 px-3 rounded-lg text-left text-sm transition-colors"
        :class="folder === 'inbox' ? 'bg-white/15' : 'hover:bg-white/5 text-white/70'"
        @click="folder = 'inbox'"
      >
        📥 Boîte de réception
      </button>
      <button
        type="button"
        class="w-full py-2 px-3 rounded-lg text-left text-sm transition-colors"
        :class="folder === 'compose' ? 'bg-white/15' : 'hover:bg-white/5 text-white/70'"
        @click="folder = 'compose'"
      >
        ✉️ Composer
      </button>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="shrink-0 px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <span class="text-lg">✉️</span>
        <span class="font-semibold text-sm">Mail — {{ meta.email }}</span>
      </header>

      <div v-if="folder === 'inbox'" class="flex-1 overflow-y-auto">
        <button
          v-for="msg in inboxMessages"
          :key="msg.id"
          type="button"
          class="w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors"
          @click="folder = 'compose'"
        >
          <div class="flex items-center justify-between gap-2 mb-0.5">
            <span class="text-sm font-semibold" :class="msg.unread ? 'text-white' : 'text-white/60'">
              {{ msg.from }}
            </span>
            <span class="text-[10px] text-white/30">{{ msg.date }}</span>
          </div>
          <p class="text-xs font-medium text-white/80 truncate">{{ msg.subject }}</p>
          <p class="text-[11px] text-white/40 truncate mt-0.5">{{ msg.preview }}</p>
        </button>
      </div>

      <form
        v-else
        class="flex-1 overflow-y-auto p-5 space-y-4"
        @submit.prevent="submit"
      >
        <div>
          <label class="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Destinataire</label>
          <input
            type="text"
            readonly
            :value="meta.email"
            class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60"
          />
        </div>
        <div>
          <label class="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Votre nom *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-sky-500/50 outline-none"
          />
        </div>
        <div>
          <label class="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Votre email *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-sky-500/50 outline-none"
          />
        </div>
        <div>
          <label class="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Message *</label>
          <textarea
            v-model="form.message"
            rows="6"
            required
            placeholder="Décrivez votre projet, votre besoin…"
            class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-sky-500/50 outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {{ loading ? 'Envoi…' : '🏆 Envoyer & compléter la quête (+150 XP)' }}
        </button>
        <p v-if="success" class="text-emerald-400 text-sm font-medium">Message envoyé ! Quête finale réussie.</p>
        <p v-if="errorMessage && !success" class="text-red-400 text-sm">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
