<template>
  <div class="pricing-table-container">
    <!-- Table Header -->
    <div class="overflow-x-auto">
      <div class="min-w-[600px]">
        <!-- Size/Quantity Grid -->
        <div class="grid grid-cols-8 gap-1 mb-4">
          <!-- Top-left empty cell -->
          <div class="p-3 text-center font-semibold text-slate-400 text-sm">
            Size / Qty
          </div>
          
          <!-- Quantity headers -->
          <div 
            v-for="quantity in quantities" 
            :key="quantity"
            class="p-3 text-center font-semibold text-slate-200 text-sm bg-slate-800 rounded-lg"
          >
            {{ quantity.toLocaleString() }}
          </div>
          
          <!-- Size rows with pricing cells -->
          <template v-for="size in sizes" :key="size">
            <!-- Size header -->
            <div class="p-3 text-center font-semibold text-slate-200 text-sm bg-slate-800 rounded-lg">
              {{ size }}"
            </div>
            
            <!-- Price cells for this size -->
            <button
              v-for="quantity in quantities"
              :key="`${size}-${quantity}`"
              @click="selectCell(size, quantity)"
              @mouseenter="hoveredCell = `${size}-${quantity}`"
              @mouseleave="hoveredCell = null"
              :class="getCellClasses(size, quantity)"
              class="p-3 text-center text-sm font-medium transition-all duration-200 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <div class="flex flex-col">
                <span class="text-xs text-slate-400 mb-1">per unit</span>
                <span class="font-semibold">
                  ${{ formatPrice(getPrice(size, quantity)) }}
                </span>
                <span class="text-xs text-slate-300 mt-1">
                  Total: ${{ formatPrice(getPrice(size, quantity) * quantity) }}
                </span>
              </div>
            </button>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Selection Summary -->
    <div v-if="selectedSize && selectedQuantity" class="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div class="text-slate-200">
          <span class="font-semibold">Selected:</span>
          {{ selectedSize }}" × {{ selectedQuantity.toLocaleString() }} units
        </div>
        <div class="text-right">
          <div class="text-sm text-slate-400">Unit Price: ${{ formatPrice(unitPrice) }}</div>
          <div class="text-lg font-bold text-slate-100">
            Base Total: ${{ formatPrice(baseTotal) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PlatingType } from '~/types/pricing';
import { SIZES, QUANTITIES } from '~/data/pricing';

interface Props {
  platingType: PlatingType;
  selectedSize: string | null;
  selectedQuantity: number | null;
}

interface Emits {
  (e: 'selection-change', size: string, quantity: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Reactive data
const hoveredCell = ref<string | null>(null);
const sizes = SIZES;
const quantities = QUANTITIES;

// Computed properties
const unitPrice = computed(() => {
  if (!props.selectedSize || !props.selectedQuantity) return 0;
  return getPrice(props.selectedSize, props.selectedQuantity);
});

const baseTotal = computed(() => {
  if (!props.selectedQuantity) return 0;
  return unitPrice.value * props.selectedQuantity;
});

// Methods
const getPrice = (size: string, quantity: number): number => {
  try {
    const price = props.platingType.pricing[size]?.[quantity];
    if (price === undefined || price < 0) {
      console.warn(`Invalid price for size ${size} and quantity ${quantity}`);
      return 0;
    }
    return price;
  } catch (error) {
    console.error('Error getting price:', error);
    return 0;
  }
};

const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

const selectCell = (size: string, quantity: number) => {
  try {
    // Validate the selection
    if (!size || !quantity || quantity <= 0) {
      console.error('Invalid size or quantity selection:', { size, quantity });
      return;
    }
    
    // Check if the price exists for this combination
    const price = getPrice(size, quantity);
    if (price <= 0) {
      console.error('No valid price found for selection:', { size, quantity });
      return;
    }
    
    emit('selection-change', size, quantity);
  } catch (error) {
    console.error('Error selecting cell:', error);
  }
};

const getCellClasses = (size: string, quantity: number): string => {
  const cellKey = `${size}-${quantity}`;
  const isSelected = props.selectedSize === size && props.selectedQuantity === quantity;
  const isHovered = hoveredCell.value === cellKey;
  
  let classes = 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-slate-500';
  
  if (isSelected) {
    classes = 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25';
  } else if (isHovered) {
    classes = 'bg-slate-600 border-slate-500 text-slate-100 shadow-md';
  }
  
  return classes;
};
</script>

<style scoped>
.pricing-table-container {
  width: 100%;
}

/* Ensure smooth transitions for all interactive elements */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .grid-cols-8 {
    font-size: 0.75rem;
  }
  
  .p-3 {
    padding: 0.5rem;
  }
}
</style>