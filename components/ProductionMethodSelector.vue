<template>
  <div class="w-full" role="tablist" aria-label="Production method selection">
    <!-- Tab Navigation -->
    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 xs:gap-4">
      <label
        v-for="(productionMethod, index) in productionMethods"
        :key="productionMethod.id"
        :class="getOptionClasses(selectedMethod?.id === productionMethod.id)"
        @keydown.enter="selectProductionMethod(productionMethod)"
        @keydown.space.prevent="selectProductionMethod(productionMethod)"
        @keydown.arrow-left="focusPreviousTab(index)"
        @keydown.arrow-right="focusNextTab(index)"
        @keydown.home="focusFirstTab"
        @keydown.end="focusLastTab"
        :ref="el => tabRefs[index] = el"
        :aria-selected="selectedMethod?.id === productionMethod.id"
        :aria-controls="`panel-${productionMethod.id}`"
        :id="`tab-${productionMethod.id}`"
        :tabindex="selectedMethod?.id === productionMethod.id ? 0 : -1"
        role="tab"
      >
        <input
          type="radio"
          name="production-method"
          :value="productionMethod.id"
          :checked="selectedMethod?.id === productionMethod.id"
          @change="selectProductionMethod(productionMethod)"
          class="sr-only"
        />
        <div class="flex-1 min-w-0 hover-lift">
          <div class="flex flex-col items-center space-y-1 min-h-[3rem] justify-center">
            <span class="font-medium text-sm xs:text-base leading-tight text-center">{{ productionMethod.name }}</span>
            <div
              v-if="productionMethod.setupFee"
              class="flex items-center space-x-1"
              :aria-label="`Setup fee: ${productionMethod.setupFee}`"
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
              <span class="text-xs text-amber-400 font-medium">+${{ productionMethod.setupFee }}</span>
            </div>
          </div>
        </div>
      </label>
    </div>

    <div class="border-t border-slate-700 my-4"></div>
    <!-- Setup Fee Notice -->
    <div
      v-if="selectedMethod?.setupFee"
      :id="`panel-${selectedMethod.id}`"
      class="mt-4 p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl"
      role="tabpanel"
      :aria-labelledby="`tab-${selectedMethod.id}`"
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
            <span class="font-medium">{{ selectedMethod.name }}</span> includes a one-time setup fee of 
            <span class="font-semibold">${{ selectedMethod.setupFee }}</span>
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
import type { ProductionMethod } from '~/types/pricing';
import { PRODUCTION_METHODS } from '~/data/pricing';

interface Props {
  selectedMethod?: ProductionMethod | null;
}

interface Emits {
  (e: 'update:selectedMethod', method: ProductionMethod): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedMethod: null
});

const emit = defineEmits<Emits>();

const productionMethods = PRODUCTION_METHODS;
const tabRefs = ref<(HTMLElement | null)[]>([]);

const selectProductionMethod = (method: ProductionMethod) => {
  try {
    if (!method || !method.id || !method.name || !method.pricing) {
      console.error('Invalid production method:', method);
      return;
    }
    emit('update:selectedMethod', method);
  } catch (error) {
    console.error('Error selecting production method:', error);
  }
};

// Keyboard navigation functions
const focusPreviousTab = (currentIndex: number) => {
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : productionMethods.length - 1;
  tabRefs.value[prevIndex]?.focus();
};

const focusNextTab = (currentIndex: number) => {
  const nextIndex = currentIndex < productionMethods.length - 1 ? currentIndex + 1 : 0;
  tabRefs.value[nextIndex]?.focus();
};

const focusFirstTab = () => {
  tabRefs.value[0]?.focus();
};

const focusLastTab = () => {
  tabRefs.value[productionMethods.length - 1]?.focus();
};

// Option classes matching ModificationsPanel styling
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