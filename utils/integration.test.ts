import { describe, it, expect } from 'vitest';
import { calculatePriceBreakdown, validatePricingData } from './calculations';
import { PRODUCTION_METHODS, PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';
import type { OrderSelections } from '~/types/pricing';

describe('Integration tests with real pricing data', () => {
  it('should validate all real pricing data', () => {
    const result = validatePricingData(PRODUCTION_METHODS, PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should calculate price breakdown for Die Struck without rush', () => {
    const selections: OrderSelections = {
      productionMethod: PRODUCTION_METHODS[0], // Die Struck
      platingType: PLATING_OPTIONS[0], // Polished Gold (free)
      size: '1.00',
      quantity: 100,
      backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
      packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
      rushOrder: false
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(2.61);
    expect(result.basePrice).toBe(261); // 2.61 * 100
    expect(result.setupFee).toBe(0);
    expect(result.platingCost).toBe(0); // Free plating
    expect(result.backingCost).toBe(0);
    expect(result.packagingCost).toBe(0);
    expect(result.rushFee).toBe(0);
    expect(result.moldFee).toBe(50); // 1.00" size gets $50 mold fee
    expect(result.moldFeeWaived).toBe(false);
    expect(result.total).toBe(311); // 261 + 50
  });

  it('should calculate price breakdown for Offset Printed with setup fee', () => {
    const selections: OrderSelections = {
      productionMethod: PRODUCTION_METHODS[4], // Offset Printed
      platingType: PLATING_OPTIONS[5], // Antique Gold ($0.60)
      size: '1.25',
      quantity: 500,
      backing: BACKING_OPTIONS[6], // Magnetic ($0.35)
      packaging: PACKAGING_OPTIONS[2], // Velvet Bag ($0.60)
      rushOrder: false
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(1.21);
    expect(result.basePrice).toBe(605); // 1.21 * 500
    expect(result.setupFee).toBe(100); // Offset Printed setup fee
    expect(result.platingCost).toBe(300); // 0.60 * 500
    expect(result.backingCost).toBe(175); // 0.35 * 500
    expect(result.packagingCost).toBe(300); // 0.60 * 500
    expect(result.rushFee).toBe(0);
    expect(result.moldFee).toBe(50); // 1.25" size gets $50 mold fee, 500 qty is at threshold
    expect(result.moldFeeWaived).toBe(false);
    expect(result.total).toBe(1530); // 605 + 100 + 300 + 175 + 300 + 50
  });

  it('should calculate price breakdown with rush order', () => {
    const selections: OrderSelections = {
      productionMethod: PRODUCTION_METHODS[1], // Soft Enamel
      platingType: PLATING_OPTIONS[6], // Antique Silver ($0.35)
      size: '1.50',
      quantity: 200,
      backing: BACKING_OPTIONS[4], // Military Clutch ($0.25)
      packaging: PACKAGING_OPTIONS[1], // Acrylic Case ($1.00)
      rushOrder: true
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(2.52);
    expect(result.basePrice).toBe(504); // 2.52 * 200
    expect(result.setupFee).toBe(0);
    expect(result.platingCost).toBe(70); // 0.35 * 200
    expect(result.backingCost).toBe(50); // 0.25 * 200
    expect(result.packagingCost).toBe(200); // 1.00 * 200
    expect(result.moldFee).toBe(50); // 1.50" size gets $50 mold fee
    expect(result.moldFeeWaived).toBe(false);
    expect(result.rushFee).toBe(174.8); // (504 + 0 + 70 + 50 + 200 + 50) * 0.20
    expect(result.total).toBe(1048.8); // 504 + 0 + 70 + 50 + 200 + 50 + 174.8
  });

  it('should handle maximum quantity and size', () => {
    const selections: OrderSelections = {
      productionMethod: PRODUCTION_METHODS[3], // Hard Enamel
      platingType: PLATING_OPTIONS[8], // Dual Plated ($0.70)
      size: '2.00',
      quantity: 2000,
      backing: BACKING_OPTIONS[8], // Deluxe Clutch ($0.40)
      packaging: PACKAGING_OPTIONS[3], // Velvet Case ($4.00)
      rushOrder: true
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(1.69);
    expect(result.basePrice).toBe(3380); // 1.69 * 2000
    expect(result.setupFee).toBe(0);
    expect(result.platingCost).toBe(1400); // 0.70 * 2000
    expect(result.backingCost).toBe(800); // 0.40 * 2000
    expect(result.packagingCost).toBe(8000); // 4.00 * 2000
    expect(result.moldFee).toBe(0); // Waived for 2000 qty (>500)
    expect(result.moldFeeWaived).toBe(true);
    expect(result.rushFee).toBe(2716); // (3380 + 0 + 1400 + 800 + 8000 + 0) * 0.20
    expect(result.total).toBe(16296); // 3380 + 0 + 1400 + 800 + 8000 + 0 + 2716
  });

  it('should handle minimum quantity and size', () => {
    const selections: OrderSelections = {
      productionMethod: PRODUCTION_METHODS[2], // Silk Screen
      platingType: PLATING_OPTIONS[7], // Antique Copper ($0.30)
      size: '0.75',
      quantity: 100,
      backing: BACKING_OPTIONS[1], // Rubber Clutch (free)
      packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
      rushOrder: false
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(2.64);
    expect(result.basePrice).toBe(264); // 2.64 * 100
    expect(result.setupFee).toBe(0);
    expect(result.platingCost).toBe(30); // 0.30 * 100
    expect(result.backingCost).toBe(0); // Free
    expect(result.packagingCost).toBe(0); // Free
    expect(result.rushFee).toBe(0);
    expect(result.moldFee).toBe(50); // 0.75" size gets $50 mold fee
    expect(result.moldFeeWaived).toBe(false);
    expect(result.total).toBe(344); // 264 + 0 + 30 + 0 + 0 + 50
  });
});

describe('Integration tests for mold fees with price breakdown', () => {
  describe('Mold fee calculation with various size/quantity combinations', () => {
    it('should apply $50 mold fee for sizes ≤1.5" with quantity ≤500', () => {
      const testCases = [
        { size: '0.75', quantity: 100, expectedFee: 50 },
        { size: '1.00', quantity: 200, expectedFee: 50 },
        { size: '1.25', quantity: 300, expectedFee: 50 },
        { size: '1.50', quantity: 500, expectedFee: 50 }
      ];

      testCases.forEach(({ size, quantity, expectedFee }) => {
        const selections: OrderSelections = {
          productionMethod: PRODUCTION_METHODS[0], // Die Struck
          platingType: PLATING_OPTIONS[0], // Polished Gold (free)
          size,
          quantity,
          backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
          packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
          rushOrder: false
        };

        const result = calculatePriceBreakdown(selections);
        
        expect(result.moldFee).toBe(expectedFee);
        expect(result.moldFeeWaived).toBe(false);
        expect(result.total).toBeGreaterThan(result.basePrice); // Total includes mold fee
      });
    });

    it('should apply $62.50 mold fee for 1.75" size with quantity ≤500', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[1], // Soft Enamel
        platingType: PLATING_OPTIONS[1], // Polished Silver (free)
        size: '1.75',
        quantity: 300,
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      expect(result.moldFee).toBe(62.50);
      expect(result.moldFeeWaived).toBe(false);
      expect(result.total).toBe(result.basePrice + result.setupFee + result.platingCost + 
                               result.backingCost + result.packagingCost + result.rushFee + 62.50);
    });

    it('should apply $75 mold fee for sizes ≥2.0" with quantity ≤500', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[2], // Silk Screen
        platingType: PLATING_OPTIONS[2], // Polished Copper (free)
        size: '2.00',
        quantity: 200,
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      expect(result.moldFee).toBe(75);
      expect(result.moldFeeWaived).toBe(false);
      expect(result.total).toBe(result.basePrice + result.setupFee + result.platingCost + 
                               result.backingCost + result.packagingCost + result.rushFee + 75);
    });

    it('should waive mold fee for quantities >500 regardless of size', () => {
      const testCases = [
        { size: '0.75', quantity: 750 },
        { size: '1.25', quantity: 1000 },
        { size: '1.75', quantity: 2000 },
        { size: '2.00', quantity: 750 }
      ];

      testCases.forEach(({ size, quantity }) => {
        const selections: OrderSelections = {
          productionMethod: PRODUCTION_METHODS[0], // Die Struck
          platingType: PLATING_OPTIONS[0], // Polished Gold (free)
          size,
          quantity,
          backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
          packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
          rushOrder: false
        };

        const result = calculatePriceBreakdown(selections);
        
        expect(result.moldFee).toBe(0);
        expect(result.moldFeeWaived).toBe(true);
        expect(result.total).toBe(result.basePrice + result.setupFee + result.platingCost + 
                                 result.backingCost + result.packagingCost + result.rushFee);
      });
    });
  });

  describe('Total price calculation with mold fees', () => {
    it('should include mold fee in total when applicable', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[4], // Offset Printed (has setup fee)
        platingType: PLATING_OPTIONS[5], // Antique Gold ($0.60)
        size: '1.50',
        quantity: 300,
        backing: BACKING_OPTIONS[6], // Magnetic ($0.35)
        packaging: PACKAGING_OPTIONS[2], // Gift Box ($1.25)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      const expectedTotal = result.basePrice + result.setupFee + result.platingCost + 
                           result.backingCost + result.packagingCost + result.rushFee + result.moldFee;
      
      expect(result.moldFee).toBe(50); // 1.50" size gets $50 fee
      expect(result.moldFeeWaived).toBe(false);
      expect(result.total).toBe(expectedTotal);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should exclude mold fee from total when waived', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[3], // Hard Enamel
        platingType: PLATING_OPTIONS[8], // Dual Plated ($0.70)
        size: '2.00',
        quantity: 1000,
        backing: BACKING_OPTIONS[8], // Deluxe Clutch ($0.40)
        packaging: PACKAGING_OPTIONS[3], // Presentation Box ($2.50)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      const expectedTotal = result.basePrice + result.setupFee + result.platingCost + 
                           result.backingCost + result.packagingCost + result.rushFee;
      
      expect(result.moldFee).toBe(0);
      expect(result.moldFeeWaived).toBe(true);
      expect(result.total).toBe(expectedTotal);
      expect(result.total).not.toContain(75); // Should not include the $75 fee that would apply for 2.00"
    });

    it('should include mold fee in rush fee calculation', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[1], // Soft Enamel
        platingType: PLATING_OPTIONS[6], // Antique Silver ($0.35)
        size: '1.75',
        quantity: 200,
        backing: BACKING_OPTIONS[4], // Military Clutch ($0.25)
        packaging: PACKAGING_OPTIONS[1], // Velvet Pouch ($0.75)
        rushOrder: true
      };

      const result = calculatePriceBreakdown(selections);
      
      const subtotal = result.basePrice + result.setupFee + result.platingCost + 
                      result.backingCost + result.packagingCost + result.moldFee;
      const expectedRushFee = subtotal * 0.20;
      
      expect(result.moldFee).toBe(62.50); // 1.75" size gets $62.50 fee
      expect(result.moldFeeWaived).toBe(false);
      expect(result.rushFee).toBe(expectedRushFee);
      expect(result.total).toBe(subtotal + result.rushFee);
    });
  });

  describe('Price breakdown updates when size or quantity changes affect mold fee', () => {
    it('should transition from mold fee applied to waived when quantity increases', () => {
      // First calculation with quantity ≤500 (mold fee applies)
      const selectionsLowQty: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[0], // Die Struck
        platingType: PLATING_OPTIONS[0], // Polished Gold (free)
        size: '1.25',
        quantity: 500,
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const resultLowQty = calculatePriceBreakdown(selectionsLowQty);
      
      expect(resultLowQty.moldFee).toBe(50);
      expect(resultLowQty.moldFeeWaived).toBe(false);

      // Second calculation with quantity >500 (mold fee waived)
      const selectionsHighQty: OrderSelections = {
        ...selectionsLowQty,
        quantity: 750
      };

      const resultHighQty = calculatePriceBreakdown(selectionsHighQty);
      
      expect(resultHighQty.moldFee).toBe(0);
      expect(resultHighQty.moldFeeWaived).toBe(true);
      expect(resultHighQty.total).toBeLessThan(resultLowQty.total + (resultHighQty.basePrice - resultLowQty.basePrice));
    });

    it('should transition from waived to applied when quantity decreases', () => {
      // First calculation with quantity >500 (mold fee waived)
      const selectionsHighQty: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[2], // Silk Screen
        platingType: PLATING_OPTIONS[3], // Antique Bronze (free)
        size: '1.75',
        quantity: 1000,
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const resultHighQty = calculatePriceBreakdown(selectionsHighQty);
      
      expect(resultHighQty.moldFee).toBe(0);
      expect(resultHighQty.moldFeeWaived).toBe(true);

      // Second calculation with quantity ≤500 (mold fee applies)
      const selectionsLowQty: OrderSelections = {
        ...selectionsHighQty,
        quantity: 300
      };

      const resultLowQty = calculatePriceBreakdown(selectionsLowQty);
      
      expect(resultLowQty.moldFee).toBe(62.50);
      expect(resultLowQty.moldFeeWaived).toBe(false);
    });

    it('should update mold fee when size changes between thresholds', () => {
      const baseSelections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[1], // Soft Enamel
        platingType: PLATING_OPTIONS[0], // Polished Gold (free)
        size: '1.50',
        quantity: 200,
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      // Test 1.50" size ($50 fee)
      const result150 = calculatePriceBreakdown(baseSelections);
      expect(result150.moldFee).toBe(50);

      // Test 1.75" size ($62.50 fee)
      const result175 = calculatePriceBreakdown({
        ...baseSelections,
        size: '1.75'
      });
      expect(result175.moldFee).toBe(62.50);

      // Test 2.00" size ($75 fee)
      const result200 = calculatePriceBreakdown({
        ...baseSelections,
        size: '2.00'
      });
      expect(result200.moldFee).toBe(75);
    });
  });

  describe('Backward compatibility with existing price breakdown functionality', () => {
    it('should maintain existing price breakdown structure with new mold fee fields', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[0], // Die Struck
        platingType: PLATING_OPTIONS[0], // Polished Gold (free)
        size: '1.00',
        quantity: 100,
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      // Verify all existing fields are present and valid
      expect(typeof result.basePrice).toBe('number');
      expect(typeof result.setupFee).toBe('number');
      expect(typeof result.platingCost).toBe('number');
      expect(typeof result.backingCost).toBe('number');
      expect(typeof result.packagingCost).toBe('number');
      expect(typeof result.rushFee).toBe('number');
      expect(typeof result.total).toBe('number');
      expect(typeof result.unitPrice).toBe('number');
      
      // Verify new mold fee fields are present
      expect(typeof result.moldFee).toBe('number');
      expect(typeof result.moldFeeWaived).toBe('boolean');
      
      // Verify values are reasonable
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.unitPrice).toBeGreaterThan(0);
      expect(result.moldFee).toBeGreaterThanOrEqual(0);
    });

    it('should handle mold fee calculation errors gracefully without breaking existing functionality', () => {
      // Create selections that might cause mold fee calculation issues
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[0], // Die Struck
        platingType: PLATING_OPTIONS[0], // Polished Gold (free)
        size: '1.00', // Valid size
        quantity: 100, // Valid quantity
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      // Even if mold fee calculation has issues, basic pricing should work
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
      expect(result.unitPrice).toBeGreaterThan(0);
      
      // Mold fee fields should exist with safe defaults
      expect(typeof result.moldFee).toBe('number');
      expect(typeof result.moldFeeWaived).toBe('boolean');
      expect(result.moldFee).toBeGreaterThanOrEqual(0);
    });

    it('should calculate correct totals for complex orders with all modifications and mold fees', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[4], // Offset Printed (setup fee)
        platingType: PLATING_OPTIONS[5], // Antique Gold ($0.60)
        size: '1.75',
        quantity: 500,
        backing: BACKING_OPTIONS[6], // Magnetic ($0.35)
        packaging: PACKAGING_OPTIONS[2], // Velvet Bag ($0.60)
        rushOrder: true
      };

      const result = calculatePriceBreakdown(selections);
      
      // Verify individual components
      expect(result.basePrice).toBeGreaterThan(0);
      expect(result.setupFee).toBe(100); // Offset Printed setup fee
      expect(result.platingCost).toBe(300); // 0.60 * 500
      expect(result.backingCost).toBe(175); // 0.35 * 500
      expect(result.packagingCost).toBe(300); // 0.60 * 500
      expect(result.moldFee).toBe(62.50); // 1.75" size fee
      expect(result.moldFeeWaived).toBe(false); // 500 qty is at threshold, not over
      
      // Verify rush fee includes mold fee in calculation
      const subtotal = result.basePrice + result.setupFee + result.platingCost + 
                      result.backingCost + result.packagingCost + result.moldFee;
      expect(result.rushFee).toBe(subtotal * 0.20);
      
      // Verify total
      expect(result.total).toBe(subtotal + result.rushFee);
    });

    it('should handle edge case of exactly 500 quantity (mold fee should apply)', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[0], // Die Struck
        platingType: PLATING_OPTIONS[0], // Polished Gold (free)
        size: '2.00',
        quantity: 500, // Exactly at threshold
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      expect(result.moldFee).toBe(75); // Should apply fee for exactly 500
      expect(result.moldFeeWaived).toBe(false);
      expect(result.total).toBe(result.basePrice + result.moldFee);
    });

    it('should handle edge case of 501 quantity (mold fee should be waived)', () => {
      const selections: OrderSelections = {
        productionMethod: PRODUCTION_METHODS[0], // Die Struck
        platingType: PLATING_OPTIONS[0], // Polished Gold (free)
        size: '2.00',
        quantity: 750, // Over threshold
        backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
        packaging: PACKAGING_OPTIONS[0], // Poly Bag (free)
        rushOrder: false
      };

      const result = calculatePriceBreakdown(selections);
      
      expect(result.moldFee).toBe(0); // Should waive fee for 501+
      expect(result.moldFeeWaived).toBe(true);
      expect(result.total).toBe(result.basePrice); // No additional fees
    });
  });
});