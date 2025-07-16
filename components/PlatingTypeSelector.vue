<template>
  <div class="w-full">
    <!-- Tab Navigation -->
    <div class="flex flex-wrap gap-1 p-1 bg-slate-800 rounded-lg">
      <button
        v-for="platingType in platingTypes"
        :key="platingType.id"
        @click="selectPlatingType(platingType)"
        :class="[
          'flex-1 min-w-0 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800',
          selectedType?.id === platingType.id
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-300 hover:text-white hover:bg-slate-700'
        ]"
      >
        <div class="flex flex-col items-center space-y-1">
          <span class="truncate">{{ platingType.name }}</span>
          <div
            v-if="platingType.setupFee"
            class="flex items-center space-x-1"
          >
            <svg
              class="w-3 h-3 text-amber-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-xs text-amber-400">+${{ platingType.setupFee }}</span>
          </div>
        </div>
      </button>
    </div>

    <!-- Setup Fee Notice -->
    <div
      v-if="selectedType?.setupFee"
      class="mt-3 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg"
    >
      <div class="flex items-center space-x-2">
        <svg
          class="w-4 h-4 text-amber-400 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm text-amber-200">
          <span class="font-medium">{{ selectedType.name }}</span> includes a one-time setup fee of 
          <span class="font-semibold">${{ selectedType.setupFee }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const selectPlatingType = (type: PlatingType) => {
  emit('update:selectedType', type);
};
</script>