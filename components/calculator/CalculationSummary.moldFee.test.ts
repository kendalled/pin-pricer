import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalculationSummary from './CalculationSummary.vue';
import type { PriceBreakdown } from '~/types/pricing';

describe('CalculationSummary - Mold Fee Display', () => {
  const baseMockBreakdown: PriceBreakdown = {
    basePrice: 100.00,
    setupFee: 50.00,
    platingCost: 10.00,
    backingCost: 20.00,
    packagingCost: 15.00,
    rushFee: 0,
    moldFee: 0,
    moldFeeWaived: false,
    total: 195.00,
    unitPrice: 1.00
  };

  it('should display mold fee when applicable', () => {
    const mockBreakdownWithMoldFee: PriceBreakdown = {
      ...baseMockBreakdown,
      moldFee: 50.00,
      moldFeeWaived: false,
      total: 245.00
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownWithMoldFee,
        isComplete: true
      }
    });

    const text = wrapper.text();
    expect(text).toContain('Mold Fee');
    expect(text).toContain('$50.00');
    expect(text).toContain('$245.00'); // Total should include mold fee
  });

  it('should display waived mold fee message when quantity exemption applies', () => {
    const mockBreakdownWithWaivedMoldFee: PriceBreakdown = {
      ...baseMockBreakdown,
      moldFee: 0,
      moldFeeWaived: true,
      total: 195.00
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownWithWaivedMoldFee,
        isComplete: true
      }
    });

    const text = wrapper.text();
    expect(text).toContain('Mold Fee');
    expect(text).toContain('Waived');
    expect(text).toContain('500+ qty');
  });

  it('should not display mold fee section when neither applied nor waived', () => {
    const mockBreakdownNoMoldFee: PriceBreakdown = {
      ...baseMockBreakdown,
      moldFee: 0,
      moldFeeWaived: false,
      total: 195.00
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownNoMoldFee,
        isComplete: true
      }
    });

    const text = wrapper.text();
    expect(text).not.toContain('Mold Fee');
  });

  it('should apply correct styling for waived mold fee', () => {
    const mockBreakdownWithWaivedMoldFee: PriceBreakdown = {
      ...baseMockBreakdown,
      moldFee: 0,
      moldFeeWaived: true,
      total: 195.00
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownWithWaivedMoldFee,
        isComplete: true
      }
    });

    // Check for green styling classes on waived mold fee
    const moldFeeElements = wrapper.findAll('.text-green-400');
    expect(moldFeeElements.length).toBeGreaterThan(0);
  });

  it('should display mold fee in correct position within pricing breakdown', () => {
    const mockBreakdownWithMoldFee: PriceBreakdown = {
      ...baseMockBreakdown,
      moldFee: 75.00,
      moldFeeWaived: false,
      total: 270.00
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownWithMoldFee,
        isComplete: true
      }
    });

    const text = wrapper.text();
    
    // Mold fee should appear after other costs but before total
    const moldFeeIndex = text.indexOf('Mold Fee');
    const totalIndex = text.indexOf('Total');
    
    expect(moldFeeIndex).toBeGreaterThan(-1);
    expect(totalIndex).toBeGreaterThan(-1);
    expect(moldFeeIndex).toBeLessThan(totalIndex);
  });
});