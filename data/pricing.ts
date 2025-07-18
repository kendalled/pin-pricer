import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption } from '~/types/pricing';

export const PRODUCTION_METHODS: ProductionMethod[] = [
  {
    id: 'die-struck',
    name: 'Die Struck',
    pricing: {
      '0.75': { 100: 2.54, 200: 2.00, 300: 1.46, 500: 1.22, 750: 1.11, 1000: 1.06, 2000: 0.95 },
      '1.00': { 100: 2.61, 200: 2.08, 300: 1.54, 500: 1.26, 750: 1.16, 1000: 1.09, 2000: 0.97 },
      '1.25': { 100: 2.68, 200: 2.15, 300: 1.61, 500: 1.31, 750: 1.20, 1000: 1.13, 2000: 1.00 },
      '1.50': { 100: 2.75, 200: 2.22, 300: 1.68, 500: 1.36, 750: 1.25, 1000: 1.17, 2000: 1.03 },
      '1.75': { 100: 2.82, 200: 2.29, 300: 1.75, 500: 1.41, 750: 1.30, 1000: 1.21, 2000: 1.06 },
      '2.00': { 100: 2.89, 200: 2.36, 300: 1.82, 500: 1.46, 750: 1.35, 1000: 1.25, 2000: 1.09 }
    }
  },
  {
    id: 'soft-enamel',
    name: 'Soft Enamel',
    pricing: {
      '0.75': { 100: 2.84, 200: 2.30, 300: 1.76, 500: 1.52, 750: 1.41, 1000: 1.36, 2000: 1.25 },
      '1.00': { 100: 2.91, 200: 2.38, 300: 1.84, 500: 1.56, 750: 1.46, 1000: 1.39, 2000: 1.27 },
      '1.25': { 100: 2.98, 200: 2.45, 300: 1.91, 500: 1.61, 750: 1.50, 1000: 1.43, 2000: 1.30 },
      '1.50': { 100: 3.05, 200: 2.52, 300: 1.98, 500: 1.66, 750: 1.55, 1000: 1.47, 2000: 1.33 },
      '1.75': { 100: 3.12, 200: 2.59, 300: 2.05, 500: 1.71, 750: 1.60, 1000: 1.51, 2000: 1.36 },
      '2.00': { 100: 3.19, 200: 2.66, 300: 2.12, 500: 1.76, 750: 1.65, 1000: 1.55, 2000: 1.39 }
    }
  },
  {
    id: 'silk-screen',
    name: 'Silk Screen',
    pricing: {
      '0.75': { 100: 2.64, 200: 2.10, 300: 1.56, 500: 1.32, 750: 1.21, 1000: 1.16, 2000: 1.05 },
      '1.00': { 100: 2.71, 200: 2.18, 300: 1.64, 500: 1.36, 750: 1.26, 1000: 1.19, 2000: 1.07 },
      '1.25': { 100: 2.78, 200: 2.25, 300: 1.71, 500: 1.41, 750: 1.30, 1000: 1.23, 2000: 1.10 },
      '1.50': { 100: 2.85, 200: 2.32, 300: 1.78, 500: 1.46, 750: 1.35, 1000: 1.27, 2000: 1.13 },
      '1.75': { 100: 2.92, 200: 2.39, 300: 1.85, 500: 1.51, 750: 1.40, 1000: 1.31, 2000: 1.16 },
      '2.00': { 100: 2.99, 200: 2.46, 300: 1.92, 500: 1.56, 750: 1.45, 1000: 1.35, 2000: 1.19 }
    }
  },
  {
    id: 'hard-enamel',
    name: 'Hard Enamel',
    pricing: {
      '0.75': { 100: 3.14, 200: 2.60, 300: 2.06, 500: 1.82, 750: 1.71, 1000: 1.66, 2000: 1.55 },
      '1.00': { 100: 3.21, 200: 2.68, 300: 2.14, 500: 1.86, 750: 1.76, 1000: 1.69, 2000: 1.57 },
      '1.25': { 100: 3.28, 200: 2.75, 300: 2.21, 500: 1.91, 750: 1.80, 1000: 1.73, 2000: 1.60 },
      '1.50': { 100: 3.35, 200: 2.82, 300: 2.28, 500: 1.96, 750: 1.85, 1000: 1.77, 2000: 1.63 },
      '1.75': { 100: 3.42, 200: 2.89, 300: 2.35, 500: 2.01, 750: 1.90, 1000: 1.81, 2000: 1.66 },
      '2.00': { 100: 3.49, 200: 2.96, 300: 2.42, 500: 2.06, 750: 1.95, 1000: 1.85, 2000: 1.69 }
    }
  },
  {
    id: 'offset-printed',
    name: 'Offset Printed',
    setupFee: 100,
    pricing: {
      '0.75': { 100: 2.44, 200: 1.90, 300: 1.36, 500: 1.12, 750: 1.01, 1000: 0.96, 2000: 0.85 },
      '1.00': { 100: 2.51, 200: 1.98, 300: 1.44, 500: 1.16, 750: 1.06, 1000: 0.99, 2000: 0.87 },
      '1.25': { 100: 2.58, 200: 2.05, 300: 1.51, 500: 1.21, 750: 1.10, 1000: 1.03, 2000: 0.90 },
      '1.50': { 100: 2.65, 200: 2.12, 300: 1.58, 500: 1.26, 750: 1.15, 1000: 1.07, 2000: 0.93 },
      '1.75': { 100: 2.72, 200: 2.19, 300: 1.65, 500: 1.31, 750: 1.20, 1000: 1.11, 2000: 0.96 },
      '2.00': { 100: 2.79, 200: 2.26, 300: 1.72, 500: 1.36, 750: 1.25, 1000: 1.15, 2000: 0.99 }
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