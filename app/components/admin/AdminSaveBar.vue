<script setup lang="ts">
defineProps<{
  saving?: boolean
  message?: string | null
}>()
</script>

<template>
  <div class="pt-4">
    <p v-if="message" :class="message.includes('succès') ? 'text-green-600' : 'text-red-500'" class="text-sm mb-3">
      {{ message }}
    </p>
    <button
      type="submit"
      :disabled="saving"
      class="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-sky-600 hover:to-indigo-700 transition-all disabled:opacity-50"
    >
      {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
    </button>
  </div>
</template>
