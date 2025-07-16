<template>
  <div class="bg-slate-800 rounded-lg border border-slate-600 p-6">
    <h3 class="text-lg font-semibold text-slate-50 mb-4">Price Breakdown</h3>
    
    <!-- Show message when calculation is not complete -->
    <div v-if="!breakdown" class="text-slate-400 text-sm">
      Complete your selections to see pricing breakdown
    </div>
    
    <!-- Price breakdown when complete -->
    <div v-else class="space-y-3">
      <!-- Base Price -->
      <div class="flex justify-between items-center text-slate-200">
        <span>Base Price ({{ breakdown.unitPrice ? formatCurrency(breakdown.unitPrice) : '$0.00' }} each)</span>
        <span class="font-medium">{{ formatCurrency(breakdown.basePrice) }}</span>
      </div>
      
      <!-- Setup Fee (only show if applicable) -->
      <div 
        v-if="breakdown.setupFee > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Setup Fee</span>
        <span class="font-medium">{{ formatCurrency(breakdown.setupFee) }}</span>
      </div>
      
      <!-- Backing Cost (only show if applicable) -->
      <div 
        v-if="breakdown.backingCost > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Backing</span>
        <span class="font-medium">{{ formatCurrency(breakdown.backingCost) }}</span>
      </div>
      
      <!-- Packaging Cost (only show if applicable) -->
      <div 
        v-if="breakdown.packagingCost > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Packaging</span>
        <span class="font-medium">{{ formatCurrency(breakdown.packagingCost) }}</span>
      </div>
      
      <!-- Rush Fee (only show if applicable) -->
      <div 
        v-if="breakdown.rushFee > 0" 
        class="flex justify-between items-center text-slate-200"
      >
        <span>Rush Fee (20%)</span>
        <span class="font-medium">{{ formatCurrency(breakdown.rushFee) }}</span>
      </div>
      
      <!-- Divider -->
      <hr class="border-slate-600 my-4">
      
      <!-- Total -->
      <div class="flex justify-between items-center text-slate-50">
        <span class="text-xl font-semibold">Total</span>
        <span class="text-2xl font-bold text-blue-400">{{ formatCurrency(breakdown.total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceBreakdown } from '~/types/pricing';
import { formatCurrency } from '~/utils/calculations';

interface Props {
  breakdown: PriceBreakdown | null;
  isComplete?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isComplete: false
});
</script>