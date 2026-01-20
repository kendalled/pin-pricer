import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PlatingTypeSelector from './PlatingTypeSelector.vue';
import { PLATING_OPTIONS } from '~/data/pricing';

describe('PlatingTypeSelector', () => {
  it('renders all plating options', () => {
    const wrapper = mount(PlatingTypeSelector);
    
    const options = wrapper.findAll('label');
    expect(options.length).toBe(PLATING_OPTIONS.length);
    
    // Check that all plating option names are rendered
    PLATING_OPTIONS.forEach(option => {
      expect(wrapper.text()).toContain(option.name);
    });
  });

  it('shows FREE or price badge for each option', () => {
    const wrapper = mount(PlatingTypeSelector);
    
    PLATING_OPTIONS.forEach(option => {
      if (option.isFree) {
        expect(wrapper.text()).toContain('FREE');
      } else {
        expect(wrapper.text()).toContain(`+$${option.price.toFixed(2)}`);
      }
    });
  });

  it('emits update:selectedPlating when an option is selected', async () => {
    const wrapper = mount(PlatingTypeSelector);

    const firstInput = wrapper.findAll('input[type="radio"]')[0];
    await firstInput.setValue();

    expect(wrapper.emitted('update:selectedPlating')).toBeTruthy();
  });

  it('applies selected styling to the selected option', () => {
    const selectedPlating = PLATING_OPTIONS[0];
    const wrapper = mount(PlatingTypeSelector, {
      props: {
        selectedPlating
      }
    });
    
    const options = wrapper.findAll('label');
    const selected = options[0];
    
    expect(selected.classes()).toContain('border-blue-500');
  });

  it('does not show setup fee notices (not applicable for plating options)', () => {
    const wrapper = mount(PlatingTypeSelector);
    expect(wrapper.text()).not.toContain('setup fee');
  });
});