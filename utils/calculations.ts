import type { PlatingType, BackingOption, PackagingOption, OrderSelections, PriceBreakdown } from '~/types/pricing';

/**
 * Calculate the base price for a given plating type, size, and quantity
 */
export function calculateBasePrice(
  platingType: PlatingType,
  size: string,
  quantity: number
): number {
  const unitPrice = platingType.pricing[size]?.[quantity];
  if (unitPrice === undefined) {
    throw new Error(`Invalid size "${size}" or quantity "${quantity}" for plating type "${platingType.name}"`);
  }
  return unitPrice * quantity;
}

/**
 * Get the unit price for a given plating type, size, and quantity
 */
export function getUnitPrice(
  platingType: PlatingType,
  size: string,
  quantity: number
): number {
  const unitPrice = platingType.pricing[size]?.[quantity];
  if (unitPrice === undefined) {
    throw new Error(`Invalid size "${size}" or quantity "${quantity}" for plating type "${platingType.name}"`);
  }
  return unitPrice;
}

/**
 * Calculate the setup fee for a plating type
 */
export function calculateSetupFee(platingType: PlatingType): number {
  return platingType.setupFee || 0;
}

/**
 * Calculate the total cost for backing modifications
 */
export function calculateBackingCost(
  backing: BackingOption,
  quantity: number
): number {
  return backing.price * quantity;
}

/**
 * Calculate the total cost for packaging modifications
 */
export function calculatePackagingCost(
  packaging: PackagingOption,
  quantity: number
): number {
  return packaging.price * quantity;
}

/**
 * Calculate the rush order fee (20% of subtotal)
 */
export function calculateRushFee(
  basePrice: number,
  setupFee: number,
  backingCost: number,
  packagingCost: number
): number {
  const subtotal = basePrice + setupFee + backingCost + packagingCost;
  return subtotal * 0.20;
}

/**
 * Calculate the complete price breakdown for an order
 */
export function calculatePriceBreakdown(selections: OrderSelections): PriceBreakdown {
  const basePrice = calculateBasePrice(
    selections.platingType,
    selections.size,
    selections.quantity
  );
  
  const unitPrice = getUnitPrice(
    selections.platingType,
    selections.size,
    selections.quantity
  );
  
  const setupFee = calculateSetupFee(selections.platingType);
  const backingCost = calculateBackingCost(selections.backing, selections.quantity);
  const packagingCost = calculatePackagingCost(selections.packaging, selections.quantity);
  
  const rushFee = selections.rushOrder 
    ? calculateRushFee(basePrice, setupFee, backingCost, packagingCost)
    : 0;
  
  const total = basePrice + setupFee + backingCost + packagingCost + rushFee;
  
  return {
    basePrice,
    setupFee,
    backingCost,
    packagingCost,
    rushFee,
    total,
    unitPrice
  };
}

/**
 * Format a number as currency with two decimal places
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a number as currency without the dollar sign
 */
export function formatPrice(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Validate that a plating type has complete pricing data
 */
export function validatePlatingType(platingType: PlatingType): boolean {
  if (!platingType.id || !platingType.name || !platingType.pricing) {
    return false;
  }
  
  // Check that all expected sizes are present
  const expectedSizes = ['0.75', '1.00', '1.25', '1.50', '1.75', '2.00'];
  const expectedQuantities = [100, 200, 300, 500, 750, 1000, 2000];
  
  for (const size of expectedSizes) {
    if (!platingType.pricing[size]) {
      return false;
    }
    
    for (const quantity of expectedQuantities) {
      if (typeof platingType.pricing[size][quantity] !== 'number' || 
          platingType.pricing[size][quantity] <= 0) {
        return false;
      }
    }
  }
  
  return true;
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
  
  if (!selections.platingType) {
    errors.push('Plating type is required');
  } else if (!validatePlatingType(selections.platingType)) {
    errors.push('Invalid plating type data');
  }
  
  if (!selections.size) {
    errors.push('Size selection is required');
  } else if (!['0.75', '1.00', '1.25', '1.50', '1.75', '2.00'].includes(selections.size)) {
    errors.push('Invalid size selection');
  }
  
  if (!selections.quantity) {
    errors.push('Quantity selection is required');
  } else if (![100, 200, 300, 500, 750, 1000, 2000].includes(selections.quantity)) {
    errors.push('Invalid quantity selection');
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
  platingTypes: PlatingType[],
  backingOptions: BackingOption[],
  packagingOptions: PackagingOption[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate plating types
  if (!Array.isArray(platingTypes) || platingTypes.length === 0) {
    errors.push('Plating types array is empty or invalid');
  } else {
    platingTypes.forEach((platingType, index) => {
      if (!validatePlatingType(platingType)) {
        errors.push(`Invalid plating type at index ${index}: ${platingType.name || 'Unknown'}`);
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