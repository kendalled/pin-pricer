import { describe, it, expect, beforeEach } from 'vitest';
import { usePricingCalculator } from './usePricingCalculator';
import { PRODUCTION_METHODS, PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

describe('usePricingCalculator', () => {
  let calculator: ReturnType<typeof usePricingCalculator>;

  beforeEach(() => {
    calculator = usePricingCalculator();
  });

  describe('Initial State', () => {
    it('should initialize with empty selections', () => {
      expect(calculator.state.selectedPlatingType).toBeNull();
      expect(calculator.state.selectedSize).toBeNull();
      expect(calculator.state.selectedQuantity).toBeNull();
      expect(calculator.state.selectedBacking).toBeNull();
      expect(calculator.state.selectedPackaging).toBeNull();
      expect(calculator.state.rushOrder).toBe(false);
    });

    it('should not be complete initially', () => {
      expect(calculator.isSelectionComplete.value).toBe(false);
    });

    it('should have no price breakdown initially', () => {
      expect(calculator.priceBreakdown.value).toBeNull();
    });
  });

  describe('Production Method Selection', () => {
    it('should set production method correctly', () => {
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);

      expect(calculator.state.selectedProductionMethod).toStrictEqual(dieStruck);
    });

    it('should provide available production methods', () => {
      const methods = calculator.getAvailableProductionMethods();
      expect(methods).toEqual(PRODUCTION_METHODS);
      expect(methods.length).toBe(5);
    });

    it('should reset size/quantity when production method changes if incompatible', () => {
      const dieStruck = PRODUCTION_METHODS[0];
      calculator.setProductionMethod(dieStruck);
      calculator.setSizeAndQuantity('1.00', 100);

      expect(calculator.state.selectedSize).toBe('1.00');
      expect(calculator.state.selectedQuantity).toBe(100);

      // Switch to another production method - should keep selections if valid
      const softEnamel = PRODUCTION_METHODS[1];
      calculator.setProductionMethod(softEnamel);

      expect(calculator.state.selectedSize).toBe('1.00');
      expect(calculator.state.selectedQuantity).toBe(100);
    });
  });

  describe('Plating Type Selection', () => {
    it('should set plating type correctly', () => {
      const polishedGold = PLATING_OPTIONS[0];
      calculator.setPlatingType(polishedGold);

      expect(calculator.state.selectedPlatingType).toStrictEqual(polishedGold);
    });

    it('should provide available plating options', () => {
      const options = calculator.getAvailablePlatingOptions();
      expect(options).toEqual(PLATING_OPTIONS);
      expect(options.length).toBe(10);
    });
  });

  describe('Size and Quantity Selection', () => {
    beforeEach(() => {
      calculator.setProductionMethod(PRODUCTION_METHODS[0]); // Die Struck
      calculator.setPlatingType(PLATING_OPTIONS[0]); // Polished Gold
    });

    it('should set size and quantity correctly', () => {
      calculator.setSizeAndQuantity('1.00', 100);

      expect(calculator.state.selectedSize).toBe('1.00');
      expect(calculator.state.selectedQuantity).toBe(100);
    });

    it('should validate size/quantity combination exists', () => {
      calculator.setSizeAndQuantity('1.00', 999); // Invalid quantity

      expect(calculator.validationErrors.value.general).toBeDefined();
      expect(calculator.validationErrors.value.general![0]).toContain('Invalid');
    });

    it('should require production method before size/quantity', () => {
      calculator.resetSelections();
      calculator.setSizeAndQuantity('1.00', 100);

      expect(calculator.validationErrors.value.productionMethod).toBeDefined();
    });

    it('should provide available sizes for selected plating type', () => {
      const sizes = calculator.getAvailableSizes.value;
      expect(sizes).toEqual(['0.75', '1.00', '1.25', '1.50', '1.75', '2.00']);
    });

    it('should provide available quantities for selected size', () => {
      calculator.setSizeAndQuantity('1.00', 100);
      const quantities = calculator.getAvailableQuantities.value;
      expect(quantities).toEqual([100, 200, 300, 500, 750, 1000, 2000]);
    });
  });

  describe('Backing and Packaging Selection', () => {
    it('should set backing option correctly', () => {
      const butterfly = BACKING_OPTIONS[0];
      calculator.setBacking(butterfly);

      expect(calculator.state.selectedBacking).toStrictEqual(butterfly);
    });

    it('should set packaging option correctly', () => {
      const polyBag = PACKAGING_OPTIONS[0];
      calculator.setPackaging(polyBag);

      expect(calculator.state.selectedPackaging).toStrictEqual(polyBag);
    });

    it('should provide available backing options', () => {
      const options = calculator.getAvailableBackingOptions();
      expect(options).toEqual(BACKING_OPTIONS);
      expect(options.length).toBe(9);
    });

    it('should provide available packaging options', () => {
      const options = calculator.getAvailablePackagingOptions();
      expect(options).toEqual(PACKAGING_OPTIONS);
      expect(options.length).toBe(4);
    });
  });

  describe('Rush Order', () => {
    it('should set rush order correctly', () => {
      calculator.setRushOrder(true);
      expect(calculator.state.rushOrder).toBe(true);

      calculator.setRushOrder(false);
      expect(calculator.state.rushOrder).toBe(false);
    });
  });

  describe('Price Calculation', () => {
    beforeEach(() => {
      // Set up complete selections
      calculator.setProductionMethod(PRODUCTION_METHODS[0]); // Die Struck
      calculator.setPlatingType(PLATING_OPTIONS[0]); // Polished Gold
      calculator.setSizeAndQuantity('1.00', 100);
      calculator.setBacking(BACKING_OPTIONS[0]); // Butterfly (free)
      calculator.setPackaging(PACKAGING_OPTIONS[0]); // Poly Bag (free)
    });

    it('should calculate price breakdown when selections are complete', () => {
      expect(calculator.isSelectionComplete.value).toBe(true);

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown).not.toBeNull();
      expect(breakdown!.basePrice).toBe(261); // 2.61 * 100
      expect(breakdown!.setupFee).toBe(0);
      expect(breakdown!.backingCost).toBe(0);
      expect(breakdown!.packagingCost).toBe(0);
      expect(breakdown!.rushFee).toBe(0);
      expect(breakdown!.moldFee).toBe(50); // Mold fee for 1.00" size
      expect(breakdown!.total).toBe(311); // 261 + 50 (mold fee)
      expect(breakdown!.unitPrice).toBe(2.61);
    });

    it('should include setup fee for Offset Printed', () => {
      calculator.setProductionMethod(PRODUCTION_METHODS[4]); // Offset Printed

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown!.setupFee).toBe(100);
    });

    it('should calculate rush fee correctly', () => {
      calculator.setRushOrder(true);

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown!.rushFee).toBe(62.2); // 20% of (261 + 50 mold fee) = 20% of 311
      expect(breakdown!.total).toBe(373.2); // 261 + 50 + 62.2
    });

    it('should include backing and packaging costs', () => {
      calculator.setBacking(BACKING_OPTIONS[2]); // Double Butterfly ($0.20)
      calculator.setPackaging(PACKAGING_OPTIONS[1]); // Acrylic Case ($1.00)

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown!.backingCost).toBe(20); // 0.20 * 100
      expect(breakdown!.packagingCost).toBe(100); // 1.00 * 100
      expect(breakdown!.total).toBe(431); // 261 + 50 (mold fee) + 20 + 100
    });

    it('should return null when selections are incomplete', () => {
      calculator.resetSelections();
      expect(calculator.priceBreakdown.value).toBeNull();
    });
  });

  describe('Validation', () => {
    it('should validate complete selections', () => {
      // Incomplete selections
      expect(calculator.validationStatus.value.isComplete).toBe(false);
      expect(calculator.validationStatus.value.isValid).toBe(false);

      // Complete selections
      calculator.setProductionMethod(PRODUCTION_METHODS[0]);
      calculator.setPlatingType(PLATING_OPTIONS[0]);
      calculator.setSizeAndQuantity('1.00', 100);
      calculator.setBacking(BACKING_OPTIONS[0]);
      calculator.setPackaging(PACKAGING_OPTIONS[0]);

      expect(calculator.validationStatus.value.isComplete).toBe(true);
      expect(calculator.validationStatus.value.isValid).toBe(true);
    });

    it('should clear validation errors when selections are made', () => {
      calculator.setValidationError('platingType', 'Test error');
      expect(calculator.validationErrors.value.platingType).toBe('Test error');

      calculator.setPlatingType(PLATING_OPTIONS[0]);
      expect(calculator.validationErrors.value.platingType).toBeUndefined();
    });
  });

  describe('Reset Functions', () => {
    beforeEach(() => {
      // Set up complete selections
      calculator.setProductionMethod(PRODUCTION_METHODS[0]);
      calculator.setPlatingType(PLATING_OPTIONS[0]);
      calculator.setSizeAndQuantity('1.00', 100);
      calculator.setBacking(BACKING_OPTIONS[0]);
      calculator.setPackaging(PACKAGING_OPTIONS[0]);
      calculator.setRushOrder(true);
    });

    it('should reset all selections', () => {
      calculator.resetSelections();

      expect(calculator.state.selectedPlatingType).toBeNull();
      expect(calculator.state.selectedSize).toBeNull();
      expect(calculator.state.selectedQuantity).toBeNull();
      expect(calculator.state.selectedBacking).toBeNull();
      expect(calculator.state.selectedPackaging).toBeNull();
      expect(calculator.state.rushOrder).toBe(false);
    });

    it('should reset only modifications', () => {
      calculator.resetModifications();

      expect(calculator.state.selectedPlatingType).not.toBeNull();
      expect(calculator.state.selectedSize).not.toBeNull();
      expect(calculator.state.selectedQuantity).not.toBeNull();
      expect(calculator.state.selectedBacking).toBeNull();
      expect(calculator.state.selectedPackaging).toBeNull();
      expect(calculator.state.rushOrder).toBe(false);
    });
  });

  describe('Mold Fee State Management', () => {
    beforeEach(() => {
      calculator.setProductionMethod(PRODUCTION_METHODS[0]); // Die Struck
      calculator.setPlatingType(PLATING_OPTIONS[0]); // Polished Gold
      calculator.setBacking(BACKING_OPTIONS[0]); // Butterfly (free)
      calculator.setPackaging(PACKAGING_OPTIONS[0]); // Poly Bag (free)
    });

    describe('Mold Fee Calculation', () => {
      it('should calculate $50 mold fee for sizes ≤ 1.5"', () => {
        calculator.setSizeAndQuantity('0.75', 100);
        expect(calculator.moldFeeInfo.value.applicable).toBe(true);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);

        calculator.setSizeAndQuantity('1.00', 200);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.hasMoldFee.value).toBe(true);

        calculator.setSizeAndQuantity('1.25', 300);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.hasMoldFee.value).toBe(true);

        calculator.setSizeAndQuantity('1.50', 500);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.hasMoldFee.value).toBe(true);
      });

      it('should calculate $62.50 mold fee for 1.75" size', () => {
        calculator.setSizeAndQuantity('1.75', 100);
        expect(calculator.moldFeeInfo.value.applicable).toBe(true);
        expect(calculator.moldFeeInfo.value.fee).toBe(62.50);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);
      });

      it('should calculate $75 mold fee for sizes ≥ 2.0"', () => {
        calculator.setSizeAndQuantity('2.00', 100);
        expect(calculator.moldFeeInfo.value.applicable).toBe(true);
        expect(calculator.moldFeeInfo.value.fee).toBe(75.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);
      });

      it('should waive mold fee for quantities > 500', () => {
        calculator.setSizeAndQuantity('1.00', 750);
        expect(calculator.moldFeeInfo.value.applicable).toBe(true);
        expect(calculator.moldFeeInfo.value.fee).toBe(0);
        expect(calculator.moldFeeInfo.value.waived).toBe(true);
        expect(calculator.moldFeeInfo.value.reason).toBe('High volume exemption (500+ qty)');
        expect(calculator.hasMoldFee.value).toBe(false);
        expect(calculator.moldFeeWaived.value).toBe(true);
        expect(calculator.moldFeeWaivedReason.value).toBe('High volume exemption (500+ qty)');

        calculator.setSizeAndQuantity('2.00', 1000);
        expect(calculator.moldFeeInfo.value.fee).toBe(0);
        expect(calculator.moldFeeInfo.value.waived).toBe(true);
        expect(calculator.hasMoldFee.value).toBe(false);
        expect(calculator.moldFeeWaived.value).toBe(true);

        calculator.setSizeAndQuantity('1.75', 2000);
        expect(calculator.moldFeeInfo.value.fee).toBe(0);
        expect(calculator.moldFeeInfo.value.waived).toBe(true);
        expect(calculator.hasMoldFee.value).toBe(false);
        expect(calculator.moldFeeWaived.value).toBe(true);
      });

      it('should apply mold fee for quantity exactly 500', () => {
        calculator.setSizeAndQuantity('1.50', 500);
        expect(calculator.moldFeeInfo.value.applicable).toBe(true);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);
      });

      it('should not be applicable when size or quantity is not selected', () => {
        expect(calculator.moldFeeInfo.value.applicable).toBe(false);
        expect(calculator.moldFeeInfo.value.fee).toBe(0);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(false);
        expect(calculator.moldFeeWaived.value).toBe(false);

        calculator.setSizeAndQuantity('1.00', 100);
        calculator.resetSelections();
        expect(calculator.moldFeeInfo.value.applicable).toBe(false);
      });
    });

    describe('Real-time Updates', () => {
      it('should update mold fee when size changes', () => {
        calculator.setSizeAndQuantity('1.00', 100);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.hasMoldFee.value).toBe(true);

        calculator.setSizeAndQuantity('1.75', 100);
        expect(calculator.moldFeeInfo.value.fee).toBe(62.50);
        expect(calculator.hasMoldFee.value).toBe(true);

        calculator.setSizeAndQuantity('2.00', 100);
        expect(calculator.moldFeeInfo.value.fee).toBe(75.00);
        expect(calculator.hasMoldFee.value).toBe(true);
      });

      it('should update mold fee when quantity changes', () => {
        calculator.setSizeAndQuantity('1.50', 100);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);

        calculator.setSizeAndQuantity('1.50', 750);
        expect(calculator.moldFeeInfo.value.fee).toBe(0);
        expect(calculator.moldFeeInfo.value.waived).toBe(true);
        expect(calculator.hasMoldFee.value).toBe(false);
        expect(calculator.moldFeeWaived.value).toBe(true);

        calculator.setSizeAndQuantity('1.50', 300);
        expect(calculator.moldFeeInfo.value.fee).toBe(50.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);
      });

      it('should handle waived/applied transitions correctly', () => {
        // Start with quantity that applies mold fee
        calculator.setSizeAndQuantity('2.00', 500);
        expect(calculator.moldFeeInfo.value.fee).toBe(75.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);

        // Change to quantity that waives mold fee
        calculator.setSizeAndQuantity('2.00', 750);
        expect(calculator.moldFeeInfo.value.fee).toBe(0);
        expect(calculator.moldFeeInfo.value.waived).toBe(true);
        expect(calculator.hasMoldFee.value).toBe(false);
        expect(calculator.moldFeeWaived.value).toBe(true);

        // Change back to quantity that applies mold fee
        calculator.setSizeAndQuantity('2.00', 200);
        expect(calculator.moldFeeInfo.value.fee).toBe(75.00);
        expect(calculator.moldFeeInfo.value.waived).toBe(false);
        expect(calculator.hasMoldFee.value).toBe(true);
        expect(calculator.moldFeeWaived.value).toBe(false);
      });
    });

    describe('Price Breakdown Integration', () => {
      it('should include mold fee in price breakdown when applicable', () => {
        calculator.setSizeAndQuantity('1.50', 100);
        
        const breakdown = calculator.priceBreakdown.value;
        expect(breakdown).not.toBeNull();
        expect(breakdown!.moldFee).toBe(50.00);
        expect(breakdown!.moldFeeWaived).toBe(false);
        expect(breakdown!.total).toBe(325); // 275 (base) + 50 (mold fee)
      });

      it('should exclude mold fee from price breakdown when waived', () => {
        calculator.setSizeAndQuantity('1.50', 750);
        
        const breakdown = calculator.priceBreakdown.value;
        expect(breakdown).not.toBeNull();
        expect(breakdown!.moldFee).toBe(0);
        expect(breakdown!.moldFeeWaived).toBe(true);
        expect(breakdown!.total).toBe(937.5); // Base price for 1.50" x 750 (1.25 * 750) without mold fee
      });

      it('should include mold fee in rush fee calculation', () => {
        calculator.setSizeAndQuantity('1.00', 100);
        calculator.setRushOrder(true);
        
        const breakdown = calculator.priceBreakdown.value;
        expect(breakdown).not.toBeNull();
        expect(breakdown!.moldFee).toBe(50.00);
        expect(breakdown!.moldFeeWaived).toBe(false);
        // Rush fee should be 20% of (basePrice + moldFee) = 20% of (261 + 50) = 62.2
        expect(breakdown!.rushFee).toBe(62.2);
        expect(breakdown!.total).toBe(373.2); // 261 + 50 + 62.2
      });

      it('should not include waived mold fee in rush fee calculation', () => {
        calculator.setSizeAndQuantity('1.00', 750);
        calculator.setRushOrder(true);
        
        const breakdown = calculator.priceBreakdown.value;
        expect(breakdown).not.toBeNull();
        expect(breakdown!.moldFee).toBe(0);
        expect(breakdown!.moldFeeWaived).toBe(true);
        // Rush fee should be 20% of basePrice only (no mold fee)
        // For 1.00" x 750, unit price is 1.16, so base price is 1.16 * 750 = 870
        const expectedBasePrice = 1.16 * 750; // 870
        const expectedRushFee = expectedBasePrice * 0.20; // 174
        expect(breakdown!.rushFee).toBe(expectedRushFee);
        expect(breakdown!.total).toBe(expectedBasePrice + expectedRushFee);
      });
    });

    describe('Error Handling', () => {
      it('should handle mold fee calculation errors gracefully', () => {
        // This test ensures the composable doesn't break if mold fee calculation fails
        calculator.setSizeAndQuantity('1.00', 100);
        
        // Even if there's an error in mold fee calculation, the composable should still work
        expect(calculator.moldFeeInfo.value).toBeDefined();
        expect(calculator.hasMoldFee.value).toBeDefined();
        expect(calculator.moldFeeWaived.value).toBeDefined();
        expect(calculator.moldFeeAmount.value).toBeDefined();
        expect(calculator.moldFeeWaivedReason.value).toBeDefined();
      });
    });
  });
});