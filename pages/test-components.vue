<template>
  <div class="min-h-screen bg-slate-900 text-slate-50 p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <h1 class="text-3xl font-bold mb-8">UI Components Test</h1>
      
      <!-- Button Tests -->
      <UiCard>
        <template #header>
          <h2 class="text-xl font-semibold">Button Component</h2>
        </template>
        
        <div class="space-y-4">
          <div class="space-x-4">
            <h3 class="text-lg font-medium mb-2">Primary Buttons</h3>
            <UiButton variant="primary" size="sm">Small Primary</UiButton>
            <UiButton variant="primary" size="md">Medium Primary</UiButton>
            <UiButton variant="primary" size="lg">Large Primary</UiButton>
            <UiButton variant="primary" disabled>Disabled Primary</UiButton>
          </div>
          
          <div class="space-x-4">
            <h3 class="text-lg font-medium mb-2">Secondary Buttons</h3>
            <UiButton variant="secondary" size="sm">Small Secondary</UiButton>
            <UiButton variant="secondary" size="md">Medium Secondary</UiButton>
            <UiButton variant="secondary" size="lg">Large Secondary</UiButton>
            <UiButton variant="secondary" disabled>Disabled Secondary</UiButton>
          </div>
          
          <div class="space-x-4">
            <h3 class="text-lg font-medium mb-2">Ghost Buttons</h3>
            <UiButton variant="ghost" size="sm">Small Ghost</UiButton>
            <UiButton variant="ghost" size="md">Medium Ghost</UiButton>
            <UiButton variant="ghost" size="lg">Large Ghost</UiButton>
            <UiButton variant="ghost" disabled>Disabled Ghost</UiButton>
          </div>
        </div>
      </UiCard>
      
      <!-- Card Tests -->
      <UiCard variant="elevated">
        <template #header>
          <h2 class="text-xl font-semibold">Card Component</h2>
        </template>
        
        <div class="space-y-4">
          <p>This is a card with elevated variant and header/footer slots.</p>
          
          <UiCard variant="default" padding="sm">
            <p>Small padding card</p>
          </UiCard>
          
          <UiCard variant="default" padding="lg">
            <p>Large padding card</p>
          </UiCard>
        </div>
        
        <template #footer>
          <p class="text-sm text-slate-400">Card footer content</p>
        </template>
      </UiCard>
      
      <!-- Badge Tests -->
      <UiCard>
        <template #header>
          <h2 class="text-xl font-semibold">Badge Component</h2>
        </template>
        
        <div class="space-y-4">
          <div class="space-x-2">
            <h3 class="text-lg font-medium mb-2">Default Badges</h3>
            <UiBadge size="sm">Small</UiBadge>
            <UiBadge size="md">Medium</UiBadge>
            <UiBadge size="lg">Large</UiBadge>
          </div>
          
          <div class="space-x-2">
            <h3 class="text-lg font-medium mb-2">Variant Badges</h3>
            <UiBadge variant="default">Default</UiBadge>
            <UiBadge variant="success">Success</UiBadge>
            <UiBadge variant="warning">Warning</UiBadge>
            <UiBadge variant="info">Info</UiBadge>
            <UiBadge variant="error">Error</UiBadge>
          </div>
        </div>
      </UiCard>
      
      <!-- PlatingTypeSelector Tests -->
      <UiCard>
        <template #header>
          <h2 class="text-xl font-semibold">Plating Type Selector Component</h2>
        </template>
        
        <div class="space-y-4">
          <p class="text-slate-300">Selected: {{ selectedPlatingType?.name || 'None' }}</p>
          <PlatingTypeSelector 
            :selected-type="selectedPlatingType"
            @update:selected-type="selectedPlatingType = $event"
          />
        </div>
      </UiCard>
      
      <!-- PricingTable Tests -->
      <UiCard>
        <template #header>
          <h2 class="text-xl font-semibold">Pricing Table Component</h2>
        </template>
        
        <div class="space-y-4">
          <div v-if="selectedPlatingType">
            <p class="text-slate-300 mb-4">
              Showing pricing for: {{ selectedPlatingType.name }}
              <span v-if="selectedSize && selectedQuantity" class="ml-4">
                | Selected: {{ selectedSize }}" × {{ selectedQuantity }}
              </span>
            </p>
            <CalculatorPricingTable
              :plating-type="selectedPlatingType"
              :selected-size="selectedSize"
              :selected-quantity="selectedQuantity"
              @selection-change="handlePricingSelection"
            />
          </div>
          <div v-else class="text-slate-400 italic">
            Please select a plating type above to see the pricing table.
          </div>
        </div>
      </UiCard>
      
      <!-- ModificationsPanel Tests -->
      <UiCard>
        <template #header>
          <h2 class="text-xl font-semibold">Modifications Panel Component</h2>
        </template>
        
        <div class="space-y-4">
          <div class="text-slate-300 mb-4">
            <p>Selected Backing: {{ selectedBacking?.name || 'None' }}</p>
            <p>Selected Packaging: {{ selectedPackaging?.name || 'None' }}</p>
            <p>Rush Order: {{ rushOrder ? 'Yes' : 'No' }}</p>
          </div>
          <CalculatorModificationsPanel
            :selected-backing="selectedBacking"
            :selected-packaging="selectedPackaging"
            :rush-order="rushOrder"
            @backing-change="selectedBacking = $event"
            @packaging-change="selectedPackaging = $event"
            @rush-toggle="rushOrder = $event"
          />
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlatingType, BackingOption, PackagingOption } from '~/types/pricing';

// Test page for UI components
const selectedPlatingType = ref<PlatingType | null>(null);
const selectedSize = ref<string | null>(null);
const selectedQuantity = ref<number | null>(null);
const selectedBacking = ref<BackingOption | null>(null);
const selectedPackaging = ref<PackagingOption | null>(null);
const rushOrder = ref(false);

const handlePricingSelection = (size: string, quantity: number) => {
  selectedSize.value = size;
  selectedQuantity.value = quantity;
};
</script>