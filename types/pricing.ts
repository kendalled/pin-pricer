export interface PricingMatrix {
  [size: string]: {
    [quantity: number]: number;
  };
}

export interface PlatingType {
  id: string;
  name: string;
  setupFee?: number;
  pricing: PricingMatrix;
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
  platingType: PlatingType;
  size: string;
  quantity: number;
  backing: BackingOption;
  packaging: PackagingOption;
  rushOrder: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  setupFee: number;
  backingCost: number;
  packagingCost: number;
  rushFee: number;
  total: number;
  unitPrice: number;
}