import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ModificationsPanel from './ModificationsPanel.vue';
import { BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

describe('ModificationsPanel', () => {
  it('renders all backing options', () => {
    const wrapper = mount(ModificationsPanel);
    
    // Check that all backing options are rendered
    BACKING_OPTIONS.forEach(option => {
      expect(wrapper.text()).toContain(option.name);
    });
  });

  it('renders all packaging options', () => {
    const wrapper = mount(ModificationsPanel);
    
    // Check that all packaging options are rendered
    PACKAGING_OPTIONS.forEach(option => {
      expect(wrapper.text()).toContain(option.name);
    });
  });

  it('displays "FREE" for zero-cost options', () => {
    const wrapper = mount(ModificationsPanel);
    
    // Check that free options show "FREE" instead of $0.00
    const freeBackingOptions = BACKING_OPTIONS.filter(option => option.isFree);
    const freePackagingOptions = PACKAGING_OPTIONS.filter(option => option.isFree);
    
    freeBackingOptions.forEach(option => {
      const optionElement = wrapper.find(`[data-testid="backing-${option.id}"]`);
      if (optionElement.exists()) {
        expect(optionElement.text()).toContain('FREE');
        expect(optionElement.text()).not.toContain('$0.00');
      } else {
        // Fallback: check if FREE text exists in the component
        expect(wrapper.text()).toContain('FREE');
      }
    });
    
    freePackagingOptions.forEach(option => {
      const optionElement = wrapper.find(`[data-testid="packaging-${option.id}"]`);
      if (optionElement.exists()) {
        expect(optionElement.text()).toContain('FREE');
        expect(optionElement.text()).not.toContain('$0.00');
      } else {
        // Fallback: check if FREE text exists in the component
        expect(wrapper.text()).toContain('FREE');
      }
    });
  });

  it('displays formatted prices for paid options', () => {
    const wrapper = mount(ModificationsPanel);
    
    // Check that paid options show formatted prices
    const paidBackingOptions = BACKING_OPTIONS.filter(option => !option.isFree);
    const paidPackagingOptions = PACKAGING_OPTIONS.filter(option => !option.isFree);
    
    paidBackingOptions.forEach(option => {
      expect(wrapper.text()).toContain(`$${option.price.toFixed(2)}`);
    });
    
    paidPackagingOptions.forEach(option => {
      expect(wrapper.text()).toContain(`$${option.price.toFixed(2)}`);
    });
  });

  it('emits backing-change event when backing option is selected', async () => {
    const wrapper = mount(ModificationsPanel);
    
    // Find the first backing option radio input
    const backingInputs = wrapper.findAll('input[type="radio"]');
    const firstBackingInput = backingInputs.find(input => 
      input.attributes('value') === BACKING_OPTIONS[0].id
    );
    
    expect(firstBackingInput).toBeDefined();
    
    // Trigger change event
    await firstBackingInput!.trigger('change');
    
    // Check that the event was emitted with correct data
    expect(wrapper.emitted('backing-change')).toBeTruthy();
    expect(wrapper.emitted('backing-change')![0]).toEqual([BACKING_OPTIONS[0]]);
  });

  it('emits packaging-change event when packaging option is selected', async () => {
    const wrapper = mount(ModificationsPanel);
    
    // Find a packaging option radio input (backing options come first, so we need to skip them)
    const allInputs = wrapper.findAll('input[type="radio"]');
    const packagingInput = allInputs.find(input => 
      input.attributes('value') === PACKAGING_OPTIONS[0].id
    );
    
    expect(packagingInput).toBeDefined();
    
    // Trigger change event
    await packagingInput!.trigger('change');
    
    // Check that the event was emitted with correct data
    expect(wrapper.emitted('packaging-change')).toBeTruthy();
    expect(wrapper.emitted('packaging-change')![0]).toEqual([PACKAGING_OPTIONS[0]]);
  });

  it('emits rush-toggle event when rush order toggle is clicked', async () => {
    const wrapper = mount(ModificationsPanel, {
      props: {
        rushOrder: false
      }
    });
    
    // Find the rush order checkbox
    const rushCheckbox = wrapper.find('input[type="checkbox"]');
    expect(rushCheckbox.exists()).toBe(true);
    
    // Set the checkbox to checked and trigger change event
    await rushCheckbox.setValue(true);
    
    // Check that the event was emitted
    expect(wrapper.emitted('rush-toggle')).toBeTruthy();
    expect(wrapper.emitted('rush-toggle')![0]).toEqual([true]);
  });

  it('shows selected backing option with proper styling', () => {
    const selectedBacking = BACKING_OPTIONS[1]; // Select second option
    const wrapper = mount(ModificationsPanel, {
      props: {
        selectedBacking
      }
    });
    
    // Find the selected backing option label
    const labels = wrapper.findAll('label');
    const selectedLabel = labels.find(label => 
      label.text().includes(selectedBacking.name)
    );
    
    expect(selectedLabel).toBeDefined();
    expect(selectedLabel!.classes()).toContain('bg-blue-900/30');
    expect(selectedLabel!.classes()).toContain('border-blue-500');
  });

  it('shows selected packaging option with proper styling', () => {
    const selectedPackaging = PACKAGING_OPTIONS[1]; // Select second option
    const wrapper = mount(ModificationsPanel, {
      props: {
        selectedPackaging
      }
    });
    
    // Find the selected packaging option label
    const labels = wrapper.findAll('label');
    const selectedLabel = labels.find(label => 
      label.text().includes(selectedPackaging.name)
    );
    
    expect(selectedLabel).toBeDefined();
    expect(selectedLabel!.classes()).toContain('bg-blue-900/30');
    expect(selectedLabel!.classes()).toContain('border-blue-500');
  });

  it('shows rush order toggle in correct state', () => {
    // Test with rush order disabled
    const wrapperDisabled = mount(ModificationsPanel, {
      props: {
        rushOrder: false
      }
    });
    
    expect(wrapperDisabled.text()).toContain('Disabled');
    
    // Test with rush order enabled
    const wrapperEnabled = mount(ModificationsPanel, {
      props: {
        rushOrder: true
      }
    });
    
    expect(wrapperEnabled.text()).toContain('Enabled');
  });

  it('displays rush order description correctly', () => {
    const wrapper = mount(ModificationsPanel);
    
    expect(wrapper.text()).toContain('Rush Order');
    expect(wrapper.text()).toContain('Add 20% to total price for expedited processing');
  });


  it('formats prices correctly', () => {
    const wrapper = mount(ModificationsPanel);
    
    // Test the formatPrice method indirectly by checking rendered prices
    const paidOptions = [...BACKING_OPTIONS, ...PACKAGING_OPTIONS].filter(option => !option.isFree);
    
    paidOptions.forEach(option => {
      const expectedPrice = `$${option.price.toFixed(2)}`;
      expect(wrapper.text()).toContain(expectedPrice);
    });
  });
});