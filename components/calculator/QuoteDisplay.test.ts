import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuoteDisplay from './QuoteDisplay.vue';
import type { OrderSelections, PriceBreakdown } from '~/types/pricing';
import { PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  PrinterIcon: { template: '<div data-testid="printer-icon"></div>' },
  PencilIcon: { template: '<div data-testid="pencil-icon"></div>' },
  CogIcon: { template: '<div data-testid="cog-icon"></div>' },
  WrenchScrewdriverIcon: { template: '<div data-testid="wrench-icon"></div>' },
  CalculatorIcon: { template: '<div data-testid="calculator-icon"></div>' }
}));

// Mock UI components
vi.mock('~/components/ui/Card.vue', () => ({
  default: {
    template: `
      <div class="mock-card">
        <div v-if="$slots.header" class="mock-header">
          <slot name="header" />
        </div>
        <div class="mock-content">
          <slot />
        </div>
      </div>
    `
  }
}));

vi.mock('~/components/ui/Button.vue', () => ({
  default: {
    template: '<button class="mock-button" @click="$emit(\'click\')"><slot /></button>',
    emits: ['click']
  }
}));

vi.mock('~/components/ui/Badge.vue', () => ({
  default: {
    template: '<span class="mock-badge" :class="variant"><slot /></span>',
    props: ['variant', 'size']
  }
}));

describe('QuoteDisplay', () => {
  const mockSelections: OrderSelections = {
    platingType: PLATING_TYPES[0], // Die Struck
    size: '1.00',
    quantity: 500,
    backing: BACKING_OPTIONS[0], // Butterfly Clutch (free)
    packaging: PACKAGING_OPTIONS[1], // Velvet Pouch
    rushOrder: false
  };

  const mockBreakdown: PriceBreakdown = {
    basePrice: 630.00,
    setupFee: 0,
    platingCost: 0,
    backingCost: 0,
    packagingCost: 375.00,
    rushFee: 0,
    moldFee: 0,
    moldFeeWaived: false,
    total: 1005.00,
    unitPrice: 1.26
  };

  const mockSelectionsWithSetupFee: OrderSelections = {
    ...mockSelections,
    platingType: PLATING_TYPES[4], // Offset Printed (has setup fee)
    rushOrder: true
  };

  const mockBreakdownWithAllFees: PriceBreakdown = {
    basePrice: 580.00,
    setupFee: 100.00,
    platingCost: 0,
    backingCost: 0,
    packagingCost: 375.00,
    rushFee: 211.00, // 20% of (580 + 100 + 0 + 375)
    moldFee: 0,
    moldFeeWaived: false,
    total: 1266.00,
    unitPrice: 1.16
  };

  it('renders quote display with basic selections', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    expect(wrapper.find('.quote-display').exists()).toBe(true);
    expect(wrapper.text()).toContain('Quote Summary');
    expect(wrapper.text()).toContain('Die Struck');
    expect(wrapper.text()).toContain('1.00"');
    expect(wrapper.text()).toContain('500 pieces');
  });

  it('displays product specifications correctly', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    expect(wrapper.text()).toContain('Product Specifications');
    expect(wrapper.text()).toContain('Die Struck');
    expect(wrapper.text()).toContain('1.00"');
    expect(wrapper.text()).toContain('500 pieces');
    expect(wrapper.text()).toContain('$1.26');
  });

  it('displays modifications correctly', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    expect(wrapper.text()).toContain('Modifications');
    expect(wrapper.text()).toContain('Butterfly Clutch');
    // Packaging option in test data is Acrylic Case; ensure it's present
    expect(wrapper.text()).toContain('Acrylic Case');
    expect(wrapper.text()).toContain('Rush Order');
    expect(wrapper.text()).toContain('No');
  });

  it('shows FREE badge for free options', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    const badges = wrapper.findAll('.mock-badge');
    const freeBadges = badges.filter(badge => badge.text().includes('FREE'));
    expect(freeBadges.length).toBeGreaterThan(0);
  });

  it('displays price breakdown correctly', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    expect(wrapper.text()).toContain('Price Breakdown');
    expect(wrapper.text()).toContain('Base Price');
    expect(wrapper.text()).toContain('$630.00');
    expect(wrapper.text()).toContain('$375.00');
    expect(wrapper.text()).toContain('Total');
    expect(wrapper.text()).toContain('$1,005.00');
  });

  it('shows setup fee when applicable', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelectionsWithSetupFee,
        breakdown: mockBreakdownWithAllFees
      }
    });

    expect(wrapper.text()).toContain('Setup Fee');
    expect(wrapper.text()).toContain('$100.00');
  });

  it('shows rush fee when rush order is selected', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelectionsWithSetupFee,
        breakdown: mockBreakdownWithAllFees
      }
    });

    expect(wrapper.text()).toContain('Rush Fee');
    expect(wrapper.text()).toContain('$211.00');
    expect(wrapper.text()).toContain('Yes');
  });

  it('calculates and displays cost per unit', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    const expectedCostPerUnit = mockBreakdown.total / mockSelections.quantity;
    expect(wrapper.text()).toContain('Cost per unit');
    expect(wrapper.text()).toContain(`$${expectedCostPerUnit.toFixed(2)}`);
  });

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    const editButton = wrapper.findAll('.mock-button').find(button => 
      button.text().includes('Edit')
    );
    
    expect(editButton).toBeDefined();
    await editButton!.trigger('click');
    
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')).toHaveLength(1);
  });

  it('calls window.print when print button is clicked', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    const printButton = wrapper.findAll('.mock-button').find(button => 
      button.text().includes('Print Quote')
    );
    
    expect(printButton).toBeDefined();
    await printButton!.trigger('click');
    
    expect(printSpy).toHaveBeenCalledOnce();
    
    printSpy.mockRestore();
  });

  it('formats currency correctly', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    // Check that prices are formatted with dollar signs and proper decimals
    expect(wrapper.text()).toContain('$630.00');
    expect(wrapper.text()).toContain('$375.00');
    expect(wrapper.text()).toContain('$1,005.00');
    expect(wrapper.text()).toContain('$1.26');
  });

  it('displays current date in quote', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    const currentYear = new Date().getFullYear().toString();
    expect(wrapper.text()).toContain(currentYear);
    expect(wrapper.text()).toContain('Quote generated on');
  });

  it('includes print-friendly version', () => {
    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: mockSelections,
        breakdown: mockBreakdown
      }
    });

    expect(wrapper.find('.print-version').exists()).toBe(true);
    expect(wrapper.find('.print-header').exists()).toBe(true);
    expect(wrapper.find('.print-content').exists()).toBe(true);
  });

  it('handles zero costs correctly', () => {
    const zeroBreakdown: PriceBreakdown = {
      basePrice: 500.00,
      setupFee: 0,
      platingCost: 0,
      backingCost: 0,
      packagingCost: 0,
      rushFee: 0,
      moldFee: 0,
      moldFeeWaived: false,
      total: 500.00,
      unitPrice: 1.00
    };

    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: {
          ...mockSelections,
          backing: BACKING_OPTIONS[0], // Free option
          packaging: PACKAGING_OPTIONS[0], // Free option
          rushOrder: false
        },
        breakdown: zeroBreakdown
      }
    });

    // Should not show zero-cost line items in breakdown
    expect(wrapper.text()).toContain('Base Price');
    expect(wrapper.text()).not.toContain('Setup Fee');
    expect(wrapper.text()).not.toContain('Backing Cost');
    expect(wrapper.text()).not.toContain('Packaging Cost');
    expect(wrapper.text()).not.toContain('Rush Fee');
  });

  it('displays quantity with proper formatting', () => {
    const largeQuantitySelections: OrderSelections = {
      ...mockSelections,
      quantity: 2000
    };

    const wrapper = mount(QuoteDisplay, {
      props: {
        selections: largeQuantitySelections,
        breakdown: mockBreakdown
      }
    });

    expect(wrapper.text()).toContain('2,000 pieces');
  });
});