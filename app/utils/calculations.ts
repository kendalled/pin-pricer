import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption, OrderSelections, PriceBreakdown, MoldFeeCalculationResult } from '~/types/pricing';
import { MOLD_FEE_CONFIG } from '~/types/pricing';

// Standard quantity tiers for interpolation
const STANDARD_QUANTITIES = [100, 200, 300, 500, 750, 1000, 2000];

/**
 * Interpolate unit price for custom quantities not in standard tiers
 */
export function interpolateUnitPrice(
  productionMethod: ProductionMethod,
  size: string,
  quantity: number
): number {
  const pricing = productionMethod.pricing[size];
  if (!pricing) {
    throw new Error(`No pricing data for size "${size}"`);
  }

  // If quantity matches a tier exactly, return that price
  if (pricing[quantity] !== undefined) {
    return pricing[quantity];
  }

  const sortedQuantities = [...STANDARD_QUANTITIES].sort((a, b) => a - b);

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
 * Calculate the base price for a given production method, size, and quantity
 */
export function calculateBasePrice(
  productionMethod: ProductionMethod,
  size: string,
  quantity: number
): number {
  try {
    // Validate inputs
    if (!productionMethod || !productionMethod.pricing) {
      throw new Error('Invalid production method provided');
    }
    if (!size || typeof size !== 'string') {
      throw new Error('Invalid size provided');
    }
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Invalid quantity provided');
    }

    // Try to get direct price, otherwise interpolate
    let unitPrice = productionMethod.pricing[size]?.[quantity];
    if (unitPrice === undefined || typeof unitPrice !== 'number' || unitPrice <= 0) {
      // Use interpolation for custom quantities
      unitPrice = interpolateUnitPrice(productionMethod, size, quantity);
    }
    
    const basePrice = unitPrice * quantity;
    if (isNaN(basePrice) || !isFinite(basePrice) || basePrice < 0) {
      throw new Error('Calculated base price is invalid');
    }
    
    return basePrice;
  } catch (error) {
    console.error('Error calculating base price:', error);
    throw error; // Re-throw to be handled by calling function
  }
}

/**
 * Get the unit price for a given production method, size, and quantity
 */
export function getUnitPrice(
  productionMethod: ProductionMethod,
  size: string,
  quantity: number
): number {
  try {
    // Validate inputs
    if (!productionMethod || !productionMethod.pricing) {
      throw new Error('Invalid production method provided');
    }
    if (!size || typeof size !== 'string') {
      throw new Error('Invalid size provided');
    }
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Invalid quantity provided');
    }

    // Try to get direct price, otherwise interpolate
    let unitPrice = productionMethod.pricing[size]?.[quantity];
    if (unitPrice === undefined || typeof unitPrice !== 'number' || unitPrice <= 0) {
      // Use interpolation for custom quantities
      unitPrice = interpolateUnitPrice(productionMethod, size, quantity);
    }
    return unitPrice;
  } catch (error) {
    console.error('Error getting unit price:', error);
    throw error; // Re-throw to be handled by calling function
  }
}

/**
 * Calculate the setup fee for a production method
 */
export function calculateSetupFee(productionMethod: ProductionMethod): number {
  try {
    if (!productionMethod) {
      console.warn('No production method provided for setup fee calculation');
      return 0;
    }
    
    const setupFee = productionMethod.setupFee || 0;
    if (typeof setupFee !== 'number' || isNaN(setupFee) || setupFee < 0) {
      console.warn('Invalid setup fee value:', setupFee);
      return 0;
    }
    
    return setupFee;
  } catch (error) {
    console.error('Error calculating setup fee:', error);
    return 0;
  }
}

/**
 * Calculate the total cost for plating modifications
 */
export function calculatePlatingCost(
  plating: PlatingOption,
  quantity: number
): number {
  try {
    if (!plating) {
      console.warn('No plating option provided');
      return 0;
    }
    
    if (typeof plating.price !== 'number' || isNaN(plating.price) || plating.price < 0) {
      console.warn('Invalid plating price:', plating.price);
      return 0;
    }
    
    if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
      console.warn('Invalid quantity for plating cost:', quantity);
      return 0;
    }
    
    const cost = plating.price * quantity;
    if (isNaN(cost) || !isFinite(cost) || cost < 0) {
      console.warn('Invalid calculated plating cost:', cost);
      return 0;
    }
    
    return cost;
  } catch (error) {
    console.error('Error calculating plating cost:', error);
    return 0;
  }
}

/**
 * Calculate the total cost for backing modifications
 */
export function calculateBackingCost(
  backing: BackingOption,
  quantity: number
): number {
  try {
    if (!backing) {
      console.warn('No backing option provided');
      return 0;
    }
    
    if (typeof backing.price !== 'number' || isNaN(backing.price) || backing.price < 0) {
      console.warn('Invalid backing price:', backing.price);
      return 0;
    }
    
    if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
      console.warn('Invalid quantity for backing cost:', quantity);
      return 0;
    }
    
    const cost = backing.price * quantity;
    if (isNaN(cost) || !isFinite(cost) || cost < 0) {
      console.warn('Invalid calculated backing cost:', cost);
      return 0;
    }
    
    return cost;
  } catch (error) {
    console.error('Error calculating backing cost:', error);
    return 0;
  }
}

/**
 * Calculate the total cost for packaging modifications
 */
export function calculatePackagingCost(
  packaging: PackagingOption,
  quantity: number
): number {
  try {
    if (!packaging) {
      console.warn('No packaging option provided');
      return 0;
    }
    
    if (typeof packaging.price !== 'number' || isNaN(packaging.price) || packaging.price < 0) {
      console.warn('Invalid packaging price:', packaging.price);
      return 0;
    }
    
    if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
      console.warn('Invalid quantity for packaging cost:', quantity);
      return 0;
    }
    
    const cost = packaging.price * quantity;
    if (isNaN(cost) || !isFinite(cost) || cost < 0) {
      console.warn('Invalid calculated packaging cost:', cost);
      return 0;
    }
    
    return cost;
  } catch (error) {
    console.error('Error calculating packaging cost:', error);
    return 0;
  }
}

/**
 * Calculate the rush order fee (20% of subtotal)
 */
export function calculateRushFee(
  basePrice: number,
  setupFee: number,
  platingCost: number,
  backingCost: number,
  packagingCost: number,
  moldFee: number = 0
): number {
  try {
    // Validate all input values
    const values = [basePrice, setupFee, platingCost, backingCost, packagingCost, moldFee];
    for (const value of values) {
      if (typeof value !== 'number' || isNaN(value) || !isFinite(value) || value < 0) {
        console.warn('Invalid value for rush fee calculation:', value);
        return 0;
      }
    }
    
    const subtotal = basePrice + setupFee + platingCost + backingCost + packagingCost + moldFee;
    if (isNaN(subtotal) || !isFinite(subtotal) || subtotal < 0) {
      console.warn('Invalid subtotal for rush fee calculation:', subtotal);
      return 0;
    }
    
    const rushFee = subtotal * 0.20;
    if (isNaN(rushFee) || !isFinite(rushFee) || rushFee < 0) {
      console.warn('Invalid calculated rush fee:', rushFee);
      return 0;
    }
    
    return rushFee;
  } catch (error) {
    console.error('Error calculating rush fee:', error);
    return 0;
  }
}

/**
 * Parse pin size string to numeric value with validation
 */
export function parsePinSize(sizeString: string): number {
  try {
    // Validate input
    if (!sizeString || typeof sizeString !== 'string') {
      throw new Error('Invalid size provided for mold fee calculation');
    }

    // Remove any whitespace and convert to number
    const trimmedSize = sizeString.trim();
    if (trimmedSize === '') {
      throw new Error('Empty size string provided');
    }

    const sizeNumber = parseFloat(trimmedSize);
    
    // Validate parsed number
    if (isNaN(sizeNumber) || !isFinite(sizeNumber) || sizeNumber <= 0) {
      throw new Error(`Invalid size format: ${sizeString}`);
    }

    // Additional validation for reasonable size ranges (0.1" to 10")
    if (sizeNumber < 0.1 || sizeNumber > 10) {
      throw new Error(`Size out of reasonable range: ${sizeNumber}"`);
    }

    return sizeNumber;
  } catch (error) {
    console.error('Error parsing pin size:', error);
    throw error;
  }
}

/**
 * Get mold fee for a given size based on thresholds
 */
export function getMoldFeeForSize(sizeInches: number): number {
  try {
    // Validate input
    if (typeof sizeInches !== 'number' || isNaN(sizeInches) || !isFinite(sizeInches) || sizeInches <= 0) {
      throw new Error(`Invalid size for mold fee lookup: ${sizeInches}`);
    }

    // Find the appropriate fee threshold
    for (const threshold of MOLD_FEE_CONFIG.SIZE_THRESHOLDS) {
      if (sizeInches <= threshold.maxSize) {
        return threshold.fee;
      }
    }

    // Fallback - should not reach here due to Infinity threshold
    return MOLD_FEE_CONFIG.SIZE_THRESHOLDS[MOLD_FEE_CONFIG.SIZE_THRESHOLDS.length - 1].fee;
  } catch (error) {
    console.error('Error getting mold fee for size:', error);
    throw error;
  }
}

/**
 * Calculate mold fee with quantity exemption logic
 */
export function calculateMoldFee(size: string, quantity: number): MoldFeeCalculationResult {
  try {
    // Validate inputs
    if (!size || typeof size !== 'string') {
      throw new Error('Invalid size provided for mold fee calculation');
    }
    
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Invalid quantity provided for mold fee calculation');
    }

    // Check quantity exemption first (500+ pieces get waived fee)
    if (quantity >= MOLD_FEE_CONFIG.QUANTITY_EXEMPTION_THRESHOLD) {
      return {
        fee: 0,
        waived: true,
        reason: 'High volume exemption (500+ qty)'
      };
    }

    // Parse size and get fee
    const sizeInches = parsePinSize(size);
    const fee = getMoldFeeForSize(sizeInches);

    // Validate calculated fee
    if (typeof fee !== 'number' || isNaN(fee) || fee < 0) {
      throw new Error(`Invalid calculated mold fee: ${fee}`);
    }

    return {
      fee,
      waived: false
    };
  } catch (error) {
    console.error('Error calculating mold fee:', error);
    // Return safe fallback values
    return {
      fee: 0,
      waived: false,
      reason: 'Error calculating mold fee'
    };
  }
}

/**
 * Calculate the complete price breakdown for an order
 */
export function calculatePriceBreakdown(selections: OrderSelections): PriceBreakdown {
  try {
    // Validate input selections
    if (!selections) {
      throw new Error('Order selections are required');
    }

    const basePrice = calculateBasePrice(
      selections.productionMethod,
      selections.size,
      selections.quantity
    );
    
    const unitPrice = getUnitPrice(
      selections.productionMethod,
      selections.size,
      selections.quantity
    );
    
    const setupFee = calculateSetupFee(selections.productionMethod);
    const platingCost = calculatePlatingCost(selections.platingType, selections.quantity);
    const backingCost = calculateBackingCost(selections.backing, selections.quantity);
    const packagingCost = calculatePackagingCost(selections.packaging, selections.quantity);
    
    // Calculate mold fee with error handling to maintain existing functionality
    let moldFee = 0;
    let moldFeeWaived = false;
    try {
      const moldFeeResult = calculateMoldFee(selections.size, selections.quantity);
      moldFee = moldFeeResult.fee;
      moldFeeWaived = moldFeeResult.waived;
    } catch (error) {
      console.error('Error calculating mold fee, continuing with $0 fee:', error);
      moldFee = 0;
      moldFeeWaived = false;
    }
    
    const rushFee = selections.rushOrder 
      ? calculateRushFee(basePrice, setupFee, platingCost, backingCost, packagingCost, moldFee)
      : 0;
    
    const total = basePrice + setupFee + platingCost + backingCost + packagingCost + rushFee + moldFee;
    
    // Validate all calculated values
    const values = [basePrice, unitPrice, setupFee, platingCost, backingCost, packagingCost, rushFee, moldFee, total];
    for (const value of values) {
      if (typeof value !== 'number' || isNaN(value) || !isFinite(value) || value < 0) {
        throw new Error(`Invalid calculated value: ${value}`);
      }
    }
    
    return {
      basePrice,
      setupFee,
      platingCost,
      backingCost,
      packagingCost,
      rushFee,
      moldFee,
      moldFeeWaived,
      total,
      unitPrice
    };
  } catch (error) {
    console.error('Error calculating price breakdown:', error);
    // Return safe fallback values
    return {
      basePrice: 0,
      setupFee: 0,
      platingCost: 0,
      backingCost: 0,
      packagingCost: 0,
      rushFee: 0,
      moldFee: 0,
      moldFeeWaived: false,
      total: 0,
      unitPrice: 0
    };
  }
}

/**
 * Format a number as currency with two decimal places
 */
export function formatCurrency(amount: number): string {
  try {
    // Validate input
    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
      console.warn('Invalid amount for currency formatting:', amount);
      return '$0.00';
    }
    
    // Handle negative values
    if (amount < 0) {
      console.warn('Negative amount for currency formatting:', amount);
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0.00';
  }
}

/**
 * Format a number as currency without the dollar sign
 */
export function formatPrice(amount: number): string {
  try {
    if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
      console.warn('Invalid amount for price formatting:', amount);
      return '0.00';
    }
    
    if (amount < 0) {
      console.warn('Negative amount for price formatting:', amount);
      return '0.00';
    }
    
    return amount.toFixed(2);
  } catch (error) {
    console.error('Error formatting price:', error);
    return '0.00';
  }
}

/**
 * Validate that a production method has complete pricing data
 */
export function validateProductionMethod(productionMethod: ProductionMethod): boolean {
  if (!productionMethod.id || !productionMethod.name || !productionMethod.pricing) {
    return false;
  }
  
  // Check that all expected sizes are present
  const expectedSizes = ['0.75', '1.00', '1.25', '1.50', '1.75', '2.00'];
  const expectedQuantities = [100, 200, 300, 500, 750, 1000, 2000];
  
  for (const size of expectedSizes) {
    if (!productionMethod.pricing[size]) {
      return false;
    }
    
    for (const quantity of expectedQuantities) {
      if (typeof productionMethod.pricing[size][quantity] !== 'number' || 
          productionMethod.pricing[size][quantity] <= 0) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Validate that a plating option has valid data
 */
export function validatePlatingOption(plating: PlatingOption): boolean {
  return !!(
    plating.id &&
    plating.name &&
    typeof plating.price === 'number' &&
    plating.price >= 0 &&
    typeof plating.isFree === 'boolean'
  );
}

/**
 * Validate that a backing option has valid data
 */
export function validateBackingOption(backing: BackingOption): boolean {
  return !!(
    backing.id &&
    backing.name &&
    typeof backing.price === 'number' &&
    backing.price >= 0 &&
    typeof backing.isFree === 'boolean'
  );
}

/**
 * Validate that a packaging option has valid data
 */
export function validatePackagingOption(packaging: PackagingOption): boolean {
  return !!(
    packaging.id &&
    packaging.name &&
    typeof packaging.price === 'number' &&
    packaging.price >= 0 &&
    typeof packaging.isFree === 'boolean'
  );
}

/**
 * Validate order selections for completeness and validity
 */
export function validateOrderSelections(selections: Partial<OrderSelections>): string[] {
  const errors: string[] = [];
  
  if (!selections.productionMethod) {
    errors.push('Production method is required');
  } else if (!validateProductionMethod(selections.productionMethod)) {
    errors.push('Invalid production method data');
  }
  
  if (!selections.platingType) {
    errors.push('Plating type is required');
  } else if (!validatePlatingOption(selections.platingType)) {
    errors.push('Invalid plating type data');
  }
  
  if (!selections.size) {
    errors.push('Size selection is required');
  } else if (!['0.75', '1.00', '1.25', '1.50', '1.75', '2.00'].includes(selections.size)) {
    errors.push('Invalid size selection');
  }
  
  if (!selections.quantity) {
    errors.push('Quantity selection is required');
  } else if (typeof selections.quantity !== 'number' || selections.quantity < 1 || !Number.isInteger(selections.quantity)) {
    errors.push('Invalid quantity selection - must be a positive whole number');
  }
  
  if (!selections.backing) {
    errors.push('Backing option is required');
  } else if (!validateBackingOption(selections.backing)) {
    errors.push('Invalid backing option data');
  }
  
  if (!selections.packaging) {
    errors.push('Packaging option is required');
  } else if (!validatePackagingOption(selections.packaging)) {
    errors.push('Invalid packaging option data');
  }
  
  if (typeof selections.rushOrder !== 'boolean') {
    errors.push('Rush order selection is required');
  }
  
  return errors;
}

/**
 * Check if order selections are complete
 */
export function isOrderComplete(selections: Partial<OrderSelections>): boolean {
  return validateOrderSelections(selections).length === 0;
}

/**
 * Validate pricing data integrity for edge cases
 */
export function validatePricingData(
  productionMethods: ProductionMethod[],
  platingOptions: PlatingOption[],
  backingOptions: BackingOption[],
  packagingOptions: PackagingOption[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate production methods
  if (!Array.isArray(productionMethods) || productionMethods.length === 0) {
    errors.push('Production methods array is empty or invalid');
  } else {
    productionMethods.forEach((productionMethod, index) => {
      if (!validateProductionMethod(productionMethod)) {
        errors.push(`Invalid production method at index ${index}: ${productionMethod.name || 'Unknown'}`);
      }
    });
  }
  
  // Validate plating options
  if (!Array.isArray(platingOptions) || platingOptions.length === 0) {
    errors.push('Plating options array is empty or invalid');
  } else {
    platingOptions.forEach((plating, index) => {
      if (!validatePlatingOption(plating)) {
        errors.push(`Invalid plating option at index ${index}: ${plating.name || 'Unknown'}`);
      }
    });
  }
  
  // Validate backing options
  if (!Array.isArray(backingOptions) || backingOptions.length === 0) {
    errors.push('Backing options array is empty or invalid');
  } else {
    backingOptions.forEach((backing, index) => {
      if (!validateBackingOption(backing)) {
        errors.push(`Invalid backing option at index ${index}: ${backing.name || 'Unknown'}`);
      }
    });
  }
  
  // Validate packaging options
  if (!Array.isArray(packagingOptions) || packagingOptions.length === 0) {
    errors.push('Packaging options array is empty or invalid');
  } else {
    packagingOptions.forEach((packaging, index) => {
      if (!validatePackagingOption(packaging)) {
        errors.push(`Invalid packaging option at index ${index}: ${packaging.name || 'Unknown'}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}