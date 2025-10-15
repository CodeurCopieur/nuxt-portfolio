<!-- components/ExperienceFilter.vue -->
<script setup lang="ts">
import { useFilters } from '@/store/useFilters'
const props = defineProps<{ stacks: string[] }>()
const filters = useFilters()
</script>

<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Filtrer par technologie
    </h3>
    <div class="flex flex-wrap gap-3">
      <label 
        v-for="s in props.stacks" 
        :key="s" 
        class="relative flex items-center cursor-pointer group"
      >
        <input 
          type="checkbox" 
          class="sr-only"
          :value="s"
          :checked="filters.selectedStacks.includes(s)"
          @change="filters.toggleStack(s)" 
        />
        
        <!-- Checkbox personnalisée -->
        <div 
          class="w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center group-hover:scale-110"
          :class="[
            filters.selectedStacks.includes(s)
              ? 'bg-white border-sky-400 dark:border-sky-500'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-gray-400 dark:group-hover:border-gray-500'
          ]"
        >
          <!-- Icône de check -->
          <svg 
            v-if="filters.selectedStacks.includes(s)"
            class="w-2.5 h-2.5 text-sky-600 dark:text-sky-400 transition-all duration-200"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fill-rule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clip-rule="evenodd" 
            />
          </svg>
        </div>
        
        <!-- Label -->
        <span 
          class="ml-2.5 text-sm font-medium transition-colors duration-200"
          :class="[
            filters.selectedStacks.includes(s)
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
          ]"
        >
          {{ s }}
        </span>
      </label>
    </div>
    
    <!-- Bouton pour tout désélectionner -->
    <div class="mt-4">
      <button
        @click="filters.clearStacks"
        class="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Tout désélectionner
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Animation d'entrée pour les checkboxes */
label {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Délai d'animation pour chaque checkbox */
label:nth-child(1) { animation-delay: 0.1s; }
label:nth-child(2) { animation-delay: 0.2s; }
label:nth-child(3) { animation-delay: 0.3s; }
label:nth-child(4) { animation-delay: 0.4s; }
label:nth-child(5) { animation-delay: 0.5s; }
label:nth-child(6) { animation-delay: 0.6s; }
label:nth-child(7) { animation-delay: 0.7s; }
label:nth-child(8) { animation-delay: 0.8s; }
</style>