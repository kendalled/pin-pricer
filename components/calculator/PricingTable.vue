<template>
  <div class="pricing-table-container" role="region" aria-label="Pricing table for size and quantity selection">
    <!-- Mobile-first responsive table -->
    <div class="overflow-x-auto">
      <div class="min-w-[320px] xs:min-w-[480px] sm:min-w-[600px] lg:min-w-[700px]">
        <!-- Size/Quantity Grid -->
        <div 
          class="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 gap-1 mb-4"
          role="grid"
          aria-label="Price matrix with sizes and quantities"
        >
          <!-- Top-left empty cell -->
          <div 
            class="p-2 xs:p-3 text-center font-semibold text-slate-400 text-xs xs:text-sm"
            role="columnheader"
            aria-label="Size and quantity intersection"
          >
            <span class="hidden xs:inline">Size / Qty</span>
            <span class="xs:hidden">Size/Qty</span>
          </div>
          
          <!-- Quantity headers - responsive visibility -->
          <div 
            v-for="quantity in visibleQuantities" 
            :key="quantity"
            class="p-2 xs:p-3 text-center font-semibold text-slate-200 text-xs xs:text-sm bg-slate-800 rounded-lg high-contrast:bg-slate-950 high-contrast:border high-contrast:border-slate-300"
            role="columnheader"
            :aria-label="`Quantity ${quantity.toLocaleString()}`"
          >
            <span class="hidden xs:inline">{{ quantity.toLocaleString() }}</span>
            <span class="xs:hidden">{{ formatQuantityShort(quantity) }}</span>
          </div>
          
          <!-- Size rows with pricing cells -->
          <template v-for="(size, sizeIndex) in sizes" :key="size">
            <!-- Size header -->
            <div 
              class="p-2 xs:p-3 text-center font-semibold text-slate-200 text-xs xs:text-sm bg-slate-800 rounded-lg high-contrast:bg-slate-950 high-contrast:border high-contrast:border-slate-300"
              role="rowheader"
              :aria-label="`Size ${size} inches`"
            >
              {{ size }}"
            </div>
            
            <!-- Price cells for this size -->
            <button
              v-for="(quantity, qtyIndex) in visibleQuantities"
              :key="`${size}-${quantity}`"
              @click="selectCell(size, quantity)"
              @keydown.enter="selectCell(size, quantity)"
              @keydown.space.prevent="selectCell(size, quantity)"
              @keydown.arrow-up="navigateCell(sizeIndex - 1, qtyIndex)"
              @keydown.arrow-down="navigateCell(sizeIndex + 1, qtyIndex)"
              @keydown.arrow-left="navigateCell(sizeIndex, qtyIndex - 1)"
              @keydown.arrow-right="navigateCell(sizeIndex, qtyIndex + 1)"
              @mouseenter="hoveredCell = `${size}-${quantity}`"
              @mouseleave="hoveredCell = null"
              :ref="el => setCellRef(el, sizeIndex, qtyIndex)"
              :class="getCellClasses(size, quantity)"
              :aria-label="getCellAriaLabel(size, quantity)"
              :aria-pressed="selectedSize === size && selectedQuantity === quantity"
              class="p-2 xs:p-3 text-center text-xs xs:text-sm font-medium transition-all duration-250 rounded-lg border-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px] reduced-motion:transition-none"
              role="gridcell"
              :tabindex="getTabIndex(size, quantity)"
            >
              <div class="flex flex-col justify-center min-h-[2rem] xs:min-h-[2.5rem]">
                <span class="text-xs text-slate-400 mb-0.5 xs:mb-1 hidden xs:block">per unit</span>
                <span class="font-semibold text-xs xs:text-sm">
                  ${{ formatPrice(getPrice(size, quantity)) }}
                </span>
                <span class="text-xs text-slate-300 mt-0.5 xs:mt-1 hidden sm:block">
                  Total: ${{ formatPrice(getPrice(size, quantity) * quantity) }}
                </span>
              </div>
            </button>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Show more quantities button for mobile -->
    <div v-if="!showAllQuantities && quantities.length > visibleQuantities.length" class="mb-4 text-center sm:hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        @click="showAllQuantities = true"
        aria-label="Show all quantity options"
      >
        Show More Quantities ({{ quantities.length - visibleQuantities.length }} more)
      </Button>
    </div>
    
    <!-- Selection Summary -->
    <div 
      v-if="selectedSize && selectedQuantity" 
      class="mt-4 p-3 xs:p-4 bg-slate-800 rounded-xl border border-slate-700 high-contrast:bg-slate-950 high-contrast:border-slate-300"
      role="status"
      aria-live="polite"
      aria-label="Current selection summary"
    >
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 xs:gap-3">
        <div class="text-slate-200">
          <span class="font-semibold">Selected:</span>
          <span class="ml-1">{{ selectedSize }}" × {{ selectedQuantity.toLocaleString() }} units</span>
        </div>
        <div class="text-left sm:text-right">
          <div class="text-sm text-slate-400">Unit Price: ${{ formatPrice(unitPrice) }}</div>
          <div class="text-lg font-bold text-slate-100 high-contrast:text-white">
            Base Total: ${{ formatPrice(baseTotal) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { PlatingType } from '~/types/pricing';
import { SIZES, QUANTITIES } from '~/data/pricing';
import Button from '~/components/ui/Button.vue';

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
const showAllQuantities = ref(false);
const cellRefs = ref<(HTMLElement | null)[][]>([]);
const sizes = SIZES;
const quantities = QUANTITIES;

// Responsive quantity display
const visibleQuantities = computed(() => {
  if (showAllQuantities.value) return quantities;
  
  // Show fewer quantities on mobile, more on larger screens
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width < 475) return quantities.slice(0, 3); // xs: show 3
    if (width < 640) return quantities.slice(0, 5); // sm: show 5
  }
  return quantities; // Show all on larger screens
});

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

const formatQuantityShort = (quantity: number): string => {
  if (quantity >= 1000) return `${quantity / 1000}k`;
  return quantity.toString();
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
  
  const baseClasses = [
    'high-contrast:border-slate-300',
    'hover:shadow-md active:scale-95'
  ].join(' ');
  
  if (isSelected) {
    return `bg-blue-900/30 border-blue-500 text-blue-200 shadow-md high-contrast:bg-blue-800 high-contrast:border-blue-300 high-contrast:text-white ${baseClasses}`;
  } else if (isHovered) {
    return `bg-slate-700/50 border-slate-500 text-slate-200 shadow-sm ${baseClasses}`;
  }
  
  return `bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:shadow-sm ${baseClasses}`;
};

const getCellAriaLabel = (size: string, quantity: number): string => {
  const price = getPrice(size, quantity);
  const total = price * quantity;
  return `Size ${size} inches, quantity ${quantity.toLocaleString()}, unit price $${formatPrice(price)}, total $${formatPrice(total)}`;
};

const getTabIndex = (size: string, quantity: number): number => {
  // Only the selected cell or first cell should be tabbable
  if (props.selectedSize === size && props.selectedQuantity === quantity) return 0;
  if (!props.selectedSize && !props.selectedQuantity && size === sizes[0] && quantity === visibleQuantities.value[0]) return 0;
  return -1;
};

// Cell reference management for keyboard navigation
const setCellRef = (el: Element | ComponentPublicInstance | null, sizeIndex: number, qtyIndex: number) => {
  if (!cellRefs.value[sizeIndex]) {
    cellRefs.value[sizeIndex] = [];
  }
  cellRefs.value[sizeIndex][qtyIndex] = el as HTMLElement | null;
};

// Keyboard navigation
const navigateCell = (newSizeIndex: number, newQtyIndex: number) => {
  const maxSizeIndex = sizes.length - 1;
  const maxQtyIndex = visibleQuantities.value.length - 1;
  
  // Clamp indices to valid ranges
  const clampedSizeIndex = Math.max(0, Math.min(newSizeIndex, maxSizeIndex));
  const clampedQtyIndex = Math.max(0, Math.min(newQtyIndex, maxQtyIndex));
  
  // Focus the target cell
  const targetCell = cellRefs.value[clampedSizeIndex]?.[clampedQtyIndex];
  if (targetCell) {
    targetCell.focus();
  }
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