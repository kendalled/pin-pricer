<template>
  <div class="space-y-6 xs:space-y-8">
    <!-- Design Sides (affects mold fee) -->
    <fieldset>
      <legend class="text-lg font-semibold text-slate-200 mb-4 high-contrast:text-white">
        Design Type
        <span class="text-sm font-normal text-slate-400 ml-2">(affects mold fee)</span>
      </legend>
      <div 
        class="grid grid-cols-2 gap-3 xs:gap-4"
        role="radiogroup"
        aria-labelledby="design-sides-legend"
      >
        <label
          :class="getOptionClasses(designSides === 'one-sided')"
          @keydown.enter="selectDesignSides('one-sided')"
          @keydown.space.prevent="selectDesignSides('one-sided')"
        >
          <input
            type="radio"
            name="design-sides"
            value="one-sided"
            :checked="designSides === 'one-sided'"
            @change="selectDesignSides('one-sided')"
            class="sr-only"
          />
          <div class="flex-1 min-w-0 hover-lift">
            <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
              <span class="font-medium text-sm xs:text-base leading-tight">One-Sided Design</span>
              <span class="text-sm text-slate-400 high-contrast:text-slate-300">1× mold fee</span>
            </div>
          </div>
          <!-- Radio indicator -->
          <div
            :class="[
              'ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-250 flex-shrink-0',
              designSides === 'one-sided'
                ? 'border-blue-500 bg-blue-500 high-contrast:border-blue-300 high-contrast:bg-blue-700'
                : 'border-slate-500 high-contrast:border-slate-300'
            ]"
            aria-hidden="true"
          >
            <div
              v-if="designSides === 'one-sided'"
              class="w-2.5 h-2.5 rounded-full bg-white"
            />
          </div>
        </label>

        <label
          :class="getOptionClasses(designSides === 'two-sided')"
          @keydown.enter="selectDesignSides('two-sided')"
          @keydown.space.prevent="selectDesignSides('two-sided')"
        >
          <input
            type="radio"
            name="design-sides"
            value="two-sided"
            :checked="designSides === 'two-sided'"
            @change="selectDesignSides('two-sided')"
            class="sr-only"
          />
          <div class="flex-1 min-w-0 hover-lift">
            <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
              <span class="font-medium text-sm xs:text-base leading-tight">Two-Sided Design</span>
              <span class="text-sm text-slate-400 high-contrast:text-slate-300">2× mold fee</span>
            </div>
          </div>
          <!-- Radio indicator -->
          <div
            :class="[
              'ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-250 flex-shrink-0',
              designSides === 'two-sided'
                ? 'border-blue-500 bg-blue-500 high-contrast:border-blue-300 high-contrast:bg-blue-700'
                : 'border-slate-500 high-contrast:border-slate-300'
            ]"
            aria-hidden="true"
          >
            <div
              v-if="designSides === 'two-sided'"
              class="w-2.5 h-2.5 rounded-full bg-white"
            />
          </div>
        </label>
      </div>
    </fieldset>

    <div class="border-t border-slate-700 my-4"></div>

    <!-- Packaging Options -->
    <fieldset>
      <legend class="text-lg font-semibold text-slate-200 mb-4 high-contrast:text-white">
        Packaging Options
      </legend>
      <div 
        class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4"
        role="radiogroup"
        aria-labelledby="packaging-options-legend"
      >
        <label
          v-for="option in packagingOptions"
          :key="option.id"
          :class="getOptionClasses(selectedPackaging?.id === option.id)"
          @keydown.enter="selectPackaging(option)"
          @keydown.space.prevent="selectPackaging(option)"
        >
          <input
            type="radio"
            name="packaging-option"
            :value="option.id"
            :checked="selectedPackaging?.id === option.id"
            @change="selectPackaging(option)"
            :aria-describedby="`packaging-${option.id}-price`"
            class="sr-only"
          />
          <div class="flex-1 min-w-0 hover-lift">
            <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
              <span class="font-medium text-sm xs:text-base leading-tight">{{ option.name }}</span>
              <span
                :id="`packaging-${option.id}-price`"
                :class="[
                  'text-sm font-semibold flex-shrink-0',
                  option.isFree ? 'text-green-400 high-contrast:text-green-300' : 'text-slate-400 high-contrast:text-slate-300'
                ]"
              >
                {{ option.isFree ? 'FREE' : `$${formatPrice(option.price)}` }}
              </span>
            </div>
          </div>
          <!-- Radio indicator -->
          <div
            :class="[
              'ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-250 flex-shrink-0',
              selectedPackaging?.id === option.id
                ? 'border-blue-500 bg-blue-500 high-contrast:border-blue-300 high-contrast:bg-blue-700'
                : 'border-slate-500 high-contrast:border-slate-300'
            ]"
            aria-hidden="true"
          >
            <div
              v-if="selectedPackaging?.id === option.id"
              class="w-2.5 h-2.5 rounded-full bg-white"
            />
          </div>
        </label>
      </div>
    </fieldset>

    <div class="border-t border-slate-700 my-4"></div>

    <!-- Rush Order Toggle -->
    <div>
      <div 
        class="flex items-center justify-between gap-4 p-4 xs:p-6 bg-slate-800 border border-slate-600 rounded-xl high-contrast:bg-slate-950 high-contrast:border-slate-300"
        role="group"
        aria-labelledby="rush-order-heading"
      >
        <div class="flex-1">
          <h3 id="rush-order-heading" class="text-lg font-semibold text-slate-200 high-contrast:text-white">
            Rush Order
          </h3>
          <p class="text-sm text-slate-400 mt-1 high-contrast:text-slate-300 leading-relaxed">
            Add 20% to total price for expedited processing
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer flex-shrink-0 transition-transform duration-[600ms] ease-out active:scale-98 reduced-motion:transition-none">
          <input
            type="checkbox"
            :checked="rushOrder"
            @change="toggleRushOrder"
            @keydown.enter="toggleRushOrder"
            @keydown.space.prevent="toggleRushOrder"
            class="sr-only peer"
            :aria-describedby="rushOrder ? 'rush-enabled' : 'rush-disabled'"
          />
          <div
            :class="[
              'relative w-12 h-7 rounded-full transition-colors duration-300 ease-out shadow-inner',
              'peer-focus-visible:ring-3 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900',
              'reduced-motion:transition-none',
              rushOrder
                ? 'bg-green-500/90 high-contrast:bg-green-700'
                : 'bg-slate-600 high-contrast:bg-slate-700'
            ]"
          >
            <div
              :class="[
                'absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 ease-out shadow',
                'reduced-motion:transition-none',
                rushOrder ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </div>
          <span 
            :id="rushOrder ? 'rush-enabled' : 'rush-disabled'"
            class="ml-3 text-sm font-medium text-slate-300 high-contrast:text-slate-200"
          >
            {{ rushOrder ? 'Enabled' : 'Disabled' }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PackagingOption, CoinDesignSides } from '~/types/pricing';
import { PACKAGING_OPTIONS } from '~/data/pricing';

interface Props {
  selectedPackaging?: PackagingOption | null;
  designSides?: CoinDesignSides;
  rushOrder?: boolean;
}

interface Emits {
  (e: 'packaging-change', option: PackagingOption): void;
  (e: 'design-sides-change', sides: CoinDesignSides): void;
  (e: 'rush-toggle', enabled: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedPackaging: null,
  designSides: 'one-sided',
  rushOrder: false
});

const emit = defineEmits<Emits>();

const packagingOptions = PACKAGING_OPTIONS;

// Computed for template binding
const designSides = computed(() => props.designSides);

const selectDesignSides = (sides: CoinDesignSides) => {
  emit('design-sides-change', sides);
};

const selectPackaging = (option: PackagingOption) => {
  try {
    if (!option || !option.id || !option.name || typeof option.price !== 'number') {
      console.error('Invalid packaging option:', option);
      return;
    }
    emit('packaging-change', option);
  } catch (error) {
    console.error('Error selecting packaging option:', error);
  }
};

const toggleRushOrder = (event: Event) => {
  try {
    const target = event.target as HTMLInputElement;
    if (target && typeof target.checked === 'boolean') {
      emit('rush-toggle', target.checked);
    }
  } catch (error) {
    console.error('Error toggling rush order:', error);
  }
};

const formatPrice = (price: number): string => {
  try {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      return '0.00';
    }
    return price.toFixed(2);
  } catch (error) {
    console.error('Error formatting price:', error);
    return '0.00';
  }
};

const getOptionClasses = (isSelected: boolean): string => {
  const baseClasses = [
    'relative flex items-center p-3 xs:p-4 border rounded-xl cursor-pointer',
    'transition-all duration-250 ease-in-out',
    'focus-within:ring-3 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
    'min-h-[44px]',
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
