# Pin Pricer

A pricing calculator for custom lapel pins and challenge coins. Built with Nuxt 4 + TypeScript.

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

- **Nuxt 4** with Vue 3 Composition API
- **TypeScript** for type safety
- **TailwindCSS v4** for styling with accessibility features
- **Vitest** for testing
- **Heroicons** for UI icons

## Project Structure

```
app/
├── components/
│   ├── calculator/          # Pricing calculator components
│   ├── ui/                  # Reusable UI components
├── composables/             # Vue composables (pricing logic)
├── data/                    # Static pricing matrices
├── types/
│   ├── pricing.ts           # Type definitions
├── utils/
│   ├── calculations.ts      # Calculation utilities
```

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
