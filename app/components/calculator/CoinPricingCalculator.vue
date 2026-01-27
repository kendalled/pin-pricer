<template>
  <div class="pricing-calculator max-w-6xl mx-auto p-3 xs:p-4 sm:p-6 space-y-6 xs:space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl xs:text-3xl font-bold text-slate-50 mb-2 high-contrast:text-white leading-tight">
        Challenge Coin Price Calculator
      </h1>
      <p class="text-sm xs:text-base text-slate-400 high-contrast:text-slate-300">
        Get instant pricing for your custom challenge coins
      </p>
    </div>

    <!-- Progress Indicator -->
    <div
      class="flex flex-row items-center justify-center space-x-2 sm:space-x-4 mb-6 xs:mb-8"
      role="progressbar"
      aria-label="Calculator progress"
      :aria-valuenow="getProgressValue()"
      aria-valuemin="0"
      aria-valuemax="4"
    >
      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          state.selectedColorOption
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700 text-slate-400'
        ]">
          1
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          state.selectedColorOption ? 'text-slate-200' : 'text-slate-400'
        ]">
          Color
        </span>
      </div>

      <div class="hidden sm:block w-4 h-0.5 bg-slate-700"></div>

      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          (state.selectedSize && state.selectedQuantity)
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700 text-slate-400'
        ]">
          2
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          (state.selectedSize && state.selectedQuantity) ? 'text-slate-200' : 'text-slate-400'
        ]">
          Size
        </span>
      </div>

      <div class="hidden sm:block w-4 h-0.5 bg-slate-700"></div>

      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          state.selectedPlatingType
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700 text-slate-400'
        ]">
          3
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          state.selectedPlatingType ? 'text-slate-200' : 'text-slate-400'
        ]">
          Plating
        </span>
      </div>

      <div class="hidden sm:block w-4 h-0.5 bg-slate-700"></div>

      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          state.selectedPackaging
            ? 'bg-blue-600 text-white'
            : 'bg-slate-700 text-slate-400'
        ]">
          4
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          state.selectedPackaging ? 'text-slate-200' : 'text-slate-400'
        ]">
          Options
        </span>
      </div>
    </div>

    <!-- Validation Errors -->
    <div v-if="validationErrors.general && validationErrors.general.length > 0" 
         class="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-2">
        <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-red-200 font-medium">System Errors</h3>
      </div>
      <ul class="text-red-300 text-sm space-y-1">
        <li v-for="error in validationErrors.general" :key="error">{{ error }}</li>
      </ul>
      <div class="mt-3 pt-3 border-t border-red-700/30">
        <Button 
          variant="secondary" 
          size="sm" 
          @click="handleErrorRecovery"
          class="bg-red-800 hover:bg-red-700 border-red-600"
        >
          Try to Recover
        </Button>
      </div>
    </div>

    <!-- Validation Status Summary -->
    <div v-if="!validationStatus.isComplete && !validationErrors.general?.length" 
         class="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-3">
        <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-blue-200 font-medium">Complete Your Selection</h3>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div :class="[
          'flex items-center space-x-2 p-2 rounded',
          state.selectedColorOption ? 'text-green-300 bg-green-900/20' : 'text-blue-300 bg-blue-900/20'
        ]">
          <svg v-if="state.selectedColorOption" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <div v-else class="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
          <span>Color Option</span>
        </div>

        <div :class="[
          'flex items-center space-x-2 p-2 rounded',
          (state.selectedSize && state.selectedQuantity) ? 'text-green-300 bg-green-900/20' : 'text-blue-300 bg-blue-900/20'
        ]">
          <svg v-if="state.selectedSize && state.selectedQuantity" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <div v-else class="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
          <span>Size & Quantity</span>
        </div>

        <div :class="[
          'flex items-center space-x-2 p-2 rounded',
          state.selectedPlatingType ? 'text-green-300 bg-green-900/20' : 'text-blue-300 bg-blue-900/20'
        ]">
          <svg v-if="state.selectedPlatingType" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <div v-else class="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
          <span>Plating Type</span>
        </div>

        <div :class="[
          'flex items-center space-x-2 p-2 rounded',
          state.selectedPackaging ? 'text-green-300 bg-green-900/20' : 'text-blue-300 bg-blue-900/20'
        ]">
          <svg v-if="state.selectedPackaging" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <div v-else class="w-4 h-4 border-2 border-blue-400 rounded-full"></div>
          <span>Packaging</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Color Option Selection -->
    <Card>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-50">
            Step 1: Choose Color Option
          </h2>
          <Badge v-if="validationErrors.colorOption" variant="error" size="sm">
            Required
          </Badge>
        </div>
      </template>
      
      <CoinColorSelector
        :selected-color-option="state.selectedColorOption"
        @update:selected-color-option="handleColorOptionChange"
      />
      
      <div v-if="validationErrors.colorOption" class="mt-3 text-red-400 text-sm">
        {{ validationErrors.colorOption }}
      </div>
    </Card>

    <div class="border-t border-slate-700 my-6 xs:my-8"></div>

    <!-- Step 2: Size and Quantity Selection -->
    <Card v-if="state.selectedColorOption">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-50">
            Step 2: Select Size & Quantity
          </h2>
          <div class="flex gap-2">
            <Badge v-if="validationErrors.size" variant="error" size="sm">
              Size Required
            </Badge>
            <Badge v-if="validationErrors.quantity" variant="error" size="sm">
              Quantity Required
            </Badge>
          </div>
        </div>
      </template>

      <CoinPricingTable
        v-if="state.selectedColorOption"
        :color-option="state.selectedColorOption"
        :selected-size="state.selectedSize"
        :selected-quantity="state.selectedQuantity"
        @selection-change="handleSizeQuantityChange"
      />

      <div v-if="validationErrors.size || validationErrors.quantity" class="mt-3 text-red-400 text-sm">
        <div v-if="validationErrors.size">{{ validationErrors.size }}</div>
        <div v-if="validationErrors.quantity">{{ validationErrors.quantity }}</div>
      </div>
    </Card>

    <div class="border-t border-slate-700 my-6 xs:my-8"></div>

    <!-- Step 3: Plating Type Selection -->
    <Card v-if="state.selectedSize && state.selectedQuantity">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-50">
            Step 3: Choose Plating Type
          </h2>
          <Badge v-if="validationErrors.platingType" variant="error" size="sm">
            Required
          </Badge>
        </div>
      </template>

      <PlatingTypeSelector
        :selected-plating="state.selectedPlatingType"
        @update:selected-plating="handlePlatingTypeChange"
      />

      <div v-if="validationErrors.platingType" class="mt-3 text-red-400 text-sm">
        {{ validationErrors.platingType }}
      </div>
    </Card>

    <div class="border-t border-slate-700 my-6 xs:my-8"></div>

    <!-- Step 4: Packaging & Options -->
    <Card v-if="state.selectedPlatingType">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-50">
            Step 4: Choose Packaging & Options
          </h2>
          <Badge v-if="validationErrors.packaging" variant="error" size="sm">
            Packaging Required
          </Badge>
        </div>
      </template>
      
      <CoinModificationsPanel
        :selected-packaging="state.selectedPackaging"
        :design-sides="state.designSides"
        :rush-order="state.rushOrder"
        @packaging-change="handlePackagingChange"
        @design-sides-change="handleDesignSidesChange"
        @rush-toggle="handleRushToggle"
      />
      
      <div v-if="validationErrors.packaging" class="mt-3 text-red-400 text-sm">
        {{ validationErrors.packaging }}
      </div>
    </Card>

    <div class="border-t border-slate-700 my-6 xs:my-8"></div>

    <!-- Price Summary (Always Visible) -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Calculation Summary -->
      <CoinCalculationSummary
        :breakdown="priceBreakdown"
        :is-complete="isSelectionComplete"
      />
      
      <!-- Action Buttons -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-50">Actions</h3>
        </template>
        
        <div class="space-y-4">
          <!-- Generate Quote Button -->
          <Button
            :disabled="!isSelectionComplete || isCalculating"
            variant="primary"
            size="lg"
            class="w-full"
            @click="showQuote = true"
          >
            <template v-if="isCalculating">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </template>
            <template v-else>
              Generate Quote
            </template>
          </Button>
          
          <!-- Reset Button -->
          <Button
            variant="secondary"
            size="md"
            class="w-full"
            @click="handleReset"
          >
            Reset Calculator
          </Button>
          
          <!-- Validation Status -->
          <div class="text-sm text-slate-400">
            <div v-if="!validationStatus.isComplete" class="space-y-1">
              <div class="font-medium text-slate-300">Complete these steps:</div>
              <ul class="space-y-1 ml-4">
                <li v-if="!state.selectedColorOption" class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span>Select color option</span>
                </li>
                <li v-if="!state.selectedSize || !state.selectedQuantity" class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span>Choose size and quantity</span>
                </li>
                <li v-if="!state.selectedPlatingType" class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span>Select plating type</span>
                </li>
                <li v-if="!state.selectedPackaging" class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span>Choose packaging option</span>
                </li>
              </ul>
            </div>
            <div v-else class="flex items-center space-x-2 text-green-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Ready to generate quote</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Quote Display Modal/Overlay -->
    <div v-if="showQuote && isSelectionComplete && priceBreakdown" 
         class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
         @click.self="showQuote = false">
      <div class="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-slate-50">Quote Details</h2>
          <Button variant="ghost" size="sm" @click="showQuote = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        <div class="p-6">
          <CoinQuoteDisplay
            :selections="currentSelections as CoinOrderSelections"
            :breakdown="priceBreakdown"
            @edit="showQuote = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CoinColorOption, PlatingOption, PackagingOption, CoinOrderSelections, CoinDesignSides } from '~/types/pricing';
import { useCoinPricingCalculator } from '~/composables/useCoinPricingCalculator';
import CoinColorSelector from '~/components/CoinColorSelector.vue';
import PlatingTypeSelector from '~/components/PlatingTypeSelector.vue';
import CoinPricingTable from '~/components/calculator/CoinPricingTable.vue';
import CoinModificationsPanel from '~/components/calculator/CoinModificationsPanel.vue';
import CoinCalculationSummary from '~/components/calculator/CoinCalculationSummary.vue';
import CoinQuoteDisplay from '~/components/calculator/CoinQuoteDisplay.vue';
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';
import Badge from '~/components/ui/Badge.vue';

// Use the coin pricing calculator composable
const {
  state,
  validationErrors,
  isCalculating,
  isSelectionComplete,
  currentSelections,
  priceBreakdown,
  validationStatus,
  setColorOption,
  setPlatingType,
  setSizeAndQuantity,
  setPackaging,
  setDesignSides,
  setRushOrder,
  resetSelections,
  clearAllValidationErrors
} = useCoinPricingCalculator();

// Local state for UI
const showQuote = ref(false);

// Event handlers
const handleColorOptionChange = (colorOption: CoinColorOption) => {
  setColorOption(colorOption);
};

const handlePlatingTypeChange = (platingType: PlatingOption) => {
  setPlatingType(platingType);
};

const handleSizeQuantityChange = (size: string, quantity: number) => {
  setSizeAndQuantity(size, quantity);
};

const handlePackagingChange = (packaging: PackagingOption) => {
  setPackaging(packaging);
};

const handleDesignSidesChange = (sides: CoinDesignSides) => {
  setDesignSides(sides);
};

const handleRushToggle = (enabled: boolean) => {
  setRushOrder(enabled);
};

const handleReset = () => {
  showQuote.value = false;
  resetSelections();
};

const handleErrorRecovery = () => {
  try {
    // Clear all validation errors
    clearAllValidationErrors();
    
    // Reset to a clean state
    resetSelections();
    
    // Force a re-render by toggling the quote display
    showQuote.value = false;
    
    console.log('Error recovery attempted - calculator reset to clean state');
  } catch (error) {
    console.error('Error during recovery attempt:', error);
    // If recovery fails, at least clear the error display
    clearAllValidationErrors();
  }
};

// Progress calculation for accessibility
const getProgressValue = (): number => {
  let progress = 0;
  if (state.selectedColorOption) progress++;
  if (state.selectedSize && state.selectedQuantity) progress++;
  if (state.selectedPlatingType) progress++;
  if (state.selectedPackaging) progress++;
  return progress;
};
</script>

<style scoped>
/* Smooth transitions for all interactive elements */
.pricing-calculator * {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for quote modal */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 8px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #1e293b;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
