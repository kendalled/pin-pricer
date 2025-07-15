import { describe, it, expect } from 'vitest';
import { calculatePriceBreakdown, validatePricingData } from './calculations';
import { PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';
import type { OrderSelections } from '~/types/pricing';

describe('Integration tests with real pricing data', () => {
  it('should validate all real pricing data', () => {
    const result = validatePricingData(PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should calculate price breakdown for Die Struck without rush', () => {
    const selections: OrderSelections = {
      platingType: PLATING_TYPES[0], // Die Struck
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
    expect(result.backingCost).toBe(0);
    expect(result.packagingCost).toBe(0);
    expect(result.rushFee).toBe(0);
    expect(result.total).toBe(261);
  });

  it('should calculate price breakdown for Offset Printed with setup fee', () => {
    const selections: OrderSelections = {
      platingType: PLATING_TYPES[4], // Offset Printed
      size: '1.25',
      quantity: 500,
      backing: BACKING_OPTIONS[6], // Magnetic ($0.35)
      packaging: PACKAGING_OPTIONS[2], // Gift Box ($1.25)
      rushOrder: false
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(1.21);
    expect(result.basePrice).toBe(605); // 1.21 * 500
    expect(result.setupFee).toBe(100); // Offset Printed setup fee
    expect(result.backingCost).toBe(175); // 0.35 * 500
    expect(result.packagingCost).toBe(625); // 1.25 * 500
    expect(result.rushFee).toBe(0);
    expect(result.total).toBe(1505); // 605 + 100 + 175 + 625
  });

  it('should calculate price breakdown with rush order', () => {
    const selections: OrderSelections = {
      platingType: PLATING_TYPES[1], // Soft Enamel
      size: '1.50',
      quantity: 200,
      backing: BACKING_OPTIONS[4], // Military Clutch ($0.25)
      packaging: PACKAGING_OPTIONS[1], // Velvet Pouch ($0.75)
      rushOrder: true
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(2.52);
    expect(result.basePrice).toBe(504); // 2.52 * 200
    expect(result.setupFee).toBe(0);
    expect(result.backingCost).toBe(50); // 0.25 * 200
    expect(result.packagingCost).toBe(150); // 0.75 * 200
    expect(result.rushFee).toBe(140.8); // (504 + 0 + 50 + 150) * 0.20
    expect(result.total).toBe(844.8); // 504 + 0 + 50 + 150 + 140.8
  });

  it('should handle maximum quantity and size', () => {
    const selections: OrderSelections = {
      platingType: PLATING_TYPES[3], // Hard Enamel
      size: '2.00',
      quantity: 2000,
      backing: BACKING_OPTIONS[8], // Deluxe Clutch ($0.40)
      packaging: PACKAGING_OPTIONS[3], // Presentation Box ($2.50)
      rushOrder: true
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(1.69);
    expect(result.basePrice).toBe(3380); // 1.69 * 2000
    expect(result.setupFee).toBe(0);
    expect(result.backingCost).toBe(800); // 0.40 * 2000
    expect(result.packagingCost).toBe(5000); // 2.50 * 2000
    expect(result.rushFee).toBe(1836); // (3380 + 0 + 800 + 5000) * 0.20
    expect(result.total).toBe(11016); // 3380 + 0 + 800 + 5000 + 1836
  });

  it('should handle minimum quantity and size', () => {
    const selections: OrderSelections = {
      platingType: PLATING_TYPES[2], // Silk Screen
      size: '0.75',
      quantity: 100,
      backing: BACKING_OPTIONS[1], // Rubber Clutch (free)
      packaging: PACKAGING_OPTIONS[4], // Custom Card ($0.50)
      rushOrder: false
    };

    const result = calculatePriceBreakdown(selections);
    
    expect(result.unitPrice).toBe(2.64);
    expect(result.basePrice).toBe(264); // 2.64 * 100
    expect(result.setupFee).toBe(0);
    expect(result.backingCost).toBe(0); // Free
    expect(result.packagingCost).toBe(50); // 0.50 * 100
    expect(result.rushFee).toBe(0);
    expect(result.total).toBe(314); // 264 + 0 + 0 + 50
  });
});