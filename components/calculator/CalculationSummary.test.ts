import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CalculationSummary from './CalculationSummary.vue';
import type { PriceBreakdown } from '~/types/pricing';

describe('CalculationSummary', () => {
  const mockBreakdown: PriceBreakdown = {
    basePrice: 100.00,
    setupFee: 50.00,
    backingCost: 20.00,
    packagingCost: 15.00,
    rushFee: 37.00, // 20% of (100 + 50 + 20 + 15) = 37
    total: 222.00,
    unitPrice: 1.00
  };

  const mockBreakdownWithoutOptionalFees: PriceBreakdown = {
    basePrice: 100.00,
    setupFee: 0,
    backingCost: 0,
    packagingCost: 0,
    rushFee: 0,
    total: 100.00,
    unitPrice: 1.00
  };

  const mockBreakdownWithSetupFeeOnly: PriceBreakdown = {
    basePrice: 100.00,
    setupFee: 100.00, // Offset Printed setup fee
    backingCost: 0,
    packagingCost: 0,
    rushFee: 0,
    total: 200.00,
    unitPrice: 1.00
  };

  it('renders correctly with null breakdown', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: null
      }
    });

    expect(wrapper.find('h3').text()).toBe('Price Breakdown');
    expect(wrapper.text()).toContain('Complete your selections to see pricing breakdown');
  });

  it('displays all line items when breakdown is complete', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdown,
        isComplete: true
      }
    });

    // Check that all line items are displayed
    expect(wrapper.text()).toContain('Base Price ($1.00 each)');
    expect(wrapper.text()).toContain('$100.00');
    expect(wrapper.text()).toContain('Setup Fee');
    expect(wrapper.text()).toContain('$50.00');
    expect(wrapper.text()).toContain('Backing');
    expect(wrapper.text()).toContain('$20.00');
    expect(wrapper.text()).toContain('Packaging');
    expect(wrapper.text()).toContain('$15.00');
    expect(wrapper.text()).toContain('Rush Fee (20%)');
    expect(wrapper.text()).toContain('$37.00');
    expect(wrapper.text()).toContain('Total');
    expect(wrapper.text()).toContain('$222.00');
  });

  it('hides zero-cost line items', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownWithoutOptionalFees,
        isComplete: true
      }
    });

    // Should show base price and total
    expect(wrapper.text()).toContain('Base Price');
    expect(wrapper.text()).toContain('Total');
    expect(wrapper.text()).toContain('$100.00');

    // Should not show zero-cost items
    expect(wrapper.text()).not.toContain('Setup Fee');
    expect(wrapper.text()).not.toContain('Backing');
    expect(wrapper.text()).not.toContain('Packaging');
    expect(wrapper.text()).not.toContain('Rush Fee');
  });

  it('displays Offset Printed setup fee as separate line item', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdownWithSetupFeeOnly,
        isComplete: true
      }
    });

    expect(wrapper.text()).toContain('Setup Fee');
    expect(wrapper.text()).toContain('$100.00');
    expect(wrapper.text()).toContain('Total');
    expect(wrapper.text()).toContain('$200.00');
  });

  it('formats all prices as currency with two decimal places', () => {
    const breakdownWithDecimals: PriceBreakdown = {
      basePrice: 123.45,
      setupFee: 67.89,
      backingCost: 12.34,
      packagingCost: 5.67,
      rushFee: 41.87,
      total: 251.22,
      unitPrice: 1.23
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: breakdownWithDecimals,
        isComplete: true
      }
    });

    // Check currency formatting
    expect(wrapper.text()).toContain('$123.45');
    expect(wrapper.text()).toContain('$67.89');
    expect(wrapper.text()).toContain('$12.34');
    expect(wrapper.text()).toContain('$5.67');
    expect(wrapper.text()).toContain('$41.87');
    expect(wrapper.text()).toContain('$251.22');
    expect(wrapper.text()).toContain('$1.23 each');
  });

  it('emphasizes total with larger text and different color', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdown,
        isComplete: true
      }
    });

    const totalSection = wrapper.find('.text-2xl.font-bold.text-blue-400');
    expect(totalSection.exists()).toBe(true);
    expect(totalSection.text()).toBe('$222.00');

    const totalLabel = wrapper.find('.text-xl.font-semibold');
    expect(totalLabel.exists()).toBe(true);
    expect(totalLabel.text()).toBe('Total');
  });

  it('shows unit price in base price line', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdown,
        isComplete: true
      }
    });

    expect(wrapper.text()).toContain('Base Price ($1.00 each)');
  });

  it('handles edge case with zero unit price', () => {
    const breakdownWithZeroUnit: PriceBreakdown = {
      basePrice: 0,
      setupFee: 100,
      backingCost: 0,
      packagingCost: 0,
      rushFee: 0,
      total: 100,
      unitPrice: 0
    };

    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: breakdownWithZeroUnit,
        isComplete: true
      }
    });

    expect(wrapper.text()).toContain('Base Price ($0.00 each)');
  });

  it('applies correct styling classes', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdown,
        isComplete: true
      }
    });

    // Check main container styling
    expect(wrapper.find('.bg-slate-800.rounded-lg.border.border-slate-600.p-6').exists()).toBe(true);
    
    // Check header styling
    expect(wrapper.find('h3.text-lg.font-semibold.text-slate-50').exists()).toBe(true);
    
    // Check line item styling
    expect(wrapper.find('.text-slate-200').exists()).toBe(true);
    
    // Check divider
    expect(wrapper.find('hr.border-slate-600').exists()).toBe(true);
    
    // Check total styling
    expect(wrapper.find('.text-slate-50').exists()).toBe(true);
  });

  it('shows rush fee with correct percentage label', () => {
    const wrapper = mount(CalculationSummary, {
      props: {
        breakdown: mockBreakdown,
        isComplete: true
      }
    });

    expect(wrapper.text()).toContain('Rush Fee (20%)');
  });
});