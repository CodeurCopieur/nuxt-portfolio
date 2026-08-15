<script setup lang="ts">
const { sections } = useContent()

const items = computed(() => {
  const stacks = sections.value.competences
  const order = sections.value.competences_order ?? Object.keys(stacks)
  return order.flatMap((key) => (stacks[key] ?? []).slice(0, 4))
})
</script>

<template>
  <div class="refonte-marquee" data-scroll-section aria-hidden="true">
    <div class="refonte-marquee__track">
      <span v-for="(item, i) in [...items, ...items]" :key="`${item}-${i}`">{{ item }}</span>
    </div>
  </div>
</template>

<style scoped>
.refonte-marquee {
  overflow: hidden;
  border-block: 1px solid var(--rf-line);
  background: var(--rf-paper);
  padding: 0.85rem 0;
}

.refonte-marquee__track {
  display: flex;
  gap: 2.5rem;
  width: max-content;
  animation: rf-marquee 38s linear infinite;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rf-muted);
}

.refonte-marquee__track span::after {
  content: '◆';
  margin-left: 2.5rem;
  color: var(--rf-accent);
  font-size: 0.55rem;
  vertical-align: middle;
}

@keyframes rf-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .refonte-marquee__track {
    animation: none;
    flex-wrap: wrap;
    width: auto;
    justify-content: center;
  }
}
</style>
