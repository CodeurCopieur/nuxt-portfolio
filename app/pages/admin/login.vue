<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login, loading, error } = useAdminAuth()
const email = ref('')
const password = ref('')

async function handleSubmit() {
  const ok = await login(email.value, password.value)
  if (ok) {
    await navigateTo('/admin', { replace: true })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Portfolio</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">Connectez-vous pour gérer le contenu</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="admin@example.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <p class="text-center mt-6 text-sm text-gray-500">
        <NuxtLink to="/" class="hover:text-sky-500 transition-colors">← Retour au portfolio</NuxtLink>
      </p>
    </div>
  </div>
</template>
