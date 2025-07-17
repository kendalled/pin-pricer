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
├── calculator/     # Main pricing calculator components
├── ui/            # Reusable UI components
composables/       # Vue composables (pricing logic)
data/             # Static pricing matrices
types/            # TypeScript definitions
utils/            # Calculation utilities
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