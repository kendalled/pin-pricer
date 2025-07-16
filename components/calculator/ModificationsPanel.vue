<template>
  <div class="space-y-6">
    <!-- Backing Options -->
    <div>
      <h3 class="text-lg font-semibold text-slate-200 mb-4">Backing Options</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <label
          v-for="option in backingOptions"
          :key="option.id"
          :class="[
            'relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200',
            'hover:bg-slate-700/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
            selectedBacking?.id === option.id
              ? 'bg-blue-900/30 border-blue-500 text-blue-200'
              : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
          ]"
        >
          <input
            type="radio"
            :value="option.id"
            :checked="selectedBacking?.id === option.id"
            @change="selectBacking(option)"
            class="sr-only"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-medium truncate">{{ option.name }}</span>
              <span
                :class="[
                  'text-sm font-semibold ml-2 flex-shrink-0',
                  option.isFree ? 'text-green-400' : 'text-slate-400'
                ]"
              >
                {{ option.isFree ? 'FREE' : formatPrice(option.price) }}
              </span>
            </div>
          </div>
          <!-- Radio indicator -->
          <div
            :class="[
              'ml-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              selectedBacking?.id === option.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-slate-500'
            ]"
          >
            <div
              v-if="selectedBacking?.id === option.id"
              class="w-2 h-2 rounded-full bg-white"
            />
          </div>
        </label>
      </div>
    </div>

    <!-- Packaging Options -->
    <div>
      <h3 class="text-lg font-semibold text-slate-200 mb-4">Packaging Options</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <label
          v-for="option in packagingOptions"
          :key="option.id"
          :class="[
            'relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200',
            'hover:bg-slate-700/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
            selectedPackaging?.id === option.id
              ? 'bg-blue-900/30 border-blue-500 text-blue-200'
              : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
          ]"
        >
          <input
            type="radio"
            :value="option.id"
            :checked="selectedPackaging?.id === option.id"
            @change="selectPackaging(option)"
            class="sr-only"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="font-medium truncate">{{ option.name }}</span>
              <span
                :class="[
                  'text-sm font-semibold ml-2 flex-shrink-0',
                  option.isFree ? 'text-green-400' : 'text-slate-400'
                ]"
              >
                {{ option.isFree ? 'FREE' : formatPrice(option.price) }}
              </span>
            </div>
          </div>
          <!-- Radio indicator -->
          <div
            :class="[
              'ml-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200',
              selectedPackaging?.id === option.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-slate-500'
            ]"
          >
            <div
              v-if="selectedPackaging?.id === option.id"
              class="w-2 h-2 rounded-full bg-white"
            />
          </div>
        </label>
      </div>
    </div>

    <!-- Rush Order Toggle -->
    <div>
      <div class="flex items-center justify-between p-4 bg-slate-800 border border-slate-600 rounded-lg">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-slate-200">Rush Order</h3>
          <p class="text-sm text-slate-400 mt-1">
            Add 20% to total price for expedited processing
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer ml-4">
          <input
            type="checkbox"
            :checked="rushOrder"
            @change="toggleRushOrder"
            class="sr-only peer"
          />
          <div
            :class="[
              'relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out',
              'peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900',
              rushOrder
                ? 'bg-blue-600'
                : 'bg-slate-600'
            ]"
          >
            <div
              :class="[
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out',
                rushOrder ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </div>
          <span class="ml-3 text-sm font-medium text-slate-300">
            {{ rushOrder ? 'Enabled' : 'Disabled' }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BackingOption, PackagingOption } from '~/types/pricing';
import { BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

interface Props {
  selectedBacking?: BackingOption | null;
  selectedPackaging?: PackagingOption | null;
  rushOrder?: boolean;
}

interface Emits {
  (e: 'backing-change', option: BackingOption): void;
  (e: 'packaging-change', option: PackagingOption): void;
  (e: 'rush-toggle', enabled: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedBacking: null,
  selectedPackaging: null,
  rushOrder: false
});

const emit = defineEmits<Emits>();

const backingOptions = BACKING_OPTIONS;
const packagingOptions = PACKAGING_OPTIONS;

const selectBacking = (option: BackingOption) => {
  emit('backing-change', option);
};

const selectPackaging = (option: PackagingOption) => {
  emit('packaging-change', option);
};

const toggleRushOrder = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('rush-toggle', target.checked);
};

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};
</script>