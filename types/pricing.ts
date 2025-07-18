export interface PricingMatrix {
  [size: string]: {
    [quantity: number]: number;
  };
}

export interface ProductionMethod {
  id: string;
  name: string;
  setupFee?: number;
  pricing: PricingMatrix;
}

export interface PlatingOption {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
}

export interface BackingOption {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
}

export interface PackagingOption {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
}

export interface OrderSelections {
  productionMethod: ProductionMethod;
  platingType: PlatingOption;
  size: string;
  quantity: number;
  backing: BackingOption;
  packaging: PackagingOption;
  rushOrder: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  setupFee: number;
  platingCost: number;
  backingCost: number;
  packagingCost: number;
  rushFee: number;
  moldFee: number;
  moldFeeWaived: boolean;
  total: number;
  unitPrice: number;
}

// Mold fee configuration and types
export interface MoldFeeThreshold {
  maxSize: number;
  fee: number;
}

export interface MoldFeeCalculationResult {
  fee: number;
  waived: boolean;
  reason?: string;
}

export const MOLD_FEE_CONFIG = {
  SIZE_THRESHOLDS: [
    { maxSize: 1.5, fee: 50.00 },
    { maxSize: 1.75, fee: 62.50 },
    { maxSize: 2.0, fee: 75.00 },
    { maxSize: Infinity, fee: 75.00 } // For sizes > 2.0"
  ] as const satisfies readonly MoldFeeThreshold[],
  QUANTITY_EXEMPTION_THRESHOLD: 500
} as const;

// Legacy type alias for backward compatibility during transition
export type PlatingType = ProductionMethod;