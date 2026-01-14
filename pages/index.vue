<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Skip Link for Screen Readers -->
    <a 
      href="#main-content" 
      class="skip-link"
      @click="focusMainContent"
    >
      Skip to main content
    </a>

    <!-- Main Application Header -->
    <header 
      class="glass border-b border-slate-700/60 sticky top-0 z-40 high-contrast:bg-slate-950 high-contrast:border-slate-300 backdrop-blur-xl accent-glow"
      role="banner"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 xs:h-18">
          <div class="flex items-center">
            <h1 class="text-lg xs:text-xl sm:text-2xl font-bold text-slate-50 high-contrast:text-white leading-tight">
              Pin Price Calculator
            </h1>
          </div>
          <div class="hidden sm:flex items-center space-x-4">
            <div class="text-sm text-slate-400 high-contrast:text-slate-300">
              Professional Pricing Tool
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main 
      id="main-content"
      class="flex-1"
      role="main"
      tabindex="-1"
    >
      <div class="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        <!-- Calculator Component -->
        <PricingCalculator />
      </div>
    </main>

    <!-- Footer -->
    <footer 
      class="bg-slate-800 border-t border-slate-700 mt-8 xs:mt-12 sm:mt-16 high-contrast:bg-slate-950 high-contrast:border-slate-300"
      role="contentinfo"
    >
      <div class="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6">
        <div class="text-center text-slate-400 text-sm high-contrast:text-slate-300">
          <p>&copy; {{ new Date().getFullYear() }} Pin Price Calculator</p>
          <p class="mt-1">Get accurate pricing for your custom pins and coins</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import PricingCalculator from '~/components/calculator/PricingCalculator.vue';

// Set page meta for SEO and accessibility
useHead({
  title: 'Pin Price Calculator',
  meta: [
    {
      name: 'description',
      content: 'Professional pricing calculator for custom lapel pins and challenge coins. Get instant quotes with detailed breakdowns for different plating types, sizes, and modifications.'
    },
    {
      name: 'keywords',
      content: 'lapel pin calculator, challenge coin pricing, custom pins, pricing tool, quote generator'
    }
  ]
});

// Ensure dark mode theme is applied consistently
useSeoMeta({
  title: 'Pin Price Calculator',
  ogTitle: 'Pin Price Calculator',
  description: 'Professional pricing calculator for custom lapel pins and challenge coins',
  ogDescription: 'Get instant quotes with detailed breakdowns for different plating types, sizes, and modifications',
  ogType: 'website'
});

// Focus management for skip link
const focusMainContent = () => {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
  }
};
</script>

<style scoped>
/* Ensure consistent dark mode theme across the entire interface */
.min-h-screen {
  background-color: #0f172a; /* slate-900 */
}

/* Smooth transitions for responsive design */
@media (max-width: 640px) {
  header h1 {
    font-size: 1.25rem; /* text-xl */
    line-height: 1.75rem;
  }
}

@media (min-width: 641px) {
  header h1 {
    font-size: 1.5rem; /* text-2xl */
    line-height: 2rem;
  }
}

/* Mobile-first responsive adjustments */
@media (max-width: 768px) {
  .max-w-7xl {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  main .py-6 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

/* Ensure proper contrast and accessibility */
header {
  background-color: #1e293b; /* slate-800 */
  border-bottom: 1px solid #475569; /* slate-600 */
}

footer {
  background-color: #1e293b; /* slate-800 */
  border-top: 1px solid #475569; /* slate-600 */
}

/* High contrast text for accessibility */
h1 {
  color: #f8fafc; /* slate-50 */
}

.text-slate-400 {
  color: #94a3b8; /* slate-400 */
}
</style>