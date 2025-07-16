<template>
  <div class="w-full" role="tablist" aria-label="Plating type selection">
    <!-- Tab Navigation -->
    <div class="flex flex-wrap gap-1 p-1 bg-slate-800 rounded-xl">
      <button
        v-for="(platingType, index) in platingTypes"
        :key="platingType.id"
        @click="selectPlatingType(platingType)"
        @keydown.arrow-left="focusPreviousTab(index)"
        @keydown.arrow-right="focusNextTab(index)"
        @keydown.home="focusFirstTab"
        @keydown.end="focusLastTab"
        :ref="el => tabRefs[index] = el"
        :class="tabClasses(platingType)"
        :aria-selected="selectedType?.id === platingType.id"
        :aria-controls="`panel-${platingType.id}`"
        :id="`tab-${platingType.id}`"
        :tabindex="selectedType?.id === platingType.id ? 0 : -1"
        role="tab"
      >
        <div class="flex flex-col items-center space-y-1 min-h-[3rem] justify-center">
          <span class="truncate text-center leading-tight">{{ platingType.name }}</span>
          <div
            v-if="platingType.setupFee"
            class="flex items-center space-x-1"
            :aria-label="`Setup fee: $${platingType.setupFee}`"
          >
            <svg
              class="w-3 h-3 text-amber-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-xs text-amber-400 font-medium">+${{ platingType.setupFee }}</span>
          </div>
        </div>
      </button>
    </div>

    <!-- Setup Fee Notice -->
    <div
      v-if="selectedType?.setupFee"
      :id="`panel-${selectedType.id}`"
      class="mt-4 p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl"
      role="tabpanel"
      :aria-labelledby="`tab-${selectedType.id}`"
    >
      <div class="flex items-start space-x-3">
        <svg
          class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <p class="text-sm text-amber-200 leading-relaxed">
            <span class="font-medium">{{ selectedType.name }}</span> includes a one-time setup fee of 
            <span class="font-semibold">${{ selectedType.setupFee }}</span>
          </p>
          <p class="text-xs text-amber-300 mt-1 opacity-90">
            This fee applies once per order regardless of quantity
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PlatingType } from '~/types/pricing';
import { PLATING_TYPES } from '~/data/pricing';

interface Props {
  selectedType?: PlatingType | null;
}

interface Emits {
  (e: 'update:selectedType', type: PlatingType): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedType: null
});

const emit = defineEmits<Emits>();

const platingTypes = PLATING_TYPES;
const tabRefs = ref<(HTMLElement | null)[]>([]);

const selectPlatingType = (type: PlatingType) => {
  try {
    if (!type || !type.id || !type.name || !type.pricing) {
      console.error('Invalid plating type:', type);
      return;
    }
    emit('update:selectedType', type);
  } catch (error) {
    console.error('Error selecting plating type:', error);
  }
};

// Keyboard navigation functions
const focusPreviousTab = (currentIndex: number) => {
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : platingTypes.length - 1;
  tabRefs.value[prevIndex]?.focus();
};

const focusNextTab = (currentIndex: number) => {
  const nextIndex = currentIndex < platingTypes.length - 1 ? currentIndex + 1 : 0;
  tabRefs.value[nextIndex]?.focus();
};

const focusFirstTab = () => {
  tabRefs.value[0]?.focus();
};

const focusLastTab = () => {
  tabRefs.value[platingTypes.length - 1]?.focus();
};

// Dynamic tab classes for better responsive design and accessibility
const tabClasses = (platingType: PlatingType) => {
  const isSelected = props.selectedType?.id === platingType.id;
  
  return [
    // Base classes
    'flex-1 min-w-0 px-2 py-2 xs:px-3 xs:py-2.5 sm:px-4 sm:py-3',
    'text-xs xs:text-sm font-medium rounded-lg',
    'transition-all duration-250 ease-in-out',
    'focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800',
    // Enhanced touch targets
    'min-h-[44px] min-w-[80px] xs:min-w-[100px]',
    // State-based styling
    isSelected
      ? [
          'bg-blue-550 text-white shadow-md',
          'high-contrast:bg-blue-700 high-contrast:border-2 high-contrast:border-blue-300'
        ].join(' ')
      : [
          'text-slate-300 bg-slate-700/50',
          'hover:text-white hover:bg-slate-700 hover:shadow-sm',
          'active:bg-slate-600 active:scale-95',
          'high-contrast:text-white high-contrast:bg-slate-800 high-contrast:border high-contrast:border-slate-300'
        ].join(' '),
    // Reduced motion support
    'reduced-motion:transition-none'
  ].join(' ');
};
</script>