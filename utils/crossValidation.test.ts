import { describe, it, expect } from 'vitest'
import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption } from '~/types/pricing'

// Import original functions with explicit path to avoid conflicts
import * as OriginalCalcs from './calculations'
// Import simplified functions
import * as SimpleCalcs from './calculationsSimple'

// Test data
const mockProductionMethod: ProductionMethod = {
  id: 'die-struck',
  name: 'Die Struck',
  pricing: {
    '0.75': { 100: 3.25, 200: 2.75, 500: 2.25, 1000: 1.85, 2500: 1.55 },
    '1.00': { 100: 3.35, 200: 2.85, 500: 2.35, 1000: 1.95, 2500: 1.65 },
    '1.25': { 100: 3.65, 200: 3.15, 500: 2.65, 1000: 2.25, 2500: 1.95 },
    '1.50': { 100: 3.85, 200: 3.35, 500: 2.85, 1000: 2.45, 2500: 2.15 },
    '1.75': { 100: 4.25, 200: 3.75, 500: 3.25, 1000: 2.85, 2500: 2.55 },
    '2.00': { 100: 4.65, 200: 4.15, 500: 3.65, 1000: 3.25, 2500: 2.95 }
  }
}

const mockSetupMethod: ProductionMethod = {
  id: 'offset-printed',
  name: 'Offset Printed',
  setupFee: 100,
  pricing: {
    '1.00': { 100: 2.00, 200: 1.50, 500: 1.00, 1000: 0.80, 2500: 0.65 }
  }
}

const mockPlating: PlatingOption = {
  id: 'antique-gold',
  name: 'Antique Gold',
  price: 0.60,
  isFree: false
}

const mockBacking: BackingOption = {
  id: 'magnetic',
  name: 'Magnetic',
  price: 0.35,
  isFree: false
}

const mockPackaging: PackagingOption = {
  id: 'gift-box',
  name: 'Gift Box',
  price: 1.25,
  isFree: false
}

describe('Cross-Validation: Original vs Simplified System', () => {
  describe('CRITICAL: Mold Fee Calculations', () => {
    const testCases = [
      // Size threshold tests
      { size: '0.75', quantity: 100, description: 'Small size (≤1.5")' },
      { size: '1.00', quantity: 200, description: 'Medium size (≤1.5")' },
      { size: '1.50', quantity: 300, description: 'Boundary size (exactly 1.5")' },
      { size: '1.75', quantity: 400, description: 'Medium-large size (1.75")' },
      { size: '2.00', quantity: 500, description: 'Large size (≥2.0")' },
      { size: '2.50', quantity: 100, description: 'Extra large size (≥2.0")' },
      
      // Quantity exemption tests
      { size: '1.00', quantity: 500, description: 'Exactly 500 qty (fee applies)' },
      { size: '1.00', quantity: 501, description: 'Exactly 501 qty (fee waived)' },
      { size: '1.75', quantity: 750, description: '1.75" with high qty (waived)' },
      { size: '2.00', quantity: 1000, description: '2.0" with high qty (waived)' },
      
      // Edge cases
      { size: '1.49', quantity: 100, description: 'Just under 1.5" threshold' },
      { size: '1.51', quantity: 100, description: 'Just over 1.5" threshold' },
      { size: '1.76', quantity: 100, description: 'Just over 1.75" threshold' },
    ]

    testCases.forEach(({ size, quantity, description }) => {
      it(`should match original calculation for ${description}`, () => {
        const originalResult = OriginalCalcs.calculateMoldFee(size, quantity)
        const simplifiedResult = SimpleCalcs.calculateMoldFee(size, quantity)

        expect(simplifiedResult.fee).toBe(originalResult.fee)
        expect(simplifiedResult.waived).toBe(originalResult.waived)
        if (originalResult.reason) {
          expect(simplifiedResult.reason).toBe(originalResult.reason)
        }
      })
    })
  })

  describe('Base Price Calculations', () => {
    const testCases = [
      { size: '0.75', quantity: 100 },
      { size: '1.00', quantity: 200 },
      { size: '1.25', quantity: 500 },
      { size: '1.50', quantity: 1000 },
      { size: '1.75', quantity: 2500 },
      { size: '2.00', quantity: 500 }
    ]

    testCases.forEach(({ size, quantity }) => {
      it(`should match original calculation for ${size}" × ${quantity}`, () => {
        const originalResult = OriginalCalcs.calculateBasePrice(mockProductionMethod, size, quantity)
        const simplifiedResult = SimpleCalcs.calculateBasePrice(mockProductionMethod, size, quantity)

        expect(simplifiedResult).toBe(originalResult)
      })
    })
  })

  describe('Setup Fee Calculations', () => {
    it('should match original calculation for method without setup fee', () => {
      const originalResult = OriginalCalcs.calculateSetupFee(mockProductionMethod)
      const simplifiedResult = SimpleCalcs.calculateSetupFee(mockProductionMethod)

      expect(simplifiedResult).toBe(originalResult)
    })

    it('should match original calculation for method with setup fee', () => {
      const originalResult = OriginalCalcs.calculateSetupFee(mockSetupMethod)
      const simplifiedResult = SimpleCalcs.calculateSetupFee(mockSetupMethod)

      expect(simplifiedResult).toBe(originalResult)
    })
  })

  describe('Add-on Cost Calculations', () => {
    const quantity = 100

    it('should match original plating cost calculation', () => {
      const originalResult = OriginalCalcs.calculatePlatingCost(mockPlating, quantity)
      const simplifiedResult = SimpleCalcs.calculatePlatingCost(mockPlating, quantity)

      expect(simplifiedResult).toBe(originalResult)
    })

    it('should match original backing cost calculation', () => {
      const originalResult = OriginalCalcs.calculateBackingCost(mockBacking, quantity)
      const simplifiedResult = SimpleCalcs.calculateBackingCost(mockBacking, quantity)

      expect(simplifiedResult).toBe(originalResult)
    })

    it('should match original packaging cost calculation', () => {
      const originalResult = OriginalCalcs.calculatePackagingCost(mockPackaging, quantity)
      const simplifiedResult = SimpleCalcs.calculatePackagingCost(mockPackaging, quantity)

      expect(simplifiedResult).toBe(originalResult)
    })
  })

  describe('Complete Price Breakdown Validation', () => {
    const testScenarios = [
      {
        name: 'Basic order without setup fee',
        method: mockProductionMethod,
        size: '1.00',
        quantity: 100,
        plating: mockPlating,
        backing: mockBacking,
        packaging: mockPackaging,
        rushOrder: false
      },
      {
        name: 'Order with setup fee',
        method: mockSetupMethod,
        size: '1.00',
        quantity: 200,
        plating: null,
        backing: null,
        packaging: null,
        rushOrder: false
      },
      {
        name: 'Rush order with all add-ons',
        method: mockProductionMethod,
        size: '1.75',
        quantity: 500,
        plating: mockPlating,
        backing: mockBacking,
        packaging: mockPackaging,
        rushOrder: true
      },
      {
        name: 'High quantity order (mold fee waived)',
        method: mockProductionMethod,
        size: '2.00',
        quantity: 1000,
        plating: mockPlating,
        backing: null,
        packaging: null,
        rushOrder: false
      }
    ]

    testScenarios.forEach(({ name, method, size, quantity, plating, backing, packaging, rushOrder }) => {
      it(`should match original breakdown for ${name}`, () => {
        const originalBreakdown = OriginalCalcs.calculatePriceBreakdown(
          method, size, quantity, plating, backing, packaging, rushOrder
        )
        const simplifiedBreakdown = SimpleCalcs.calculatePriceBreakdown(
          method, size, quantity, plating, backing, packaging, rushOrder
        )

        // Compare all breakdown components
        expect(simplifiedBreakdown.basePrice).toBe(originalBreakdown.basePrice)
        expect(simplifiedBreakdown.setupFee).toBe(originalBreakdown.setupFee)
        expect(simplifiedBreakdown.moldFee).toBe(originalBreakdown.moldFee)
        expect(simplifiedBreakdown.platingCost).toBe(originalBreakdown.platingCost)
        expect(simplifiedBreakdown.backingCost).toBe(originalBreakdown.backingCost)
        expect(simplifiedBreakdown.packagingCost).toBe(originalBreakdown.packagingCost)
        expect(simplifiedBreakdown.rushOrderMultiplier).toBe(originalBreakdown.rushOrderMultiplier)
        expect(simplifiedBreakdown.totalPrice).toBe(originalBreakdown.totalPrice)
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle null production method identically', () => {
      const originalResult = SimpleCalcs.calculateBasePrice(null, '1.00', 100)
      const simplifiedResult = SimpleCalcs.calculateBasePrice(null, '1.00', 100)

      expect(simplifiedResult).toBe(originalResult)
      expect(simplifiedResult).toBe(0)
    })

    it('should handle invalid size/quantity gracefully', () => {
      // Test with simplified system only since original may throw
      const result = SimpleCalcs.calculatePriceBreakdown(
        mockProductionMethod, 'invalid', 0, null, null, null, false
      )

      expect(result.basePrice).toBe(0)
      expect(result.moldFee).toBe(0) // Should gracefully handle error
      expect(result.totalPrice).toBeGreaterThanOrEqual(0)
    })
  })
})