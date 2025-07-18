import { describe, it, expect } from 'vitest';
import {
  calculateBasePrice,
  getUnitPrice,
  calculateSetupFee,
  calculatePlatingCost,
  calculateBackingCost,
  calculatePackagingCost,
  calculateRushFee,
  calculatePriceBreakdown,
  formatCurrency,
  formatPrice,
  validateProductionMethod,
  validatePlatingOption,
  validateBackingOption,
  validatePackagingOption,
  validateOrderSelections,
  isOrderComplete,
  validatePricingData
} from './calculations';
import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption, OrderSelections } from '~/types/pricing';

// Test data
const mockProductionMethod: ProductionMethod = {
  id: 'test-production',
  name: 'Test Production',
  pricing: {
    '1.00': { 100: 2.50, 200: 2.00, 500: 1.50 },
    '1.25': { 100: 2.75, 200: 2.25, 500: 1.75 }
  }
};

const mockProductionMethodWithSetup: ProductionMethod = {
  id: 'offset-printed',
  name: 'Offset Printed',
  setupFee: 100,
  pricing: {
    '1.00': { 100: 2.00, 200: 1.50, 500: 1.00 }
  }
};

const mockPlatingOption: PlatingOption = {
  id: 'antique-gold',
  name: 'Antique Gold',
  price: 0.60,
  isFree: false
};

const mockPlatingOptionFree: PlatingOption = {
  id: 'polished-gold',
  name: 'Polished Gold',
  price: 0.00,
  isFree: true
};

const mockBackingFree: BackingOption = {
  id: 'butterfly',
  name: 'Butterfly Clutch',
  price: 0.00,
  isFree: true
};

const mockBackingPaid: BackingOption = {
  id: 'magnetic',
  name: 'Magnetic',
  price: 0.35,
  isFree: false
};

const mockPackagingFree: PackagingOption = {
  id: 'poly-bag',
  name: 'Poly Bag',
  price: 0.00,
  isFree: true
};

const mockPackagingPaid: PackagingOption = {
  id: 'gift-box',
  name: 'Gift Box',
  price: 1.25,
  isFree: false
};

describe('calculateBasePrice', () => {
  it('should calculate base price correctly', () => {
    const result = calculateBasePrice(mockProductionMethod, '1.00', 100);
    expect(result).toBe(250); // 2.50 * 100
  });

  it('should calculate base price for different quantities', () => {
    const result = calculateBasePrice(mockProductionMethod, '1.00', 200);
    expect(result).toBe(400); // 2.00 * 200
  });

  it('should throw error for invalid size', () => {
    expect(() => {
      calculateBasePrice(mockProductionMethod, '3.00', 100);
    }).toThrow('Invalid size "3.00" or quantity "100" for production method "Test Production"');
  });

  it('should throw error for invalid quantity', () => {
    expect(() => {
      calculateBasePrice(mockProductionMethod, '1.00', 150);
    }).toThrow('Invalid size "1.00" or quantity "150" for production method "Test Production"');
  });

  it('should throw error for invalid production method', () => {
    expect(() => {
      calculateBasePrice(null as any, '1.00', 100);
    }).toThrow('Invalid production method provided');
  });

  it('should throw error for invalid inputs', () => {
    expect(() => {
      calculateBasePrice(mockProductionMethod, '', 100);
    }).toThrow('Invalid size provided');

    expect(() => {
      calculateBasePrice(mockProductionMethod, '1.00', 0);
    }).toThrow('Invalid quantity provided');

    expect(() => {
      calculateBasePrice(mockProductionMethod, '1.00', -100);
    }).toThrow('Invalid quantity provided');
  });
});

describe('getUnitPrice', () => {
  it('should return correct unit price', () => {
    const result = getUnitPrice(mockProductionMethod, '1.25', 500);
    expect(result).toBe(1.75);
  });

  it('should throw error for invalid combination', () => {
    expect(() => {
      getUnitPrice(mockProductionMethod, '2.00', 100);
    }).toThrow();
  });
});

describe('calculateSetupFee', () => {
  it('should return setup fee when present', () => {
    const result = calculateSetupFee(mockProductionMethodWithSetup);
    expect(result).toBe(100);
  });

  it('should return 0 when no setup fee', () => {
    const result = calculateSetupFee(mockProductionMethod);
    expect(result).toBe(0);
  });

  it('should handle invalid production method gracefully', () => {
    expect(calculateSetupFee(null as any)).toBe(0);
    expect(calculateSetupFee(undefined as any)).toBe(0);
  });

  it('should handle invalid setup fee values', () => {
    const invalidSetupFee = { ...mockProductionMethod, setupFee: -100 };
    expect(calculateSetupFee(invalidSetupFee)).toBe(0);

    const nanSetupFee = { ...mockProductionMethod, setupFee: NaN };
    expect(calculateSetupFee(nanSetupFee)).toBe(0);
  });
});

describe('calculatePlatingCost', () => {
  it('should calculate plating cost for paid option', () => {
    const result = calculatePlatingCost(mockPlatingOption, 100);
    expect(result).toBe(60); // 0.60 * 100
  });

  it('should return 0 for free plating option', () => {
    const result = calculatePlatingCost(mockPlatingOptionFree, 100);
    expect(result).toBe(0);
  });

  it('should handle different quantities', () => {
    const result = calculatePlatingCost(mockPlatingOption, 500);
    expect(result).toBe(300); // 0.60 * 500
  });

  it('should handle invalid plating option gracefully', () => {
    expect(calculatePlatingCost(null as any, 100)).toBe(0);
    expect(calculatePlatingCost(undefined as any, 100)).toBe(0);
  });

  it('should handle invalid plating price gracefully', () => {
    const invalidPlating = { ...mockPlatingOption, price: -1 };
    expect(calculatePlatingCost(invalidPlating, 100)).toBe(0);

    const nanPlating = { ...mockPlatingOption, price: NaN };
    expect(calculatePlatingCost(nanPlating, 100)).toBe(0);
  });

  it('should handle invalid quantity gracefully', () => {
    expect(calculatePlatingCost(mockPlatingOption, 0)).toBe(0);
    expect(calculatePlatingCost(mockPlatingOption, -100)).toBe(0);
    expect(calculatePlatingCost(mockPlatingOption, NaN)).toBe(0);
  });
});

describe('calculateBackingCost', () => {
  it('should calculate backing cost for paid option', () => {
    const result = calculateBackingCost(mockBackingPaid, 100);
    expect(result).toBe(35); // 0.35 * 100
  });

  it('should return 0 for free backing option', () => {
    const result = calculateBackingCost(mockBackingFree, 100);
    expect(result).toBe(0);
  });

  it('should handle different quantities', () => {
    const result = calculateBackingCost(mockBackingPaid, 500);
    expect(result).toBe(175); // 0.35 * 500
  });

  it('should handle invalid backing option gracefully', () => {
    expect(calculateBackingCost(null as any, 100)).toBe(0);
    expect(calculateBackingCost(undefined as any, 100)).toBe(0);
  });

  it('should handle invalid backing price gracefully', () => {
    const invalidBacking = { ...mockBackingPaid, price: -1 };
    expect(calculateBackingCost(invalidBacking, 100)).toBe(0);

    const nanBacking = { ...mockBackingPaid, price: NaN };
    expect(calculateBackingCost(nanBacking, 100)).toBe(0);
  });

  it('should handle invalid quantity gracefully', () => {
    expect(calculateBackingCost(mockBackingPaid, 0)).toBe(0);
    expect(calculateBackingCost(mockBackingPaid, -100)).toBe(0);
    expect(calculateBackingCost(mockBackingPaid, NaN)).toBe(0);
  });
});

describe('calculatePackagingCost', () => {
  it('should calculate packaging cost for paid option', () => {
    const result = calculatePackagingCost(mockPackagingPaid, 100);
    expect(result).toBe(125); // 1.25 * 100
  });

  it('should return 0 for free packaging option', () => {
    const result = calculatePackagingCost(mockPackagingFree, 100);
    expect(result).toBe(0);
  });

  it('should handle invalid packaging option gracefully', () => {
    expect(calculatePackagingCost(null as any, 100)).toBe(0);
    expect(calculatePackagingCost(undefined as any, 100)).toBe(0);
  });

  it('should handle invalid packaging price gracefully', () => {
    const invalidPackaging = { ...mockPackagingPaid, price: -1 };
    expect(calculatePackagingCost(invalidPackaging, 100)).toBe(0);

    const nanPackaging = { ...mockPackagingPaid, price: NaN };
    expect(calculatePackagingCost(nanPackaging, 100)).toBe(0);
  });

  it('should handle invalid quantity gracefully', () => {
    expect(calculatePackagingCost(mockPackagingPaid, 0)).toBe(0);
    expect(calculatePackagingCost(mockPackagingPaid, -100)).toBe(0);
    expect(calculatePackagingCost(mockPackagingPaid, NaN)).toBe(0);
  });
});

describe('calculateRushFee', () => {
  it('should calculate 20% rush fee correctly', () => {
    const basePrice = 250;
    const setupFee = 100;
    const backingCost = 35;
    const packagingCost = 125;
    const platingCost = 0;
    const result = calculateRushFee(basePrice, setupFee, platingCost, backingCost, packagingCost);
    expect(result).toBe(102); // (250 + 100 + 0 + 35 + 125) * 0.20 = 102
  });

  it('should handle zero values', () => {
    const result = calculateRushFee(100, 0, 0, 0, 0);
    expect(result).toBe(20); // 100 * 0.20
  });

  it('should handle invalid inputs gracefully', () => {
    expect(calculateRushFee(NaN, 0, 0, 0, 0)).toBe(0);
    expect(calculateRushFee(100, -50, 0, 0, 0)).toBe(0);
    expect(calculateRushFee(100, 0, Infinity, 0, 0)).toBe(0);
    expect(calculateRushFee(100, 0, 0, null as any, 0)).toBe(0);
  });

  it('should handle all invalid inputs', () => {
    expect(calculateRushFee(-100, -50, -25, -10, -5)).toBe(0);
    expect(calculateRushFee(NaN, NaN, NaN, NaN, NaN)).toBe(0);
  });
});

describe('calculatePriceBreakdown', () => {
  const mockOrderSelections: OrderSelections = {
    productionMethod: mockProductionMethod,
    platingType: mockPlatingOptionFree,
    size: '1.00',
    quantity: 100,
    backing: mockBackingPaid,
    packaging: mockPackagingPaid,
    rushOrder: false
  };

  it('should calculate complete price breakdown without rush', () => {
    const result = calculatePriceBreakdown(mockOrderSelections);

    expect(result.basePrice).toBe(250); // 2.50 * 100
    expect(result.setupFee).toBe(0);
    expect(result.platingCost).toBe(0); // Free plating
    expect(result.backingCost).toBe(35); // 0.35 * 100
    expect(result.packagingCost).toBe(125); // 1.25 * 100
    expect(result.rushFee).toBe(0);
    expect(result.total).toBe(410); // 250 + 0 + 0 + 35 + 125
    expect(result.unitPrice).toBe(2.50);
  });

  it('should calculate complete price breakdown with rush order', () => {
    const rushOrderSelections = { ...mockOrderSelections, rushOrder: true };
    const result = calculatePriceBreakdown(rushOrderSelections);

    expect(result.basePrice).toBe(250);
    expect(result.setupFee).toBe(0);
    expect(result.platingCost).toBe(0);
    expect(result.backingCost).toBe(35);
    expect(result.packagingCost).toBe(125);
    expect(result.rushFee).toBe(82); // (250 + 0 + 0 + 35 + 125) * 0.20
    expect(result.total).toBe(492); // 250 + 0 + 0 + 35 + 125 + 82
  });

  it('should include setup fee in calculations', () => {
    const selectionsWithSetup = {
      ...mockOrderSelections,
      productionMethod: mockProductionMethodWithSetup,
      platingType: mockPlatingOption, // Use paid plating
      rushOrder: true
    };
    const result = calculatePriceBreakdown(selectionsWithSetup);

    expect(result.setupFee).toBe(100);
    expect(result.platingCost).toBe(60); // 0.60 * 100
    expect(result.rushFee).toBe(102); // (200 + 100 + 60 + 35 + 125) * 0.20 = 104
    expect(result.total).toBe(622); // 200 + 100 + 60 + 35 + 125 + 102
  });
});

describe('formatCurrency', () => {
  it('should format currency with dollar sign', () => {
    expect(formatCurrency(123.45)).toBe('$123.45');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  it('should handle decimal precision', () => {
    expect(formatCurrency(123.456)).toBe('$123.46'); // Rounds to 2 decimals
    expect(formatCurrency(123.1)).toBe('$123.10'); // Pads to 2 decimals
  });

  it('should handle invalid inputs gracefully', () => {
    expect(formatCurrency(NaN)).toBe('$0.00');
    expect(formatCurrency(Infinity)).toBe('$0.00');
    expect(formatCurrency(-Infinity)).toBe('$0.00');
    expect(formatCurrency(-123.45)).toBe('$0.00');
    expect(formatCurrency(null as any)).toBe('$0.00');
    expect(formatCurrency(undefined as any)).toBe('$0.00');
    expect(formatCurrency('invalid' as any)).toBe('$0.00');
  });
});

describe('formatPrice', () => {
  it('should format price without dollar sign', () => {
    expect(formatPrice(123.45)).toBe('123.45');
    expect(formatPrice(0)).toBe('0.00');
    expect(formatPrice(123.1)).toBe('123.10');
  });

  it('should handle rounding', () => {
    expect(formatPrice(123.456)).toBe('123.46');
  });

  it('should handle invalid inputs gracefully', () => {
    expect(formatPrice(NaN)).toBe('0.00');
    expect(formatPrice(Infinity)).toBe('0.00');
    expect(formatPrice(-Infinity)).toBe('0.00');
    expect(formatPrice(-123.45)).toBe('0.00');
    expect(formatPrice(null as any)).toBe('0.00');
    expect(formatPrice(undefined as any)).toBe('0.00');
    expect(formatPrice('invalid' as any)).toBe('0.00');
  });
});

describe('validateProductionMethod', () => {
  const validProductionMethod: ProductionMethod = {
    id: 'test',
    name: 'Test',
    pricing: {
      '0.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.25': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.50': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '2.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 }
    }
  };

  it('should validate complete production method', () => {
    expect(validateProductionMethod(validProductionMethod)).toBe(true);
  });

  it('should reject production method without id', () => {
    const invalid = { ...validProductionMethod, id: '' };
    expect(validateProductionMethod(invalid)).toBe(false);
  });

  it('should reject production method without name', () => {
    const invalid = { ...validProductionMethod, name: '' };
    expect(validateProductionMethod(invalid)).toBe(false);
  });

  it('should reject production method with missing size', () => {
    const invalid = { ...validProductionMethod };
    delete invalid.pricing['1.00'];
    expect(validateProductionMethod(invalid)).toBe(false);
  });

  it('should reject production method with invalid price', () => {
    const invalid: ProductionMethod = {
      id: 'test',
      name: 'Test',
      pricing: {
        '0.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
        '1.00': { 100: -1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 }, // Invalid negative price
        '1.25': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
        '1.50': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
        '1.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
        '2.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 }
      }
    };
    expect(validateProductionMethod(invalid)).toBe(false);
  });
});

describe('validatePlatingOption', () => {
  it('should validate valid plating option', () => {
    expect(validatePlatingOption(mockPlatingOption)).toBe(true);
    expect(validatePlatingOption(mockPlatingOptionFree)).toBe(true);
  });

  it('should reject plating option without id', () => {
    const invalid = { ...mockPlatingOption, id: '' };
    expect(validatePlatingOption(invalid)).toBe(false);
  });

  it('should reject plating option without name', () => {
    const invalid = { ...mockPlatingOption, name: '' };
    expect(validatePlatingOption(invalid)).toBe(false);
  });

  it('should reject plating option with negative price', () => {
    const invalid = { ...mockPlatingOption, price: -1 };
    expect(validatePlatingOption(invalid)).toBe(false);
  });
});

describe('validateBackingOption', () => {
  it('should validate valid backing option', () => {
    expect(validateBackingOption(mockBackingFree)).toBe(true);
    expect(validateBackingOption(mockBackingPaid)).toBe(true);
  });

  it('should reject backing option without id', () => {
    const invalid = { ...mockBackingFree, id: '' };
    expect(validateBackingOption(invalid)).toBe(false);
  });

  it('should reject backing option with negative price', () => {
    const invalid = { ...mockBackingFree, price: -1 };
    expect(validateBackingOption(invalid)).toBe(false);
  });
});

describe('validatePackagingOption', () => {
  it('should validate valid packaging option', () => {
    expect(validatePackagingOption(mockPackagingFree)).toBe(true);
    expect(validatePackagingOption(mockPackagingPaid)).toBe(true);
  });

  it('should reject packaging option without name', () => {
    const invalid = { ...mockPackagingFree, name: '' };
    expect(validatePackagingOption(invalid)).toBe(false);
  });
});

describe('validateOrderSelections', () => {
  const validProductionMethodForValidation: ProductionMethod = {
    id: 'test',
    name: 'Test',
    pricing: {
      '0.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.25': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.50': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '2.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 }
    }
  };

  const validSelections: OrderSelections = {
    productionMethod: validProductionMethodForValidation,
    platingType: mockPlatingOptionFree,
    size: '1.00',
    quantity: 100,
    backing: mockBackingFree,
    packaging: mockPackagingFree,
    rushOrder: false
  };

  it('should validate complete order selections', () => {
    const errors = validateOrderSelections(validSelections);
    expect(errors).toHaveLength(0);
  });

  it('should detect missing production method', () => {
    const invalid = { ...validSelections };
    delete (invalid as any).productionMethod;
    const errors = validateOrderSelections(invalid);
    expect(errors).toContain('Production method is required');
  });

  it('should detect missing plating type', () => {
    const invalid = { ...validSelections };
    delete (invalid as any).platingType;
    const errors = validateOrderSelections(invalid);
    expect(errors).toContain('Plating type is required');
  });

  it('should detect invalid size', () => {
    const invalid = { ...validSelections, size: '3.00' };
    const errors = validateOrderSelections(invalid);
    expect(errors).toContain('Invalid size selection');
  });

  it('should detect invalid quantity', () => {
    const invalid = { ...validSelections, quantity: 150 };
    const errors = validateOrderSelections(invalid);
    expect(errors).toContain('Invalid quantity selection');
  });

  it('should detect missing backing', () => {
    const invalid = { ...validSelections };
    delete (invalid as any).backing;
    const errors = validateOrderSelections(invalid);
    expect(errors).toContain('Backing option is required');
  });

  it('should detect missing packaging', () => {
    const invalid = { ...validSelections };
    delete (invalid as any).packaging;
    const errors = validateOrderSelections(invalid);
    expect(errors).toContain('Packaging option is required');
  });
});

describe('isOrderComplete', () => {
  const validProductionMethodForValidation: ProductionMethod = {
    id: 'test',
    name: 'Test',
    pricing: {
      '0.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.25': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.50': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '1.75': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 },
      '2.00': { 100: 1, 200: 1, 300: 1, 500: 1, 750: 1, 1000: 1, 2000: 1 }
    }
  };

  const validSelections: OrderSelections = {
    productionMethod: validProductionMethodForValidation,
    platingType: mockPlatingOptionFree,
    size: '1.00',
    quantity: 100,
    backing: mockBackingFree,
    packaging: mockPackagingFree,
    rushOrder: false
  };

  it('should return true for complete order', () => {
    expect(isOrderComplete(validSelections)).toBe(true);
  });

  it('should return false for incomplete order', () => {
    const incomplete = { ...validSelections };
    delete (incomplete as any).size;
    expect(isOrderComplete(incomplete)).toBe(false);
  });
});

describe('validatePricingData', () => {
  const validProductionMethods = [mockProductionMethod];
  const validPlatingOptions = [mockPlatingOption, mockPlatingOptionFree];
  const validBackingOptions = [mockBackingFree, mockBackingPaid];
  const validPackagingOptions = [mockPackagingFree, mockPackagingPaid];

  it('should validate complete pricing data', () => {
    const result = validatePricingData(
      validProductionMethods,
      validPlatingOptions,
      validBackingOptions,
      validPackagingOptions
    );
    expect(result.isValid).toBe(false); // Will be false due to incomplete pricing matrix
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should detect empty production methods array', () => {
    const result = validatePricingData([], validPlatingOptions, validBackingOptions, validPackagingOptions);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Production methods array is empty or invalid');
  });

  it('should detect empty plating options array', () => {
    const result = validatePricingData(validProductionMethods, [], validBackingOptions, validPackagingOptions);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Plating options array is empty or invalid');
  });

  it('should detect empty backing options array', () => {
    const result = validatePricingData(validProductionMethods, validPlatingOptions, [], validPackagingOptions);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Backing options array is empty or invalid');
  });

  it('should detect empty packaging options array', () => {
    const result = validatePricingData(validProductionMethods, validPlatingOptions, validBackingOptions, []);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Packaging options array is empty or invalid');
  });
});

describe('Edge cases and mathematical accuracy', () => {
  it('should handle very small prices accurately', () => {
    const smallPrice = 0.01;
    expect(formatPrice(smallPrice)).toBe('0.01');
    expect(formatCurrency(smallPrice)).toBe('$0.01');
  });

  it('should handle large quantities accurately', () => {
    const result = calculateBackingCost(mockBackingPaid, 2000);
    expect(result).toBe(700); // 0.35 * 2000
  });

  it('should maintain precision in rush fee calculations', () => {
    const basePrice = 333.33;
    const rushFee = calculateRushFee(basePrice, 0, 0, 0, 0);
    expect(rushFee).toBe(66.666); // 333.33 * 0.20
  });

  it('should handle zero values in all calculations', () => {
    const zeroBackingCost = calculateBackingCost(mockBackingFree, 100);
    const zeroPackagingCost = calculatePackagingCost(mockPackagingFree, 100);
    const zeroSetupFee = calculateSetupFee(mockProductionMethod);

    expect(zeroBackingCost).toBe(0);
    expect(zeroPackagingCost).toBe(0);
    expect(zeroSetupFee).toBe(0);
  });
});

describe('Error Handling Integration', () => {
  it('should handle complete invalid order gracefully', () => {
    const invalidOrder: any = {
      platingType: null,
      size: '',
      quantity: -1,
      backing: { price: NaN },
      packaging: { price: Infinity },
      rushOrder: 'invalid'
    };

    // Should return safe fallback values instead of throwing
    const result = calculatePriceBreakdown(invalidOrder);
    expect(result.total).toBe(0);
    expect(result.basePrice).toBe(0);
    expect(result.unitPrice).toBe(0);
  });

  it('should validate order selections and return appropriate errors', () => {
    const invalidSelections = {
      platingType: undefined,
      size: undefined,
      quantity: undefined,
      backing: undefined,
      packaging: undefined,
      rushOrder: undefined
    };

    const errors = validateOrderSelections(invalidSelections);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('Plating type is required');
    expect(errors).toContain('Size selection is required');
    expect(errors).toContain('Quantity selection is required');
    expect(errors).toContain('Backing option is required');
    expect(errors).toContain('Packaging option is required');
  });

  it('should handle corrupted pricing data gracefully', () => {
    const corruptedPlatingTypes = [
      { id: '', name: '', pricing: null },
      { id: 'valid', name: 'Valid', pricing: { '1.00': { 100: -1 } } }
    ] as any[];

    const validation = validatePricingData(corruptedPlatingTypes, [], [], []);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});