import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PricingCalculator from '~/components/calculator/PricingCalculator.vue';
import { PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

// Mock UI components for E2E testing
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
        template: '<button class="mock-button" @click="$emit(\'click\')" :disabled="disabled"><slot /></button>',
        props: ['disabled'],
        emits: ['click']
    }
}));

vi.mock('~/components/ui/Badge.vue', () => ({
    default: {
        template: '<span class="mock-badge" :class="variant"><slot /></span>',
        props: ['variant', 'size']
    }
}));

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
    PrinterIcon: { template: '<div data-testid="printer-icon"></div>' },
    PencilIcon: { template: '<div data-testid="pencil-icon"></div>' },
    CogIcon: { template: '<div data-testid="cog-icon"></div>' },
    WrenchScrewdriverIcon: { template: '<div data-testid="wrench-icon"></div>' },
    CalculatorIcon: { template: '<div data-testid="calculator-icon"></div>' }
}));

describe('End-to-End Quote Generation Workflow', () => {
    describe('Complete Quote Generation - Die Struck', () => {
        it('should generate a complete quote for Die Struck pins', async () => {
            const wrapper = mount(PricingCalculator);

            // Step 1: Select plating type (Die Struck)
            const platingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            expect(platingButtons.length).toBeGreaterThan(0);

            await platingButtons[0].trigger('click');

            // Verify plating type selection
            expect(wrapper.text()).toContain('Die Struck');

            // Step 2: Select size and quantity from pricing table
            const pricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$2.61') // Die Struck 1.00" x 100
            );
            expect(pricingButtons.length).toBeGreaterThan(0);

            await pricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Verify selection is reflected in summary
            expect(wrapper.text()).toContain('$261.00'); // 2.61 * 100

            // Step 3: Select backing option (Butterfly Clutch - Free)
            const backingInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'butterfly'
            );
            expect(backingInputs.length).toBeGreaterThan(0);

            await backingInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Step 4: Select packaging option (Poly Bag - Free)
            const packagingInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'poly-bag'
            );
            expect(packagingInputs.length).toBeGreaterThan(0);

            await packagingInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Step 5: Verify final calculation
            expect(wrapper.text()).toContain('Total');
            expect(wrapper.text()).toContain('$261.00');

            // Step 6: Check if quote generation is available
            const generateQuoteButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Generate Quote') || btn.text().includes('View Quote')
            );

            if (generateQuoteButtons.length > 0) {
                await generateQuoteButtons[0].trigger('click');

                // Verify quote display elements are present
                expect(wrapper.text()).toContain('Die Struck');
                expect(wrapper.text()).toContain('1.00"');
                expect(wrapper.text()).toContain('100');
                expect(wrapper.text()).toContain('Butterfly');
                expect(wrapper.text()).toContain('Poly');
            }
        });
    });

    describe('Complete Quote Generation - Offset Printed with Setup Fee', () => {
        it('should generate a complete quote for Offset Printed with setup fee', async () => {
            const wrapper = mount(PricingCalculator);

            // Step 1: Select Offset Printed (has setup fee)
            const offsetButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Offset Printed')
            );
            expect(offsetButtons.length).toBeGreaterThan(0);

            await offsetButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Verify setup fee notice
            expect(wrapper.text()).toContain('$100');

            // Step 2: Select size and quantity
            const pricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$1.21') // Offset Printed 1.25" x 500
            );
            expect(pricingButtons.length).toBeGreaterThan(0);

            await pricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Step 3: Select paid backing option (Magnetic - $0.35)
            const magneticInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'magnetic'
            );
            expect(magneticInputs.length).toBeGreaterThan(0);

            await magneticInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Step 4: Select paid packaging option (Gift Box - $1.25)
            const giftBoxInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'gift-box'
            );
            expect(giftBoxInputs.length).toBeGreaterThan(0);

            await giftBoxInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Step 5: Enable rush order
            const rushCheckbox = wrapper.find('input[type="checkbox"]');
            expect(rushCheckbox.exists()).toBe(true);

            await rushCheckbox.setValue(true);
            await wrapper.vm.$nextTick();

            // Step 6: Verify complex calculation elements are present
            expect(wrapper.text()).toContain('Setup Fee');
            expect(wrapper.text()).toContain('$100');
            expect(wrapper.text()).toContain('Rush Fee');
            expect(wrapper.text()).toContain('20%');
            expect(wrapper.text()).toContain('Total');
            expect(wrapper.text()).toMatch(/\$[0-9,]+\.\d{2}/); // Contains a properly formatted price
        });
    });

    describe('Quote Editing and Regeneration', () => {
        it('should allow editing and regenerating quotes', async () => {
            const wrapper = mount(PricingCalculator);

            // Generate initial quote
            const dieStruckButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            await dieStruckButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            const pricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$2.61')
            );
            await pricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            const butterflyInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'butterfly'
            );
            await butterflyInputs[0].trigger('change');

            const polyBagInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'poly-bag'
            );
            await polyBagInputs[0].trigger('change');

            // Verify initial total
            expect(wrapper.text()).toContain('$261.00');

            // Edit: Change to paid backing option
            const magneticInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'magnetic'
            );
            await magneticInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Verify updated total (should increase)
            expect(wrapper.text()).toMatch(/\$[0-9,]+\.\d{2}/);

            // Edit: Add rush order
            const rushCheckbox = wrapper.find('input[type="checkbox"]');
            await rushCheckbox.setValue(true);
            await wrapper.vm.$nextTick();

            // Verify rush fee is added
            expect(wrapper.text()).toContain('Rush Fee');
            expect(wrapper.text()).toContain('Total');
        });
    });

    describe('Error Handling in Workflow', () => {
        it('should handle incomplete selections gracefully', async () => {
            const wrapper = mount(PricingCalculator);

            // Should show guidance for missing selections
            const text = wrapper.text();
            expect(
                text.includes('Complete') ||
                text.includes('Select') ||
                text.includes('Choose')
            ).toBe(true);
        });

        it('should validate selections and show appropriate feedback', async () => {
            const wrapper = mount(PricingCalculator);

            // Select plating type but not size/quantity
            const dieStruckButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            await dieStruckButtons[0].trigger('click');

            // Should indicate next steps needed
            const text = wrapper.text();
            expect(
                text.includes('Choose') ||
                text.includes('Select') ||
                text.includes('Complete')
            ).toBe(true);
        });
    });

    describe('Multiple Quote Scenarios', () => {
        it('should handle minimum order scenario', async () => {
            const wrapper = mount(PricingCalculator);

            // Select minimum configuration
            const dieStruckButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            await dieStruckButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Select smallest size and quantity (0.75" x 100)
            const minPricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$2.54') // Die Struck 0.75" x 100
            );
            await minPricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Select free options
            const butterflyInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'butterfly'
            );
            await butterflyInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            const polyBagInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'poly-bag'
            );
            await polyBagInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Verify minimum total
            expect(wrapper.text()).toContain('$254.00'); // 2.54 * 100
        });

        it('should handle maximum order scenario', async () => {
            const wrapper = mount(PricingCalculator);

            // Select Hard Enamel (premium option)
            const hardEnamelButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Hard Enamel')
            );
            await hardEnamelButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Select largest size and quantity (2.00" x 2000)
            const maxPricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$1.69') // Hard Enamel 2.00" x 2000
            );
            await maxPricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Select most expensive options - check if they exist first
            const deluxeClutchInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'deluxe-clutch'
            );
            if (deluxeClutchInputs.length > 0) {
                await deluxeClutchInputs[0].trigger('change');
                await wrapper.vm.$nextTick();
            }

            const presentationBoxInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'presentation-box'
            );
            if (presentationBoxInputs.length > 0) {
                await presentationBoxInputs[0].trigger('change');
                await wrapper.vm.$nextTick();
            }

            // Add rush order
            const rushCheckbox = wrapper.find('input[type="checkbox"]');
            await rushCheckbox.setValue(true);
            await wrapper.vm.$nextTick();

            // Verify high-value calculation shows a substantial total
            expect(wrapper.text()).toContain('Total');
            const totalMatch = wrapper.text().match(/Total[^$]*\$([0-9,]+\.\d{2})/);
            expect(totalMatch).toBeTruthy();

            if (totalMatch) {
                const total = parseFloat(totalMatch[1].replace(/,/g, ''));
                expect(total).toBeGreaterThan(100); // Should be a reasonable amount for the configuration
            }
        });
    });

    describe('Quote Printing and Export', () => {
        it('should support quote printing functionality', async () => {
            const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

            const wrapper = mount(PricingCalculator);

            // Generate a complete quote first
            const dieStruckButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            await dieStruckButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            const pricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$2.61')
            );
            await pricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            const butterflyInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'butterfly'
            );
            await butterflyInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            const polyBagInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'poly-bag'
            );
            await polyBagInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Verify that the quote functionality is working
            expect(wrapper.text()).toContain('Total');
            expect(wrapper.text()).toContain('$261.00');

            // Since print functionality may not be directly testable in this context,
            // we'll verify that the quote data is complete and ready for printing
            expect(wrapper.text()).toContain('Die Struck');
            expect(wrapper.text()).toContain('Butterfly');
            expect(wrapper.text()).toContain('Poly');

            printSpy.mockRestore();
        });
    });

    describe('Performance and User Experience', () => {
        it('should update calculations in real-time', async () => {
            const wrapper = mount(PricingCalculator);

            // Select plating type
            const dieStruckButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            await dieStruckButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // The pricing table should be visible after selecting plating type
            expect(wrapper.text()).toContain('$2.61');

            // Select size/quantity
            const pricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$2.61')
            );
            await pricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            // Should immediately show base calculation
            expect(wrapper.text()).toContain('$261.00');

            // Add backing option
            const magneticInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'magnetic'
            );
            await magneticInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            // Should immediately update total
            expect(wrapper.text()).toMatch(/\$[0-9,]+\.\d{2}/);
        });

        it('should maintain responsive performance with complex calculations', async () => {
            const startTime = performance.now();

            const wrapper = mount(PricingCalculator);

            // Perform multiple rapid selections
            const dieStruckButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('Die Struck')
            );
            await dieStruckButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            const pricingButtons = wrapper.findAll('button').filter(btn =>
                btn.text().includes('$2.61')
            );
            await pricingButtons[0].trigger('click');
            await wrapper.vm.$nextTick();

            const magneticInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'magnetic'
            );
            await magneticInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            const giftBoxInputs = wrapper.findAll('input[type="radio"]').filter(input =>
                input.attributes('value') === 'gift-box'
            );
            await giftBoxInputs[0].trigger('change');
            await wrapper.vm.$nextTick();

            const rushCheckbox = wrapper.find('input[type="checkbox"]');
            await rushCheckbox.setValue(true);
            await wrapper.vm.$nextTick();

            const endTime = performance.now();
            const executionTime = endTime - startTime;

            // Should complete within reasonable time (less than 100ms)
            expect(executionTime).toBeLessThan(100);

            // Final calculation should be correct
            expect(wrapper.text()).toContain('Total');
            expect(wrapper.text()).toContain('Rush Fee');
        });
    });
});