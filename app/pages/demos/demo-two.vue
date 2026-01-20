<template>
  <div class="demo-two min-h-screen bg-stone-50 text-stone-800">
    <!-- Subtle Texture Overlay -->
    <div class="fixed inset-0 paper-texture pointer-events-none opacity-40" />

    <!-- Header -->
    <header class="relative bg-white/80 backdrop-blur-sm border-b border-stone-200/60">
      <div class="max-w-6xl mx-auto px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="w-12 h-12 rounded-full border-2 border-amber-600/30 flex items-center justify-center">
              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700" />
            </div>
            <div>
              <h1 class="font-serif text-2xl tracking-wide text-stone-900">Artisan Pins</h1>
              <p class="text-xs tracking-[0.25em] text-stone-500 uppercase mt-0.5">Bespoke Pricing</p>
            </div>
          </div>
          <nav class="hidden md:flex items-center gap-8 text-sm">
            <a href="#" class="text-stone-500 hover:text-amber-700 transition-colors">Collections</a>
            <a href="#" class="text-stone-500 hover:text-amber-700 transition-colors">Process</a>
            <a href="#" class="text-stone-500 hover:text-amber-700 transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative max-w-6xl mx-auto px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h2 class="font-serif text-4xl md:text-5xl text-stone-900 mb-4">Configure Your Pin</h2>
        <p class="text-stone-500 max-w-xl mx-auto leading-relaxed">
          Craft your perfect pin with our intuitive configurator. Each selection brings you closer to a piece that's uniquely yours.
        </p>
      </div>

      <div class="grid lg:grid-cols-[1fr_420px] gap-16">
        <!-- Left Column: Configuration Steps -->
        <div class="space-y-12">

          <!-- Step 1: Production Method -->
          <section class="config-section">
            <div class="section-header">
              <div class="step-indicator">
                <span class="step-number">1</span>
                <div v-if="state.selectedProductionMethod" class="step-check">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="font-serif text-xl text-stone-900">Production Method</h3>
                <p class="text-sm text-stone-500 mt-1">Select the craftsmanship technique for your pin</p>
              </div>
            </div>
            <div class="section-content">
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="method in getAvailableProductionMethods()"
                  :key="method.id"
                  @click="setProductionMethod(method)"
                  :class="[
                    'method-card',
                    state.selectedProductionMethod?.id === method.id && 'selected'
                  ]"
                >
                  <span class="method-name">{{ method.name }}</span>
                  <span v-if="method.setupFee" class="method-addon">+${{ method.setupFee }} setup</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Step 2: Size & Quantity -->
          <section v-if="state.selectedProductionMethod" class="config-section animate-fade-up">
            <div class="section-header">
              <div class="step-indicator">
                <span class="step-number">2</span>
                <div v-if="state.selectedSize && state.selectedQuantity" class="step-check">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="font-serif text-xl text-stone-900">Size & Quantity</h3>
                <p class="text-sm text-stone-500 mt-1">Choose dimensions and order volume</p>
              </div>
            </div>
            <div class="section-content space-y-8">
              <!-- Size Selection -->
              <div>
                <label class="text-xs tracking-wider text-stone-500 uppercase mb-3 block">Diameter</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in getAvailableSizes"
                    :key="size"
                    @click="selectSize(size)"
                    :class="[
                      'size-pill',
                      state.selectedSize === size && 'selected'
                    ]"
                  >
                    {{ size }}<span class="text-stone-400">"</span>
                  </button>
                </div>
              </div>

              <!-- Quantity Selection -->
              <div v-if="state.selectedSize">
                <label class="text-xs tracking-wider text-stone-500 uppercase mb-3 block">Quantity</label>
                <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
                  <button
                    v-for="qty in standardQuantities"
                    :key="qty"
                    @click="setSizeAndQuantity(state.selectedSize!, qty)"
                    :class="[
                      'qty-pill',
                      state.selectedQuantity === qty && 'selected'
                    ]"
                  >
                    {{ qty >= 1000 ? `${qty/1000}k` : qty }}
                  </button>
                </div>

                <!-- Custom Quantity -->
                <div class="mt-4 flex items-center gap-4">
                  <span class="text-sm text-stone-500">or enter custom:</span>
                  <div class="relative">
                    <input
                      v-model="customQtyInput"
                      type="text"
                      inputmode="numeric"
                      placeholder="e.g. 350"
                      @keydown.enter="applyCustomQty"
                      @blur="applyCustomQty"
                      class="custom-input"
                    />
                    <button
                      v-if="customQtyInput"
                      @click="applyCustomQty"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-700"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p v-if="isCustomQuantitySelected" class="mt-3 text-sm text-amber-700 italic">
                  Custom quantity of {{ state.selectedQuantity?.toLocaleString() }} units with interpolated pricing
                </p>
              </div>
            </div>
          </section>

          <!-- Step 3: Plating -->
          <section v-if="state.selectedSize && state.selectedQuantity" class="config-section animate-fade-up">
            <div class="section-header">
              <div class="step-indicator">
                <span class="step-number">3</span>
                <div v-if="state.selectedPlatingType" class="step-check">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="font-serif text-xl text-stone-900">Finish</h3>
                <p class="text-sm text-stone-500 mt-1">Select your preferred plating</p>
              </div>
            </div>
            <div class="section-content">
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  v-for="plating in getAvailablePlatingOptions()"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :class="[
                    'plating-card',
                    state.selectedPlatingType?.id === plating.id && 'selected'
                  ]"
                >
                  <div class="plating-swatch" :class="getPlatingClass(plating.id)" />
                  <span class="plating-name">{{ plating.name }}</span>
                  <span class="plating-price">
                    {{ plating.isFree ? 'Included' : `+$${plating.price.toFixed(2)}` }}
                  </span>
                </button>
              </div>
            </div>
          </section>

          <!-- Step 4: Details -->
          <section v-if="state.selectedPlatingType" class="config-section animate-fade-up">
            <div class="section-header">
              <div class="step-indicator">
                <span class="step-number">4</span>
                <div v-if="state.selectedBacking && state.selectedPackaging" class="step-check">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="font-serif text-xl text-stone-900">Final Details</h3>
                <p class="text-sm text-stone-500 mt-1">Complete your configuration</p>
              </div>
            </div>
            <div class="section-content space-y-8">
              <!-- Backing -->
              <div>
                <label class="text-xs tracking-wider text-stone-500 uppercase mb-3 block">Backing</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    v-for="backing in getAvailableBackingOptions()"
                    :key="backing.id"
                    @click="setBacking(backing)"
                    :class="[
                      'option-card',
                      state.selectedBacking?.id === backing.id && 'selected'
                    ]"
                  >
                    <span class="option-name">{{ backing.name }}</span>
                    <span class="option-price">
                      {{ backing.isFree ? 'Included' : `+$${backing.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Packaging -->
              <div>
                <label class="text-xs tracking-wider text-stone-500 uppercase mb-3 block">Packaging</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    v-for="pkg in getAvailablePackagingOptions()"
                    :key="pkg.id"
                    @click="setPackaging(pkg)"
                    :class="[
                      'option-card',
                      state.selectedPackaging?.id === pkg.id && 'selected'
                    ]"
                  >
                    <span class="option-name">{{ pkg.name }}</span>
                    <span class="option-price">
                      {{ pkg.isFree ? 'Included' : `+$${pkg.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Rush Order -->
              <div class="pt-4 border-t border-stone-200">
                <button
                  @click="setRushOrder(!state.rushOrder)"
                  :class="['rush-toggle', state.rushOrder && 'active']"
                >
                  <div class="rush-checkbox">
                    <svg v-if="state.rushOrder" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span class="text-stone-900 font-medium">Expedited Production</span>
                    <span class="text-stone-500 text-sm ml-2">+20% rush fee</span>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Summary -->
        <div class="lg:sticky lg:top-8 h-fit">
          <div class="summary-card">
            <!-- Header -->
            <div class="summary-header">
              <h3 class="font-serif text-lg text-stone-900">Order Summary</h3>
              <button
                @click="resetSelections"
                class="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Clear all
              </button>
            </div>

            <!-- Selections Display -->
            <div class="summary-selections">
              <div class="selection-item" :class="{ 'pending': !state.selectedProductionMethod }">
                <span class="selection-label">Method</span>
                <span class="selection-value">{{ state.selectedProductionMethod?.name || 'Not selected' }}</span>
              </div>
              <div class="selection-item" :class="{ 'pending': !state.selectedSize }">
                <span class="selection-label">Size</span>
                <span class="selection-value">{{ state.selectedSize ? `${state.selectedSize}"` : 'Not selected' }}</span>
              </div>
              <div class="selection-item" :class="{ 'pending': !state.selectedQuantity }">
                <span class="selection-label">Quantity</span>
                <span class="selection-value">
                  {{ state.selectedQuantity ? state.selectedQuantity.toLocaleString() : 'Not selected' }}
                  <span v-if="isCustomQuantitySelected" class="text-amber-600 text-xs ml-1">(custom)</span>
                </span>
              </div>
              <div class="selection-item" :class="{ 'pending': !state.selectedPlatingType }">
                <span class="selection-label">Finish</span>
                <span class="selection-value">{{ state.selectedPlatingType?.name || 'Not selected' }}</span>
              </div>
              <div class="selection-item" :class="{ 'pending': !state.selectedBacking }">
                <span class="selection-label">Backing</span>
                <span class="selection-value">{{ state.selectedBacking?.name || 'Not selected' }}</span>
              </div>
              <div class="selection-item" :class="{ 'pending': !state.selectedPackaging }">
                <span class="selection-label">Packaging</span>
                <span class="selection-value">{{ state.selectedPackaging?.name || 'Not selected' }}</span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div v-if="priceBreakdown" class="price-section">
              <div class="price-line">
                <span>Base Price</span>
                <span>${{ priceBreakdown.basePrice.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.setupFee > 0" class="price-line">
                <span>Setup Fee</span>
                <span>${{ priceBreakdown.setupFee.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.platingCost > 0" class="price-line">
                <span>Plating</span>
                <span>${{ priceBreakdown.platingCost.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.backingCost > 0" class="price-line">
                <span>Backing</span>
                <span>${{ priceBreakdown.backingCost.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.packagingCost > 0" class="price-line">
                <span>Packaging</span>
                <span>${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.moldFee > 0 || priceBreakdown.moldFeeWaived" class="price-line">
                <span>
                  Mold Fee
                  <span v-if="priceBreakdown.moldFeeWaived" class="text-emerald-600 text-xs">(waived)</span>
                </span>
                <span :class="priceBreakdown.moldFeeWaived && 'line-through text-stone-400'">
                  ${{ priceBreakdown.moldFee.toFixed(2) }}
                </span>
              </div>
              <div v-if="priceBreakdown.rushFee > 0" class="price-line rush">
                <span>Rush Fee</span>
                <span>${{ priceBreakdown.rushFee.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Total -->
            <div class="total-section">
              <div class="total-row">
                <span class="font-serif text-lg">Total</span>
                <span class="total-amount">
                  ${{ priceBreakdown ? priceBreakdown.total.toFixed(2) : '0.00' }}
                </span>
              </div>
              <p v-if="priceBreakdown" class="unit-price">
                ${{ priceBreakdown.unitPrice.toFixed(2) }} per unit
              </p>
            </div>

            <!-- CTA -->
            <button
              :disabled="!isSelectionComplete"
              class="cta-button"
            >
              <span>Request Quote</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-stone-200/60 mt-20 py-12 bg-white/50">
      <div class="max-w-6xl mx-auto px-8 text-center">
        <p class="text-sm text-stone-400">Crafted with precision. Delivered with care.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { QUANTITIES } from '~/data/pricing';

useHead({
  title: 'Demo Two - Luxe Minimalist | Pin Calculator',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap' }
  ]
});

const {
  state,
  isSelectionComplete,
  priceBreakdown,
  getAvailableSizes,
  setProductionMethod,
  setPlatingType,
  setSizeAndQuantity,
  setBacking,
  setPackaging,
  setRushOrder,
  resetSelections,
  getAvailableProductionMethods,
  getAvailablePlatingOptions,
  getAvailableBackingOptions,
  getAvailablePackagingOptions
} = usePricingCalculator();

const standardQuantities = QUANTITIES;
const customQtyInput = ref('');

const selectSize = (size: string) => {
  if (state.selectedQuantity) {
    setSizeAndQuantity(size, state.selectedQuantity);
  } else {
    setSizeAndQuantity(size, standardQuantities[0]);
  }
};

const isCustomQuantitySelected = computed(() => {
  if (!state.selectedQuantity) return false;
  return !standardQuantities.includes(state.selectedQuantity);
});

const applyCustomQty = () => {
  const value = customQtyInput.value.trim();
  if (!value || !state.selectedSize) return;

  const numValue = parseInt(value, 10);
  if (isNaN(numValue) || numValue < 1) return;

  setSizeAndQuantity(state.selectedSize, numValue);
};

const getPlatingClass = (id: string): string => {
  const classes: Record<string, string> = {
    'polished-gold': 'bg-gradient-to-br from-amber-300 to-amber-600',
    'polished-silver': 'bg-gradient-to-br from-gray-200 to-gray-400',
    'polished-copper': 'bg-gradient-to-br from-orange-300 to-orange-600',
    'polished-nickel': 'bg-gradient-to-br from-slate-300 to-slate-500',
    'black-metal': 'bg-gradient-to-br from-gray-700 to-gray-900',
    'antique-gold': 'bg-gradient-to-br from-amber-400 to-amber-800',
    'antique-silver': 'bg-gradient-to-br from-gray-400 to-gray-600',
    'antique-copper': 'bg-gradient-to-br from-orange-400 to-orange-800',
    'dual-plated': 'bg-gradient-to-br from-amber-300 via-gray-300 to-amber-300',
    'color-coated': 'bg-gradient-to-br from-rose-300 via-violet-300 to-cyan-300',
  };
  return classes[id] || 'bg-gray-300';
};
</script>

<style scoped>
.demo-two {
  font-family: 'Outfit', sans-serif;
}

.demo-two h1,
.demo-two h2,
.demo-two h3,
.demo-two .font-serif {
  font-family: 'Cormorant Garamond', serif;
}

/* Paper Texture */
.paper-texture {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Config Section */
.config-section {
  position: relative;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.step-indicator {
  position: relative;
  flex-shrink: 0;
}

.step-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px;
  font-weight: 500;
  color: #78716c;
  border: 1px solid #d6d3d1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.step-check {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
  border-radius: 50%;
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.section-content {
  padding-left: 52px;
}

/* Method Cards */
.method-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 20px;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.method-card:hover {
  border-color: #d6d3d1;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.method-card.selected {
  border-color: #d97706;
  background: linear-gradient(to bottom, #fffbeb, white);
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.12);
}

.method-name {
  font-weight: 500;
  color: #44403c;
  font-size: 14px;
}

.method-addon {
  font-size: 11px;
  color: #a8a29e;
}

/* Size Pills */
.size-pill {
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 500;
  color: #78716c;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-pill:hover {
  border-color: #d6d3d1;
  color: #44403c;
}

.size-pill.selected {
  background: linear-gradient(135deg, #d97706, #b45309);
  border-color: transparent;
  color: white;
}

/* Qty Pills */
.qty-pill {
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 500;
  color: #78716c;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-pill:hover {
  border-color: #d6d3d1;
  color: #44403c;
}

.qty-pill.selected {
  background: #44403c;
  border-color: #44403c;
  color: white;
}

/* Custom Input */
.custom-input {
  width: 140px;
  padding: 10px 36px 10px 14px;
  font-family: inherit;
  font-size: 14px;
  color: #44403c;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s ease;
}

.custom-input::placeholder {
  color: #a8a29e;
}

.custom-input:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

/* Plating Cards */
.plating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 10px;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.plating-card:hover {
  border-color: #d6d3d1;
  transform: translateY(-2px);
}

.plating-card.selected {
  border-color: #d97706;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.15);
}

.plating-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.plating-name {
  font-size: 11px;
  font-weight: 500;
  color: #44403c;
  text-align: center;
}

.plating-price {
  font-size: 10px;
  color: #a8a29e;
}

/* Option Cards */
.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 12px;
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: #d6d3d1;
}

.option-card.selected {
  border-color: #44403c;
  background: #fafaf9;
}

.option-name {
  font-size: 12px;
  font-weight: 500;
  color: #44403c;
  text-align: center;
}

.option-price {
  font-size: 10px;
  color: #a8a29e;
}

/* Rush Toggle */
.rush-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafaf9;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rush-toggle:hover {
  border-color: #d6d3d1;
}

.rush-toggle.active {
  background: #fffbeb;
  border-color: #d97706;
}

.rush-checkbox {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #d6d3d1;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.rush-toggle.active .rush-checkbox {
  background: #d97706;
  border-color: #d97706;
  color: white;
}

/* Summary Card */
.summary-card {
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f5f5f4;
}

.summary-selections {
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f4;
}

.selection-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
}

.selection-item.pending {
  opacity: 0.5;
}

.selection-label {
  color: #78716c;
}

.selection-value {
  color: #44403c;
  font-weight: 500;
}

/* Price Section */
.price-section {
  padding: 16px 24px;
  border-bottom: 1px solid #f5f5f4;
}

.price-line {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: #78716c;
}

.price-line.rush {
  color: #d97706;
}

/* Total Section */
.total-section {
  padding: 20px 24px;
  background: #fafaf9;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-amount {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 600;
  color: #44403c;
}

.unit-price {
  text-align: right;
  font-size: 12px;
  color: #a8a29e;
  margin-top: 4px;
}

/* CTA Button */
.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 48px);
  margin: 20px 24px 24px;
  padding: 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: white;
  background: linear-gradient(135deg, #44403c, #292524);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #292524, #1c1917);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.cta-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Animations */
.animate-fade-up {
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
