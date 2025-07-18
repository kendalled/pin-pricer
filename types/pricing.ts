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
  total: number;
  unitPrice: number;
}

// Legacy type alias for backward compatibility during transition
export type PlatingType = ProductionMethod;