import { describe, it, expect, beforeEach } from 'vitest';
import { usePricingCalculator } from './usePricingCalculator';
import { PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

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

  describe('Plating Type Selection', () => {
    it('should set plating type correctly', () => {
      const dieStruck = PLATING_TYPES[0];
      calculator.setPlatingType(dieStruck);

      expect(calculator.state.selectedPlatingType).toStrictEqual(dieStruck);
    });

    it('should provide available plating types', () => {
      const types = calculator.getAvailablePlatingTypes();
      expect(types).toEqual(PLATING_TYPES);
      expect(types.length).toBe(5);
    });

    it('should reset size/quantity when plating type changes if incompatible', () => {
      const dieStruck = PLATING_TYPES[0];
      calculator.setPlatingType(dieStruck);
      calculator.setSizeAndQuantity('1.00', 100);

      expect(calculator.state.selectedSize).toBe('1.00');
      expect(calculator.state.selectedQuantity).toBe(100);

      // Switch to another plating type - should keep selections if valid
      const softEnamel = PLATING_TYPES[1];
      calculator.setPlatingType(softEnamel);

      expect(calculator.state.selectedSize).toBe('1.00');
      expect(calculator.state.selectedQuantity).toBe(100);
    });
  });

  describe('Size and Quantity Selection', () => {
    beforeEach(() => {
      calculator.setPlatingType(PLATING_TYPES[0]); // Die Struck
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

    it('should require plating type before size/quantity', () => {
      calculator.resetSelections();
      calculator.setSizeAndQuantity('1.00', 100);

      expect(calculator.validationErrors.value.platingType).toBeDefined();
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
      expect(options.length).toBe(5);
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
      calculator.setPlatingType(PLATING_TYPES[0]); // Die Struck
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
      expect(breakdown!.total).toBe(261);
      expect(breakdown!.unitPrice).toBe(2.61);
    });

    it('should include setup fee for Offset Printed', () => {
      calculator.setPlatingType(PLATING_TYPES[4]); // Offset Printed

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown!.setupFee).toBe(100);
    });

    it('should calculate rush fee correctly', () => {
      calculator.setRushOrder(true);

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown!.rushFee).toBe(52.2); // 20% of 261
      expect(breakdown!.total).toBe(313.2);
    });

    it('should include backing and packaging costs', () => {
      calculator.setBacking(BACKING_OPTIONS[2]); // Double Butterfly ($0.20)
      calculator.setPackaging(PACKAGING_OPTIONS[1]); // Velvet Pouch ($0.75)

      const breakdown = calculator.priceBreakdown.value;
      expect(breakdown!.backingCost).toBe(20); // 0.20 * 100
      expect(breakdown!.packagingCost).toBe(75); // 0.75 * 100
      expect(breakdown!.total).toBe(356); // 261 + 20 + 75
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
      calculator.setPlatingType(PLATING_TYPES[0]);
      calculator.setSizeAndQuantity('1.00', 100);
      calculator.setBacking(BACKING_OPTIONS[0]);
      calculator.setPackaging(PACKAGING_OPTIONS[0]);

      expect(calculator.validationStatus.value.isComplete).toBe(true);
      expect(calculator.validationStatus.value.isValid).toBe(true);
    });

    it('should clear validation errors when selections are made', () => {
      calculator.setValidationError('platingType', 'Test error');
      expect(calculator.validationErrors.value.platingType).toBe('Test error');

      calculator.setPlatingType(PLATING_TYPES[0]);
      expect(calculator.validationErrors.value.platingType).toBeUndefined();
    });
  });

  describe('Reset Functions', () => {
    beforeEach(() => {
      // Set up complete selections
      calculator.setPlatingType(PLATING_TYPES[0]);
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
});