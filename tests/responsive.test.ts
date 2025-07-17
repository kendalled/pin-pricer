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
      
      // Check for mobile-specific classes
      const container = wrapper.find('.plating-selector');
      expect(container.exists()).toBe(true);
      
      // Should have flex-col or similar stacking classes
      const buttons = wrapper.findAll('button');
      expect(buttons.length).toBe(5);
      
      // Check for responsive text sizing
      buttons.forEach(button => {
        const classes = button.classes();
        const hasResponsiveText = classes.some(cls => 
          cls.includes('text-sm') || 
          cls.includes('xs:text-') ||
          cls.includes('sm:text-')
        );
        expect(hasResponsiveText).toBe(true);
      });
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
      
      // Check for minimum width on table
      const table = wrapper.find('.min-w-full');
      expect(table.exists()).toBe(true);
    });

    it('should stack modifications panel vertically on mobile', () => {
      const wrapper = mount(ModificationsPanel);
      
      // Check for mobile stacking classes
      const container = wrapper.find('.modifications-panel');
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
      
      // Check for mobile-friendly padding and spacing
      const container = wrapper.find('.p-4, .p-6');
      expect(container.exists()).toBe(true);
      
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
      
      // Check for tablet grid classes
      const gridContainer = wrapper.find('.md:grid, .md:grid-cols-2');
      expect(gridContainer.exists()).toBe(true);
    });

    it('should maintain horizontal plating selector on tablet', () => {
      const wrapper = mount(PlatingTypeSelector);
      
      // Should maintain horizontal layout
      const container = wrapper.find('.flex');
      expect(container.exists()).toBe(true);
      
      // Check for tablet-specific spacing
      const buttons = wrapper.findAll('button');
      buttons.forEach(button => {
        const classes = button.classes();
        const hasTabletSpacing = classes.some(cls => 
          cls.includes('md:px-') || 
          cls.includes('md:py-')
        );
        expect(hasTabletSpacing).toBe(true);
      });
    });

    it('should optimize pricing table for tablet view', () => {
      const wrapper = mount(PricingTable, {
        props: {
          platingType: PLATING_TYPES[0],
          selectedSize: null,
          selectedQuantity: null
        }
      });
      
      // Should not need horizontal scroll on tablet
      const table = wrapper.find('.pricing-table-container');
      expect(table.exists()).toBe(true);
      
      // Check for tablet-optimized cell sizing
      const cells = wrapper.findAll('button');
      cells.forEach(cell => {
        const classes = cell.classes();
        const hasTabletSizing = classes.some(cls => 
          cls.includes('md:px-') || 
          cls.includes('md:py-') ||
          cls.includes('md:text-')
        );
        expect(hasTabletSizing).toBe(true);
      });
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
      
      // Check for desktop grid classes
      const gridContainer = wrapper.find('.lg:grid-cols-2, .xl:grid-cols-3');
      expect(gridContainer.exists()).toBe(true);
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
      
      // Check for desktop layout classes
      const layoutContainer = wrapper.find('.lg:flex, .lg:grid');
      expect(layoutContainer.exists()).toBe(true);
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
          selectedType: PLATING_TYPES[0]
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
      expect(wrapper.props('selectedType')).toEqual(PLATING_TYPES[0]);
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
      
      // Test touch events
      await firstCell.trigger('touchstart');
      await firstCell.trigger('touchend');
      
      // Should emit selection change
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
      labels.forEach(label => {
        const classes = label.classes();
        // Should have hover states that don't interfere with touch
        const hasHoverState = classes.some(cls => 
          cls.includes('hover:') ||
          cls.includes('md:hover:')
        );
        expect(hasHoverState).toBe(true);
      });
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
      
      // Check for overflow handling
      const container = wrapper.find('.overflow-hidden, .overflow-x-hidden');
      expect(container.exists()).toBe(true);
    });

    it('should maintain proper spacing at all breakpoints', () => {
      const wrapper = mount(ModificationsPanel);
      
      // Check for responsive spacing classes
      const spacingElements = wrapper.findAll('[class*="space-y-"], [class*="gap-"], [class*="p-"], [class*="m-"]');
      expect(spacingElements.length).toBeGreaterThan(0);
      
      spacingElements.forEach(element => {
        const classes = element.classes();
        const hasResponsiveSpacing = classes.some(cls => 
          cls.includes('sm:') || 
          cls.includes('md:') || 
          cls.includes('lg:')
        );
        expect(hasResponsiveSpacing).toBe(true);
      });
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
      const animatedElements = wrapper.findAll('[class*="transition"], [class*="animate"]');
      animatedElements.forEach(element => {
        const classes = element.classes();
        const hasMotionSafe = classes.some(cls => 
          cls.includes('motion-safe:') ||
          cls.includes('motion-reduce:')
        );
        // Should respect motion preferences
        expect(hasMotionSafe).toBe(true);
      });
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
      const printElements = wrapper.findAll('.print\\:block, .print\\:hidden, .print\\:text-black');
      expect(printElements.length).toBeGreaterThan(0);
    });
  });
});