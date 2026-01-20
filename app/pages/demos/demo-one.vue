<template>
  <div class="demo-one min-h-screen bg-slate-950 relative overflow-hidden">
    <!-- Blueprint Grid Background -->
    <div class="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
    <div class="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-blue-950/20 pointer-events-none" />

    <!-- Header -->
    <header class="relative border-b border-cyan-800/40 bg-slate-950/80 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 border border-cyan-500/50 flex items-center justify-center rotate-45">
              <div class="w-4 h-4 bg-cyan-500/30 -rotate-45" />
            </div>
            <div>
              <h1 class="font-mono text-lg tracking-wider text-cyan-100 uppercase">Pin.Calc</h1>
              <div class="font-mono text-[10px] text-cyan-600 tracking-[0.3em]">SPEC // ESTIMATE // BUILD</div>
            </div>
          </div>
          <div class="font-mono text-xs text-cyan-700">
            REV.{{ new Date().getFullYear() }}.01
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative max-w-7xl mx-auto px-6 py-8">
      <!-- Technical Drawing Corner Marks -->
      <div class="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-700/40" />
      <div class="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-700/40" />
      <div class="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-700/40" />
      <div class="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-700/40" />

      <div class="grid lg:grid-cols-[1fr_380px] gap-8">
        <!-- Left Column: Configuration -->
        <div class="space-y-6">

          <!-- Section 01: Production Method -->
          <section class="spec-panel">
            <div class="spec-header">
              <span class="spec-number">01</span>
              <span class="spec-title">PRODUCTION METHOD</span>
              <span v-if="state.selectedProductionMethod" class="spec-badge complete">SPEC'D</span>
              <span v-else class="spec-badge pending">PENDING</span>
            </div>
            <div class="spec-content">
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-2">
                <button
                  v-for="method in getAvailableProductionMethods()"
                  :key="method.id"
                  @click="setProductionMethod(method)"
                  :class="[
                    'method-btn',
                    state.selectedProductionMethod?.id === method.id && 'active'
                  ]"
                >
                  <span class="method-name">{{ method.name }}</span>
                  <span v-if="method.setupFee" class="method-fee">+${{ method.setupFee }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Section 02: Dimensions -->
          <section v-if="state.selectedProductionMethod" class="spec-panel animate-panel-in">
            <div class="spec-header">
              <span class="spec-number">02</span>
              <span class="spec-title">SIZE & QUANTITY</span>
              <span v-if="state.selectedSize && state.selectedQuantity" class="spec-badge complete">SPEC'D</span>
              <span v-else class="spec-badge pending">PENDING</span>
            </div>
            <div class="spec-content">
              <!-- Size Pills -->
              <div class="mb-4">
                <div class="font-mono text-[10px] text-cyan-600 mb-2 tracking-wider">DIAMETER (INCHES)</div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="size in getAvailableSizes"
                    :key="size"
                    @click="selectSize(size)"
                    :class="[
                      'size-btn',
                      state.selectedSize === size && 'active'
                    ]"
                  >
                    {{ size }}"
                  </button>
                </div>
              </div>

              <!-- Quantity Grid -->
              <div v-if="state.selectedSize">
                <div class="font-mono text-[10px] text-cyan-600 mb-2 tracking-wider">UNIT COUNT</div>
                <div class="grid grid-cols-4 lg:grid-cols-8 gap-2">
                  <button
                    v-for="qty in standardQuantities"
                    :key="qty"
                    @click="setSizeAndQuantity(state.selectedSize!, qty)"
                    :class="[
                      'qty-btn',
                      state.selectedQuantity === qty && 'active'
                    ]"
                  >
                    {{ qty.toLocaleString() }}
                  </button>
                  <!-- Custom Quantity -->
                  <div class="qty-custom">
                    <input
                      v-model="customQtyInput"
                      type="text"
                      inputmode="numeric"
                      placeholder="Custom"
                      @keydown.enter="applyCustomQty"
                      @blur="applyCustomQty"
                      class="qty-input"
                    />
                  </div>
                </div>
                <div v-if="isCustomQuantitySelected" class="mt-2 font-mono text-xs text-cyan-400 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
                  Custom quantity: {{ state.selectedQuantity?.toLocaleString() }} units (interpolated pricing)
                </div>
              </div>
            </div>
          </section>

          <!-- Section 03: Plating -->
          <section v-if="state.selectedSize && state.selectedQuantity" class="spec-panel animate-panel-in">
            <div class="spec-header">
              <span class="spec-number">03</span>
              <span class="spec-title">PLATING TYPE</span>
              <span v-if="state.selectedPlatingType" class="spec-badge complete">SPEC'D</span>
              <span v-else class="spec-badge pending">PENDING</span>
            </div>
            <div class="spec-content">
              <div class="grid grid-cols-2 lg:grid-cols-5 gap-2">
                <button
                  v-for="plating in getAvailablePlatingOptions()"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :class="[
                    'plating-btn',
                    state.selectedPlatingType?.id === plating.id && 'active'
                  ]"
                >
                  <span class="plating-name">{{ plating.name }}</span>
                  <span :class="['plating-price', plating.isFree && 'free']">
                    {{ plating.isFree ? 'STD' : `+$${plating.price.toFixed(2)}` }}
                  </span>
                </button>
              </div>
            </div>
          </section>

          <!-- Section 04: Accessories -->
          <section v-if="state.selectedPlatingType" class="spec-panel animate-panel-in">
            <div class="spec-header">
              <span class="spec-number">04</span>
              <span class="spec-title">ACCESSORIES</span>
              <span v-if="state.selectedBacking && state.selectedPackaging" class="spec-badge complete">SPEC'D</span>
              <span v-else class="spec-badge pending">PENDING</span>
            </div>
            <div class="spec-content space-y-4">
              <!-- Backing -->
              <div>
                <div class="font-mono text-[10px] text-cyan-600 mb-2 tracking-wider">BACKING MECHANISM</div>
                <div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    v-for="backing in getAvailableBackingOptions()"
                    :key="backing.id"
                    @click="setBacking(backing)"
                    :class="[
                      'accessory-btn',
                      state.selectedBacking?.id === backing.id && 'active'
                    ]"
                  >
                    <span class="accessory-name">{{ backing.name }}</span>
                    <span :class="['accessory-price', backing.isFree && 'free']">
                      {{ backing.isFree ? 'STD' : `+$${backing.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Packaging -->
              <div>
                <div class="font-mono text-[10px] text-cyan-600 mb-2 tracking-wider">PACKAGING</div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <button
                    v-for="pkg in getAvailablePackagingOptions()"
                    :key="pkg.id"
                    @click="setPackaging(pkg)"
                    :class="[
                      'accessory-btn',
                      state.selectedPackaging?.id === pkg.id && 'active'
                    ]"
                  >
                    <span class="accessory-name">{{ pkg.name }}</span>
                    <span :class="['accessory-price', pkg.isFree && 'free']">
                      {{ pkg.isFree ? 'STD' : `+$${pkg.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Rush Toggle -->
              <div class="rush-toggle">
                <button
                  @click="setRushOrder(!state.rushOrder)"
                  :class="['rush-btn', state.rushOrder && 'active']"
                >
                  <span class="rush-indicator" />
                  <span class="rush-label">RUSH ORDER (+20%)</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Summary -->
        <div class="lg:sticky lg:top-8 h-fit">
          <div class="summary-panel">
            <div class="summary-header">
              <span class="font-mono text-[10px] tracking-[0.3em] text-cyan-600">COST ANALYSIS</span>
            </div>

            <div class="summary-content">
              <!-- Digital Display -->
              <div class="digital-display">
                <div class="digital-label">TOTAL ESTIMATE</div>
                <div class="digital-value">
                  <span class="digital-currency">$</span>
                  <span class="digital-amount">{{ priceBreakdown ? formatDigitalPrice(priceBreakdown.total) : '-----.--' }}</span>
                </div>
              </div>

              <!-- Breakdown -->
              <div v-if="priceBreakdown" class="breakdown-list">
                <div class="breakdown-item">
                  <span class="breakdown-label">Base ({{ state.selectedQuantity?.toLocaleString() }} @ ${{ priceBreakdown.unitPrice.toFixed(2) }})</span>
                  <span class="breakdown-value">${{ priceBreakdown.basePrice.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.setupFee > 0" class="breakdown-item">
                  <span class="breakdown-label">Setup Fee</span>
                  <span class="breakdown-value">${{ priceBreakdown.setupFee.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.platingCost > 0" class="breakdown-item">
                  <span class="breakdown-label">Plating</span>
                  <span class="breakdown-value">${{ priceBreakdown.platingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.backingCost > 0" class="breakdown-item">
                  <span class="breakdown-label">Backing</span>
                  <span class="breakdown-value">${{ priceBreakdown.backingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.packagingCost > 0" class="breakdown-item">
                  <span class="breakdown-label">Packaging</span>
                  <span class="breakdown-value">${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.moldFee > 0 || priceBreakdown.moldFeeWaived" class="breakdown-item">
                  <span class="breakdown-label">
                    Mold Fee
                    <span v-if="priceBreakdown.moldFeeWaived" class="text-emerald-400 ml-1">[WAIVED]</span>
                  </span>
                  <span :class="['breakdown-value', priceBreakdown.moldFeeWaived && 'text-emerald-400 line-through']">
                    ${{ priceBreakdown.moldFee.toFixed(2) }}
                  </span>
                </div>
                <div v-if="priceBreakdown.rushFee > 0" class="breakdown-item highlight">
                  <span class="breakdown-label">Rush (+20%)</span>
                  <span class="breakdown-value">${{ priceBreakdown.rushFee.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Status -->
              <div class="status-bar">
                <div v-if="!isSelectionComplete" class="status-incomplete">
                  <div class="status-dots">
                    <span :class="['status-dot', state.selectedProductionMethod && 'complete']" />
                    <span :class="['status-dot', state.selectedSize && state.selectedQuantity && 'complete']" />
                    <span :class="['status-dot', state.selectedPlatingType && 'complete']" />
                    <span :class="['status-dot', state.selectedBacking && state.selectedPackaging && 'complete']" />
                  </div>
                  <span class="status-text">AWAITING FULL SPECIFICATION</span>
                </div>
                <div v-else class="status-complete">
                  <span class="status-icon" />
                  <span class="status-text">READY FOR QUOTE</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="actions">
                <button
                  @click="resetSelections"
                  class="action-btn secondary"
                >
                  CLEAR SPEC
                </button>
                <button
                  :disabled="!isSelectionComplete"
                  class="action-btn primary"
                >
                  GENERATE QUOTE
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
import { ref, computed } from 'vue';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { QUANTITIES } from '~/data/pricing';

useHead({
  title: 'Demo One - Industrial Blueprint | Pin Calculator',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap' }
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

const formatDigitalPrice = (value: number): string => {
  return value.toFixed(2).padStart(8, ' ');
};
</script>

<style scoped>
.demo-one {
  font-family: 'JetBrains Mono', monospace;
}

/* Blueprint Grid */
.blueprint-grid {
  background-image:
    linear-gradient(rgba(6, 182, 212, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.08) 1px, transparent 1px),
    linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.04) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
}

/* Spec Panel */
.spec-panel {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  position: relative;
}

.spec-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
}

.spec-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(6, 182, 212, 0.15);
  background: rgba(6, 182, 212, 0.03);
}

.spec-number {
  font-size: 10px;
  font-weight: 600;
  color: rgba(6, 182, 212, 0.6);
  padding: 2px 6px;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.spec-title {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: #e0f2fe;
  flex: 1;
}

.spec-badge {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  padding: 3px 8px;
}

.spec-badge.complete {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.spec-badge.pending {
  background: rgba(251, 191, 36, 0.1);
  color: #fcd34d;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.spec-content {
  padding: 16px;
}

/* Method Buttons */
.method-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 8px;
  min-height: 64px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.15);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.method-btn:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
  color: #e0f2fe;
  transform: translateY(-1px);
}

.method-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #06b6d4;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(6, 182, 212, 0.05);
}

.method-name {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.05em;
}

.method-fee {
  font-size: 9px;
  color: #fbbf24;
}

/* Size Buttons */
.size-btn {
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.15);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-btn:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
  color: #e0f2fe;
}

.size-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #06b6d4;
}

/* Quantity Buttons */
.qty-btn {
  padding: 10px 8px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.15);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.qty-btn:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
  color: #e0f2fe;
}

.qty-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #06b6d4;
}

.qty-custom {
  grid-column: span 1;
}

.qty-input {
  width: 100%;
  height: 100%;
  padding: 10px 8px;
  font-family: inherit;
  font-size: 11px;
  text-align: center;
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed rgba(6, 182, 212, 0.3);
  color: #e0f2fe;
  outline: none;
  transition: all 0.15s ease;
}

.qty-input::placeholder {
  color: rgba(6, 182, 212, 0.4);
}

.qty-input:focus {
  background: rgba(6, 182, 212, 0.1);
  border-color: #06b6d4;
  border-style: solid;
}

/* Plating Buttons */
.plating-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 8px;
  min-height: 56px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.15);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.plating-btn:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
  color: #e0f2fe;
}

.plating-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #06b6d4;
}

.plating-name {
  font-size: 9px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.03em;
}

.plating-price {
  font-size: 9px;
  color: #fbbf24;
}

.plating-price.free {
  color: #6ee7b7;
}

/* Accessory Buttons */
.accessory-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px 8px;
  min-height: 52px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.15);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.accessory-btn:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
  color: #e0f2fe;
}

.accessory-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
  color: #06b6d4;
}

.accessory-name {
  font-size: 9px;
  font-weight: 500;
  text-align: center;
}

.accessory-price {
  font-size: 8px;
  color: #fbbf24;
}

.accessory-price.free {
  color: #6ee7b7;
}

/* Rush Toggle */
.rush-toggle {
  padding-top: 8px;
  border-top: 1px solid rgba(6, 182, 212, 0.1);
}

.rush-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.rush-btn:hover {
  background: rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.3);
}

.rush-btn.active {
  background: rgba(251, 191, 36, 0.1);
  border-color: #fbbf24;
  color: #fbbf24;
}

.rush-indicator {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  position: relative;
  transition: all 0.15s ease;
}

.rush-btn.active .rush-indicator::after {
  content: '';
  position: absolute;
  inset: 2px;
  background: currentColor;
}

.rush-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.1em;
}

/* Summary Panel */
.summary-panel {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(6, 182, 212, 0.25);
  position: relative;
}

.summary-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #06b6d4, #0ea5e9, #06b6d4);
}

.summary-header {
  padding: 16px;
  border-bottom: 1px solid rgba(6, 182, 212, 0.15);
  text-align: center;
}

.summary-content {
  padding: 20px;
}

/* Digital Display */
.digital-display {
  background: #020617;
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.digital-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  color: rgba(6, 182, 212, 0.6);
  margin-bottom: 8px;
}

.digital-value {
  font-size: 28px;
  font-weight: 300;
  color: #06b6d4;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
  font-variant-numeric: tabular-nums;
}

.digital-currency {
  font-size: 18px;
  opacity: 0.7;
}

/* Breakdown List */
.breakdown-list {
  margin-bottom: 20px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(6, 182, 212, 0.08);
  font-size: 11px;
}

.breakdown-item.highlight {
  color: #fbbf24;
}

.breakdown-label {
  color: #64748b;
}

.breakdown-value {
  color: #94a3b8;
  font-weight: 500;
}

/* Status Bar */
.status-bar {
  padding: 12px;
  background: rgba(6, 182, 212, 0.05);
  border: 1px solid rgba(6, 182, 212, 0.1);
  margin-bottom: 16px;
}

.status-incomplete,
.status-complete {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dots {
  display: flex;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: rgba(100, 116, 139, 0.3);
  transition: all 0.2s ease;
}

.status-dot.complete {
  background: #06b6d4;
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
}

.status-text {
  font-size: 9px;
  letter-spacing: 0.1em;
  color: #64748b;
}

.status-complete .status-text {
  color: #6ee7b7;
}

.status-icon {
  width: 8px;
  height: 8px;
  background: #6ee7b7;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Actions */
.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn.secondary {
  background: transparent;
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #64748b;
}

.action-btn.secondary:hover {
  border-color: rgba(100, 116, 139, 0.5);
  color: #94a3b8;
}

.action-btn.primary {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(14, 165, 233, 0.2));
  border: 1px solid #06b6d4;
  color: #06b6d4;
}

.action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(14, 165, 233, 0.3));
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}

.action-btn.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Animation */
.animate-panel-in {
  animation: panelIn 0.3s ease-out;
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
