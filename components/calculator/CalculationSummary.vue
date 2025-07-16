<template>
  <div class="bg-slate-800 rounded-lg border border-slate-600 p-6">
    <h3 class="text-lg font-semibold text-slate-50 mb-4">Price Breakdown</h3>
    
    <!-- Show message when calculation is not complete -->
    <div v-if="!breakdown" class="text-slate-400 text-sm">
      Complete your selections to see pricing breakdown
    </div>
    
    <!-- Price breakdown when complete -->
    <div v-else class="space-y-3">
      <!-- Error state for invalid breakdown -->
      <div v-if="hasInvalidBreakdown" class="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-red-300 text-sm">Invalid pricing data detected. Using fallback values.</span>
        </div>
      </div>
      
      <!-- Base Price -->
      <div class="flex justify-between items-center text-slate-200">
        <span>Base Price ({{ safeFormatCurrency(breakdown.unitPrice) }} each)</span>
        <span class="font-medium">{{ safeFormatCurrency(breakdown.basePrice) }}</span>
      </div>
      
      <!-- Setup Fee (only show if applicable) -->
      <div 
        v-if="breakdown.setupFee > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Setup Fee</span>
        <span class="font-medium">{{ safeFormatCurrency(breakdown.setupFee) }}</span>
      </div>
      
      <!-- Backing Cost (only show if applicable) -->
      <div 
        v-if="breakdown.backingCost > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Backing</span>
        <span class="font-medium">{{ safeFormatCurrency(breakdown.backingCost) }}</span>
      </div>
      
      <!-- Packaging Cost (only show if applicable) -->
      <div 
        v-if="breakdown.packagingCost > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Packaging</span>
        <span class="font-medium">{{ safeFormatCurrency(breakdown.packagingCost) }}</span>
      </div>
      
      <!-- Rush Fee (only show if applicable) -->
      <div 
        v-if="breakdown.rushFee > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Rush Fee (20%)</span>
        <span class="font-medium">{{ safeFormatCurrency(breakdown.rushFee) }}</span>
      </div>
      
      <!-- Divider -->
      <hr class="border-slate-600 my-4">
      
      <!-- Total -->
      <div class="flex justify-between items-center text-slate-50">
        <span class="text-xl font-semibold">Total</span>
        <span class="text-2xl font-bold text-blue-400">{{ safeFormatCurrency(breakdown.total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PriceBreakdown } from '~/types/pricing';
import { formatCurrency } from '~/utils/calculations';

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
  
  const { basePrice, setupFee, backingCost, packagingCost, rushFee, total, unitPrice } = props.breakdown;
  
  // Check for invalid numbers
  const values = [basePrice, setupFee, backingCost, packagingCost, rushFee, total, unitPrice];
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