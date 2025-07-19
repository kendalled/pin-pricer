import { describe, it, expect, beforeEach } from 'vitest';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { PRODUCTION_METHODS } from '~/data/pricing';

describe('PricingCalculator - Mold Fee Real-time Updates Integration', () => {
  let calculator: ReturnType<typeof usePricingCalculator>;

  beforeEach(() => {
    calculator = usePricingCalculator();
  });

  describe('Real-time Mold Fee Updates', () => {
    it('should update mold fee when size changes affect fee calculation', () => {
      // Set up initial state with a production method
      const dieStruck = PRODUCTION_METHODS[0]; // Die Struck
      calculator.setProductionMethod(dieStruck);
      
      // Set initial size that triggers mold fee (≤1.5")
      calculator.setSizeAndQuantity('1.00', 100);
      
      // Should have mold fee for small size with low quantity
      expect(calculator.moldFeeInfo.value.applicable).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      expect(calculator.hasMoldFee.value).toBe(true);
      expect(calculator.moldFeeWaived.value).toBe(false);
      expect(calculator.moldFeeAmount.value).toBe(50.00);
      
      // Change to larger size (≥2.0")
      calculator.setSizeAndQuantity('2.00', 100);
      
      // Should update mold fee to higher amount
      expect(calculator.moldFeeInfo.value.applicable).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(75.00);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      expect(calculator.hasMoldFee.value).toBe(true);
      expect(calculator.moldFeeAmount.value).toBe(75.00);
      
      // Change to medium size (1.75")
      calculator.setSizeAndQuantity('1.75', 100);
      
      // Should update mold fee to medium amount
      expect(calculator.moldFeeInfo.value.applicable).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(62.50);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      expect(calculator.moldFeeAmount.value).toBe(62.50);
    });

    it('should update mold fee when quantity changes affect exemption status', () => {
      // Set up initial state
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      
      // Set size and low quantity (should have mold fee)
      calculator.setSizeAndQuantity('1.50', 100);
      
      // Should have mold fee for low quantity
      expect(calculator.moldFeeInfo.value.applicable).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      expect(calculator.hasMoldFee.value).toBe(true);
      expect(calculator.moldFeeWaived.value).toBe(false);
      
      // Change to high quantity (should waive mold fee)
      calculator.setSizeAndQuantity('1.50', 1000);
      
      // Should waive mold fee for high quantity
      expect(calculator.moldFeeInfo.value.applicable).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(0);
      expect(calculator.moldFeeInfo.value.waived).toBe(true);
      expect(calculator.hasMoldFee.value).toBe(false);
      expect(calculator.moldFeeWaived.value).toBe(true);
      expect(calculator.moldFeeWaivedReason.value).toContain('500+');
      
      // Change back to low quantity (should apply mold fee again)
      calculator.setSizeAndQuantity('1.50', 200);
      
      // Should apply mold fee again
      expect(calculator.moldFeeInfo.value.applicable).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      expect(calculator.hasMoldFee.value).toBe(true);
      expect(calculator.moldFeeWaived.value).toBe(false);
    });

    it('should handle boundary conditions correctly', () => {
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      
      // Test exactly 500 quantity (should still apply mold fee)
      calculator.setSizeAndQuantity('1.50', 500);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
      
      // Test high quantity (should waive mold fee) - use 1000 which should be available
      calculator.setSizeAndQuantity('1.50', 1000);
      expect(calculator.moldFeeInfo.value.waived).toBe(true);
      expect(calculator.moldFeeInfo.value.fee).toBe(0);
      
      // Test exactly 1.5" size (should use $50 fee)
      calculator.setSizeAndQuantity('1.50', 100);
      expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
      
      // Test exactly 2.0" size (should use $75 fee)
      calculator.setSizeAndQuantity('2.00', 100);
      expect(calculator.moldFeeInfo.value.fee).toBe(75.00);
    });

    it('should integrate mold fee into price breakdown correctly', async () => {
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      
      // Use valid plating, backing, and packaging options from the data
      const { PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS } = await import('~/data/pricing');
      calculator.setPlatingType(PLATING_OPTIONS[0]); // Use first available option
      calculator.setSizeAndQuantity('1.50', 100);
      calculator.setBacking(BACKING_OPTIONS[0]); // Use first available option
      calculator.setPackaging(PACKAGING_OPTIONS[0]); // Use first available option
      
      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown).not.toBeNull();
      
      if (breakdown) {
        // Should include mold fee in breakdown
        expect(breakdown.moldFee).toBe(50.00);
        expect(breakdown.moldFeeWaived).toBe(false);
        
        // Total should include mold fee
        const expectedTotal = breakdown.basePrice + breakdown.setupFee + 
                            breakdown.platingCost + breakdown.backingCost + 
                            breakdown.packagingCost + breakdown.rushFee + 
                            breakdown.moldFee;
        expect(breakdown.total).toBe(expectedTotal);
      }
      
      // Change to high quantity to waive mold fee
      calculator.setSizeAndQuantity('1.50', 1000);
      
      const updatedBreakdown = calculator.priceBreakdown.value;
      expect(updatedBreakdown).not.toBeNull();
      
      if (updatedBreakdown) {
        // Should waive mold fee in breakdown
        expect(updatedBreakdown.moldFee).toBe(0);
        expect(updatedBreakdown.moldFeeWaived).toBe(true);
        
        // Total should not include mold fee
        const expectedTotal = updatedBreakdown.basePrice + updatedBreakdown.setupFee + 
                            updatedBreakdown.platingCost + updatedBreakdown.backingCost + 
                            updatedBreakdown.packagingCost + updatedBreakdown.rushFee;
        expect(updatedBreakdown.total).toBe(expectedTotal);
      }
    });

    it('should handle production method changes that affect size availability', () => {
      // Start with one production method
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      calculator.setSizeAndQuantity('1.50', 100);
      
      // Should have mold fee
      expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
      
      // Change production method (this might reset size/quantity)
      const offsetPrinted = PRODUCTION_METHODS.find(m => m.id === 'offset-printed');
      if (offsetPrinted) {
        calculator.setProductionMethod(offsetPrinted);
        
        // If size/quantity were reset, mold fee should not be applicable
        if (!calculator.state.selectedSize || !calculator.state.selectedQuantity) {
          expect(calculator.moldFeeInfo.value.applicable).toBe(false);
          expect(calculator.moldFeeInfo.value.fee).toBe(0);
        }
      }
    });

    it('should maintain mold fee state consistency during rapid changes', () => {
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      
      // Perform rapid state changes
      const changes = [
        { size: '1.00', quantity: 100, expectedFee: 50.00, expectedWaived: false },
        { size: '1.00', quantity: 1000, expectedFee: 0, expectedWaived: true },
        { size: '1.75', quantity: 1000, expectedFee: 0, expectedWaived: true },
        { size: '1.75', quantity: 200, expectedFee: 62.50, expectedWaived: false },
        { size: '2.00', quantity: 200, expectedFee: 75.00, expectedWaived: false },
        { size: '2.00', quantity: 1000, expectedFee: 0, expectedWaived: true }
      ];
      
      changes.forEach(({ size, quantity, expectedFee, expectedWaived }) => {
        calculator.setSizeAndQuantity(size, quantity);
        
        expect(calculator.moldFeeInfo.value.applicable).toBe(true);
        expect(calculator.moldFeeInfo.value.fee).toBe(expectedFee);
        expect(calculator.moldFeeInfo.value.waived).toBe(expectedWaived);
        expect(calculator.hasMoldFee.value).toBe(!expectedWaived && expectedFee > 0);
        expect(calculator.moldFeeWaived.value).toBe(expectedWaived);
        expect(calculator.moldFeeAmount.value).toBe(expectedFee);
      });
    });

    it('should handle error conditions gracefully', () => {
      // Test with no production method selected
      expect(calculator.moldFeeInfo.value.applicable).toBe(false);
      expect(calculator.moldFeeInfo.value.fee).toBe(0);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
      
      // Test with production method but no size/quantity selected
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      
      // Without setting size and quantity, mold fee should not be applicable
      expect(calculator.moldFeeInfo.value.applicable).toBe(false);
      expect(calculator.moldFeeInfo.value.fee).toBe(0);
      expect(calculator.moldFeeInfo.value.waived).toBe(false);
    });
  });

  describe('Mold Fee State Management', () => {
    it('should provide readonly access to mold fee computed properties', () => {
      // Verify that mold fee properties are readonly by checking their type
      // Note: In JavaScript, computed refs don't throw errors when you try to set them,
      // but they are marked as readonly in TypeScript
      expect(calculator.moldFeeInfo.value).toBeDefined();
      expect(calculator.hasMoldFee.value).toBeDefined();
      expect(calculator.moldFeeWaived.value).toBeDefined();
      expect(calculator.moldFeeAmount.value).toBeDefined();
      expect(calculator.moldFeeWaivedReason.value).toBeDefined();
      
      // These properties should be computed and reactive
      expect(typeof calculator.moldFeeInfo.value).toBe('object');
      expect(typeof calculator.hasMoldFee.value).toBe('boolean');
      expect(typeof calculator.moldFeeWaived.value).toBe('boolean');
      expect(typeof calculator.moldFeeAmount.value).toBe('number');
    });

    it('should update mold fee properties reactively', () => {
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      
      // Track changes to mold fee properties
      const moldFeeValues: number[] = [];
      const waivedValues: boolean[] = [];
      
      // Set up watchers (in a real Vue component, these would be automatic)
      const initialFee = calculator.moldFeeAmount.value;
      const initialWaived = calculator.moldFeeWaived.value;
      moldFeeValues.push(initialFee);
      waivedValues.push(initialWaived);
      
      // Make changes and track updates
      calculator.setSizeAndQuantity('1.50', 100);
      moldFeeValues.push(calculator.moldFeeAmount.value);
      waivedValues.push(calculator.moldFeeWaived.value);
      
      calculator.setSizeAndQuantity('1.50', 1000); // Use valid quantity that should waive fee
      moldFeeValues.push(calculator.moldFeeAmount.value);
      waivedValues.push(calculator.moldFeeWaived.value);
      
      calculator.setSizeAndQuantity('2.00', 100);
      moldFeeValues.push(calculator.moldFeeAmount.value);
      waivedValues.push(calculator.moldFeeWaived.value);
      
      // Verify that values changed as expected
      expect(moldFeeValues).toEqual([0, 50.00, 0, 75.00]);
      expect(waivedValues).toEqual([false, false, true, false]);
    });
  });
});