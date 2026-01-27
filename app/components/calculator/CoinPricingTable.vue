<template>
  <div class="pricing-table-container" role="region" aria-label="Pricing table for size and quantity selection" tabindex="-1">
    <!-- Mobile-first responsive table -->
    <div class="overflow-x-auto px-1">
      <div class="min-w-[320px] xs:min-w-[480px] sm:min-w-[600px] lg:min-w-[750px]">
        <!-- Size/Quantity Grid -->
        <div
          :class="gridClasses"
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

          <!-- Custom quantity column header (+ button) -->
          <button
            @click="toggleCustomQuantityColumn"
            :class="[
              'p-2 xs:p-3 text-center font-semibold text-xs xs:text-sm rounded-lg transition-all duration-200',
              'border-2 border-dashed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              showCustomColumn
                ? 'bg-blue-900/30 border-blue-500 text-blue-200'
                : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            ]"
            role="columnheader"
            :aria-label="showCustomColumn ? 'Hide custom quantity column' : 'Show custom quantity column'"
            :aria-pressed="showCustomColumn"
          >
            <svg
              class="w-4 h-4 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

          <!-- Size rows with pricing cells -->
          <template v-for="(size, sizeIndex) in sizes" :key="size">
            <!-- Size header -->
            <div
              class="p-2 xs:p-3 flex items-center justify-center font-semibold text-slate-200 text-xs xs:text-sm bg-slate-800 rounded-lg high-contrast:bg-slate-950 high-contrast:border high-contrast:border-slate-300 h-full"
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
              :aria-pressed="selectedSize === size && selectedQuantity === quantity && !isCustomQuantitySelected"
              class="p-2 xs:p-3 cursor-pointer text-center text-xs xs:text-sm font-medium transition-all duration-250 rounded-lg border-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px] reduced-motion:transition-none"
              role="gridcell"
              :tabindex="getTabIndex(size, quantity)"
            >
              <div class="flex flex-col justify-center min-h-[2rem] xs:min-h-[2.5rem]">
                <span class="font-semibold text-xs xs:text-sm">
                  ${{ formatPrice(getPrice(size, quantity)) }}
                </span>
              </div>
            </button>

            <!-- Custom quantity input cell for this row -->
            <div
              :class="[
                'p-1 xs:p-1.5 rounded-lg border-2 border-dashed transition-all duration-200 min-h-[44px] flex items-center justify-center',
                getCustomCellClasses(size)
              ]"
              role="gridcell"
              :aria-label="`Custom quantity input for size ${size} inches`"
            >
              <template v-if="showCustomColumn">
                <input
                  v-model="customInputs[size]"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  placeholder="Qty"
                  @input="handleCustomInput(size)"
                  @keydown.enter="applyCustomQuantity(size)"
                  @blur="applyCustomQuantity(size)"
                  :class="[
                    'w-full h-full px-2 py-1.5 rounded text-center text-xs xs:text-sm font-medium transition-all duration-200',
                    'bg-transparent border-0 text-slate-100 placeholder-slate-500',
                    'focus:outline-none focus:bg-slate-800/50'
                  ]"
                  :aria-label="`Enter custom quantity for size ${size} inches`"
                />
              </template>
            </div>
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
          <span
            v-if="isCustomQuantitySelected"
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50"
          >
            Custom
          </span>
        </div>
        <div class="text-left sm:text-right">
          <div class="text-sm text-slate-400">
            Unit Price: ${{ formatPrice(unitPrice) }}
            <span v-if="isCustomQuantitySelected" class="text-blue-400">(interpolated)</span>
          </div>
          <div class="text-lg font-bold text-slate-100 high-contrast:text-white">
            Base Total: ${{ formatPrice(baseTotal) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Divider after table block -->
    <div class="border-t border-slate-700 my-4"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import type { CoinColorOption } from '~/types/pricing';
import { COIN_SIZES, COIN_QUANTITIES } from '~/data/pricing';
import Button from '~/components/ui/Button.vue';

interface Props {
  colorOption: CoinColorOption;
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
const sizes = COIN_SIZES;
const quantities = COIN_QUANTITIES;

// Custom quantity column state
const showCustomColumn = ref(false);
const customInputs = reactive<Record<string, string>>({});

// Toggle custom quantity column visibility
const toggleCustomQuantityColumn = () => {
  showCustomColumn.value = !showCustomColumn.value;
  if (!showCustomColumn.value) {
    // Clear all custom inputs when hiding the column
    for (const size of sizes) {
      customInputs[size] = '';
    }
  }
};

// Handle custom quantity input for a specific size
const handleCustomInput = (size: string) => {
  const value = customInputs[size]?.trim() || '';

  // Only allow digits
  if (value && !/^\d*$/.test(value)) {
    customInputs[size] = value.replace(/\D/g, '');
  }
};

// Apply custom quantity - this is called on Enter or blur
const applyCustomQuantity = (size: string) => {
  const value = customInputs[size]?.trim();
  if (!value) return;

  const numValue = parseInt(value, 10);
  if (isNaN(numValue) || numValue < 1) return;

  // Emit the selection - this takes precedence as the last action
  emit('selection-change', size, numValue);
};

// Interpolate price for custom quantities
const getInterpolatedPrice = (size: string, quantity: number): number => {
  const pricing = props.colorOption.pricing[size];
  if (!pricing) return 0;

  const sortedQuantities = [...quantities].sort((a, b) => a - b);

  // If quantity matches a tier exactly, return that price
  if (pricing[quantity] !== undefined) {
    return pricing[quantity];
  }

  // Find bounding quantities for interpolation
  let lowerQty = sortedQuantities[0];
  let upperQty = sortedQuantities[sortedQuantities.length - 1];

  for (let i = 0; i < sortedQuantities.length - 1; i++) {
    if (quantity > sortedQuantities[i] && quantity < sortedQuantities[i + 1]) {
      lowerQty = sortedQuantities[i];
      upperQty = sortedQuantities[i + 1];
      break;
    }
  }

  // Handle edge cases (below minimum or above maximum)
  if (quantity <= sortedQuantities[0]) {
    return pricing[sortedQuantities[0]];
  }
  if (quantity >= sortedQuantities[sortedQuantities.length - 1]) {
    return pricing[sortedQuantities[sortedQuantities.length - 1]];
  }

  // Linear interpolation
  const lowerPrice = pricing[lowerQty];
  const upperPrice = pricing[upperQty];
  const ratio = (quantity - lowerQty) / (upperQty - lowerQty);

  return lowerPrice + (upperPrice - lowerPrice) * ratio;
};

// Check if current selection is a custom quantity (not in standard tiers)
const isCustomQuantitySelected = computed(() => {
  if (!props.selectedQuantity) return false;
  return !quantities.includes(props.selectedQuantity);
});

// Dynamic grid classes based on visible columns
const gridClasses = computed(() => {
  const baseCount = visibleQuantities.value.length + 2; // +1 for size column, +1 for custom column
  return `grid gap-1 mb-4 grid-cols-${baseCount}`;
});

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
    // First check if this is a standard quantity
    const price = props.colorOption.pricing[size]?.[quantity];
    if (price !== undefined && price >= 0) {
      return price;
    }

    // For custom quantities, use interpolation
    return getInterpolatedPrice(size, quantity);
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

    // Clear the custom input for this size when a standard cell is clicked
    // This ensures "last edit wins" behavior
    if (customInputs[size]) {
      customInputs[size] = '';
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
    return `bg-blue-900/30 border-blue-500 text-blue-200 shadow-md accent-ring accent-glow high-contrast:bg-blue-800 high-contrast:border-blue-300 high-contrast:text-white ${baseClasses}`;
  } else if (isHovered) {
    return `bg-slate-700/50 border-slate-500 text-slate-200 shadow-md ${baseClasses}`;
  }

  return `bg-slate-800/90 border-slate-600 text-slate-300 gradient-surface hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:shadow-md ${baseClasses}`;
};

const getCustomCellClasses = (size: string): string => {
  // Check if this row has a custom quantity selected
  const isCustomSelected = props.selectedSize === size && isCustomQuantitySelected.value;

  if (isCustomSelected) {
    return 'border-blue-500 bg-blue-900/20';
  }

  if (showCustomColumn.value) {
    return 'border-slate-600 hover:border-slate-500';
  }

  return 'border-slate-700/50';
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

/* Dynamic grid columns - Tailwind can't handle dynamic values so we use CSS */
.grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.grid-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }
.grid-cols-7 { grid-template-columns: repeat(7, minmax(0, 1fr)); }
.grid-cols-8 { grid-template-columns: repeat(8, minmax(0, 1fr)); }
.grid-cols-9 { grid-template-columns: repeat(9, minmax(0, 1fr)); }
.grid-cols-10 { grid-template-columns: repeat(10, minmax(0, 1fr)); }

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
