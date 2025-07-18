<template>
  <Card>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-50">
        Price Breakdown
      </h3>
    </template>
    
    <!-- Show message when calculation is not complete -->
    <div 
      v-if="!breakdown" 
      class="text-slate-400 text-sm xs:text-base high-contrast:text-slate-300"
      role="status"
      aria-live="polite"
    >
      Complete your selections to see pricing breakdown
    </div>
    
    <!-- Price breakdown when complete -->
    <div v-else class="space-y-3 xs:space-y-4" role="status" aria-live="polite">
      <!-- Error state for invalid breakdown -->
      <div 
        v-if="hasInvalidBreakdown" 
        class="bg-red-900/20 border border-red-700/30 rounded-lg p-3"
        role="alert"
        aria-describedby="pricing-error-description"
      >
        <div class="flex items-start space-x-2">
          <svg 
            class="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span 
            id="pricing-error-description"
            class="text-red-300 text-sm leading-relaxed"
          >
            Invalid pricing data detected. Using fallback values.
          </span>
        </div>
      </div>
      
      <!-- Base Price -->
      <div class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-200 high-contrast:text-slate-100">
        <span class="text-sm xs:text-base">
          Base Price 
          <span class="text-xs xs:text-sm text-slate-400 high-contrast:text-slate-300">
            ({{ safeFormatCurrency(breakdown.unitPrice) }} each)
          </span>
        </span>
        <span class="font-medium text-sm xs:text-base">{{ safeFormatCurrency(breakdown.basePrice) }}</span>
      </div>
      
      <!-- Setup Fee (only show if applicable) -->
      <div 
        v-if="breakdown.setupFee > 0" 
        class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-200 high-contrast:text-slate-100"
      >
        <span class="text-sm xs:text-base">Setup Fee</span>
        <span class="font-medium text-sm xs:text-base">{{ safeFormatCurrency(breakdown.setupFee) }}</span>
      </div>
      
      <!-- Plating Cost (only show if applicable) -->
      <div 
        v-if="breakdown.platingCost > 0" 
        class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-200 high-contrast:text-slate-100"
      >
        <span class="text-sm xs:text-base">Plating</span>
        <span class="font-medium text-sm xs:text-base">{{ safeFormatCurrency(breakdown.platingCost) }}</span>
      </div>
      
      <!-- Backing Cost (only show if applicable) -->
      <div 
        v-if="breakdown.backingCost > 0" 
        class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-200 high-contrast:text-slate-100"
      >
        <span class="text-sm xs:text-base">Backing</span>
        <span class="font-medium text-sm xs:text-base">{{ safeFormatCurrency(breakdown.backingCost) }}</span>
      </div>
      
      <!-- Packaging Cost (only show if applicable) -->
      <div 
        v-if="breakdown.packagingCost > 0" 
        class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-200 high-contrast:text-slate-100"
      >
        <span class="text-sm xs:text-base">Packaging</span>
        <span class="font-medium text-sm xs:text-base">{{ safeFormatCurrency(breakdown.packagingCost) }}</span>
      </div>
      
      <!-- Rush Fee (only show if applicable) -->
      <div 
        v-if="breakdown.rushFee > 0" 
        class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-200 high-contrast:text-slate-100"
      >
        <span class="text-sm xs:text-base">Rush Fee (20%)</span>
        <span class="font-medium text-sm xs:text-base">{{ safeFormatCurrency(breakdown.rushFee) }}</span>
      </div>
      
      <!-- Divider -->
      <hr class="border-slate-600 my-3 xs:my-4 high-contrast:border-slate-300">
      
      <!-- Total -->
      <div 
        class="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-2 text-slate-50 high-contrast:text-white"
        aria-label="Total price"
      >
        <span class="text-lg xs:text-xl font-semibold">Total</span>
        <span class="text-xl xs:text-2xl font-bold text-blue-400 high-contrast:text-blue-300">
          {{ safeFormatCurrency(breakdown.total) }}
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PriceBreakdown } from '~/types/pricing';
import { formatCurrency } from '~/utils/calculations';
import Card from '~/components/ui/Card.vue';

interface Props {
  breakdown: PriceBreakdown | null;
  isComplete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isComplete: false
});

// Computed property to check for invalid breakdown data
const hasInvalidBreakdown = computed(() => {
  if (!props.breakdown) return false;
  
  const { basePrice, setupFee, platingCost, backingCost, packagingCost, rushFee, total, unitPrice } = props.breakdown;
  
  // Check for invalid numbers
  const values = [basePrice, setupFee, platingCost, backingCost, packagingCost, rushFee, total, unitPrice];
  return values.some(value => 
    typeof value !== 'number' || 
    isNaN(value) || 
    value < 0 || 
    !isFinite(value)
  );
});

// Safe currency formatting with fallback values
const safeFormatCurrency = (amount: number | undefined): string => {
  try {
    if (typeof amount !== 'number' || isNaN(amount) || amount < 0 || !isFinite(amount)) {
      return '$0.00';
    }
    return formatCurrency(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0.00';
  }
};
</script>