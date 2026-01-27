# Pin Pricer

Pricing calculator for custom lapel pins and challenge coins. Built with Nuxt 4 + TypeScript.

## What it does

Two calculators in one app:
- **Lapel pins** (`/`) — Die struck, soft enamel, hard enamel, silk screen, offset printed
- **Challenge coins** (`/coins`) — Color-based pricing (1-4 colors), multiple sizes, plating options

Handles size-based mold fees, bulk pricing tiers, plating upcharges, and packaging add-ons. Orders of 500+ get the mold fee waived.

## Key Features

- Real-time price calculations
- Custom quantity input (not just preset tiers)
- Multiple plating types (gold, silver, black nickel, antique finishes)
- Coin color options (1-4 colors with different pricing)
- Quantity interpolation for non-standard amounts
- Responsive design (mobile-first)
- Accessibility compliant (ARIA, keyboard nav)
- Quote generation and display

## Commands

```bash
bun run dev      # Development server
bun run build    # Production build
bun run preview  # Preview build
bun run test     # Run tests
```

## Tech Stack

- **Nuxt 4** with Vue 3 Composition API
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **Vitest** for testing

## Project Structure

```
app/
├── components/calculator/   # UI for both calculators
├── composables/             # usePricingCalculator, useCoinPricingCalculator
├── data/pricing.ts          # All pricing matrices
├── types/pricing.ts         # Types + mold fee config
└── utils/calculations.ts    # Pure calculation functions
```
