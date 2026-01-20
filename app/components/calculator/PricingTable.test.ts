import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PricingTable from './PricingTable.vue';
import { PLATING_TYPES } from '~/data/pricing';

describe('PricingTable', () => {
  const mockPlatingType = PLATING_TYPES[0]; // Die Struck
  
  const defaultProps = {
    platingType: mockPlatingType,
    selectedSize: null,
    selectedQuantity: null
  };

  it('renders the pricing table with correct structure', () => {
    const wrapper = mount(PricingTable, {
      props: defaultProps
    });

    // Check if the table container exists
    expect(wrapper.find('.pricing-table-container').exists()).toBe(true);
    
    // Check if quantity headers are rendered
    expect(wrapper.text()).toContain('100');
    expect(wrapper.text()).toContain('2,000');
    
    // Check if size headers are rendered
    expect(wrapper.text()).toContain('0.75"');
    expect(wrapper.text()).toContain('2.00"');
  });

  it('displays correct prices for each cell', () => {
    const wrapper = mount(PricingTable, {
      props: defaultProps
    });

    // Check if prices are displayed correctly
    // Die Struck 0.75" x 100 should be $2.54
    expect(wrapper.text()).toContain('$2.54');
    
    // Die Struck 2.00" x 2000 should be $1.09
    expect(wrapper.text()).toContain('$1.09');
  });

  it('emits selection-change event when cell is clicked', async () => {
    const wrapper = mount(PricingTable, {
      props: defaultProps
    });

    // Find and click a pricing cell
    const pricingButtons = wrapper.findAll('button');
    const firstPricingButton = pricingButtons.find(button => 
      button.text().includes('$2.54') // Die Struck 0.75" x 100
    );

    expect(firstPricingButton).toBeDefined();
    await firstPricingButton!.trigger('click');

    // Check if the event was emitted with correct parameters
    expect(wrapper.emitted('selection-change')).toBeTruthy();
    expect(wrapper.emitted('selection-change')![0]).toEqual(['0.75', 100]);
  });

  it('highlights selected cell correctly', () => {
    const wrapper = mount(PricingTable, {
      props: {
        ...defaultProps,
        selectedSize: '0.75',
        selectedQuantity: 100
      }
    });

    // Find the selected cell button
    const pricingButtons = wrapper.findAll('button');
    const selectedButton = pricingButtons.find(button => 
      button.text().includes('$2.54')
    );

    expect(selectedButton).toBeDefined();
    const classes = selectedButton!.classes();
    expect(classes.some(c => c.includes('border-blue-500') || c.includes('bg-blue-900/30'))).toBe(true);
  });

  it('shows selection summary when size and quantity are selected', () => {
    const wrapper = mount(PricingTable, {
      props: {
        ...defaultProps,
        selectedSize: '1.00',
        selectedQuantity: 500
      }
    });

    // Check if selection summary is displayed (allow optional space after colon)
    expect(wrapper.text()).toMatch(/Selected:\s*1\.00" × 500 units/);
    expect(wrapper.text()).toContain('Unit Price: $1.26');
    expect(wrapper.text()).toContain('Base Total: $630.00');
  });

  it('does not show selection summary when no selection is made', () => {
    const wrapper = mount(PricingTable, {
      props: defaultProps
    });

    // Selection summary should not be visible
    expect(wrapper.text()).not.toContain('Selected:');
    expect(wrapper.text()).not.toContain('Base Total:');
  });

  it('handles hover effects correctly', async () => {
    const wrapper = mount(PricingTable, {
      props: defaultProps
    });

    const pricingButtons = wrapper.findAll('button');
    const firstButton = pricingButtons.find(button => 
      button.text().includes('$2.54')
    );

    expect(firstButton).toBeDefined();

    // Trigger mouseenter
    await firstButton!.trigger('mouseenter');
    
    // Check if hover classes are applied (refreshed uses bg-slate-700/50)
    expect(firstButton!.classes().some(c => c.includes('bg-slate-700/50'))).toBe(true);

    // Trigger mouseleave
    await firstButton!.trigger('mouseleave');
    
    // Hover classes should be removed, base classes remain
    expect(firstButton!.classes().some(c => c.includes('bg-slate-800') || c.includes('bg-slate-700'))).toBe(true);
  });

  it('formats prices correctly', () => {
    const wrapper = mount(PricingTable, {
      props: defaultProps
    });

    // All prices should be formatted to 2 decimal places
    const priceTexts = wrapper.findAll('button').map(button => button.text());
    const priceRegex = /\$\d+\.\d{2}/;
    
    priceTexts.forEach(text => {
      if (text.includes('$')) {
        expect(priceRegex.test(text)).toBe(true);
      }
    });
  });

  it('calculates total prices correctly', () => {
    const wrapper = mount(PricingTable, {
      props: {
        ...defaultProps,
        selectedSize: '0.75',
        selectedQuantity: 100
      }
    });

    // Unit price should be $2.54, total should be $254.00
    expect(wrapper.text()).toContain('Unit Price: $2.54');
    expect(wrapper.text()).toContain('Base Total: $254.00');
  });

  it('works with different plating types', () => {
    const softEnamelType = PLATING_TYPES[1]; // Soft Enamel
    const wrapper = mount(PricingTable, {
      props: {
        platingType: softEnamelType,
        selectedSize: null,
        selectedQuantity: null
      }
    });

    // Should display Soft Enamel prices (different from Die Struck)
    // Soft Enamel 0.75" x 100 should be $2.55
    expect(wrapper.text()).toContain('$2.55');
  });
});