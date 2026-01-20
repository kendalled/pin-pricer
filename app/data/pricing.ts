import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption } from '~/types/pricing';

export const PRODUCTION_METHODS: ProductionMethod[] = [
  {
    id: 'die-struck',
    name: 'Die Struck',
    pricing: {
      '0.75': { 100: 2.54, 200: 2.00, 300: 1.46, 500: 1.22, 750: 1.11, 1000: 1.06, 2000: 0.95 },
      '1.00': { 100: 2.61, 200: 2.08, 300: 1.54, 500: 1.26, 750: 1.16, 1000: 1.09, 2000: 0.97 },
      '1.25': { 100: 2.68, 200: 2.22, 300: 1.65, 500: 1.32, 750: 1.20, 1000: 1.12, 2000: 1.03 },
      '1.50': { 100: 2.85, 200: 2.42, 300: 1.94, 500: 1.43, 750: 1.30, 1000: 1.23, 2000: 1.10 },
      '1.75': { 100: 3.17, 200: 2.67, 300: 2.19, 500: 1.70, 750: 1.56, 1000: 1.50, 2000: 1.40 },
      '2.00': { 100: 3.37, 200: 2.88, 300: 2.39, 500: 1.89, 750: 1.76, 1000: 1.68, 2000: 1.58 }
    }
  },
  {
    id: 'soft-enamel',
    name: 'Soft Enamel',
    pricing: {
      '0.75': { 100: 2.55, 200: 2.01, 300: 1.47, 500: 1.23, 750: 1.12, 1000: 1.07, 2000: 0.96 },
      '1.00': { 100: 2.62, 200: 2.09, 300: 1.55, 500: 1.27, 750: 1.17, 1000: 1.10, 2000: 0.98 },
      '1.25': { 100: 2.69, 200: 2.23, 300: 1.66, 500: 1.33, 750: 1.21, 1000: 1.13, 2000: 1.04 },
      '1.50': { 100: 2.86, 200: 2.43, 300: 1.95, 500: 1.44, 750: 1.31, 1000: 1.24, 2000: 1.11 },
      '1.75': { 100: 3.18, 200: 2.68, 300: 2.20, 500: 1.71, 750: 1.57, 1000: 1.51, 2000: 1.41 },
      '2.00': { 100: 3.38, 200: 2.89, 300: 2.40, 500: 1.90, 750: 1.77, 1000: 1.69, 2000: 1.59 }
    }
  },
  {
    id: 'silk-screen',
    name: 'Silk Screen',
    pricing: {
      '0.75': { 100: 2.53, 200: 1.99, 300: 1.44, 500: 1.21, 750: 1.08, 1000: 1.02, 2000: 0.91 },
      '1.00': { 100: 2.55, 200: 2.05, 300: 1.52, 500: 1.25, 750: 1.11, 1000: 1.06, 2000: 0.95 },
      '1.25': { 100: 2.62, 200: 2.18, 300: 1.63, 500: 1.31, 750: 1.16, 1000: 1.08, 2000: 0.99 },
      '1.50': { 100: 2.78, 200: 2.34, 300: 1.90, 500: 1.41, 750: 1.24, 1000: 1.18, 2000: 1.05 },
      '1.75': { 100: 3.16, 200: 2.64, 300: 2.15, 500: 1.69, 750: 1.51, 1000: 1.44, 2000: 1.39 },
      '2.00': { 100: 3.31, 200: 2.79, 300: 2.30, 500: 1.83, 750: 1.70, 1000: 1.64, 2000: 1.51 }
    }
  },
  {
    id: 'hard-enamel',
    name: 'Hard Enamel',
    pricing: {
      '0.75': { 100: 2.66, 200: 2.11, 300: 1.55, 500: 1.28, 750: 1.19, 1000: 1.11, 2000: 1.04 },
      '1.00': { 100: 2.69, 200: 2.17, 300: 1.66, 500: 1.36, 750: 1.23, 1000: 1.19, 2000: 1.14 },
      '1.25': { 100: 2.80, 200: 2.26, 300: 1.75, 500: 1.43, 750: 1.30, 1000: 1.23, 2000: 1.19 },
      '1.50': { 100: 3.05, 200: 2.53, 300: 2.00, 500: 1.53, 750: 1.43, 1000: 1.38, 2000: 1.30 },
      '1.75': { 100: 3.30, 200: 2.73, 300: 2.33, 500: 1.83, 750: 1.73, 1000: 1.65, 2000: 1.59 },
      '2.00': { 100: 3.57, 200: 3.07, 300: 2.58, 500: 2.09, 750: 1.99, 1000: 1.91, 2000: 1.85 }
    }
  },
  {
    id: 'offset-printed',
    name: 'Offset Printed',
    setupFee: 100,
    pricing: {
      '0.75': { 100: 2.54, 200: 2.00, 300: 1.46, 500: 1.22, 750: 1.11, 1000: 1.06, 2000: 0.95 },
      '1.00': { 100: 2.61, 200: 2.08, 300: 1.54, 500: 1.26, 750: 1.16, 1000: 1.09, 2000: 0.97 },
      '1.25': { 100: 2.68, 200: 2.22, 300: 1.65, 500: 1.32, 750: 1.20, 1000: 1.12, 2000: 1.03 },
      '1.50': { 100: 2.85, 200: 2.42, 300: 1.94, 500: 1.43, 750: 1.30, 1000: 1.23, 2000: 1.10 },
      '1.75': { 100: 3.17, 200: 2.67, 300: 2.19, 500: 1.70, 750: 1.56, 1000: 1.50, 2000: 1.40 },
      '2.00': { 100: 3.37, 200: 2.88, 300: 2.39, 500: 1.89, 750: 1.76, 1000: 1.68, 2000: 1.58 }
    }
  }
];

export const BACKING_OPTIONS: BackingOption[] = [
  { id: 'butterfly', name: 'Butterfly Clutch', price: 0.00, isFree: true },
  { id: 'rubber', name: 'Rubber Clutch', price: 0.00, isFree: true },
  { id: 'double-butterfly', name: 'Double Butterfly', price: 0.20, isFree: false },
  { id: 'double-rubber', name: 'Double Rubber', price: 0.20, isFree: false },
  { id: 'military', name: 'Military Clutch', price: 0.25, isFree: false },
  { id: 'safety-pin', name: 'Safety Pin', price: 0.15, isFree: false },
  { id: 'magnetic', name: 'Magnetic', price: 0.35, isFree: false },
  { id: 'tie-tack', name: 'Tie Tack', price: 0.30, isFree: false },
  { id: 'deluxe', name: 'Deluxe Clutch', price: 0.40, isFree: false }
];

export const PLATING_OPTIONS: PlatingOption[] = [
  { id: 'polished-gold', name: 'Polished Gold', price: 0.00, isFree: true },
  { id: 'polished-silver', name: 'Polished Silver', price: 0.00, isFree: true },
  { id: 'polished-copper', name: 'Polished Copper', price: 0.00, isFree: true },
  { id: 'polished-nickel', name: 'Polished Nickel', price: 0.00, isFree: true },
  { id: 'black-metal', name: 'Black Metal', price: 0.00, isFree: true },
  { id: 'antique-gold', name: 'Antique Gold', price: 0.60, isFree: false },
  { id: 'antique-silver', name: 'Antique Silver', price: 0.35, isFree: false },
  { id: 'antique-copper', name: 'Antique Copper', price: 0.30, isFree: false },
  { id: 'dual-plated', name: 'Dual Plated', price: 0.70, isFree: false },
  { id: 'color-coated', name: 'Color Coated', price: 0.00, isFree: true }
];

export const PACKAGING_OPTIONS: PackagingOption[] = [
  { id: 'poly-bag', name: 'Poly Bag', price: 0.00, isFree: true },
  { id: 'acrylic-case', name: 'Acrylic Case', price: 1.00, isFree: false },
  { id: 'velvet-bag', name: 'Velvet Bag', price: 0.60, isFree: false },
  { id: 'velvet-case', name: 'Velvet Case', price: 4.00, isFree: false }
];

// Size and quantity arrays for easy iteration
export const SIZES = ['0.75', '1.00', '1.25', '1.50', '1.75', '2.00'];
export const QUANTITIES = [100, 200, 300, 500, 750, 1000, 2000];

// Legacy export for backward compatibility during transition
export const PLATING_TYPES = PRODUCTION_METHODS;