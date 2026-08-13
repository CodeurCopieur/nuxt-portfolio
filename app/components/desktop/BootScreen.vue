<script setup lang="ts">
import { useDesktopStore } from '@/store/useDesktop'

const desktop = useDesktopStore()
const { meta } = useContent()

const progress = ref(0)
const phase = ref<'logo' | 'loading' | 'login'>('logo')

onMounted(() => {
  desktop.hydrateBoot()
  if (desktop.booted) return

  setTimeout(() => {
    phase.value = 'loading'
    const interval = setInterval(() => {
      progress.value += Math.random() * 18 + 4
      if (progress.value >= 100) {
        progress.value = 100
        clearInterval(interval)
        setTimeout(() => {
          phase.value = 'login'
        }, 400)
      }
    }, 120)
  }, 800)
})

async function login() {
  await desktop.boot()
}
</script>

<template>
  <div
    v-if="!desktop.booted"
    class="boot-screen fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
  >
    <div class="boot-bg absolute inset-0" />
    <div class="boot-grid absolute inset-0 opacity-30" />

    <div class="relative z-10 w-full max-w-md px-8 text-center">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="phase === 'logo'" key="logo" class="space-y-6">
          <div class="mx-auto w-24 h-24 rounded-[28px] bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 boot-logo">
            <span class="text-4xl font-black text-white">W</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">WiddyOS</h1>
            <p class="text-white/60 text-sm mt-2">Portfolio Experience System</p>
          </div>
        </div>

        <div v-else-if="phase === 'loading'" key="loading" class="space-y-8">
          <div class="mx-auto w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <div class="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
          <div class="space-y-3">
            <p class="text-white/80 text-sm font-medium">Initialisation du système…</p>
            <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-500 transition-all duration-300"
                :style="{ width: `${progress}%` }"
              />
            </div>
            <p class="text-white/40 text-xs tabular-nums">{{ Math.round(progress) }}%</p>
          </div>
        </div>

        <div v-else key="login" class="space-y-8">
          <div class="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-2xl shadow-orange-500/30">
            <div class="w-full h-full rounded-full bg-gray-900/90 flex items-center justify-center text-4xl font-bold text-white">
              {{ meta.name.charAt(0) }}
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-white">{{ meta.name }}</h2>
            <p class="text-white/50 text-sm mt-1">{{ meta.role }}</p>
          </div>
          <button
            type="button"
            class="group w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            :disabled="desktop.booting"
            @click="login"
          >
            <span v-if="desktop.booting" class="inline-flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connexion…
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <span>Se connecter</span>
              <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          <NuxtLink
            to="/"
            class="inline-block text-white/40 hover:text-white/70 text-xs transition-colors"
          >
            ← Retour au site classique
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.boot-screen {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

.boot-bg {
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%, rgba(56, 189, 248, 0.25), transparent),
    radial-gradient(ellipse 70% 50% at 80% 70%, rgba(139, 92, 246, 0.3), transparent),
    radial-gradient(ellipse 50% 40% at 50% 50%, rgba(251, 146, 60, 0.15), transparent),
    linear-gradient(160deg, #0f172a 0%, #1e1b4b 40%, #0c4a6e 100%);
}

.boot-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}

.boot-logo {
  animation: boot-pulse 2s ease-in-out infinite;
}

@keyframes boot-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.4); }
  50% { transform: scale(1.04); box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.6); }
}
</style>
