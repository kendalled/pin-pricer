import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
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

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    // Clean up any existing wrapper
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Mold Fee Line Item Display', () => {
    it('should display mold fee line item correctly for applicable orders', () => {
      const mockBreakdownWithMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 50.00,
        moldFeeWaived: false,
        total: 245.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithMoldFee,
          isComplete: true
        }
      });

      const text = wrapper.text();
      
      // Test mold fee line item appears correctly
      expect(text).toContain('Mold Fee');
      expect(text).toContain('$50.00');
      expect(text).toContain('$245.00'); // Total should include mold fee
      
      // Verify mold fee section exists in DOM
      const moldFeeSection = wrapper.find('[class*="text-slate-200"]:has-text("Mold Fee")');
      expect(wrapper.html()).toContain('Mold Fee');
    });

    it('should display different mold fee amounts correctly', () => {
      const testCases = [
        { fee: 50.00, expectedText: '$50.00' },
        { fee: 62.50, expectedText: '$62.50' },
        { fee: 75.00, expectedText: '$75.00' }
      ];

      testCases.forEach(({ fee, expectedText }) => {
        const mockBreakdown: PriceBreakdown = {
          ...baseMockBreakdown,
          moldFee: fee,
          moldFeeWaived: false,
          total: baseMockBreakdown.total + fee
        };

        wrapper = mount(CalculationSummary, {
          props: {
            breakdown: mockBreakdown,
            isComplete: true
          }
        });

        expect(wrapper.text()).toContain(expectedText);
        wrapper.unmount();
      });
    });

    it('should not display mold fee section when neither applied nor waived', () => {
      const mockBreakdownNoMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: false,
        total: 195.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownNoMoldFee,
          isComplete: true
        }
      });

      const text = wrapper.text();
      expect(text).not.toContain('Mold Fee');
    });
  });

  describe('Waived Mold Fee Display', () => {
    it('should display waived message properly when quantity exceeds 500 pieces', () => {
      const mockBreakdownWithWaivedMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: true,
        total: 195.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithWaivedMoldFee,
          isComplete: true
        }
      });

      const text = wrapper.text();
      
      // Test waived message displays properly
      expect(text).toContain('Mold Fee');
      expect(text).toContain('Waived');
      expect(text).toContain('500+ qty');
      expect(text).toContain('Waived - 500+ qty');
    });

    it('should apply correct green styling for waived mold fee', () => {
      const mockBreakdownWithWaivedMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: true,
        total: 195.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithWaivedMoldFee,
          isComplete: true
        }
      });

      // Check for green styling classes on waived mold fee
      const moldFeeElements = wrapper.findAll('.text-green-400');
      expect(moldFeeElements.length).toBeGreaterThan(0);
      
      // Verify the waived text has green styling
      const waivedText = wrapper.find('.text-green-400');
      expect(waivedText.exists()).toBe(true);
      expect(waivedText.text()).toContain('Waived');
    });

    it('should show "Waived" instead of fee amount when mold fee is waived', () => {
      const mockBreakdownWithWaivedMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: true,
        total: 195.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithWaivedMoldFee,
          isComplete: true
        }
      });

      const text = wrapper.text();
      
      // Should show "Waived" text instead of dollar amount
      expect(text).toContain('Waived');
      expect(text).not.toContain('$0.00');
    });
  });

  describe('Mold Fee Formatting and Currency Display', () => {
    it('should format mold fee currency to match existing pricing format', () => {
      const mockBreakdownWithMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 62.50,
        moldFeeWaived: false,
        total: 257.50
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithMoldFee,
          isComplete: true
        }
      });

      const text = wrapper.text();
      
      // Test currency formatting matches existing format (two decimal places)
      expect(text).toContain('$62.50');
      expect(text).toContain('$257.50'); // Total formatting
      
      // Verify it doesn't show incorrect formats (without dollar sign or with wrong decimal places)
      expect(text).not.toContain('62.5 '); // Space after to avoid matching $62.50
      expect(text).not.toContain('62.50 '); // Without dollar sign
    });

    it('should handle edge case currency formatting', () => {
      const testCases = [
        { fee: 50.00, expected: '$50.00' },
        { fee: 75.99, expected: '$75.99' },
        { fee: 100.10, expected: '$100.10' }
      ];

      testCases.forEach(({ fee, expected }) => {
        const mockBreakdown: PriceBreakdown = {
          ...baseMockBreakdown,
          moldFee: fee,
          moldFeeWaived: false,
          total: baseMockBreakdown.total + fee
        };

        wrapper = mount(CalculationSummary, {
          props: {
            breakdown: mockBreakdown,
            isComplete: true
          }
        });

        expect(wrapper.text()).toContain(expected);
        wrapper.unmount();
      });
    });
  });

  describe('Mold Fee Position and Layout', () => {
    it('should display mold fee in correct position within pricing breakdown', () => {
      const mockBreakdownWithMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 75.00,
        moldFeeWaived: false,
        total: 270.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithMoldFee,
          isComplete: true
        }
      });

      const text = wrapper.text();
      
      // Mold fee should appear after other costs but before total
      const moldFeeIndex = text.indexOf('Mold Fee');
      const totalIndex = text.indexOf('Total');
      const rushFeeIndex = text.indexOf('Rush Fee');
      
      expect(moldFeeIndex).toBeGreaterThan(-1);
      expect(totalIndex).toBeGreaterThan(-1);
      expect(moldFeeIndex).toBeLessThan(totalIndex);
      
      // If rush fee exists, mold fee should come after it
      if (rushFeeIndex > -1) {
        expect(moldFeeIndex).toBeGreaterThan(rushFeeIndex);
      }
    });

    it('should maintain consistent layout styling with other line items', () => {
      const mockBreakdownWithMoldFee: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 50.00,
        moldFeeWaived: false,
        total: 245.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: mockBreakdownWithMoldFee,
          isComplete: true
        }
      });

      // Check that mold fee section has consistent styling classes
      const html = wrapper.html();
      
      // Should have the same layout classes as other line items
      expect(html).toContain('text-slate-200');
      expect(html).toContain('flex');
      expect(html).toContain('justify-between');
    });
  });

  describe('Real-time UI Updates', () => {
    it('should update mold fee display when breakdown changes from no fee to fee applied', async () => {
      // Start with no mold fee
      const initialBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: false,
        total: 195.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: initialBreakdown,
          isComplete: true
        }
      });

      // Initially should not show mold fee
      expect(wrapper.text()).not.toContain('Mold Fee');

      // Update to include mold fee
      const updatedBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 50.00,
        moldFeeWaived: false,
        total: 245.00
      };

      await wrapper.setProps({ breakdown: updatedBreakdown });
      await nextTick();

      // Should now show mold fee
      expect(wrapper.text()).toContain('Mold Fee');
      expect(wrapper.text()).toContain('$50.00');
    });

    it('should update mold fee display when status changes from applied to waived', async () => {
      // Start with mold fee applied
      const initialBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 50.00,
        moldFeeWaived: false,
        total: 245.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: initialBreakdown,
          isComplete: true
        }
      });

      // Initially should show mold fee amount
      expect(wrapper.text()).toContain('$50.00');
      expect(wrapper.text()).not.toContain('Waived');

      // Update to waived status
      const updatedBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: true,
        total: 195.00
      };

      await wrapper.setProps({ breakdown: updatedBreakdown });
      await nextTick();

      // Should now show waived message
      expect(wrapper.text()).toContain('Waived');
      expect(wrapper.text()).toContain('500+ qty');
      
      // The mold fee section should show "Waived" instead of the fee amount
      const moldFeeSection = wrapper.html().match(/Mold Fee.*?(?=<\/div>|Total)/s);
      if (moldFeeSection) {
        expect(moldFeeSection[0]).toContain('Waived');
        expect(moldFeeSection[0]).not.toContain('$50.00');
      }
    });

    it('should update mold fee display when status changes from waived to applied', async () => {
      // Start with mold fee waived
      const initialBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 0,
        moldFeeWaived: true,
        total: 195.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: initialBreakdown,
          isComplete: true
        }
      });

      // Initially should show waived message
      expect(wrapper.text()).toContain('Waived');
      expect(wrapper.text()).toContain('500+ qty');

      // Update to applied status
      const updatedBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 75.00,
        moldFeeWaived: false,
        total: 270.00
      };

      await wrapper.setProps({ breakdown: updatedBreakdown });
      await nextTick();

      // Should now show mold fee amount
      expect(wrapper.text()).toContain('$75.00');
      expect(wrapper.text()).not.toContain('Waived');
      expect(wrapper.text()).not.toContain('500+ qty');
    });

    it('should update total price when mold fee changes', async () => {
      // Start with one mold fee amount
      const initialBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 50.00,
        moldFeeWaived: false,
        total: 245.00
      };

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: initialBreakdown,
          isComplete: true
        }
      });

      expect(wrapper.text()).toContain('$245.00');

      // Update to different mold fee amount
      const updatedBreakdown: PriceBreakdown = {
        ...baseMockBreakdown,
        moldFee: 75.00,
        moldFeeWaived: false,
        total: 270.00
      };

      await wrapper.setProps({ breakdown: updatedBreakdown });
      await nextTick();

      // Total should update to reflect new mold fee
      expect(wrapper.text()).toContain('$270.00');
      expect(wrapper.text()).toContain('$75.00');
    });

    it('should handle rapid state changes without display issues', async () => {
      const states = [
        { moldFee: 0, moldFeeWaived: false, total: 195.00 },
        { moldFee: 50.00, moldFeeWaived: false, total: 245.00 },
        { moldFee: 0, moldFeeWaived: true, total: 195.00 },
        { moldFee: 75.00, moldFeeWaived: false, total: 270.00 }
      ];

      wrapper = mount(CalculationSummary, {
        props: {
          breakdown: { ...baseMockBreakdown, ...states[0] },
          isComplete: true
        }
      });

      // Rapidly change states
      for (let i = 1; i < states.length; i++) {
        const breakdown = { ...baseMockBreakdown, ...states[i] };
        await wrapper.setProps({ breakdown });
        await nextTick();
        
        // Verify the display is consistent with the current state
        if (breakdown.moldFeeWaived) {
          expect(wrapper.text()).toContain('Waived');
        } else if (breakdown.moldFee > 0) {
          expect(wrapper.text()).toContain(`$${breakdown.moldFee.toFixed(2)}`);
        }
      }
    });
  });

});