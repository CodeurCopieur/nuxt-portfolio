<script setup lang="ts">
import { useGamificationStore } from '@/store/useGamification'

const props = defineProps<{
  sectionId: string
  label?: string
}>()

const gamification = useGamificationStore()
const sectionRef = ref<HTMLElement | null>(null)

const isDone = computed(() => gamification.homeSectionsSeen.includes(props.sectionId))

onMounted(() => {
  if (!sectionRef.value) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        gamification.discoverHomeSection(props.sectionId)
      }
    },
    { threshold: 0.35 }
  )
  observer.observe(sectionRef.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="sectionRef"
    class="section-quest-marker flex items-center justify-center gap-2 mb-6"
  >
    <span
      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
      :class="
        isDone
          ? 'border-emerald-400/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
          : 'border-sky-400/40 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300'
      "
    >
      <span>{{ isDone ? '✓' : '📍' }}</span>
      {{ label ?? 'Zone à explorer' }}
      <span
        v-if="!isDone"
        class="opacity-70"
      >— scrollez pour découvrir</span>
    </span>
  </div>
</template>
