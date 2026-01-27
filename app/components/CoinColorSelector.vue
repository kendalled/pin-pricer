<template>
  <div class="w-full" role="tablist" aria-label="Coin color option selection">
    <!-- Tab Navigation -->
    <div class="grid grid-cols-1 xs:grid-cols-3 gap-3 xs:gap-4">
      <label
        v-for="(colorOption, index) in colorOptions"
        :key="colorOption.id"
        :class="getOptionClasses(selectedColorOption?.id === colorOption.id)"
        @keydown.enter="selectColorOption(colorOption)"
        @keydown.space.prevent="selectColorOption(colorOption)"
        @keydown.arrow-left="focusPreviousTab(index)"
        @keydown.arrow-right="focusNextTab(index)"
        @keydown.home="focusFirstTab"
        @keydown.end="focusLastTab"
        :ref="el => tabRefs[index] = el"
        :aria-selected="selectedColorOption?.id === colorOption.id"
        :aria-controls="`panel-${colorOption.id}`"
        :id="`tab-${colorOption.id}`"
        :tabindex="selectedColorOption?.id === colorOption.id ? 0 : -1"
        role="tab"
      >
        <input
          type="radio"
          name="color-option"
          :value="colorOption.id"
          :checked="selectedColorOption?.id === colorOption.id"
          @change="selectColorOption(colorOption)"
          class="sr-only"
        />
        <div class="flex-1 min-w-0 hover-lift">
          <div class="flex flex-col items-center space-y-1 min-h-[3rem] justify-center">
            <span class="font-medium text-sm xs:text-base leading-tight text-center">{{ colorOption.name }}</span>
          </div>
        </div>
      </label>
    </div>

    <div class="border-t border-slate-700 my-4"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CoinColorOption } from '~/types/pricing';
import { COIN_COLOR_OPTIONS } from '~/data/pricing';

interface Props {
  selectedColorOption?: CoinColorOption | null;
}

interface Emits {
  (e: 'update:selectedColorOption', colorOption: CoinColorOption): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedColorOption: null
});

const emit = defineEmits<Emits>();

const colorOptions = COIN_COLOR_OPTIONS;
const tabRefs = ref<(HTMLElement | null)[]>([]);

const selectColorOption = (colorOption: CoinColorOption) => {
  try {
    if (!colorOption || !colorOption.id || !colorOption.name || !colorOption.pricing) {
      console.error('Invalid color option:', colorOption);
      return;
    }
    emit('update:selectedColorOption', colorOption);
  } catch (error) {
    console.error('Error selecting color option:', error);
  }
};

// Keyboard navigation functions
const focusPreviousTab = (currentIndex: number) => {
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : colorOptions.length - 1;
  tabRefs.value[prevIndex]?.focus();
};

const focusNextTab = (currentIndex: number) => {
  const nextIndex = currentIndex < colorOptions.length - 1 ? currentIndex + 1 : 0;
  tabRefs.value[nextIndex]?.focus();
};

const focusFirstTab = () => {
  tabRefs.value[0]?.focus();
};

const focusLastTab = () => {
  tabRefs.value[colorOptions.length - 1]?.focus();
};

// Option classes matching ProductionMethodSelector styling
const getOptionClasses = (isSelected: boolean): string => {
  const baseClasses = [
    'relative flex items-center p-3 xs:p-4 border rounded-xl cursor-pointer',
    'transition-all duration-250 ease-in-out',
    'focus-within:ring-3 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
    'min-h-[44px]', // Enhanced touch target
    'reduced-motion:transition-none'
  ].join(' ');
  
  if (isSelected) {
    return [
      baseClasses,
      'bg-blue-900/40 border-blue-400 text-blue-200 shadow-md accent-ring accent-glow',
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
