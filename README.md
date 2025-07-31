# Pin Pricer

A pricing calculator for custom lapel pins and challenge coins. Built with Nuxt 3 + TypeScript.

## What it does

Calculates real-time pricing for different pin types (die struck, soft enamel, etc.) based on size, quantity, backing options, and add-ons. Handles complex pricing matrices with setup fees and bulk discounts.

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Run tests
bun run test
```

## Tech Stack

- **Nuxt 3** with Vue 3 Composition API
- **TypeScript** for type safety
- **TailwindCSS** for styling with accessibility features
- **Vitest** for testing
- **Heroicons** for UI icons

## Project Structure

```
components/
├── calculator/               # Original pricing calculator components
├── ui/                      # Reusable UI components  
├── PricingCalculatorSimple.vue  # Simplified single-component calculator
composables/                 # Vue composables (pricing logic)
data/                       # Static pricing matrices
types/
├── pricing.ts              # Original type definitions
├── pricingSimple.ts        # Simplified type definitions
utils/
├── calculations.ts         # Original calculation utilities (667 lines)
├── calculationsSimple.ts   # Simplified calculation utilities (~200 lines)
```

## Architecture Notes

The project includes both the original complex system and a new simplified system:

- **Original System**: 6+ components + 353-line composable + 667-line utils (~1000+ lines)
- **Simplified System**: 1 component + ~200-line utils (~600 lines total)

The simplified system maintains 100% functionality while reducing code complexity by ~60%. Both systems are available via feature flag in `pages/index.vue`.

## Key Features

- Real-time price calculations
- Responsive design (mobile-first)
- Accessibility compliant (ARIA, keyboard nav)
- Multiple plating types and configurations
- Quote generation and display

## Commands

```bash
bun run dev      # Development server
bun run build    # Production build
bun run preview  # Preview build
bun run test     # Run tests
```