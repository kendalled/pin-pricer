<template>
  <div class="demo-four min-h-screen bg-slate-950 relative overflow-hidden">
    <!-- Blueprint Grid Background -->
    <div class="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

    <!-- Header -->
    <header class="relative border-b border-cyan-900/50 bg-slate-950/90 backdrop-blur-sm z-20">
      <div class="max-w-[1800px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-9 h-9 border border-cyan-600/50 flex items-center justify-center rotate-45">
            <div class="w-3.5 h-3.5 bg-cyan-500/40 -rotate-45" />
          </div>
          <div>
            <span class="font-mono text-sm tracking-wider text-cyan-100 uppercase">Pin.Spec</span>
            <span class="font-mono text-[9px] text-cyan-700 ml-2 tracking-widest">v2.0</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-2 px-3 py-1 border border-cyan-900/50">
            <div class="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
            <span class="font-mono text-[10px] text-cyan-600 tracking-wider">SYSTEM READY</span>
          </div>
          <button
            @click="resetSelections"
            class="font-mono text-[10px] tracking-wider text-cyan-700 hover:text-cyan-400 px-3 py-1.5 border border-transparent hover:border-cyan-800 transition-all"
          >
            CLEAR ALL
          </button>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="max-w-[1800px] mx-auto relative">
      <div class="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">

        <!-- Left Panel: All Inputs -->
        <div class="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

            <!-- 01: Production Method -->
            <div class="spec-panel">
              <div class="panel-header">
                <span class="panel-number">01</span>
                <span class="panel-title">PRODUCTION METHOD</span>
                <span :class="['panel-status', state.selectedProductionMethod ? 'complete' : 'pending']">
                  {{ state.selectedProductionMethod ? 'LOCKED' : 'AWAITING' }}
                </span>
              </div>
              <div class="panel-content">
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <button
                    v-for="method in productionMethods"
                    :key="method.id"
                    @click="setProductionMethod(method)"
                    :class="['spec-btn', state.selectedProductionMethod?.id === method.id && 'active']"
                  >
                    <span class="btn-label">{{ method.name }}</span>
                    <span v-if="method.setupFee" class="btn-addon">+${{ method.setupFee }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 02: Plating -->
            <div :class="['spec-panel', !state.selectedProductionMethod && 'disabled']">
              <div class="panel-header">
                <span class="panel-number">02</span>
                <span class="panel-title">PLATING TYPE</span>
                <span :class="['panel-status', state.selectedPlatingType ? 'complete' : 'pending']">
                  {{ state.selectedPlatingType ? 'LOCKED' : 'AWAITING' }}
                </span>
              </div>
              <div class="panel-content">
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="plating in platingOptions"
                    :key="plating.id"
                    @click="setPlatingType(plating)"
                    :disabled="!state.selectedProductionMethod"
                    :class="['spec-btn-sm', state.selectedPlatingType?.id === plating.id && 'active', plating.isFree && 'free']"
                  >
                    <span class="btn-label">{{ plating.name }}</span>
                    <span v-if="!plating.isFree" class="btn-price">+${{ plating.price.toFixed(2) }}</span>
                    <span v-else class="btn-price free">STD</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 03: Size -->
            <div :class="['spec-panel', !state.selectedPlatingType && 'disabled']">
              <div class="panel-header">
                <span class="panel-number">03</span>
                <span class="panel-title">DIAMETER</span>
                <span :class="['panel-status', state.selectedSize ? 'complete' : 'pending']">
                  {{ state.selectedSize ? 'LOCKED' : 'AWAITING' }}
                </span>
              </div>
              <div class="panel-content">
                <div class="grid grid-cols-6 gap-2">
                  <button
                    v-for="size in sizes"
                    :key="size"
                    @click="selectSize(size)"
                    :disabled="!state.selectedPlatingType"
                    :class="['size-btn', state.selectedSize === size && 'active']"
                  >
                    <span class="size-value">{{ size }}</span>
                    <span class="size-unit">"</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 04: Quantity -->
            <div :class="['spec-panel', !state.selectedSize && 'disabled']">
              <div class="panel-header">
                <span class="panel-number">04</span>
                <span class="panel-title">UNIT COUNT</span>
                <div class="flex items-center gap-2">
                  <span v-if="state.selectedQuantity && state.selectedQuantity >= 500" class="mold-waived">
                    MOLD FEE WAIVED
                  </span>
                  <span :class="['panel-status', state.selectedQuantity ? 'complete' : 'pending']">
                    {{ state.selectedQuantity ? 'LOCKED' : 'AWAITING' }}
                  </span>
                </div>
              </div>
              <div class="panel-content">
                <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  <button
                    v-for="qty in quantities"
                    :key="qty"
                    @click="selectQuantity(qty)"
                    :disabled="!state.selectedSize"
                    :class="['qty-btn', state.selectedQuantity === qty && 'active']"
                  >
                    <span class="qty-value">{{ qty }}</span>
                    <span v-if="state.selectedSize && state.selectedProductionMethod" class="qty-price">
                      ${{ getUnitPrice(state.selectedSize, qty) }}
                    </span>
                  </button>
                </div>
                <!-- Custom Quantity -->
                <div class="mt-3 flex items-center gap-3">
                  <span class="font-mono text-[9px] text-cyan-700 tracking-wider">CUSTOM:</span>
                  <input
                    v-model="customQtyInput"
                    type="text"
                    inputmode="numeric"
                    placeholder="Enter qty"
                    :disabled="!state.selectedSize"
                    @keydown.enter="applyCustomQty"
                    @blur="applyCustomQty"
                    class="custom-qty-input"
                  />
                  <span v-if="isCustomQuantitySelected" class="font-mono text-[9px] text-cyan-400">
                    {{ state.selectedQuantity?.toLocaleString() }} UNITS [INTERPOLATED]
                  </span>
                </div>
              </div>
            </div>

            <!-- 05: Backing -->
            <div :class="['spec-panel', !state.selectedQuantity && 'disabled']">
              <div class="panel-header">
                <span class="panel-number">05</span>
                <span class="panel-title">BACKING MECHANISM</span>
                <span :class="['panel-status', state.selectedBacking ? 'complete' : 'pending']">
                  {{ state.selectedBacking ? 'LOCKED' : 'AWAITING' }}
                </span>
              </div>
              <div class="panel-content">
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="backing in backingOptions"
                    :key="backing.id"
                    @click="setBacking(backing)"
                    :disabled="!state.selectedQuantity"
                    :class="['spec-btn-sm', state.selectedBacking?.id === backing.id && 'active']"
                  >
                    <span class="btn-label">{{ backing.name }}</span>
                    <span v-if="!backing.isFree" class="btn-price">+${{ backing.price.toFixed(2) }}</span>
                    <span v-else class="btn-price free">STD</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 06: Packaging & Rush -->
            <div :class="['spec-panel', !state.selectedBacking && 'disabled']">
              <div class="panel-header">
                <span class="panel-number">06</span>
                <span class="panel-title">PACKAGING & OPTIONS</span>
                <span :class="['panel-status', state.selectedPackaging ? 'complete' : 'pending']">
                  {{ state.selectedPackaging ? 'LOCKED' : 'AWAITING' }}
                </span>
              </div>
              <div class="panel-content">
                <div class="flex flex-wrap gap-1.5 mb-4">
                  <button
                    v-for="pkg in packagingOptions"
                    :key="pkg.id"
                    @click="setPackaging(pkg)"
                    :disabled="!state.selectedBacking"
                    :class="['spec-btn-sm', state.selectedPackaging?.id === pkg.id && 'active']"
                  >
                    <span class="btn-label">{{ pkg.name }}</span>
                    <span v-if="!pkg.isFree" class="btn-price">+${{ pkg.price.toFixed(2) }}</span>
                    <span v-else class="btn-price free">STD</span>
                  </button>
                </div>

                <!-- Rush Toggle -->
                <button
                  @click="setRushOrder(!state.rushOrder)"
                  :disabled="!state.selectedPackaging"
                  :class="['rush-toggle', state.rushOrder && 'active']"
                >
                  <div class="rush-indicator">
                    <span class="rush-dot" />
                  </div>
                  <div class="rush-text">
                    <span class="rush-label">EXPEDITE ORDER</span>
                    <span class="rush-desc">+20% PRODUCTION FEE</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Summary -->
        <div class="lg:w-[380px] xl:w-[420px] p-4 lg:p-6 lg:border-l border-cyan-900/30 bg-slate-900/50">
          <div class="lg:sticky lg:top-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <span class="font-mono text-[10px] tracking-[0.3em] text-cyan-600">COST ANALYSIS</span>
              <div class="flex items-center gap-1">
                <span
                  v-for="i in 6"
                  :key="i"
                  :class="['w-2 h-2', getStepComplete(i) ? 'bg-cyan-500' : 'bg-slate-800']"
                />
              </div>
            </div>

            <!-- Digital Display -->
            <div class="digital-display">
              <div class="digital-label">TOTAL ESTIMATE</div>
              <div class="digital-value">
                <span class="digital-currency">$</span>
                <span class="digital-amount" :key="priceBreakdown?.total">
                  {{ formatAnimatedPrice(animatedTotal) }}
                </span>
              </div>
              <div v-if="priceBreakdown && state.selectedQuantity" class="digital-per-unit">
                ${{ animatedUnitTotal.toFixed(2) }} / UNIT
              </div>
            </div>

            <!-- Selections Display -->
            <div class="selections-list">
              <div class="selection-row">
                <span class="selection-label">METHOD</span>
                <span :class="['selection-value', !state.selectedProductionMethod && 'empty']">
                  {{ state.selectedProductionMethod?.name || '---' }}
                </span>
              </div>
              <div class="selection-row">
                <span class="selection-label">PLATING</span>
                <span :class="['selection-value', !state.selectedPlatingType && 'empty']">
                  {{ state.selectedPlatingType?.name || '---' }}
                </span>
              </div>
              <div class="selection-row">
                <span class="selection-label">SIZE</span>
                <span :class="['selection-value', !state.selectedSize && 'empty']">
                  {{ state.selectedSize ? `${state.selectedSize}"` : '---' }}
                </span>
              </div>
              <div class="selection-row">
                <span class="selection-label">QTY</span>
                <span :class="['selection-value', !state.selectedQuantity && 'empty']">
                  {{ state.selectedQuantity?.toLocaleString() || '---' }}
                  <span v-if="isCustomQuantitySelected" class="custom-indicator">CUSTOM</span>
                </span>
              </div>
              <div class="selection-row">
                <span class="selection-label">BACKING</span>
                <span :class="['selection-value', !state.selectedBacking && 'empty']">
                  {{ state.selectedBacking?.name || '---' }}
                </span>
              </div>
              <div class="selection-row">
                <span class="selection-label">PACKAGE</span>
                <span :class="['selection-value', !state.selectedPackaging && 'empty']">
                  {{ state.selectedPackaging?.name || '---' }}
                </span>
              </div>
              <div v-if="state.rushOrder" class="selection-row rush">
                <span class="selection-label">RUSH</span>
                <span class="selection-value">ENABLED +20%</span>
              </div>
            </div>

            <!-- Breakdown -->
            <div v-if="priceBreakdown" class="breakdown-list">
              <div class="breakdown-header">COST BREAKDOWN</div>
              <div class="breakdown-row">
                <span>BASE ({{ state.selectedQuantity?.toLocaleString() }} @ ${{ priceBreakdown.unitPrice.toFixed(2) }})</span>
                <span>${{ priceBreakdown.basePrice.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.setupFee > 0" class="breakdown-row">
                <span>SETUP FEE</span>
                <span>${{ priceBreakdown.setupFee.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.platingCost > 0" class="breakdown-row">
                <span>PLATING</span>
                <span>${{ priceBreakdown.platingCost.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.backingCost > 0" class="breakdown-row">
                <span>BACKING</span>
                <span>${{ priceBreakdown.backingCost.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.packagingCost > 0" class="breakdown-row">
                <span>PACKAGING</span>
                <span>${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.moldFee > 0 || priceBreakdown.moldFeeWaived" class="breakdown-row" :class="priceBreakdown.moldFeeWaived && 'waived'">
                <span>MOLD FEE <span v-if="priceBreakdown.moldFeeWaived">[WAIVED]</span></span>
                <span :class="priceBreakdown.moldFeeWaived && 'line-through'">${{ priceBreakdown.moldFee.toFixed(2) }}</span>
              </div>
              <div v-if="priceBreakdown.rushFee > 0" class="breakdown-row rush">
                <span>RUSH FEE</span>
                <span>${{ priceBreakdown.rushFee.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button
                :disabled="!isSelectionComplete"
                class="action-btn primary"
              >
                GENERATE QUOTE
              </button>
            </div>

            <div class="font-mono text-[9px] text-center text-cyan-900 mt-4 tracking-wider">
              QUOTE VALID 30 DAYS FROM GENERATION
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { SIZES, QUANTITIES } from '~/data/pricing';

useHead({
  title: 'Demo Four - Industrial All-in-One | Pin Calculator',
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

const productionMethods = getAvailableProductionMethods();
const platingOptions = getAvailablePlatingOptions();
const backingOptions = getAvailableBackingOptions();
const packagingOptions = getAvailablePackagingOptions();
const sizes = SIZES;
const quantities = QUANTITIES;

const customQtyInput = ref('');
const animatedTotal = ref(0);
const animatedUnitTotal = ref(0);

// Animate value helper - must be defined before watchers
const animateValue = (refValue: { value: number }, target: number) => {
  if (typeof window === 'undefined') {
    refValue.value = target;
    return;
  }

  const start = refValue.value;
  const diff = target - start;
  const duration = 350;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    refValue.value = start + diff * easeOut;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// Animate price changes
watch(() => priceBreakdown.value?.total, (newTotal) => {
  if (newTotal === undefined) {
    animateValue(animatedTotal, 0);
    return;
  }
  animateValue(animatedTotal, newTotal);
}, { immediate: true });

watch(() => {
  if (!priceBreakdown.value || !state.selectedQuantity) return 0;
  return priceBreakdown.value.total / state.selectedQuantity;
}, (newValue) => {
  animateValue(animatedUnitTotal, newValue);
}, { immediate: true });

const isCustomQuantitySelected = computed(() => {
  if (!state.selectedQuantity) return false;
  return !quantities.includes(state.selectedQuantity);
});

const getUnitPrice = (size: string, qty: number): string => {
  if (!state.selectedProductionMethod) return '--';
  const price = state.selectedProductionMethod.pricing[size]?.[qty];
  return price?.toFixed(2) ?? '--';
};

const selectSize = (size: string) => {
  if (state.selectedQuantity) {
    setSizeAndQuantity(size, state.selectedQuantity);
  } else {
    setSizeAndQuantity(size, quantities[0]);
  }
};

const selectQuantity = (qty: number) => {
  if (state.selectedSize) {
    setSizeAndQuantity(state.selectedSize, qty);
    customQtyInput.value = '';
  }
};

const applyCustomQty = () => {
  const value = customQtyInput.value.trim();
  if (!value || !state.selectedSize) return;

  const numValue = parseInt(value, 10);
  if (isNaN(numValue) || numValue < 1) return;

  setSizeAndQuantity(state.selectedSize, numValue);
};

const getStepComplete = (step: number): boolean => {
  switch (step) {
    case 1: return !!state.selectedProductionMethod;
    case 2: return !!state.selectedPlatingType;
    case 3: return !!state.selectedSize;
    case 4: return !!state.selectedQuantity;
    case 5: return !!state.selectedBacking;
    case 6: return !!state.selectedPackaging;
    default: return false;
  }
};

const formatAnimatedPrice = (value: number): string => {
  return value.toFixed(2).padStart(8, ' ');
};
</script>

<style scoped>
.demo-four {
  font-family: 'JetBrains Mono', monospace;
}

/* Blueprint Grid */
.blueprint-grid {
  background-image:
    linear-gradient(rgba(6, 182, 212, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.06) 1px, transparent 1px),
    linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
}

/* Spec Panel */
.spec-panel {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(6, 182, 212, 0.15);
  transition: all 0.2s ease;
}

.spec-panel.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(6, 182, 212, 0.1);
  background: rgba(6, 182, 212, 0.02);
}

.panel-number {
  font-size: 9px;
  font-weight: 600;
  color: rgba(6, 182, 212, 0.5);
  padding: 2px 5px;
  border: 1px solid rgba(6, 182, 212, 0.25);
}

.panel-title {
  flex: 1;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: #e0f2fe;
}

.panel-status {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 2px 6px;
}

.panel-status.complete {
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
}

.panel-status.pending {
  background: rgba(100, 116, 139, 0.15);
  color: #64748b;
}

.mold-waived {
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.panel-content {
  padding: 14px;
}

/* Spec Buttons */
.spec-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 12px 8px;
  min-height: 56px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.12);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.spec-btn:hover {
  background: rgba(6, 182, 212, 0.08);
  border-color: rgba(6, 182, 212, 0.25);
  color: #e0f2fe;
}

.spec-btn.active {
  background: rgba(6, 182, 212, 0.12);
  border-color: #06b6d4;
  color: #06b6d4;
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.15);
}

.spec-btn-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.12);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.spec-btn-sm:hover:not(:disabled) {
  background: rgba(6, 182, 212, 0.08);
  border-color: rgba(6, 182, 212, 0.25);
  color: #e0f2fe;
}

.spec-btn-sm.active {
  background: rgba(6, 182, 212, 0.12);
  border-color: #06b6d4;
  color: #06b6d4;
}

.spec-btn-sm:disabled {
  cursor: not-allowed;
}

.btn-label {
  font-size: 10px;
  font-weight: 500;
}

.btn-addon {
  font-size: 9px;
  color: #fbbf24;
}

.btn-price {
  font-size: 9px;
  color: #fbbf24;
}

.btn-price.free {
  color: #6ee7b7;
}

/* Size Buttons */
.size-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.12);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.size-btn:hover:not(:disabled) {
  background: rgba(6, 182, 212, 0.08);
  border-color: rgba(6, 182, 212, 0.25);
  color: #e0f2fe;
}

.size-btn.active {
  background: rgba(6, 182, 212, 0.12);
  border-color: #06b6d4;
  color: #06b6d4;
}

.size-btn:disabled {
  cursor: not-allowed;
}

.size-value {
  font-size: 16px;
  font-weight: 600;
}

.size-unit {
  font-size: 10px;
  opacity: 0.6;
}

/* Quantity Buttons */
.qty-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px 6px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.12);
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(6, 182, 212, 0.08);
  border-color: rgba(6, 182, 212, 0.25);
  color: #e0f2fe;
}

.qty-btn.active {
  background: rgba(6, 182, 212, 0.12);
  border-color: #06b6d4;
  color: #06b6d4;
}

.qty-btn:disabled {
  cursor: not-allowed;
}

.qty-value {
  font-size: 12px;
  font-weight: 600;
}

.qty-price {
  font-size: 9px;
  opacity: 0.6;
}

.qty-btn.active .qty-price {
  opacity: 0.8;
  color: #67e8f9;
}

/* Custom Quantity Input */
.custom-qty-input {
  width: 100px;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 10px;
  text-align: center;
  background: rgba(15, 23, 42, 0.5);
  border: 1px dashed rgba(6, 182, 212, 0.25);
  color: #e0f2fe;
  outline: none;
  transition: all 0.15s ease;
}

.custom-qty-input::placeholder {
  color: rgba(6, 182, 212, 0.35);
}

.custom-qty-input:focus {
  background: rgba(6, 182, 212, 0.08);
  border-color: #06b6d4;
  border-style: solid;
}

.custom-qty-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Rush Toggle */
.rush-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(251, 191, 36, 0.15);
  cursor: pointer;
  transition: all 0.15s ease;
}

.rush-toggle:hover:not(:disabled) {
  background: rgba(251, 191, 36, 0.05);
  border-color: rgba(251, 191, 36, 0.25);
}

.rush-toggle.active {
  background: rgba(251, 191, 36, 0.1);
  border-color: #fbbf24;
}

.rush-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rush-indicator {
  width: 36px;
  height: 20px;
  background: rgba(100, 116, 139, 0.3);
  border-radius: 10px;
  padding: 3px;
  transition: background 0.2s ease;
}

.rush-toggle.active .rush-indicator {
  background: rgba(251, 191, 36, 0.5);
}

.rush-dot {
  display: block;
  width: 14px;
  height: 14px;
  background: #64748b;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.rush-toggle.active .rush-dot {
  transform: translateX(16px);
  background: #fbbf24;
}

.rush-text {
  text-align: left;
}

.rush-label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: #e0f2fe;
}

.rush-desc {
  display: block;
  font-size: 9px;
  color: #64748b;
  margin-top: 1px;
}

.rush-toggle.active .rush-desc {
  color: #fbbf24;
}

/* Digital Display */
.digital-display {
  background: #020617;
  border: 1px solid rgba(6, 182, 212, 0.25);
  padding: 20px;
  margin-bottom: 16px;
  text-align: center;
}

.digital-label {
  font-size: 8px;
  letter-spacing: 0.2em;
  color: rgba(6, 182, 212, 0.5);
  margin-bottom: 6px;
}

.digital-value {
  font-size: 32px;
  font-weight: 300;
  color: #06b6d4;
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
  font-variant-numeric: tabular-nums;
}

.digital-currency {
  font-size: 20px;
  opacity: 0.6;
}

.digital-per-unit {
  font-size: 10px;
  color: rgba(6, 182, 212, 0.6);
  margin-top: 6px;
  letter-spacing: 0.1em;
}

/* Selections List */
.selections-list {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.1);
  padding: 12px;
  margin-bottom: 16px;
}

.selection-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(6, 182, 212, 0.06);
  font-size: 10px;
}

.selection-row:last-child {
  border-bottom: none;
}

.selection-row.rush {
  color: #fbbf24;
}

.selection-label {
  color: #475569;
  letter-spacing: 0.05em;
}

.selection-value {
  color: #94a3b8;
  font-weight: 500;
}

.selection-value.empty {
  color: #334155;
}

.custom-indicator {
  font-size: 8px;
  padding: 1px 4px;
  background: rgba(6, 182, 212, 0.15);
  color: #06b6d4;
  margin-left: 6px;
}

/* Breakdown List */
.breakdown-list {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.1);
  padding: 12px;
  margin-bottom: 16px;
}

.breakdown-header {
  font-size: 8px;
  letter-spacing: 0.15em;
  color: rgba(6, 182, 212, 0.5);
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(6, 182, 212, 0.1);
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 10px;
  color: #64748b;
}

.breakdown-row.waived {
  color: #10b981;
}

.breakdown-row.rush {
  color: #fbbf24;
}

/* Actions */
.actions {
  margin-top: 16px;
}

.action-btn {
  width: 100%;
  padding: 14px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn.primary {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(14, 165, 233, 0.15));
  border: 1px solid #06b6d4;
  color: #06b6d4;
}

.action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(14, 165, 233, 0.25));
  box-shadow: 0 0 24px rgba(6, 182, 212, 0.25);
}

.action-btn.primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
