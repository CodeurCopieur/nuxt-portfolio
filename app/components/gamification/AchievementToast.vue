<script setup lang="ts">
import { useGamificationStore } from '@/store/useGamification'

const gamification = useGamificationStore()
const toastRef = ref<HTMLElement | null>(null)

watch(
  () => gamification.toast,
  async (payload) => {
    if (!payload) return
    await nextTick()
    if (!toastRef.value) return
    const gsap = await useGsap()
    gsap.fromTo(
      toastRef.value,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }
    )
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="gamification.toast"
        ref="toastRef"
        class="fixed top-24 left-1/2 -translate-x-1/2 z-[70] w-[min(100vw-2rem,380px)]"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center gap-4 p-4 rounded-2xl border border-amber-300/60 dark:border-amber-600/40 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/90 dark:to-orange-950/90 backdrop-blur-xl shadow-2xl">
          <span class="text-3xl shrink-0">{{ gamification.toast.icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Succès débloqué !
            </p>
            <p class="font-bold text-gray-900 dark:text-white">{{ gamification.toast.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ gamification.toast.description }}</p>
          </div>
          <span class="shrink-0 px-2 py-1 rounded-lg bg-amber-400/30 text-amber-800 dark:text-amber-200 text-xs font-bold tabular-nums">
            +{{ gamification.toast.xp }} XP
          </span>
          <button
            type="button"
            class="shrink-0 p-1 text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
            @click="gamification.dismissToast()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
