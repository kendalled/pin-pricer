<template>
  <div class="w-full">
    <h3 class="text-lg font-semibold text-slate-200 mb-4">Plating Type</h3>
    
    <!-- Plating Options Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      <label
        v-for="platingOption in platingOptions"
        :key="platingOption.id"
        :class="getOptionClasses(selectedPlating?.id === platingOption.id)"
        class="cursor-pointer"
      >
        <input
          type="radio"
          name="plating-type"
          :value="platingOption.id"
          :checked="selectedPlating?.id === platingOption.id"
          @change="selectPlatingOption(platingOption)"
          class="sr-only"
        />
        <div class="flex-1 min-w-0 hover-lift">
          <div class="flex flex-col items-center space-y-2 min-h-[4rem] justify-center p-3">
            <span class="font-medium text-sm text-center leading-tight">{{ platingOption.name }}</span>
            <div class="flex items-center space-x-1">
              <span 
                v-if="platingOption.isFree" 
                class="text-xs font-semibold text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full"
              >
                FREE
              </span>
              <span 
                v-else 
                class="text-xs font-semibold text-amber-400 bg-amber-900/30 px-2 py-1 rounded-full"
              >
                +${{ platingOption.price.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </label>
    </div>
    <div class="border-t border-slate-700 my-4"></div>
  </div>
</template>

<script setup lang="ts">
import type { PlatingOption } from '~/types/pricing';
import { PLATING_OPTIONS } from '~/data/pricing';

interface Props {
  selectedPlating?: PlatingOption | null;
}

interface Emits {
  (e: 'update:selectedPlating', plating: PlatingOption): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedPlating: null
});

const emit = defineEmits<Emits>();

const platingOptions = PLATING_OPTIONS;

const selectPlatingOption = (plating: PlatingOption) => {
  try {
    if (!plating || !plating.id || !plating.name) {
      console.error('Invalid plating option:', plating);
      return;
    }
    emit('update:selectedPlating', plating);
  } catch (error) {
    console.error('Error selecting plating option:', error);
  }
};

// Option classes matching ModificationsPanel styling
const getOptionClasses = (isSelected: boolean): string => {
  const baseClasses = [
    'relative flex items-center border rounded-xl',
    'transition-all duration-250 ease-in-out',
    'focus-within:ring-3 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
    'min-h-[44px]', // Enhanced touch target
    'reduced-motion:transition-none'
  ].join(' ');
  
  if (isSelected) {
    return [
      baseClasses,
      'bg-blue-900/30 bg-blue-900/40 border-blue-500 border-blue-400 text-blue-200 shadow-md accent-ring accent-glow',
      'high-contrast:bg-blue-800 high-contrast:border-blue-300 high-contrast:text-white'
    ].join(' ');
  }
  
  return [
    baseClasses,
    'bg-slate-800/90 border-slate-600 text-slate-300 gradient-surface',
    'hover:bg-slate-700/60 hover:border-slate-500 hover:text-slate-200 hover:shadow-md',
    'active:bg-slate-700 active:scale-95',
    'high-contrast:bg-slate-950 high-contrast:border-slate-300 high-contrast:text-white'
  ].join(' ');
};
</script>