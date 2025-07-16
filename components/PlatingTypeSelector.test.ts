import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PlatingTypeSelector from './PlatingTypeSelector.vue';
import { PLATING_TYPES } from '~/data/pricing';

describe('PlatingTypeSelector', () => {
  it('renders all plating types', () => {
    const wrapper = mount(PlatingTypeSelector);
    
    // Should render all 5 plating types
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(5);
    
    // Check that all plating type names are rendered
    PLATING_TYPES.forEach(type => {
      expect(wrapper.text()).toContain(type.name);
    });
  });

  it('shows setup fee indicator for Offset Printed', () => {
    const wrapper = mount(PlatingTypeSelector);
    
    // Find the Offset Printed button
    const offsetButton = wrapper.findAll('button').find(button => 
      button.text().includes('Offset Printed')
    );
    
    expect(offsetButton).toBeDefined();
    expect(offsetButton?.text()).toContain('+$100');
  });

  it('emits update:selectedType when a plating type is clicked', async () => {
    const wrapper = mount(PlatingTypeSelector);
    
    const firstButton = wrapper.findAll('button')[0];
    await firstButton.trigger('click');
    
    expect(wrapper.emitted('update:selectedType')).toBeTruthy();
    expect(wrapper.emitted('update:selectedType')?.[0]).toEqual([PLATING_TYPES[0]]);
  });

  it('applies selected styling to the selected type', () => {
    const selectedType = PLATING_TYPES[0];
    const wrapper = mount(PlatingTypeSelector, {
      props: {
        selectedType
      }
    });
    
    const buttons = wrapper.findAll('button');
    const selectedButton = buttons[0];
    
    expect(selectedButton.classes()).toContain('bg-blue-600');
    expect(selectedButton.classes()).toContain('text-white');
  });

  it('shows setup fee notice when Offset Printed is selected', () => {
    const offsetPrintedType = PLATING_TYPES.find(type => type.id === 'offset-printed');
    const wrapper = mount(PlatingTypeSelector, {
      props: {
        selectedType: offsetPrintedType
      }
    });
    
    expect(wrapper.text()).toContain('includes a one-time setup fee');
    expect(wrapper.text()).toContain('$100');
  });

  it('does not show setup fee notice for other plating types', () => {
    const dieStruckType = PLATING_TYPES.find(type => type.id === 'die-struck');
    const wrapper = mount(PlatingTypeSelector, {
      props: {
        selectedType: dieStruckType
      }
    });
    
    expect(wrapper.text()).not.toContain('includes a one-time setup fee');
  });
});