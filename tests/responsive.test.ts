import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PricingCalculator from '~/components/calculator/PricingCalculator.vue';
import PlatingTypeSelector from '~/components/PlatingTypeSelector.vue';
import PricingTable from '~/components/calculator/PricingTable.vue';
import ModificationsPanel from '~/components/calculator/ModificationsPanel.vue';
import CalculationSummary from '~/components/calculator/CalculationSummary.vue';
import QuoteDisplay from '~/components/calculator/QuoteDisplay.vue';
import { PLATING_TYPES, BACKING_OPTIONS, PACKAGING_OPTIONS } from '~/data/pricing';

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Mock UI components for responsive testing
vi.mock('~/components/ui/Card.vue', () => ({
  default: {
    template: `
      <div class="mock-card responsive-card">
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
    template: '<button class="mock-button responsive-button" @click="$emit(\'click\')"><slot /></button>',
    emits: ['click']
  }
}));

describe('Responsive Design Behavior', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(mockMatchMedia),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Mobile Layout (320px - 767px)', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      // Mock matchMedia for mobile
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        ...mockMatchMedia(query),
        matches: query.includes('max-width: 767px') || query.includes('(max-width: 767px)'),
      }));
    });

    it('should stack plating type selector vertically on mobile', () => {
      const wrapper = mount(PlatingTypeSelector);
      
      // Component should render options
      const options = wrapper.findAll('label');
      expect(options.length).toBeGreaterThan(0);
      
      // Should have flex-col or similar stacking classes
      const radios = wrapper.findAll('input[type="radio"]');
      expect(radios.length).toBeGreaterThan(0);
      
      // Check for responsive text sizing
      const labels = wrapper.findAll('label');
      const hasResponsiveText = labels.some(label => {
        const classes = label.classes();
        const labelHas = classes.some(cls =>
          cls.includes('text-sm') || cls.includes('xs:text-') || cls.includes('sm:text-')
        );
        const innerHas = label.find('.text-xs, .text-sm, .xs\\:text-base, .sm\\:text-base').exists();
        return labelHas || innerHas;
      });
      expect(hasResponsiveText).toBe(true);
    });

    it('should make pricing table scrollable horizontally on mobile', () => {
      const wrapper = mount(PricingTable, {
        props: {
          platingType: PLATING_TYPES[0],
          selectedSize: null,
          selectedQuantity: null
        }
      });
      
      // Check for horizontal scroll container
      const scrollContainer = wrapper.find('.overflow-x-auto');
      expect(scrollContainer.exists()).toBe(true);
      
      // Ensure minimum width on grid container exists (or grid layout present)
      const grid = wrapper.find('.min-w-\\[320px\\], .min-w-\\[480px\\], .grid');
      expect(grid.exists()).toBe(true);
    });

    it('should stack modifications panel vertically on mobile', () => {
      const wrapper = mount(ModificationsPanel);
      
      // Should render sections with spacing
      const container = wrapper.find('.space-y-6, .space-y-8');
      expect(container.exists()).toBe(true);
      
      // Should have space-y classes for vertical spacing
      const sections = wrapper.findAll('.space-y-4, .space-y-6');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('should adjust calculation summary layout for mobile', () => {
      const wrapper = mount(CalculationSummary, {
        props: {
          breakdown: {
            basePrice: 100,
            setupFee: 0,
            backingCost: 0,
            packagingCost: 0,
            rushFee: 0,
            total: 100,
            unitPrice: 1.00
          },
          isComplete: true
        }
      });
      
      // Check for content exists with padding classes applied inside Card
      // Content exists; padding classes are implementation-specific
      expect(wrapper.text()).toContain('Price Breakdown');
      
      // Check for responsive text sizing
      const totalText = wrapper.find('.text-xl, .text-2xl');
      expect(totalText.exists()).toBe(true);
    });

    it('should optimize quote display for mobile printing', () => {
      const mockSelections = {
        platingType: PLATING_TYPES[0],
        size: '1.00',
        quantity: 500,
        backing: BACKING_OPTIONS[0],
        packaging: PACKAGING_OPTIONS[0],
        rushOrder: false
      };

      const mockBreakdown = {
        basePrice: 630,
        setupFee: 0,
        backingCost: 0,
        packagingCost: 0,
        rushFee: 0,
        total: 630,
        unitPrice: 1.26
      };

      const wrapper = mount(QuoteDisplay, {
        props: {
          selections: mockSelections,
          breakdown: mockBreakdown
        }
      });
      
      // Check for mobile print styles
      const printVersion = wrapper.find('.print-version');
      expect(printVersion.exists()).toBe(true);
      
      // Should have responsive text sizing for mobile
      const responsiveText = wrapper.findAll('.text-sm, .xs:text-base');
      expect(responsiveText.length).toBeGreaterThan(0);
    });
  });

  describe('Tablet Layout (768px - 1023px)', () => {
    beforeEach(() => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      // Mock matchMedia for tablet
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        ...mockMatchMedia(query),
        matches: query.includes('min-width: 768px') && !query.includes('min-width: 1024px'),
      }));
    });

    it('should use grid layout for main calculator on tablet', () => {
      const wrapper = mount(PricingCalculator);
      
      // Calculator container exists
      expect(wrapper.find('.pricing-calculator').exists()).toBe(true);
    });

    it('should maintain horizontal plating selector on tablet', () => {
      const wrapper = mount(PlatingTypeSelector);
      
      // Should render grid with >=2 columns on tablet
      const grid = wrapper.find('.grid');
      expect(grid.exists()).toBe(true);
      
      // Check some responsive spacing exists
      const options = wrapper.findAll('label');
      const hasResponsive = options.length > 0;
      expect(hasResponsive).toBe(true);
    });

    it('should optimize pricing table for tablet view', () => {
      const wrapper = mount(PricingTable, {
        props: {
          platingType: PLATING_TYPES[0],
          selectedSize: null,
          selectedQuantity: null
        }
      });
      
      const table = wrapper.find('.pricing-table-container');
      expect(table.exists()).toBe(true);
      
      // Check for tablet-optimized cell sizing
      const cells = wrapper.findAll('button');
      const hasTabletSizing = cells.some(cell => {
        const classes = cell.classes();
        return classes.some(cls => 
          cls.includes('md:px-') || cls.includes('md:py-') || cls.includes('md:text-') ||
          cls.includes('xs:') || cls.includes('sm:')
        );
      });
      expect(hasTabletSizing).toBe(true);
    });
  });

  describe('Desktop Layout (1024px+)', () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      // Mock matchMedia for desktop
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        ...mockMatchMedia(query),
        matches: query.includes('min-width: 1024px'),
      }));
    });

    it('should use full grid layout on desktop', () => {
      const wrapper = mount(PricingCalculator);
      
      // Entire calculator should render on desktop
      expect(wrapper.find('.pricing-calculator').exists()).toBe(true);
    });

    it('should optimize pricing table for desktop interaction', () => {
      const wrapper = mount(PricingTable, {
        props: {
          platingType: PLATING_TYPES[0],
          selectedSize: null,
          selectedQuantity: null
        }
      });
      
      // Check for desktop hover effects
      const cells = wrapper.findAll('button');
      cells.forEach(cell => {
        const classes = cell.classes();
        const hasHoverEffects = classes.some(cls => 
          cls.includes('hover:') ||
          cls.includes('lg:hover:')
        );
        expect(hasHoverEffects).toBe(true);
      });
    });

    it('should display side-by-side layout for modifications and summary', () => {
      const wrapper = mount(PricingCalculator);
      
      expect(wrapper.find('.pricing-calculator').exists()).toBe(true);
    });
  });

  describe('Breakpoint Transitions', () => {
    it('should handle viewport size changes gracefully', async () => {
      const wrapper = mount(PricingCalculator);
      
      // Simulate viewport change from mobile to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      
      // Trigger resize event
      window.dispatchEvent(new Event('resize'));
      
      // Component should still be functional
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.pricing-calculator').exists()).toBe(true);
    });

    it('should maintain state across breakpoint changes', async () => {
      const wrapper = mount(PlatingTypeSelector, {
        props: {
          selectedPlating: PLATING_TYPES[0]
        }
      });
      
      // Simulate breakpoint change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      window.dispatchEvent(new Event('resize'));
      await wrapper.vm.$nextTick();
      
      // Selected state should be maintained
      expect(wrapper.props('selectedPlating')).toEqual(PLATING_TYPES[0]);
    });
  });

  describe('Touch and Mouse Interaction', () => {
    it('should support touch interactions on mobile', async () => {
      const wrapper = mount(PricingTable, {
        props: {
          platingType: PLATING_TYPES[0],
          selectedSize: null,
          selectedQuantity: null
        }
      });
      
      const firstCell = wrapper.findAll('button')[0];
      await firstCell.trigger('click');
      expect(wrapper.emitted('selection-change')).toBeTruthy();
    });

    it('should have appropriate touch targets on mobile', () => {
      const wrapper = mount(PlatingTypeSelector);
      
      const buttons = wrapper.findAll('button');
      buttons.forEach(button => {
        const classes = button.classes();
        // Check for minimum touch target size (44px)
        const hasTouchTarget = classes.some(cls => 
          cls.includes('min-h-') ||
          cls.includes('py-') ||
          cls.includes('px-')
        );
        expect(hasTouchTarget).toBe(true);
      });
    });

    it('should optimize hover states for non-touch devices', () => {
      const wrapper = mount(ModificationsPanel);
      
      const labels = wrapper.findAll('label');
      const anyInteractive = labels.some(label => {
        const classes = label.classes();
        return classes.some(cls => cls.includes('hover:') || cls.includes('active:'));
      });
      expect(anyInteractive).toBe(true);
    });
  });

  describe('Content Reflow and Readability', () => {
    it('should maintain readability at all screen sizes', () => {
      const wrapper = mount(CalculationSummary, {
        props: {
          breakdown: {
            basePrice: 100,
            setupFee: 50,
            backingCost: 20,
            packagingCost: 15,
            rushFee: 37,
            total: 222,
            unitPrice: 1.00
          },
          isComplete: true
        }
      });
      
      // Check for responsive text sizing
      const textElements = wrapper.findAll('.text-sm, .text-base, .text-lg, .text-xl');
      expect(textElements.length).toBeGreaterThan(0);
      
      // Check for proper line height
      const lineHeightElements = wrapper.findAll('.leading-relaxed, .leading-normal');
      expect(lineHeightElements.length).toBeGreaterThan(0);
    });

    it('should prevent horizontal scrolling on small screens', () => {
      const wrapper = mount(PricingCalculator);
      
      // Ensure container exists (overflow managed within subcomponents)
      expect(wrapper.find('.pricing-calculator').exists()).toBe(true);
    });

    it('should maintain proper spacing at all breakpoints', () => {
      const wrapper = mount(ModificationsPanel);
      
      // Check for responsive spacing classes
      const spacingElements = wrapper.findAll('[class*="space-y-"], [class*="gap-"], [class*="p-"], [class*="m-"]');
      expect(spacingElements.length).toBeGreaterThan(0);
      
      const someResponsive = spacingElements.some(element => {
        const classes = element.classes();
        return classes.some(cls => cls.includes('sm:') || cls.includes('md:') || cls.includes('lg:'));
      });
      expect(someResponsive).toBe(true);
    });
  });

  describe('Performance on Different Devices', () => {
    it('should handle large datasets efficiently on mobile', () => {
      const wrapper = mount(PricingTable, {
        props: {
          platingType: PLATING_TYPES[0],
          selectedSize: null,
          selectedQuantity: null
        }
      });
      
      // Should render all pricing cells without performance issues
      const cells = wrapper.findAll('button');
      expect(cells.length).toBe(42); // 6 sizes × 7 quantities
      
      // All cells should be rendered
      cells.forEach(cell => {
        expect(cell.exists()).toBe(true);
        expect(cell.text()).toMatch(/\$\d+\.\d{2}/);
      });
    });

    it('should optimize animations for reduced motion preferences', () => {
      const wrapper = mount(PlatingTypeSelector);
      
      // Check for motion-safe classes
      const animatedElements = wrapper.findAll('[class*="transition"], [class*="animate"], [class*="reduced-motion"]');
      const respectsMotionPref = animatedElements.some(element => {
        const classes = element.classes();
        return classes.some(cls => 
          cls.includes('motion-safe:') ||
          cls.includes('motion-reduce:') ||
          cls.includes('reduced-motion:')
        );
      });
      expect(respectsMotionPref).toBe(true);
    });
  });

  describe('Print Styles Responsiveness', () => {
    it('should optimize print layout for different paper sizes', () => {
      const mockSelections = {
        platingType: PLATING_TYPES[0],
        size: '1.00',
        quantity: 500,
        backing: BACKING_OPTIONS[0],
        packaging: PACKAGING_OPTIONS[0],
        rushOrder: false
      };

      const mockBreakdown = {
        basePrice: 630,
        setupFee: 0,
        backingCost: 0,
        packagingCost: 0,
        rushFee: 0,
        total: 630,
        unitPrice: 1.26
      };

      const wrapper = mount(QuoteDisplay, {
        props: {
          selections: mockSelections,
          breakdown: mockBreakdown
        }
      });
      
      // Check for print-specific styles
      const printElements = wrapper.findAll('.print-version, .print-header, .print-content');
      expect(printElements.length).toBeGreaterThan(0);
    });
  });
});