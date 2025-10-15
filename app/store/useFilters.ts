// store/useFilters.ts
import { defineStore } from 'pinia'

export const useFilters = defineStore('filters', () => {
  const selectedStacks = ref<string[]>([])
  
  function toggleStack(s: string) {
    const i = selectedStacks.value.indexOf(s)
    i === -1 ? selectedStacks.value.push(s) : selectedStacks.value.splice(i, 1)
  }
  
  function clearStacks() {
    selectedStacks.value = []
  }
  
  return { selectedStacks, toggleStack, clearStacks }
})