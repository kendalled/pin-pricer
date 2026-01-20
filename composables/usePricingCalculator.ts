import { ref, computed, reactive, watch, readonly } from 'vue';
import type { 
  ProductionMethod,
  PlatingOption, 
  BackingOption, 
  PackagingOption, 
  OrderSelections, 
  PriceBreakdown 
} from '~/types/pricing';
import { 
  PRODUCTION_METHODS,
  PLATING_OPTIONS, 
  BACKING_OPTIONS, 
  PACKAGING_OPTIONS 
} from '~/data/pricing';
import { 
  calculatePriceBreakdown,
  calculateMoldFee,
  validateOrderSelections,
  isOrderComplete,
  validatePricingData
} from '~/utils/calculations';

export interface PricingCalculatorState {
  selectedProductionMethod: ProductionMethod | null;
  selectedPlatingType: PlatingOption | null;
  selectedSize: string | null;
  selectedQuantity: number | null;
  selectedBacking: BackingOption | null;
  selectedPackaging: PackagingOption | null;
  rushOrder: boolean;
}

export interface ValidationErrors {
  productionMethod?: string;
  platingType?: string;
  size?: string;
  quantity?: string;
  backing?: string;
  packaging?: string;
  general?: string[];
}

export function usePricingCalculator() {
  // Reactive state for all selections
  const state = reactive<PricingCalculatorState>({
    selectedProductionMethod: null,
    selectedPlatingType: null,
    selectedSize: null,
    selectedQuantity: null,
    selectedBacking: null,
    selectedPackaging: null,
    rushOrder: false
  });

  // Error state for validation
  const validationErrors = ref<ValidationErrors>({});
  const isCalculating = ref(false);

  // Validate pricing data on initialization
  const dataValidation = validatePricingData(PRODUCTION_METHODS, PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS);
  if (!dataValidation.isValid) {
    console.error('Pricing data validation failed:', dataValidation.errors);
    validationErrors.value.general = dataValidation.errors;
  }

  // Computed properties for derived state
  const isSelectionComplete = computed(() => {
    return !!(
      state.selectedProductionMethod &&
      state.selectedPlatingType &&
      state.selectedSize &&
      state.selectedQuantity &&
      state.selectedBacking &&
      state.selectedPackaging
    );
  });

  const currentSelections = computed((): Partial<OrderSelections> => {
    return {
      productionMethod: state.selectedProductionMethod || undefined,
      platingType: state.selectedPlatingType || undefined,
      size: state.selectedSize || undefined,
      quantity: state.selectedQuantity || undefined,
      backing: state.selectedBacking || undefined,
      packaging: state.selectedPackaging || undefined,
      rushOrder: state.rushOrder
    };
  });

  const priceBreakdown = computed((): PriceBreakdown | null => {
    if (!isSelectionComplete.value) {
      return null;
    }

    try {
      isCalculating.value = true;
      const breakdown = calculatePriceBreakdown(currentSelections.value as OrderSelections);
      return breakdown;
    } catch (error) {
      console.error('Price calculation error:', error);
      validationErrors.value.general = ['Error calculating price. Please check your selections.'];
      return null;
    } finally {
      isCalculating.value = false;
    }
  });

  // Mold fee specific computed properties for display logic
  const moldFeeInfo = computed(() => {
    if (!state.selectedSize || !state.selectedQuantity) {
      return {
        applicable: false,
        fee: 0,
        waived: false,
        reason: null
      };
    }

    try {
      const result = calculateMoldFee(state.selectedSize, state.selectedQuantity);
      return {
        applicable: true,
        fee: result.fee,
        waived: result.waived,
        reason: result.reason || null
      };
    } catch (error) {
      console.error('Error calculating mold fee info:', error);
      return {
        applicable: false,
        fee: 0,
        waived: false,
        reason: 'Error calculating mold fee'
      };
    }
  });

  const hasMoldFee = computed(() => {
    return moldFeeInfo.value.applicable && moldFeeInfo.value.fee > 0 && !moldFeeInfo.value.waived;
  });

  const moldFeeWaived = computed(() => {
    return moldFeeInfo.value.applicable && moldFeeInfo.value.waived;
  });

  const moldFeeAmount = computed(() => {
    return moldFeeInfo.value.fee;
  });

  const moldFeeWaivedReason = computed(() => {
    return moldFeeInfo.value.reason;
  });

  // Validation computed property
  const validationStatus = computed(() => {
    const errors = validateOrderSelections(currentSelections.value);
    const hasErrors = errors.length > 0;
    
    return {
      isValid: !hasErrors,
      errors,
      isComplete: isOrderComplete(currentSelections.value)
    };
  });

  // Methods for handling state changes
  const setProductionMethod = (productionMethod: ProductionMethod) => {
    state.selectedProductionMethod = productionMethod;
    clearValidationError('productionMethod');
    
    // Reset size selection when production method changes if the size doesn't exist
    // Custom quantities are allowed, so we only validate the size exists
    if (state.selectedSize) {
      const hasSizeData = productionMethod.pricing[state.selectedSize];
      if (!hasSizeData) {
        state.selectedSize = null;
        state.selectedQuantity = null;
      }
    }
  };

  const setPlatingType = (platingType: PlatingOption) => {
    state.selectedPlatingType = platingType;
    clearValidationError('platingType');
  };

  const setSizeAndQuantity = (size: string, quantity: number) => {
    if (!state.selectedProductionMethod) {
      setValidationError('productionMethod', 'Please select a production method first');
      return;
    }

    // Validate the size exists in the pricing matrix
    const sizeData = state.selectedProductionMethod.pricing[size];
    if (!sizeData) {
      setValidationError('general', [`Invalid size "${size}"`]);
      return;
    }

    // Validate quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity < 1) {
      setValidationError('general', [`Invalid quantity "${quantity}" - must be a positive whole number`]);
      return;
    }

    // For custom quantities, we allow any positive integer
    // The price will be interpolated in calculatePriceBreakdown
    state.selectedSize = size;
    state.selectedQuantity = quantity;
    clearValidationError('size');
    clearValidationError('quantity');
    clearValidationError('general');
  };

  const setBacking = (backing: BackingOption) => {
    state.selectedBacking = backing;
    clearValidationError('backing');
  };

  const setPackaging = (packaging: PackagingOption) => {
    state.selectedPackaging = packaging;
    clearValidationError('packaging');
  };

  const setRushOrder = (enabled: boolean) => {
    state.rushOrder = enabled;
  };

  const resetSelections = () => {
    state.selectedProductionMethod = null;
    state.selectedPlatingType = null;
    state.selectedSize = null;
    state.selectedQuantity = null;
    state.selectedBacking = null;
    state.selectedPackaging = null;
    state.rushOrder = false;
    validationErrors.value = {};
  };

  const resetModifications = () => {
    state.selectedBacking = null;
    state.selectedPackaging = null;
    state.rushOrder = false;
    clearValidationError('backing');
    clearValidationError('packaging');
  };

  // Validation helper methods
  const setValidationError = (field: keyof ValidationErrors, message: string | string[]) => {
    if (field === 'general') {
      validationErrors.value.general = Array.isArray(message) ? message : [message];
    } else {
      validationErrors.value[field] = Array.isArray(message) ? message[0] : message;
    }
  };

  const clearValidationError = (field: keyof ValidationErrors) => {
    if (field === 'general') {
      validationErrors.value.general = undefined;
    } else {
      validationErrors.value[field] = undefined;
    }
  };

  const clearAllValidationErrors = () => {
    validationErrors.value = {};
  };

  // Get available options
  const getAvailableProductionMethods = () => PRODUCTION_METHODS;
  const getAvailablePlatingOptions = () => PLATING_OPTIONS;
  const getAvailableBackingOptions = () => BACKING_OPTIONS;
  const getAvailablePackagingOptions = () => PACKAGING_OPTIONS;

  // Get available sizes and quantities for current production method
  const getAvailableSizes = computed(() => {
    if (!state.selectedProductionMethod) return [];
    return Object.keys(state.selectedProductionMethod.pricing);
  });

  const getAvailableQuantities = computed(() => {
    if (!state.selectedProductionMethod || !state.selectedSize) return [];
    const sizeData = state.selectedProductionMethod.pricing[state.selectedSize];
    return sizeData ? Object.keys(sizeData).map(Number) : [];
  });

  // Watch for changes and perform validation
  watch(
    () => currentSelections.value,
    (newSelections) => {
      // Clear general errors when selections change
      if (validationErrors.value.general) {
        clearValidationError('general');
      }
      
      // Validate individual fields
      if (newSelections.productionMethod && validationErrors.value.productionMethod) {
        clearValidationError('productionMethod');
      }
      if (newSelections.platingType && validationErrors.value.platingType) {
        clearValidationError('platingType');
      }
      if (newSelections.size && validationErrors.value.size) {
        clearValidationError('size');
      }
      if (newSelections.quantity && validationErrors.value.quantity) {
        clearValidationError('quantity');
      }
      if (newSelections.backing && validationErrors.value.backing) {
        clearValidationError('backing');
      }
      if (newSelections.packaging && validationErrors.value.packaging) {
        clearValidationError('packaging');
      }
    },
    { deep: true }
  );

  return {
    // State
    state: readonly(state),
    validationErrors: readonly(validationErrors),
    isCalculating: readonly(isCalculating),
    
    // Computed properties
    isSelectionComplete,
    currentSelections,
    priceBreakdown,
    validationStatus,
    getAvailableSizes,
    getAvailableQuantities,
    
    // Mold fee computed properties
    moldFeeInfo: readonly(moldFeeInfo),
    hasMoldFee: readonly(hasMoldFee),
    moldFeeWaived: readonly(moldFeeWaived),
    moldFeeAmount: readonly(moldFeeAmount),
    moldFeeWaivedReason: readonly(moldFeeWaivedReason),
    
    // Methods
    setProductionMethod,
    setPlatingType,
    setSizeAndQuantity,
    setBacking,
    setPackaging,
    setRushOrder,
    resetSelections,
    resetModifications,
    
    // Validation methods
    setValidationError,
    clearValidationError,
    clearAllValidationErrors,
    
    // Data access methods
    getAvailableProductionMethods,
    getAvailablePlatingOptions,
    getAvailableBackingOptions,
    getAvailablePackagingOptions
  };
}