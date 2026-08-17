<script setup lang="ts">
defineProps<{
  chapter?: string
  chapterGap?: boolean
  scrollSection?: boolean
  /** Sans padding vertical (sections sticky / plein viewport). */
  flush?: boolean
}>()

const rootRef = ref<HTMLElement | null>(null)

defineExpose({ el: rootRef })
</script>

<template>
  <section
    ref="rootRef"
    class="refonte-section"
    :class="{
      'refonte-section--chapter': chapterGap,
      'refonte-section--flush': flush
    }"
    :data-scroll-section="scrollSection !== false ? '' : undefined"
    :data-rf-chapter="chapter"
  >
    <slot />
  </section>
</template>
