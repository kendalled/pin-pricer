<template>
  <div class="demo-three min-h-screen bg-gray-950 text-white overflow-hidden">
    <!-- Animated Gradient Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-gray-950 to-fuchsia-950/30" />
      <div class="gradient-orb orb-1" />
      <div class="gradient-orb orb-2" />
      <div class="gradient-orb orb-3" />
    </div>

    <!-- Floating Header -->
    <header class="relative z-10">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="logo-mark">
              <span class="logo-icon">P</span>
            </div>
            <span class="text-lg font-semibold tracking-tight">PinStudio</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span class="text-sm text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8">
      <!-- Hero -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-6">
          <span class="text-sm font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Price Calculator v2.0
          </span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          <span class="bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
            Design Your Perfect Pin
          </span>
        </h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Configure every detail and get instant pricing. No guesswork, no waiting.
        </p>
      </div>

      <!-- Progress Pills -->
      <div class="flex justify-center mb-12">
        <div class="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div :class="['progress-pill', stepProgress >= 1 && 'active']">
            <span class="pill-number">1</span>
            <span class="pill-label">Method</span>
          </div>
          <div class="progress-connector" :class="stepProgress >= 2 && 'active'" />
          <div :class="['progress-pill', stepProgress >= 2 && 'active']">
            <span class="pill-number">2</span>
            <span class="pill-label">Size</span>
          </div>
          <div class="progress-connector" :class="stepProgress >= 3 && 'active'" />
          <div :class="['progress-pill', stepProgress >= 3 && 'active']">
            <span class="pill-number">3</span>
            <span class="pill-label">Finish</span>
          </div>
          <div class="progress-connector" :class="stepProgress >= 4 && 'active'" />
          <div :class="['progress-pill', stepProgress >= 4 && 'active']">
            <span class="pill-number">4</span>
            <span class="pill-label">Options</span>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <!-- Configuration Area -->
        <div class="space-y-6">

          <!-- Production Method -->
          <div class="config-card">
            <div class="card-header">
              <div class="card-icon violet">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <h3 class="card-title">Production Method</h3>
                <p class="card-subtitle">How should we craft your pin?</p>
              </div>
            </div>
            <div class="card-content">
              <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button
                  v-for="method in getAvailableProductionMethods()"
                  :key="method.id"
                  @click="setProductionMethod(method)"
                  :class="[
                    'choice-btn',
                    state.selectedProductionMethod?.id === method.id && 'selected'
                  ]"
                >
                  <span class="choice-name">{{ method.name }}</span>
                  <span v-if="method.setupFee" class="choice-badge">+${{ method.setupFee }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Size & Quantity -->
          <div v-if="state.selectedProductionMethod" class="config-card animate-card-in">
            <div class="card-header">
              <div class="card-icon fuchsia">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <div>
                <h3 class="card-title">Size & Quantity</h3>
                <p class="card-subtitle">Choose dimensions and volume</p>
              </div>
            </div>
            <div class="card-content space-y-6">
              <!-- Size Slider Visual -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm text-gray-400">Pin Diameter</span>
                  <span class="size-display">{{ state.selectedSize || '?' }}"</span>
                </div>
                <div class="size-track">
                  <button
                    v-for="(size, idx) in getAvailableSizes"
                    :key="size"
                    @click="selectSize(size)"
                    :class="['size-node', state.selectedSize === size && 'selected']"
                    :style="{ left: `${(idx / (getAvailableSizes.length - 1)) * 100}%` }"
                  >
                    <span class="node-dot" />
                    <span class="node-label">{{ size }}</span>
                  </button>
                  <div
                    v-if="state.selectedSize"
                    class="size-fill"
                    :style="{ width: `${(getAvailableSizes.indexOf(state.selectedSize) / (getAvailableSizes.length - 1)) * 100}%` }"
                  />
                </div>
              </div>

              <!-- Quantity Grid -->
              <div v-if="state.selectedSize">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm text-gray-400">Quantity</span>
                  <span v-if="state.selectedQuantity" class="qty-display">
                    {{ state.selectedQuantity.toLocaleString() }} units
                    <span v-if="isCustomQuantitySelected" class="custom-tag">custom</span>
                  </span>
                </div>
                <div class="qty-grid">
                  <button
                    v-for="qty in standardQuantities"
                    :key="qty"
                    @click="setSizeAndQuantity(state.selectedSize!, qty)"
                    :class="['qty-btn', state.selectedQuantity === qty && 'selected']"
                  >
                    {{ qty >= 1000 ? `${qty/1000}k` : qty }}
                  </button>
                  <div class="qty-custom-wrapper">
                    <input
                      v-model="customQtyInput"
                      type="text"
                      inputmode="numeric"
                      placeholder="Custom qty"
                      @keydown.enter="applyCustomQty"
                      @blur="applyCustomQty"
                      class="qty-custom-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Plating -->
          <div v-if="state.selectedSize && state.selectedQuantity" class="config-card animate-card-in">
            <div class="card-header">
              <div class="card-icon amber">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 class="card-title">Finish</h3>
                <p class="card-subtitle">Select your plating style</p>
              </div>
            </div>
            <div class="card-content">
              <div class="plating-grid">
                <button
                  v-for="plating in getAvailablePlatingOptions()"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :class="[
                    'plating-btn',
                    state.selectedPlatingType?.id === plating.id && 'selected'
                  ]"
                >
                  <div class="plating-preview" :class="getPlatingGradient(plating.id)" />
                  <span class="plating-name">{{ plating.name }}</span>
                  <span :class="['plating-price', plating.isFree && 'free']">
                    {{ plating.isFree ? 'Free' : `+$${plating.price.toFixed(2)}` }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Options -->
          <div v-if="state.selectedPlatingType" class="config-card animate-card-in">
            <div class="card-header">
              <div class="card-icon emerald">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 class="card-title">Options</h3>
                <p class="card-subtitle">Backing, packaging & extras</p>
              </div>
            </div>
            <div class="card-content space-y-6">
              <!-- Backing -->
              <div>
                <span class="option-label">Backing Type</span>
                <div class="option-grid">
                  <button
                    v-for="backing in getAvailableBackingOptions()"
                    :key="backing.id"
                    @click="setBacking(backing)"
                    :class="['option-btn', state.selectedBacking?.id === backing.id && 'selected']"
                  >
                    <span class="option-name">{{ backing.name }}</span>
                    <span :class="['option-price', backing.isFree && 'free']">
                      {{ backing.isFree ? 'Free' : `+$${backing.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Packaging -->
              <div>
                <span class="option-label">Packaging</span>
                <div class="option-grid cols-4">
                  <button
                    v-for="pkg in getAvailablePackagingOptions()"
                    :key="pkg.id"
                    @click="setPackaging(pkg)"
                    :class="['option-btn', state.selectedPackaging?.id === pkg.id && 'selected']"
                  >
                    <span class="option-name">{{ pkg.name }}</span>
                    <span :class="['option-price', pkg.isFree && 'free']">
                      {{ pkg.isFree ? 'Free' : `+$${pkg.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Rush Toggle -->
              <div class="rush-section">
                <button
                  @click="setRushOrder(!state.rushOrder)"
                  :class="['rush-btn', state.rushOrder && 'active']"
                >
                  <div class="rush-toggle-track">
                    <div class="rush-toggle-thumb" />
                  </div>
                  <div class="rush-info">
                    <span class="rush-title">Rush Order</span>
                    <span class="rush-desc">Expedited production (+20%)</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Panel -->
        <div class="lg:sticky lg:top-8">
          <div class="summary-panel">
            <!-- Glassmorphic effect -->
            <div class="summary-glow" />

            <div class="summary-inner">
              <!-- Price Display -->
              <div class="price-hero">
                <span class="price-label">Estimated Total</span>
                <div class="price-value">
                  <span class="price-currency">$</span>
                  <span class="price-amount" :key="priceBreakdown?.total">
                    {{ priceBreakdown ? animatedTotal.toFixed(2) : '0.00' }}
                  </span>
                </div>
                <span v-if="priceBreakdown" class="price-per-unit">
                  ${{ priceBreakdown.unitPrice.toFixed(2) }} per pin
                </span>
              </div>

              <!-- Breakdown -->
              <div v-if="priceBreakdown" class="breakdown-section">
                <div class="breakdown-item">
                  <span>Base ({{ state.selectedQuantity?.toLocaleString() }} pcs)</span>
                  <span>${{ priceBreakdown.basePrice.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.setupFee > 0" class="breakdown-item">
                  <span>Setup Fee</span>
                  <span>${{ priceBreakdown.setupFee.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.platingCost > 0" class="breakdown-item">
                  <span>Plating</span>
                  <span>${{ priceBreakdown.platingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.backingCost > 0" class="breakdown-item">
                  <span>Backing</span>
                  <span>${{ priceBreakdown.backingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.packagingCost > 0" class="breakdown-item">
                  <span>Packaging</span>
                  <span>${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.moldFee > 0 || priceBreakdown.moldFeeWaived" class="breakdown-item">
                  <span>
                    Mold Fee
                    <span v-if="priceBreakdown.moldFeeWaived" class="waived-badge">Waived</span>
                  </span>
                  <span :class="priceBreakdown.moldFeeWaived && 'line-through opacity-50'">
                    ${{ priceBreakdown.moldFee.toFixed(2) }}
                  </span>
                </div>
                <div v-if="priceBreakdown.rushFee > 0" class="breakdown-item highlight">
                  <span>Rush Fee</span>
                  <span>${{ priceBreakdown.rushFee.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="empty-state">
                <div class="empty-icon">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p>Complete your selection to see pricing</p>
              </div>

              <!-- Actions -->
              <div class="summary-actions">
                <button
                  @click="resetSelections"
                  class="action-secondary"
                >
                  Reset
                </button>
                <button
                  :disabled="!isSelectionComplete"
                  class="action-primary"
                >
                  <span>Get Quote</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { QUANTITIES } from '~/data/pricing';

useHead({
  title: 'Demo Three - Playful Gradient | Pin Calculator',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap' }
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
const animatedTotal = ref(0);

// Animate price changes
watch(() => priceBreakdown.value?.total, (newTotal) => {
  if (newTotal === undefined) {
    animatedTotal.value = 0;
    return;
  }

  const start = animatedTotal.value;
  const diff = newTotal - start;
  const duration = 400;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    animatedTotal.value = start + diff * easeOut;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}, { immediate: true });

const stepProgress = computed(() => {
  let progress = 0;
  if (state.selectedProductionMethod) progress = 1;
  if (state.selectedSize && state.selectedQuantity) progress = 2;
  if (state.selectedPlatingType) progress = 3;
  if (state.selectedBacking && state.selectedPackaging) progress = 4;
  return progress;
});

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

const getPlatingGradient = (id: string): string => {
  const gradients: Record<string, string> = {
    'polished-gold': 'from-amber-400 to-yellow-600',
    'polished-silver': 'from-gray-300 to-slate-400',
    'polished-copper': 'from-orange-400 to-amber-700',
    'polished-nickel': 'from-slate-300 to-gray-500',
    'black-metal': 'from-gray-600 to-gray-900',
    'antique-gold': 'from-amber-500 to-amber-900',
    'antique-silver': 'from-gray-400 to-slate-600',
    'antique-copper': 'from-orange-500 to-amber-900',
    'dual-plated': 'from-amber-400 via-slate-300 to-amber-400',
    'color-coated': 'from-pink-400 via-violet-400 to-cyan-400',
  };
  return gradients[id] || 'from-gray-400 to-gray-600';
};
</script>

<style scoped>
.demo-three {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Gradient Orbs */
.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
  bottom: -100px;
  right: -150px;
  animation-delay: -5s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(20px, 30px) scale(1.02); }
}

/* Logo */
.logo-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-weight: 700;
  font-size: 18px;
}

/* Progress Pills */
.progress-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.progress-pill.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
}

.pill-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.progress-pill.active .pill-number {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}

.pill-label {
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.progress-pill.active .pill-label {
  color: white;
}

.progress-connector {
  width: 24px;
  height: 2px;
  background: rgba(255,255,255,0.1);
  transition: background 0.3s ease;
}

.progress-connector.active {
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
}

/* Config Cards */
.config-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  overflow: hidden;
  backdrop-blur: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon.violet { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1)); color: #a78bfa; }
.card-icon.fuchsia { background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1)); color: #f472b6; }
.card-icon.amber { background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1)); color: #fbbf24; }
.card-icon.emerald { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); color: #34d399; }

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.card-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.card-content {
  padding: 24px;
}

/* Choice Buttons */
.choice-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.choice-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

.choice-btn.selected {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 24px rgba(139, 92, 246, 0.2);
}

.choice-name {
  font-size: 12px;
  font-weight: 500;
  color: #d1d5db;
  text-align: center;
}

.choice-btn.selected .choice-name {
  color: white;
}

.choice-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border-radius: 4px;
}

/* Size Track */
.size-display {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.size-track {
  position: relative;
  height: 60px;
  margin: 0 20px;
}

.size-track::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
}

.size-fill {
  position: absolute;
  top: 12px;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.size-node {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;
  background: none;
  border: none;
}

.node-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1f2937;
  border: 3px solid rgba(255,255,255,0.2);
  transition: all 0.2s ease;
}

.size-node:hover .node-dot {
  border-color: rgba(139, 92, 246, 0.5);
  transform: scale(1.1);
}

.size-node.selected .node-dot {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-color: white;
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.5);
}

.node-label {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  transition: color 0.2s ease;
}

.size-node.selected .node-label {
  color: white;
}

/* Quantity */
.qty-display {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.custom-tag {
  font-size: 10px;
  padding: 2px 6px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
  color: #c4b5fd;
  border-radius: 4px;
  margin-left: 8px;
}

.qty-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

@media (min-width: 768px) {
  .qty-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.qty-btn {
  padding: 12px 8px;
  font-size: 13px;
  font-weight: 500;
  color: #9ca3af;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: rgba(255,255,255,0.06);
  color: white;
}

.qty-btn.selected {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-color: transparent;
  color: white;
}

.qty-custom-wrapper {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .qty-custom-wrapper {
    grid-column: span 1;
  }
}

.qty-custom-input {
  width: 100%;
  padding: 12px 8px;
  font-family: inherit;
  font-size: 13px;
  text-align: center;
  color: white;
  background: rgba(255,255,255,0.03);
  border: 1px dashed rgba(255,255,255,0.2);
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
}

.qty-custom-input::placeholder {
  color: #6b7280;
}

.qty-custom-input:focus {
  background: rgba(139, 92, 246, 0.1);
  border-color: #8b5cf6;
  border-style: solid;
}

/* Plating Grid */
.plating-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 768px) {
  .plating-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.plating-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.plating-btn:hover {
  background: rgba(255,255,255,0.06);
  transform: translateY(-3px);
}

.plating-btn.selected {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.3);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.plating-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to));
  box-shadow: inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.3);
}

.plating-name {
  font-size: 11px;
  font-weight: 500;
  color: #d1d5db;
  text-align: center;
}

.plating-price {
  font-size: 10px;
  color: #6b7280;
}

.plating-price.free {
  color: #34d399;
}

/* Options */
.option-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (min-width: 768px) {
  .option-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .option-grid.cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

.option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  background: rgba(255,255,255,0.06);
}

.option-btn.selected {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.25);
}

.option-name {
  font-size: 11px;
  font-weight: 500;
  color: #d1d5db;
  text-align: center;
}

.option-price {
  font-size: 10px;
  color: #6b7280;
}

.option-price.free {
  color: #34d399;
}

/* Rush Section */
.rush-section {
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.rush-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rush-btn:hover {
  background: rgba(255,255,255,0.05);
}

.rush-btn.active {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(236, 72, 153, 0.1));
  border-color: rgba(245, 158, 11, 0.3);
}

.rush-toggle-track {
  width: 48px;
  height: 28px;
  background: rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 3px;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.rush-btn.active .rush-toggle-track {
  background: linear-gradient(135deg, #f59e0b, #ec4899);
}

.rush-toggle-thumb {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.rush-btn.active .rush-toggle-thumb {
  transform: translateX(20px);
}

.rush-info {
  text-align: left;
}

.rush-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.rush-desc {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Summary Panel */
.summary-panel {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
}

.summary-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15));
  filter: blur(40px);
}

.summary-inner {
  position: relative;
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  padding: 28px;
}

/* Price Display */
.price-hero {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.price-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.price-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-currency {
  font-size: 24px;
  font-weight: 600;
  color: #9ca3af;
}

.price-amount {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-variant-numeric: tabular-nums;
}

.price-per-unit {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-top: 8px;
}

/* Breakdown */
.breakdown-section {
  margin-bottom: 24px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 13px;
  color: #9ca3af;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.breakdown-item.highlight {
  color: #fbbf24;
}

.waived-badge {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-radius: 4px;
  margin-left: 6px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 32px 0;
  margin-bottom: 24px;
}

.empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  color: #4b5563;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
}

/* Actions */
.summary-actions {
  display: flex;
  gap: 12px;
}

.action-secondary {
  flex: 1;
  padding: 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-secondary:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}

.action-primary {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
}

.action-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Animations */
.animate-card-in {
  animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
