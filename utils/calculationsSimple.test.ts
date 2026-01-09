import { describe, it, expect } from 'vitest'
import { 
  calculateMoldFee,
  parsePinSize,
  getMoldFeeForSize,
  calculateBasePrice,
  calculateSetupFee,
  calculatePlatingCost,
  calculateBackingCost,
  calculatePackagingCost,
  calculateAddOns,
  calculateTotal,
  calculatePriceBreakdown
} from './calculationsSimple'
import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption } from '~/types/pricingSimple'

// Test data
const mockProductionMethod: ProductionMethod = {
  id: 'test-production',
  name: 'Test Production',
  pricing: {
    '1.00': { 100: 2.50, 200: 2.00, 500: 1.50 },
    '1.25': { 100: 2.75, 200: 2.25, 500: 1.75 }
  }
}

const mockProductionMethodWithSetup: ProductionMethod = {
  id: 'offset-printed',
  name: 'Offset Printed',
  setupFee: 100,
  pricing: {
    '1.00': { 100: 2.00, 200: 1.50, 500: 1.00 }
  }
}

const mockPlatingOption: PlatingOption = {
  id: 'antique-gold',
  name: 'Antique Gold',
  price: 0.60,
  isFree: false
}

const mockPlatingOptionFree: PlatingOption = {
  id: 'polished-gold',
  name: 'Polished Gold',
  price: 0.00,
  isFree: true
}

const mockBackingFree: BackingOption = {
  id: 'butterfly',
  name: 'Butterfly Clutch',
  price: 0.00,
  isFree: true
}

const mockBackingPaid: BackingOption = {
  id: 'magnetic',
  name: 'Magnetic',
  price: 0.35,
  isFree: false
}

const mockPackagingFree: PackagingOption = {
  id: 'poly-bag',
  name: 'Poly Bag',
  price: 0.00,
  isFree: true
}

const mockPackagingPaid: PackagingOption = {
  id: 'gift-box',
  name: 'Gift Box',
  price: 1.25,
  isFree: false
}

// CRITICAL: Mold Fee Tests - copied exactly from existing system
describe('Mold Fee Functions - Comprehensive Tests', () => {
  describe('parsePinSize', () => {
    it('should parse valid size strings correctly', () => {
      expect(parsePinSize('1.50')).toBe(1.5)
      expect(parsePinSize('2.00')).toBe(2.0)
      expect(parsePinSize('0.75')).toBe(0.75)
      expect(parsePinSize('1.25')).toBe(1.25)
      expect(parsePinSize('1.75')).toBe(1.75)
      expect(parsePinSize('0.1')).toBe(0.1) // minimum valid size
      expect(parsePinSize('10')).toBe(10) // maximum valid size
      expect(parsePinSize('3.5')).toBe(3.5) // larger sizes
    })

    it('should handle decimal precision correctly', () => {
      expect(parsePinSize('1.500')).toBe(1.5)
      expect(parsePinSize('1.750')).toBe(1.75)
      expect(parsePinSize('2.000')).toBe(2.0)
      expect(parsePinSize('1.123')).toBe(1.123)
    })

    it('should throw error for null/undefined inputs', () => {
      expect(() => parsePinSize(null as any)).toThrow('Invalid size string provided')
      expect(() => parsePinSize(undefined as any)).toThrow('Invalid size string provided')
    })

    it('should throw error for empty strings', () => {
      expect(() => parsePinSize('')).toThrow('Invalid size string provided')
    })

    it('should throw error for non-numeric strings', () => {
      expect(() => parsePinSize('abc')).toThrow('Invalid size format: abc')
      expect(() => parsePinSize('size1.5')).toThrow('Invalid size format: size1.5')
    })

    it('should throw error for negative values', () => {
      expect(() => parsePinSize('-1.5')).toThrow('Invalid size format: -1.5')
      expect(() => parsePinSize('-0.1')).toThrow('Invalid size format: -0.1')
    })

    it('should throw error for zero values', () => {
      expect(() => parsePinSize('0')).toThrow('Invalid size format: 0')
      expect(() => parsePinSize('0.0')).toThrow('Invalid size format: 0.0')
    })

    it('should throw error for out-of-range values', () => {
      expect(() => parsePinSize('0.05')).toThrow('Size out of reasonable range: 0.05"')
      expect(() => parsePinSize('15')).toThrow('Size out of reasonable range: 15"')
    })

    it('should throw error for special numeric values', () => {
      expect(() => parsePinSize('Infinity')).toThrow('Invalid size format: Infinity')
      expect(() => parsePinSize('NaN')).toThrow('Invalid size format: NaN')
    })
  })

  describe('getMoldFeeForSize', () => {
    describe('Size threshold boundaries (≤1.5", 1.75", ≥2.0")', () => {
      it('should return $50.00 for sizes up to and including 1.5"', () => {
        expect(getMoldFeeForSize(0.75)).toBe(50.00)
        expect(getMoldFeeForSize(1.00)).toBe(50.00)
        expect(getMoldFeeForSize(1.25)).toBe(50.00)
        expect(getMoldFeeForSize(1.50)).toBe(50.00) // exactly 1.5"
        expect(getMoldFeeForSize(1.49)).toBe(50.00) // just under 1.5"
      })

      it('should return $62.50 for 1.75" size', () => {
        expect(getMoldFeeForSize(1.75)).toBe(62.50) // exactly 1.75"
        expect(getMoldFeeForSize(1.51)).toBe(62.50) // just over 1.5"
        expect(getMoldFeeForSize(1.74)).toBe(62.50) // just under 1.75"
      })

      it('should return $75.00 for sizes 2.0" and above', () => {
        expect(getMoldFeeForSize(2.00)).toBe(75.00) // exactly 2.0"
        expect(getMoldFeeForSize(1.76)).toBe(75.00) // just over 1.75"
        expect(getMoldFeeForSize(1.99)).toBe(75.00) // just under 2.0"
        expect(getMoldFeeForSize(2.50)).toBe(75.00) // larger than 2.0"
        expect(getMoldFeeForSize(5.00)).toBe(75.00) // much larger
      })
    })

    it('should handle edge cases at exact threshold boundaries', () => {
      // Test exact boundaries as specified in requirements
      expect(getMoldFeeForSize(1.5)).toBe(50.00)   // exactly 1.5" = $50
      expect(getMoldFeeForSize(1.75)).toBe(62.50)  // exactly 1.75" = $62.50
      expect(getMoldFeeForSize(2.0)).toBe(75.00)   // exactly 2.0" = $75
    })

    it('should handle sizes between thresholds correctly', () => {
      expect(getMoldFeeForSize(1.6)).toBe(62.50)   // between 1.5 and 1.75
      expect(getMoldFeeForSize(1.8)).toBe(75.00)   // between 1.75 and 2.0
    })

    it('should throw error for invalid numeric inputs', () => {
      expect(() => getMoldFeeForSize(0)).toThrow('Invalid size for mold fee lookup: 0')
      expect(() => getMoldFeeForSize(-1)).toThrow('Invalid size for mold fee lookup: -1')
      expect(() => getMoldFeeForSize(NaN)).toThrow('Invalid size for mold fee lookup: NaN')
      expect(() => getMoldFeeForSize(Infinity)).toThrow('Invalid size for mold fee lookup: Infinity')
      expect(() => getMoldFeeForSize(-Infinity)).toThrow('Invalid size for mold fee lookup: -Infinity')
    })

    it('should throw error for non-numeric inputs', () => {
      expect(() => getMoldFeeForSize(null as any)).toThrow('Invalid size for mold fee lookup')
      expect(() => getMoldFeeForSize(undefined as any)).toThrow('Invalid size for mold fee lookup')
      expect(() => getMoldFeeForSize('1.5' as any)).toThrow('Invalid size for mold fee lookup')
    })
  })

  describe('calculateMoldFee', () => {
    describe('Quantity exemption logic (<500 vs 500+)', () => {
      it('should apply mold fee for quantities below 500', () => {
        // Test various sizes with quantities < 500
        const testCases = [
          { size: '0.75', quantity: 100, expectedFee: 50.00 },
          { size: '1.00', quantity: 200, expectedFee: 50.00 },
          { size: '1.25', quantity: 300, expectedFee: 50.00 },
          { size: '1.50', quantity: 400, expectedFee: 50.00 },
          { size: '1.75', quantity: 499, expectedFee: 62.50 },
          { size: '2.00', quantity: 499, expectedFee: 75.00 }
        ]

        testCases.forEach(({ size, quantity, expectedFee }) => {
          const result = calculateMoldFee(size, quantity)
          expect(result.fee).toBe(expectedFee)
          expect(result.waived).toBe(false)
          expect(result.reason).toBeUndefined()
        })
      })

      it('should waive mold fee for quantities 500 and above', () => {
        // Test various sizes with quantities >= 500
        const testCases = [
          { size: '0.75', quantity: 500 },
          { size: '1.00', quantity: 500 },
          { size: '1.25', quantity: 500 },
          { size: '1.50', quantity: 501 },
          { size: '1.75', quantity: 600 },
          { size: '2.00', quantity: 1000 }
        ]

        testCases.forEach(({ size, quantity }) => {
          const result = calculateMoldFee(size, quantity)
          expect(result.fee).toBe(0)
          expect(result.waived).toBe(true)
          expect(result.reason).toBe('High volume exemption (500+ qty)')
        })
      })

      it('should handle edge case of exactly 500 quantity', () => {
        // exactly 500 should waive mold fee (exemption starts at 500+)
        const result = calculateMoldFee('1.50', 500)
        expect(result.fee).toBe(0)
        expect(result.waived).toBe(true)
        expect(result.reason).toBe('High volume exemption (500+ qty)')
      })

      it('should handle edge case of exactly 501 quantity', () => {
        const result = calculateMoldFee('1.50', 501)
        expect(result.fee).toBe(0)
        expect(result.waived).toBe(true)
        expect(result.reason).toBe('High volume exemption (500+ qty)')
      })
    })

    describe('Size threshold boundaries with various quantities', () => {
      it('should calculate correct fees for all size/quantity combinations', () => {
        const testMatrix = [
          // Size ≤ 1.5" = $50.00
          { size: '0.75', quantity: 100, expectedFee: 50.00, waived: false },
          { size: '1.00', quantity: 200, expectedFee: 50.00, waived: false },
          { size: '1.25', quantity: 300, expectedFee: 50.00, waived: false },
          { size: '1.50', quantity: 400, expectedFee: 50.00, waived: false },
          
          // Size 1.75" = $62.50
          { size: '1.75', quantity: 100, expectedFee: 62.50, waived: false },
          { size: '1.75', quantity: 300, expectedFee: 62.50, waived: false },
          { size: '1.75', quantity: 499, expectedFee: 62.50, waived: false },
          
          // Size ≥ 2.0" = $75.00
          { size: '2.00', quantity: 100, expectedFee: 75.00, waived: false },
          { size: '2.50', quantity: 200, expectedFee: 75.00, waived: false },
          { size: '3.00', quantity: 400, expectedFee: 75.00, waived: false },
          
          // High quantity exemptions (all sizes) - 500+ gets waived
          { size: '0.75', quantity: 500, expectedFee: 0, waived: true },
          { size: '1.25', quantity: 500, expectedFee: 0, waived: true },
          { size: '1.50', quantity: 500, expectedFee: 0, waived: true },
          { size: '1.75', quantity: 500, expectedFee: 0, waived: true },
          { size: '2.00', quantity: 500, expectedFee: 0, waived: true },
          { size: '0.75', quantity: 600, expectedFee: 0, waived: true },
          { size: '1.25', quantity: 750, expectedFee: 0, waived: true },
          { size: '1.50', quantity: 1000, expectedFee: 0, waived: true },
          { size: '1.75', quantity: 1500, expectedFee: 0, waived: true },
          { size: '2.00', quantity: 2000, expectedFee: 0, waived: true },
          { size: '3.00', quantity: 5000, expectedFee: 0, waived: true }
        ]

        testMatrix.forEach(({ size, quantity, expectedFee, waived }) => {
          const result = calculateMoldFee(size, quantity)
          expect(result.fee).toBe(expectedFee)
          expect(result.waived).toBe(waived)
          if (waived) {
            expect(result.reason).toBe('High volume exemption (500+ qty)')
          } else {
            expect(result.reason).toBeUndefined()
          }
        })
      })
    })

    describe('Edge cases and boundary conditions', () => {
      it('should handle exactly 1.5" with various quantities', () => {
        expect(calculateMoldFee('1.5', 100)).toEqual({ fee: 50.00, waived: false })
        expect(calculateMoldFee('1.5', 500)).toEqual({ fee: 50.00, waived: false })
        expect(calculateMoldFee('1.5', 501)).toEqual({ 
          fee: 0, 
          waived: true, 
          reason: 'High volume exemption (500+ qty)' 
        })
      })

      it('should handle invalid inputs gracefully', () => {
        // Invalid size
        const result1 = calculateMoldFee('', 100)
        expect(result1.fee).toBe(0)
        expect(result1.waived).toBe(false)
        expect(result1.reason).toBe('Error calculating mold fee')

        // Invalid quantity
        const result2 = calculateMoldFee('1.50', 0)
        expect(result2.fee).toBe(0)
        expect(result2.waived).toBe(false)
        expect(result2.reason).toBe('Error calculating mold fee')
      })
    })
  })
})

describe('Basic Calculations', () => {
  describe('calculateBasePrice', () => {
    it('should calculate base price correctly', () => {
      const result = calculateBasePrice(mockProductionMethod, '1.00', 100)
      expect(result).toBe(250) // 2.50 * 100
    })

    it('should calculate base price for different quantities', () => {
      const result = calculateBasePrice(mockProductionMethod, '1.00', 200)
      expect(result).toBe(400) // 2.00 * 200
    })

    it('should return 0 for invalid inputs', () => {
      expect(calculateBasePrice(null, '1.00', 100)).toBe(0)
      expect(calculateBasePrice(mockProductionMethod, '3.00', 100)).toBe(0)
      expect(calculateBasePrice(mockProductionMethod, '1.00', 150)).toBe(0)
    })
  })

  describe('calculateSetupFee', () => {
    it('should return 0 for production methods without setup fee', () => {
      const result = calculateSetupFee(mockProductionMethod)
      expect(result).toBe(0)
    })

    it('should return correct setup fee when present', () => {
      const result = calculateSetupFee(mockProductionMethodWithSetup)
      expect(result).toBe(100)
    })

    it('should return 0 for null production method', () => {
      const result = calculateSetupFee(null)
      expect(result).toBe(0)
    })
  })

  describe('calculatePlatingCost', () => {
    it('should calculate plating cost for paid options', () => {
      const result = calculatePlatingCost(mockPlatingOption, 100)
      expect(result).toBe(60) // 0.60 * 100
    })

    it('should return 0 for free plating options', () => {
      const result = calculatePlatingCost(mockPlatingOptionFree, 100)
      expect(result).toBe(0)
    })

    it('should return 0 for null plating option', () => {
      const result = calculatePlatingCost(null, 100)
      expect(result).toBe(0)
    })
  })

  describe('calculateBackingCost', () => {
    it('should calculate backing cost for paid options', () => {
      const result = calculateBackingCost(mockBackingPaid, 100)
      expect(result).toBe(35) // 0.35 * 100
    })

    it('should return 0 for free backing options', () => {
      const result = calculateBackingCost(mockBackingFree, 100)
      expect(result).toBe(0)
    })

    it('should return 0 for null backing option', () => {
      const result = calculateBackingCost(null, 100)
      expect(result).toBe(0)
    })
  })

  describe('calculatePackagingCost', () => {
    it('should calculate packaging cost for paid options', () => {
      const result = calculatePackagingCost(mockPackagingPaid, 100)
      expect(result).toBe(125) // 1.25 * 100
    })

    it('should return 0 for free packaging options', () => {
      const result = calculatePackagingCost(mockPackagingFree, 100)
      expect(result).toBe(0)
    })

    it('should return 0 for null packaging option', () => {
      const result = calculatePackagingCost(null, 100)
      expect(result).toBe(0)
    })
  })

  describe('calculateAddOns', () => {
    it('should calculate total add-on costs', () => {
      const result = calculateAddOns(mockPlatingOption, mockBackingPaid, mockPackagingPaid, 100)
      expect(result).toBe(220) // 60 + 35 + 125
    })

    it('should handle null options gracefully', () => {
      const result = calculateAddOns(null, null, null, 100)
      expect(result).toBe(0)
    })
  })

  describe('calculateTotal', () => {
    it('should calculate total without rush order', () => {
      const result = calculateTotal(250, 50, 100, false)
      expect(result).toBe(400) // 250 + 50 + 100
    })

    it('should calculate total with rush order', () => {
      const result = calculateTotal(250, 50, 100, true)
      expect(result).toBe(480) // (250 + 50 + 100) * 1.20
    })
  })

  describe('calculatePriceBreakdown', () => {
    it('should calculate complete price breakdown', () => {
      const result = calculatePriceBreakdown(
        mockProductionMethodWithSetup,
        '1.00',
        100,
        mockPlatingOption,
        mockBackingPaid,
        mockPackagingPaid,
        false
      )

      expect(result.basePrice).toBe(200) // 2.00 * 100
      expect(result.setupFee).toBe(100)
      expect(result.moldFee).toBe(50) // 1.00" = $50
      expect(result.platingCost).toBe(60) // 0.60 * 100
      expect(result.backingCost).toBe(35) // 0.35 * 100
      expect(result.packagingCost).toBe(125) // 1.25 * 100
      expect(result.rushOrderMultiplier).toBe(0)
      expect(result.totalPrice).toBe(570) // sum of all
    })

    it('should calculate price breakdown with rush order', () => {
      const result = calculatePriceBreakdown(
        mockProductionMethod,
        '1.00',
        500, // valid quantity in test data
        null, // no plating
        null, // no backing
        null, // no packaging
        true  // rush order
      )

      expect(result.basePrice).toBe(750) // 1.5 * 500 from mockProductionMethod
      expect(result.setupFee).toBe(0)
      expect(result.moldFee).toBe(0) // mold fee waived for qty 500 (exemption starts at 500+)
      expect(result.platingCost).toBe(0)
      expect(result.backingCost).toBe(0)
      expect(result.packagingCost).toBe(0)
      expect(result.rushOrderMultiplier).toBe(0.20)
      expect(result.totalPrice).toBe(900) // (750 + 0) * 1.20 = 900
    })
  })
})