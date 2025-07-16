/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      // Enhanced responsive breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Accessibility-focused breakpoints
        'mobile-landscape': {'raw': '(orientation: landscape) and (max-height: 640px)'},
        'print': {'raw': 'print'},
        'high-contrast': {'raw': '(prefers-contrast: high)'},
        'reduced-motion': {'raw': '(prefers-reduced-motion: reduce)'},
      },
      // Enhanced color palette for better contrast
      colors: {
        slate: {
          850: '#1a202c',
          950: '#0d1117',
        },
        blue: {
          450: '#4f8ff7',
          550: '#2563eb',
        }
      },
      // Improved spacing scale for better touch targets
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Enhanced font sizes for better readability
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.6' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
      },
      // Enhanced transitions for smooth interactions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      // Better focus ring styles
      ringWidth: {
        '3': '3px',
      },
      // Enhanced shadows for better depth perception
      boxShadow: {
        'focus': '0 0 0 3px rgba(59, 130, 246, 0.5)',
        'focus-inset': 'inset 0 0 0 2px rgba(59, 130, 246, 0.5)',
      },
      // Improved border radius for better touch targets
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}