import { ref, computed, reactive, watch, readonly } from 'vue';
import type { 
  CoinColorOption,
  PlatingOption, 
  PackagingOption, 
  CoinOrderSelections, 
  CoinPriceBreakdown,
  MoldFeeCalculationResult,
  CoinDesignSides
} from '~/types/pricing';
import { COIN_MOLD_FEE_CONFIG } from '~/types/pricing';
import { 
  COIN_COLOR_OPTIONS,
  PLATING_OPTIONS, 
  PACKAGING_OPTIONS,
  COIN_SIZES,
  COIN_QUANTITIES
} from '~/data/pricing';

export interface CoinPricingCalculatorState {
  selectedColorOption: CoinColorOption | null;
  selectedPlatingType: PlatingOption | null;
  selectedSize: string | null;
  selectedQuantity: number | null;
  selectedPackaging: PackagingOption | null;
  designSides: CoinDesignSides;
  rushOrder: boolean;
}

export interface CoinValidationErrors {
  colorOption?: string;
  platingType?: string;
  size?: string;
  quantity?: string;
  packaging?: string;
  general?: string[];
}

/**
 * Interpolate unit price for custom quantities not in standard tiers
 */
function interpolateUnitPrice(
  colorOption: CoinColorOption,
  size: string,
  quantity: number
): number {
  const pricing = colorOption.pricing[size];
  if (!pricing) {
    throw new Error(`No pricing data for size "${size}"`);
  }

  // If quantity matches a tier exactly, return that price
  if (pricing[quantity] !== undefined) {
    return pricing[quantity];
  }

  const sortedQuantities = [...COIN_QUANTITIES].sort((a, b) => a - b);

  // Handle edge cases (below minimum or above maximum)
  if (quantity <= sortedQuantities[0]) {
    return pricing[sortedQuantities[0]];
  }
  if (quantity >= sortedQuantities[sortedQuantities.length - 1]) {
    return pricing[sortedQuantities[sortedQuantities.length - 1]];
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

  // Linear interpolation
  const lowerPrice = pricing[lowerQty];
  const upperPrice = pricing[upperQty];
  const ratio = (quantity - lowerQty) / (upperQty - lowerQty);

  return lowerPrice + (upperPrice - lowerPrice) * ratio;
}

/**
 * Calculate the base price for a given color option, size, and quantity
 */
function calculateBasePrice(
  colorOption: CoinColorOption,
  size: string,
  quantity: number
): number {
  const unitPrice = interpolateUnitPrice(colorOption, size, quantity);
  return unitPrice * quantity;
}

/**
 * Get the unit price for a given color option, size, and quantity
 */
function getUnitPrice(
  colorOption: CoinColorOption,
  size: string,
  quantity: number
): number {
  return interpolateUnitPrice(colorOption, size, quantity);
}

/**
 * Calculate plating cost
 */
function calculatePlatingCost(plating: PlatingOption, quantity: number): number {
  if (!plating || plating.price < 0 || quantity <= 0) return 0;
  return plating.price * quantity;
}

/**
 * Calculate packaging cost
 */
function calculatePackagingCost(packaging: PackagingOption, quantity: number): number {
  if (!packaging || packaging.price < 0 || quantity <= 0) return 0;
  return packaging.price * quantity;
}

/**
 * Parse size string to numeric value
 */
function parseCoinSize(sizeString: string): number {
  const trimmedSize = sizeString.trim();
  const sizeNumber = parseFloat(trimmedSize);
  if (isNaN(sizeNumber) || sizeNumber <= 0) {
    throw new Error(`Invalid size format: ${sizeString}`);
  }
  return sizeNumber;
}

/**
 * Get mold fee for a given size based on coin-specific thresholds
 */
function getMoldFeeForSize(sizeInches: number): number {
  for (const threshold of COIN_MOLD_FEE_CONFIG.SIZE_THRESHOLDS) {
    if (sizeInches <= threshold.maxSize) {
      return threshold.fee;
    }
  }
  return COIN_MOLD_FEE_CONFIG.SIZE_THRESHOLDS[COIN_MOLD_FEE_CONFIG.SIZE_THRESHOLDS.length - 1].fee;
}

/**
 * Calculate mold fee with quantity exemption logic (coins: 300+ waived)
 * For two-sided designs, the fee is applied twice
 */
function calculateMoldFee(size: string, quantity: number, designSides: CoinDesignSides): MoldFeeCalculationResult {
  // Check quantity exemption first (300+ pieces get waived fee for coins)
  if (quantity >= COIN_MOLD_FEE_CONFIG.QUANTITY_EXEMPTION_THRESHOLD) {
    return {
      fee: 0,
      waived: true,
      reason: 'High volume exemption (300+ qty)'
    };
  }

  // Parse size and get fee
  const sizeInches = parseCoinSize(size);
  const baseFee = getMoldFeeForSize(sizeInches);
  
  // Apply fee twice for two-sided designs
  const fee = designSides === 'two-sided' ? baseFee * 2 : baseFee;

  return {
    fee,
    waived: false
  };
}

/**
 * Calculate rush fee (20% of subtotal)
 */
function calculateRushFee(
  basePrice: number,
  platingCost: number,
  packagingCost: number,
  moldFee: number
): number {
  const subtotal = basePrice + platingCost + packagingCost + moldFee;
  return subtotal * 0.20;
}

/**
 * Calculate complete coin price breakdown
 */
function calculateCoinPriceBreakdown(selections: CoinOrderSelections): CoinPriceBreakdown {
  const basePrice = calculateBasePrice(
    selections.colorOption,
    selections.size,
    selections.quantity
  );
  
  const unitPrice = getUnitPrice(
    selections.colorOption,
    selections.size,
    selections.quantity
  );
  
  const platingCost = calculatePlatingCost(selections.platingType, selections.quantity);
  const packagingCost = calculatePackagingCost(selections.packaging, selections.quantity);
  
  // Calculate mold fee (doubled for two-sided designs)
  const moldFeeResult = calculateMoldFee(selections.size, selections.quantity, selections.designSides);
  const moldFee = moldFeeResult.fee;
  const moldFeeWaived = moldFeeResult.waived;
  
  const rushFee = selections.rushOrder 
    ? calculateRushFee(basePrice, platingCost, packagingCost, moldFee)
    : 0;
  
  const total = basePrice + platingCost + packagingCost + moldFee + rushFee;
  
  return {
    basePrice,
    platingCost,
    packagingCost,
    rushFee,
    moldFee,
    moldFeeWaived,
    total,
    unitPrice
  };
}

export function useCoinPricingCalculator() {
  // Reactive state for all selections
  const state = reactive<CoinPricingCalculatorState>({
    selectedColorOption: null,
    selectedPlatingType: null,
    selectedSize: null,
    selectedQuantity: null,
    selectedPackaging: null,
    designSides: 'one-sided',
    rushOrder: false
  });

  // Error state for validation
  const validationErrors = ref<CoinValidationErrors>({});
  const isCalculating = ref(false);

  // Computed properties for derived state
  const isSelectionComplete = computed(() => {
    return !!(
      state.selectedColorOption &&
      state.selectedPlatingType &&
      state.selectedSize &&
      state.selectedQuantity &&
      state.selectedPackaging
    );
  });

  const currentSelections = computed((): Partial<CoinOrderSelections> => {
    return {
      colorOption: state.selectedColorOption || undefined,
      platingType: state.selectedPlatingType || undefined,
      size: state.selectedSize || undefined,
      quantity: state.selectedQuantity || undefined,
      packaging: state.selectedPackaging || undefined,
      designSides: state.designSides,
      rushOrder: state.rushOrder
    };
  });

  const priceBreakdown = computed((): CoinPriceBreakdown | null => {
    if (!isSelectionComplete.value) {
      return null;
    }

    try {
      isCalculating.value = true;
      const breakdown = calculateCoinPriceBreakdown(currentSelections.value as CoinOrderSelections);
      return breakdown;
    } catch (error) {
      console.error('Price calculation error:', error);
      validationErrors.value.general = ['Error calculating price. Please check your selections.'];
      return null;
    } finally {
      isCalculating.value = false;
    }
  });

  // Validation computed property
  const validationStatus = computed(() => {
    const errors: string[] = [];
    
    if (!state.selectedColorOption) errors.push('Color option is required');
    if (!state.selectedPlatingType) errors.push('Plating type is required');
    if (!state.selectedSize) errors.push('Size selection is required');
    if (!state.selectedQuantity) errors.push('Quantity selection is required');
    if (!state.selectedPackaging) errors.push('Packaging option is required');
    
    return {
      isValid: errors.length === 0,
      errors,
      isComplete: isSelectionComplete.value
    };
  });

  // Methods for handling state changes
  const setColorOption = (colorOption: CoinColorOption) => {
    state.selectedColorOption = colorOption;
    clearValidationError('colorOption');
    
    // Reset size selection when color option changes if the size doesn't exist
    if (state.selectedSize) {
      const hasSizeData = colorOption.pricing[state.selectedSize];
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
    if (!state.selectedColorOption) {
      setValidationError('colorOption', 'Please select a color option first');
      return;
    }

    // Validate the size exists in the pricing matrix
    const sizeData = state.selectedColorOption.pricing[size];
    if (!sizeData) {
      setValidationError('general', [`Invalid size "${size}"`]);
      return;
    }

    // Validate quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity < 1) {
      setValidationError('general', [`Invalid quantity "${quantity}" - must be a positive whole number`]);
      return;
    }

    state.selectedSize = size;
    state.selectedQuantity = quantity;
    clearValidationError('size');
    clearValidationError('quantity');
    clearValidationError('general');
  };

  const setPackaging = (packaging: PackagingOption) => {
    state.selectedPackaging = packaging;
    clearValidationError('packaging');
  };

  const setDesignSides = (sides: CoinDesignSides) => {
    state.designSides = sides;
  };

  const setRushOrder = (enabled: boolean) => {
    state.rushOrder = enabled;
  };

  const resetSelections = () => {
    state.selectedColorOption = null;
    state.selectedPlatingType = null;
    state.selectedSize = null;
    state.selectedQuantity = null;
    state.selectedPackaging = null;
    state.designSides = 'one-sided';
    state.rushOrder = false;
    validationErrors.value = {};
  };

  // Validation helper methods
  const setValidationError = (field: keyof CoinValidationErrors, message: string | string[]) => {
    if (field === 'general') {
      validationErrors.value.general = Array.isArray(message) ? message : [message];
    } else {
      validationErrors.value[field] = Array.isArray(message) ? message[0] : message;
    }
  };

  const clearValidationError = (field: keyof CoinValidationErrors) => {
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
  const getAvailableColorOptions = () => COIN_COLOR_OPTIONS;
  const getAvailablePlatingOptions = () => PLATING_OPTIONS;
  const getAvailablePackagingOptions = () => PACKAGING_OPTIONS;

  // Get available sizes and quantities for current color option
  const getAvailableSizes = computed(() => {
    if (!state.selectedColorOption) return [];
    return Object.keys(state.selectedColorOption.pricing);
  });

  const getAvailableQuantities = computed(() => {
    if (!state.selectedColorOption || !state.selectedSize) return [];
    const sizeData = state.selectedColorOption.pricing[state.selectedSize];
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
      if (newSelections.colorOption && validationErrors.value.colorOption) {
        clearValidationError('colorOption');
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
    
    // Methods
    setColorOption,
    setPlatingType,
    setSizeAndQuantity,
    setPackaging,
    setDesignSides,
    setRushOrder,
    resetSelections,
    
    // Validation methods
    setValidationError,
    clearValidationError,
    clearAllValidationErrors,
    
    // Data access methods
    getAvailableColorOptions,
    getAvailablePlatingOptions,
    getAvailablePackagingOptions
  };
}
