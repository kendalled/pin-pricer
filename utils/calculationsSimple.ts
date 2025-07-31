import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption, PriceBreakdown, MoldFeeCalculationResult } from '~/types/pricingSimple'
import { MOLD_FEE_CONFIG } from '~/types/pricingSimple'

/**
 * CRITICAL: Parse pin size string to numeric value - copied exactly from existing system
 */
export function parsePinSize(sizeString: string): number {
  if (!sizeString || typeof sizeString !== 'string') {
    throw new Error('Invalid size string provided')
  }
  
  // Check if string is empty after trimming
  const trimmed = sizeString.trim()
  if (!trimmed) {
    throw new Error('Invalid size string provided')
  }
  
  // Check if the string contains any non-numeric characters (except . and -)
  // This should reject strings like "size1.5" which contain letters
  if (!/^-?\d*\.?\d+$/.test(trimmed)) {
    throw new Error(`Invalid size format: ${sizeString}`)
  }
  
  const sizeNumber = parseFloat(trimmed)
  
  if (isNaN(sizeNumber) || !isFinite(sizeNumber) || sizeNumber <= 0) {
    throw new Error(`Invalid size format: ${sizeString}`)
  }

  if (sizeNumber < 0.1 || sizeNumber > 10) {
    throw new Error(`Size out of reasonable range: ${sizeNumber}"`)
  }

  return sizeNumber
}

/**
 * CRITICAL: Get mold fee for a given size - copied exactly from existing system
 */
export function getMoldFeeForSize(sizeInches: number): number {
  if (typeof sizeInches !== 'number' || isNaN(sizeInches) || !isFinite(sizeInches) || sizeInches <= 0) {
    throw new Error(`Invalid size for mold fee lookup: ${sizeInches}`)
  }

  // Find the appropriate fee threshold
  for (const threshold of MOLD_FEE_CONFIG.SIZE_THRESHOLDS) {
    if (sizeInches <= threshold.maxSize) {
      return threshold.fee
    }
  }

  // Fallback - should not reach here due to Infinity threshold
  return MOLD_FEE_CONFIG.SIZE_THRESHOLDS[MOLD_FEE_CONFIG.SIZE_THRESHOLDS.length - 1].fee
}

/**
 * CRITICAL: Calculate mold fee with quantity exemption logic - copied exactly from existing system
 * This is the most complex business logic and must be preserved exactly
 */
export function calculateMoldFee(size: string, quantity: number): MoldFeeCalculationResult {
  try {
    // Validate inputs
    if (!size || typeof size !== 'string') {
      throw new Error('Invalid size provided for mold fee calculation')
    }
    
    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('Invalid quantity provided for mold fee calculation')
    }

    // Check quantity exemption first (500+ pieces get waived fee)
    if (quantity > MOLD_FEE_CONFIG.QUANTITY_EXEMPTION_THRESHOLD) {
      return {
        fee: 0,
        waived: true,
        reason: 'High volume exemption (500+ qty)'
      }
    }

    // Parse size and get fee
    const sizeInches = parsePinSize(size)
    const fee = getMoldFeeForSize(sizeInches)

    // Validate calculated fee
    if (typeof fee !== 'number' || isNaN(fee) || fee < 0) {
      throw new Error(`Invalid calculated mold fee: ${fee}`)
    }

    return {
      fee,
      waived: false
    }
  } catch (error) {
    console.error('Error calculating mold fee:', error)
    // Return safe fallback values
    return {
      fee: 0,
      waived: false,
      reason: 'Error calculating mold fee'
    }
  }
}

// Simplified calculations (replace verbose functions)
export const calculateBasePrice = (method: ProductionMethod | null, size: string, quantity: number): number => {
  if (!method?.pricing?.[size]?.[quantity]) return 0
  return method.pricing[size][quantity] * quantity
}

export const calculateSetupFee = (method: ProductionMethod | null): number => {
  return method?.setupFee || 0
}

export const calculatePlatingCost = (plating: PlatingOption | null, quantity: number): number => {
  return plating && !plating.isFree ? plating.price * quantity : 0
}

export const calculateBackingCost = (backing: BackingOption | null, quantity: number): number => {
  return backing && !backing.isFree ? backing.price * quantity : 0
}

export const calculatePackagingCost = (packaging: PackagingOption | null, quantity: number): number => {
  return packaging && !packaging.isFree ? packaging.price * quantity : 0
}

export const calculateAddOns = (
  plating: PlatingOption | null,
  backing: BackingOption | null,
  packaging: PackagingOption | null,
  quantity: number
): number => {
  return calculatePlatingCost(plating, quantity) +
         calculateBackingCost(backing, quantity) +
         calculatePackagingCost(packaging, quantity)
}

export const calculateRushOrderCost = (subtotal: number, isRushOrder: boolean): number => {
  return isRushOrder ? subtotal * 0.25 : 0
}

export const calculateTotal = (
  basePrice: number,
  moldFee: number,
  addOnCosts: number,
  isRushOrder: boolean
): number => {
  const subtotal = basePrice + moldFee + addOnCosts
  const rushCost = calculateRushOrderCost(subtotal, isRushOrder)
  return subtotal + rushCost
}

export const calculatePriceBreakdown = (
  method: ProductionMethod | null,
  size: string,
  quantity: number,
  plating: PlatingOption | null,
  backing: BackingOption | null,
  packaging: PackagingOption | null,
  isRushOrder: boolean
): PriceBreakdown => {
  const basePrice = calculateBasePrice(method, size, quantity)
  const setupFee = calculateSetupFee(method)
  
  // Calculate mold fee with error handling to maintain existing functionality
  let moldFee = 0
  try {
    const moldFeeResult = calculateMoldFee(size, quantity)
    moldFee = moldFeeResult.fee
  } catch (error) {
    console.error('Error calculating mold fee, continuing with $0 fee:', error)
    moldFee = 0
  }
  
  const platingCost = calculatePlatingCost(plating, quantity)
  const backingCost = calculateBackingCost(backing, quantity)
  const packagingCost = calculatePackagingCost(packaging, quantity)
  
  const subtotal = basePrice + setupFee + moldFee + platingCost + backingCost + packagingCost
  const rushOrderMultiplier = isRushOrder ? 0.25 : 0
  const totalPrice = subtotal + (subtotal * rushOrderMultiplier)
  
  return {
    basePrice,
    setupFee,
    moldFee,
    platingCost,
    backingCost,
    packagingCost,
    rushOrderMultiplier,
    totalPrice
  }
}