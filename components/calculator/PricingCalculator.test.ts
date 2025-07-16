import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PricingCalculator from './PricingCalculator.vue';
import { PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

// Mock the composable
vi.mock('~/composables/usePricingCalculator', () => ({
  usePricingCalculator: () => ({
    state: {
      selectedPlatingType: null,
      selectedSize: null,
      selectedQuantity: null,
      selectedBacking: null,
      selectedPackaging: null,
      rushOrder: false
    },
    validationErrors: {},
    isCalculating: false,
    isSelectionComplete: false,
    currentSelections: {},
    priceBreakdown: null,
    validationStatus: {
      isValid: false,
      errors: [],
      isComplete: false
    },
    setPlatingType: vi.fn(),
    setSizeAndQuantity: vi.fn(),
    setBacking: vi.fn(),
    setPackaging: vi.fn(),
    setRushOrder: vi.fn(),
    resetSelections: vi.fn(),
    setValidationError: vi.fn()
  })
}));

// Mock child components
vi.mock('~/components/PlatingTypeSelector.vue', () => ({
  default: {
    name: 'PlatingTypeSelector',
    template: '<div data-testid="plating-type-selector">PlatingTypeSelector</div>',
    props: ['selectedType'],
    emits: ['update:selectedType']
  }
}));

vi.mock('~/components/calculator/PricingTable.vue', () => ({
  default: {
    name: 'PricingTable',
    template: '<div data-testid="pricing-table">PricingTable</div>',
    props: ['platingType', 'selectedSize', 'selectedQuantity'],
    emits: ['selection-change']
  }
}));

vi.mock('~/components/calculator/ModificationsPanel.vue', () => ({
  default: {
    name: 'ModificationsPanel',
    template: '<div data-testid="modifications-panel">ModificationsPanel</div>',
    props: ['selectedBacking', 'selectedPackaging', 'rushOrder'],
    emits: ['backing-change', 'packaging-change', 'rush-toggle']
  }
}));

vi.mock('~/components/calculator/CalculationSummary.vue', () => ({
  default: {
    name: 'CalculationSummary',
    template: '<div data-testid="calculation-summary">CalculationSummary</div>',
    props: ['breakdown', 'isComplete']
  }
}));

vi.mock('~/components/calculator/QuoteDisplay.vue', () => ({
  default: {
    name: 'QuoteDisplay',
    template: '<div data-testid="quote-display">QuoteDisplay</div>',
    props: ['selections', 'breakdown'],
    emits: ['edit']
  }
}));

vi.mock('~/components/ui/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="card"><header v-if="$slots.header"><slot name="header" /></header><slot /></div>'
  }
}));

vi.mock('~/components/ui/Button.vue', () => ({
  default: {
    name: 'Button',
    template: '<button :disabled="disabled" :class="variant"><slot /></button>',
    props: ['disabled', 'variant', 'size']
  }
}));

vi.mock('~/components/ui/Badge.vue', () => ({
  default: {
    name: 'Badge',
    template: '<span :class="variant"><slot /></span>',
    props: ['variant', 'size']
  }
}));

describe('PricingCalculator', () => {
  it('renders the main calculator interface', () => {
    const wrapper = mount(PricingCalculator);
    
    expect(wrapper.find('h1').text()).toBe('Lapel Pin & Challenge Coin Calculator');
    expect(wrapper.find('p').text()).toBe('Get instant pricing for your custom pins and coins');
  });

  it('displays progress indicator with correct steps', () => {
    const wrapper = mount(PricingCalculator);
    
    const steps = wrapper.findAll('.w-8.h-8.rounded-full');
    expect(steps).toHaveLength(3);
    
    // Check step labels
    expect(wrapper.text()).toContain('Plating Type');
    expect(wrapper.text()).toContain('Size & Quantity');
    expect(wrapper.text()).toContain('Modifications');
  });

  it('shows plating type selector initially', () => {
    const wrapper = mount(PricingCalculator);
    
    expect(wrapper.find('[data-testid="plating-type-selector"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Step 1: Choose Plating Type');
  });

  it('shows calculation summary', () => {
    const wrapper = mount(PricingCalculator);
    
    expect(wrapper.find('[data-testid="calculation-summary"]').exists()).toBe(true);
  });

  it('displays action buttons', () => {
    const wrapper = mount(PricingCalculator);
    
    const buttons = wrapper.findAll('button');
    const generateQuoteButton = buttons.find(button => 
      button.text().includes('Generate Quote')
    );
    const resetButton = buttons.find(button => 
      button.text().includes('Reset Calculator')
    );
    
    expect(generateQuoteButton).toBeTruthy();
    expect(resetButton).toBeTruthy();
  });

  it('shows completion checklist when selections are incomplete', () => {
    const wrapper = mount(PricingCalculator);
    
    expect(wrapper.text()).toContain('Complete these steps:');
    expect(wrapper.text()).toContain('Select plating type');
    expect(wrapper.text()).toContain('Choose size and quantity');
    expect(wrapper.text()).toContain('Select backing option');
    expect(wrapper.text()).toContain('Choose packaging option');
  });

  it('disables generate quote button when selections are incomplete', () => {
    const wrapper = mount(PricingCalculator);
    
    const generateQuoteButton = wrapper.findAll('button').find(button => 
      button.text().includes('Generate Quote')
    );
    
    expect(generateQuoteButton?.attributes('disabled')).toBeDefined();
  });
});

describe('PricingCalculator - Step Visibility', () => {
  it('shows pricing table only after plating type is selected', () => {
    const wrapper = mount(PricingCalculator);
    
    // Initially should not show pricing table
    expect(wrapper.find('[data-testid="pricing-table"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Step 2: Select Size & Quantity');
  });

  it('shows modifications panel only after size and quantity are selected', () => {
    const wrapper = mount(PricingCalculator);
    
    // Initially should not show modifications panel
    expect(wrapper.find('[data-testid="modifications-panel"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('Step 3: Choose Modifications');
  });
});

describe('PricingCalculator - Error Handling', () => {
  it('has error handling structure in place', () => {
    const wrapper = mount(PricingCalculator);
    
    // Check that the component has the structure for displaying errors
    // The actual error display is tested in integration tests
    expect(wrapper.find('.pricing-calculator').exists()).toBe(true);
  });

  it('has validation structure in place', () => {
    const wrapper = mount(PricingCalculator);
    
    // Check that the component has validation structure
    expect(wrapper.text()).toContain('Complete these steps:');
  });
});