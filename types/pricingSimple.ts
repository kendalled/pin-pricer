// Essential interfaces only - no complex validation types
export interface ProductionMethod {
  id: string
  name: string
  pricing: Record<string, Record<number, number>>
  setupFee?: number
}

export interface PlatingOption {
  id: string
  name: string
  price: number
  isFree: boolean
}

export interface BackingOption {
  id: string
  name: string
  price: number
  isFree: boolean
}

export interface PackagingOption {
  id: string
  name: string
  price: number
  isFree: boolean
}

export interface PriceBreakdown {
  basePrice: number
  setupFee: number
  moldFee: number
  platingCost: number
  backingCost: number
  packagingCost: number
  rushOrderMultiplier: number
  totalPrice: number
}

export interface Quote {
  selections: {
    productionMethod: string
    size: string
    quantity: number
    plating?: string
    backing?: string
    packaging?: string
    rushOrder: boolean
  }
  pricing: PriceBreakdown
  unitPrice: number
  generatedAt: Date
}

// Mold fee configuration - copied exactly from existing system
export interface MoldFeeThreshold {
  maxSize: number
  fee: number
}

export interface MoldFeeCalculationResult {
  fee: number
  waived: boolean
  reason?: string
}

export const MOLD_FEE_CONFIG = {
  SIZE_THRESHOLDS: [
    { maxSize: 1.5, fee: 50.00 },
    { maxSize: 1.75, fee: 62.50 },
    { maxSize: 2.0, fee: 75.00 },
    { maxSize: Infinity, fee: 75.00 } // For sizes > 2.0"
  ] as const satisfies readonly MoldFeeThreshold[],
  QUANTITY_EXEMPTION_THRESHOLD: 500
} as const