<template>
  <div
    :class="[
      'demo-five min-h-screen transition-colors duration-300',
      isDark ? 'bg-gray-950' : 'bg-gray-50'
    ]"
    :style="{ '--accent': accentColor, '--accent-rgb': accentRgb }"
  >
    <!-- Header -->
    <header
      :class="[
        'sticky top-0 z-30 transition-all duration-300 backdrop-blur-xl',
        isDark
          ? 'bg-gray-950/80 border-b border-gray-800/50'
          : 'bg-white/80 border-b border-gray-200/50'
      ]"
    >
      <div class="px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300',
              'bg-[var(--accent)] text-white shadow-lg'
            ]"
            :style="{ boxShadow: `0 4px 14px rgba(${accentRgb}, 0.4)` }"
          >
            P
          </div>
          <span :class="['text-lg font-semibold', isDark ? 'text-white' : 'text-gray-900']">
            Pin Calculator
          </span>
        </div>

        <div class="flex items-center gap-3">
          <!-- Theme Color Picker -->
          <div class="relative" ref="colorPickerRef">
            <button
              @click="showColorPicker = !showColorPicker"
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              :class="isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'"
            >
              <div
                class="w-5 h-5 rounded-full ring-2 ring-white/20"
                :style="{ backgroundColor: accentColor }"
              />
            </button>

            <!-- Color Picker Dropdown -->
            <Transition name="dropdown">
              <div
                v-if="showColorPicker"
                :class="[
                  'absolute right-0 top-full mt-2 p-3 rounded-2xl shadow-2xl border z-50',
                  isDark
                    ? 'bg-gray-900 border-gray-700'
                    : 'bg-white border-gray-200'
                ]"
              >
                <p :class="['text-xs font-medium mb-2 px-1', isDark ? 'text-gray-400' : 'text-gray-500']">
                  Theme Color
                </p>
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="color in themeColors"
                    :key="color.name"
                    @click="setThemeColor(color)"
                    class="group relative w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                  >
                    <svg
                      v-if="selectedTheme === color.name"
                      class="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-md"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDark"
            class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            :class="isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Reset Button -->
          <button
            @click="resetSelections"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            :class="isDark
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
          >
            Reset
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

      <!-- Left: Configuration Panel -->
      <div class="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <!-- Production Method -->
          <section :class="sectionClasses">
            <div class="section-header">
              <div :class="['step-indicator', state.selectedProductionMethod && 'complete']">
                <svg v-if="state.selectedProductionMethod" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>1</span>
              </div>
              <h3 class="section-title">Production Method</h3>
            </div>
            <div class="section-content">
              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  v-for="method in productionMethods"
                  :key="method.id"
                  @click="setProductionMethod(method)"
                  :class="['option-card', state.selectedProductionMethod?.id === method.id && 'selected']"
                >
                  <span class="option-name">{{ method.name }}</span>
                  <span v-if="method.setupFee" class="option-price">+${{ method.setupFee }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Plating -->
          <section :class="[sectionClasses, !state.selectedProductionMethod && 'disabled']">
            <div class="section-header">
              <div :class="['step-indicator', state.selectedPlatingType && 'complete']">
                <svg v-if="state.selectedPlatingType" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>2</span>
              </div>
              <h3 class="section-title">Plating</h3>
            </div>
            <div class="section-content">
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="plating in platingOptions"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :disabled="!state.selectedProductionMethod"
                  :class="['chip-btn', state.selectedPlatingType?.id === plating.id && 'selected']"
                >
                  <span>{{ plating.name }}</span>
                  <span v-if="!plating.isFree" class="chip-price">+${{ plating.price.toFixed(2) }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Size -->
          <section :class="[sectionClasses, !state.selectedPlatingType && 'disabled']">
            <div class="section-header">
              <div :class="['step-indicator', state.selectedSize && 'complete']">
                <svg v-if="state.selectedSize" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>3</span>
              </div>
              <h3 class="section-title">Size</h3>
            </div>
            <div class="section-content">
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="selectSize(size)"
                  :disabled="!state.selectedPlatingType"
                  :class="['size-card', state.selectedSize === size && 'selected']"
                >
                  <span class="size-value">{{ size }}"</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Quantity -->
          <section :class="[sectionClasses, !state.selectedSize && 'disabled']">
            <div class="section-header">
              <div :class="['step-indicator', state.selectedQuantity && 'complete']">
                <svg v-if="state.selectedQuantity" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>4</span>
              </div>
              <h3 class="section-title">Quantity</h3>
              <Transition name="badge-pop">
                <span v-if="state.selectedQuantity && state.selectedQuantity >= 500" class="mold-badge">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Mold fee waived
                </span>
              </Transition>
            </div>
            <div class="section-content">
              <div class="grid grid-cols-4 sm:grid-cols-8 gap-3">
                <button
                  v-for="qty in quantities"
                  :key="qty"
                  @click="selectQuantity(qty)"
                  :disabled="!state.selectedSize"
                  :class="['qty-card', state.selectedQuantity === qty && 'selected']"
                >
                  <span class="qty-value">{{ qty }}</span>
                  <span v-if="state.selectedSize && state.selectedProductionMethod" class="qty-unit-price">
                    ${{ getUnitPrice(state.selectedSize, qty) }}
                  </span>
                </button>
              </div>

              <!-- Custom Quantity Input -->
              <div class="mt-5 flex items-center gap-4">
                <label :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-500']">
                  Custom:
                </label>
                <input
                  v-model="customQtyInput"
                  type="text"
                  inputmode="numeric"
                  placeholder="Enter quantity"
                  :disabled="!state.selectedSize"
                  @keydown.enter="applyCustomQty"
                  @blur="applyCustomQty"
                  :class="['custom-qty-input', isDark ? 'dark' : 'light']"
                />
                <Transition name="fade-slide">
                  <span v-if="isCustomQuantitySelected" class="custom-qty-label">
                    {{ state.selectedQuantity?.toLocaleString() }} units
                  </span>
                </Transition>
              </div>
            </div>
          </section>

          <!-- Backing -->
          <section :class="[sectionClasses, !state.selectedQuantity && 'disabled']">
            <div class="section-header">
              <div :class="['step-indicator', state.selectedBacking && 'complete']">
                <svg v-if="state.selectedBacking" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>5</span>
              </div>
              <h3 class="section-title">Backing</h3>
            </div>
            <div class="section-content">
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="backing in backingOptions"
                  :key="backing.id"
                  @click="setBacking(backing)"
                  :disabled="!state.selectedQuantity"
                  :class="['chip-btn', state.selectedBacking?.id === backing.id && 'selected']"
                >
                  <span>{{ backing.name }}</span>
                  <span v-if="!backing.isFree" class="chip-price">+${{ backing.price.toFixed(2) }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Packaging & Rush -->
          <section :class="[sectionClasses, !state.selectedBacking && 'disabled']">
            <div class="section-header">
              <div :class="['step-indicator', state.selectedPackaging && 'complete']">
                <svg v-if="state.selectedPackaging" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>6</span>
              </div>
              <h3 class="section-title">Packaging</h3>
            </div>
            <div class="section-content">
              <div class="flex flex-wrap gap-3 mb-5">
                <button
                  v-for="pkg in packagingOptions"
                  :key="pkg.id"
                  @click="setPackaging(pkg)"
                  :disabled="!state.selectedBacking"
                  :class="['chip-btn', state.selectedPackaging?.id === pkg.id && 'selected']"
                >
                  <span>{{ pkg.name }}</span>
                  <span v-if="!pkg.isFree" class="chip-price">+${{ pkg.price.toFixed(2) }}</span>
                </button>
              </div>

              <!-- Rush Order Toggle -->
              <button
                @click="setRushOrder(!state.rushOrder)"
                :disabled="!state.selectedPackaging"
                :class="['rush-toggle', state.rushOrder && 'active', isDark ? 'dark' : 'light']"
              >
                <div class="rush-switch">
                  <div class="rush-switch-thumb" />
                </div>
                <div class="rush-label">
                  <span class="rush-title">Rush Order</span>
                  <span class="rush-subtitle">+20% for expedited production</span>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>

      <!-- Right: Summary Panel -->
      <div
        :class="[
          'lg:w-[480px] xl:w-[520px] 2xl:w-[560px] p-6 lg:p-8 transition-all duration-300',
          isDark
            ? 'bg-gray-900/80'
            : 'bg-gray-100/80'
        ]"
      >
        <div class="lg:sticky lg:top-24 space-y-5">

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span :class="['text-sm font-medium', isDark ? 'text-gray-400' : 'text-gray-600']">
                Progress
              </span>
              <span :class="['text-sm font-semibold tabular-nums', isDark ? 'text-gray-200' : 'text-gray-800']">
                {{ completionPercent }}%
              </span>
            </div>
            <div :class="['h-2 rounded-full overflow-hidden', isDark ? 'bg-gray-800' : 'bg-gray-200']">
              <div
                class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{
                  width: `${completionPercent}%`,
                  backgroundColor: accentColor,
                  boxShadow: `0 0 12px rgba(${accentRgb}, 0.5)`
                }"
              />
            </div>
          </div>

          <!-- Current Selections -->
          <div :class="['summary-card', isDark ? 'dark' : 'light']">
            <div class="summary-row">
              <span class="summary-label">Method</span>
              <span :class="['summary-value', state.selectedProductionMethod && 'active']">
                {{ state.selectedProductionMethod?.name || '—' }}
              </span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Plating</span>
              <span :class="['summary-value', state.selectedPlatingType && 'active']">
                {{ state.selectedPlatingType?.name || '—' }}
              </span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Size</span>
              <span :class="['summary-value', state.selectedSize && 'active']">
                {{ state.selectedSize ? `${state.selectedSize}"` : '—' }}
              </span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Quantity</span>
              <span :class="['summary-value', state.selectedQuantity && 'active']">
                {{ state.selectedQuantity?.toLocaleString() || '—' }}
                <span v-if="isCustomQuantitySelected" class="text-xs ml-1" :style="{ color: accentColor }">(custom)</span>
              </span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Backing</span>
              <span :class="['summary-value', state.selectedBacking && 'active']">
                {{ state.selectedBacking?.name || '—' }}
              </span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Packaging</span>
              <span :class="['summary-value', state.selectedPackaging && 'active']">
                {{ state.selectedPackaging?.name || '—' }}
              </span>
            </div>
            <Transition name="fade-slide">
              <div v-if="state.rushOrder" class="summary-row rush">
                <span class="summary-label">Rush</span>
                <span class="summary-value">+20%</span>
              </div>
            </Transition>
          </div>

          <!-- Price Breakdown -->
          <Transition name="expand">
            <div v-if="priceBreakdown" :class="['breakdown-card', isDark ? 'dark' : 'light']">
              <h4 class="breakdown-title">Breakdown</h4>
              <div class="breakdown-list">
                <div class="breakdown-row">
                  <span>Base Price</span>
                  <span class="tabular-nums">${{ priceBreakdown.basePrice.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.setupFee > 0" class="breakdown-row">
                  <span>Setup Fee</span>
                  <span class="tabular-nums">${{ priceBreakdown.setupFee.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.platingCost > 0" class="breakdown-row">
                  <span>Plating</span>
                  <span class="tabular-nums">${{ priceBreakdown.platingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.backingCost > 0" class="breakdown-row">
                  <span>Backing</span>
                  <span class="tabular-nums">${{ priceBreakdown.backingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.packagingCost > 0" class="breakdown-row">
                  <span>Packaging</span>
                  <span class="tabular-nums">${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.moldFee > 0 || priceBreakdown.moldFeeWaived" class="breakdown-row">
                  <span>
                    Mold Fee
                    <span v-if="priceBreakdown.moldFeeWaived" class="waived-badge">waived</span>
                  </span>
                  <span :class="['tabular-nums', priceBreakdown.moldFeeWaived && 'line-through opacity-50']">
                    ${{ priceBreakdown.moldFee.toFixed(2) }}
                  </span>
                </div>
                <div v-if="priceBreakdown.rushFee > 0" class="breakdown-row rush">
                  <span>Rush Fee</span>
                  <span class="tabular-nums">${{ priceBreakdown.rushFee.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Total Price Card -->
          <div
            class="total-card"
            :style="{
              backgroundColor: accentColor,
              boxShadow: `0 8px 32px rgba(${accentRgb}, 0.35)`
            }"
          >
            <div class="total-content">
              <div class="total-main">
                <span class="total-label">Total</span>
                <span class="total-amount" :key="animatedTotal">
                  ${{ animatedTotal.toFixed(2) }}
                </span>
              </div>
              <div v-if="priceBreakdown && state.selectedQuantity" class="total-unit">
                <span class="unit-label">Per Unit</span>
                <span class="unit-amount">
                  ${{ animatedUnitPrice.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Generate Quote Button -->
          <button
            :disabled="!isSelectionComplete"
            :class="['quote-btn', isSelectionComplete && 'ready']"
            :style="isSelectionComplete ? {
              borderColor: accentColor,
              color: accentColor
            } : {}"
          >
            <span>Generate Quote</span>
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <p :class="['text-xs text-center', isDark ? 'text-gray-500' : 'text-gray-400']">
            Quote valid for 30 days
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { SIZES, QUANTITIES } from '~/data/pricing';

useHead({
  title: 'Demo Five - Modern Theme | Pin Calculator',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap' }
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

// Theme colors
const themeColors = [
  { name: 'blue', value: '#3b82f6', rgb: '59, 130, 246' },
  { name: 'violet', value: '#8b5cf6', rgb: '139, 92, 246' },
  { name: 'purple', value: '#a855f7', rgb: '168, 85, 247' },
  { name: 'fuchsia', value: '#d946ef', rgb: '217, 70, 239' },
  { name: 'pink', value: '#ec4899', rgb: '236, 72, 153' },
  { name: 'rose', value: '#f43f5e', rgb: '244, 63, 94' },
  { name: 'red', value: '#ef4444', rgb: '239, 68, 68' },
  { name: 'orange', value: '#f97316', rgb: '249, 115, 22' },
  { name: 'amber', value: '#f59e0b', rgb: '245, 158, 11' },
  { name: 'yellow', value: '#eab308', rgb: '234, 179, 8' },
  { name: 'lime', value: '#84cc16', rgb: '132, 204, 22' },
  { name: 'green', value: '#22c55e', rgb: '34, 197, 94' },
  { name: 'emerald', value: '#10b981', rgb: '16, 185, 129' },
  { name: 'teal', value: '#14b8a6', rgb: '20, 184, 166' },
  { name: 'cyan', value: '#06b6d4', rgb: '6, 182, 212' },
];

const isDark = ref(true);
const selectedTheme = ref('blue');
const showColorPicker = ref(false);
const colorPickerRef = ref<HTMLElement | null>(null);
const customQtyInput = ref('');
const animatedTotal = ref(0);
const animatedUnitPrice = ref(0);

const accentColor = computed(() => {
  const found = themeColors.find(c => c.name === selectedTheme.value);
  return found?.value || '#3b82f6';
});

const accentRgb = computed(() => {
  const found = themeColors.find(c => c.name === selectedTheme.value);
  return found?.rgb || '59, 130, 246';
});

// Click outside to close color picker
const handleClickOutside = (event: MouseEvent) => {
  if (colorPickerRef.value && !colorPickerRef.value.contains(event.target as Node)) {
    showColorPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  // Load saved preferences
  const savedDark = localStorage.getItem('pin-pricer-demo-five-dark');
  if (savedDark !== null) {
    isDark.value = savedDark === 'true';
  }

  const savedTheme = localStorage.getItem('pin-pricer-demo-five-theme');
  if (savedTheme && themeColors.some(c => c.name === savedTheme)) {
    selectedTheme.value = savedTheme;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const toggleDark = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('pin-pricer-demo-five-dark', String(isDark.value));
};

const setThemeColor = (color: { name: string; value: string; rgb: string }) => {
  selectedTheme.value = color.name;
  localStorage.setItem('pin-pricer-demo-five-theme', color.name);
  showColorPicker.value = false;
};

// Animate values - SSR safe
const animateValue = (refValue: { value: number }, target: number, duration = 350) => {
  if (typeof window === 'undefined') {
    refValue.value = target;
    return;
  }

  const start = refValue.value;
  const diff = target - start;
  const startTime = performance.now();

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    refValue.value = start + diff * eased;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

watch(() => priceBreakdown.value?.total, (newTotal) => {
  animateValue(animatedTotal, newTotal ?? 0);
}, { immediate: true });

watch(() => {
  if (!priceBreakdown.value || !state.selectedQuantity) return 0;
  return priceBreakdown.value.total / state.selectedQuantity;
}, (newValue) => {
  animateValue(animatedUnitPrice, newValue);
}, { immediate: true });

const completionPercent = computed(() => {
  let steps = 0;
  if (state.selectedProductionMethod) steps++;
  if (state.selectedPlatingType) steps++;
  if (state.selectedSize) steps++;
  if (state.selectedQuantity) steps++;
  if (state.selectedBacking) steps++;
  if (state.selectedPackaging) steps++;
  return Math.round((steps / 6) * 100);
});

const isCustomQuantitySelected = computed(() => {
  if (!state.selectedQuantity) return false;
  return !quantities.includes(state.selectedQuantity);
});

const sectionClasses = computed(() => {
  return ['section-panel', isDark.value ? 'dark' : 'light'];
});

const getUnitPrice = (size: string, qty: number): string => {
  if (!state.selectedProductionMethod) return '—';
  const price = state.selectedProductionMethod.pricing[size]?.[qty];
  return price?.toFixed(2) ?? '—';
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
</script>

<style scoped>
.demo-five {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --accent: #3b82f6;
  --accent-rgb: 59, 130, 246;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.badge-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-pop-leave-active {
  transition: all 0.2s ease;
}

.badge-pop-enter-from,
.badge-pop-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Section Panel */
.section-panel {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s ease;
}

.section-panel.dark {
  background: linear-gradient(145deg, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.8));
  border: 1px solid rgba(75, 85, 99, 0.3);
}

.section-panel.light {
  background: white;
  border: 1px solid rgba(229, 231, 235, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-panel.disabled {
  opacity: 0.35;
  pointer-events: none;
  filter: grayscale(0.3);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
}

.section-panel.light .section-header {
  border-bottom-color: rgba(229, 231, 235, 1);
}

.step-indicator {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  background: rgba(75, 85, 99, 0.3);
  color: rgba(156, 163, 175, 1);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.section-panel.light .step-indicator {
  background: rgba(229, 231, 235, 1);
  color: rgba(107, 114, 128, 1);
}

.step-indicator.complete {
  background: var(--accent);
  color: white;
  box-shadow: 0 2px 8px rgba(var(--accent-rgb), 0.4);
}

.section-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.section-panel.dark .section-title {
  color: rgba(243, 244, 246, 1);
}

.mold-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(16, 185, 129, 0.15);
  color: rgb(16, 185, 129);
}

.section-content {
  padding: 20px;
}

/* Option Cards (Production Method) */
.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 18px 12px;
  min-height: 72px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(55, 65, 81, 0.3);
  border: 2px solid rgba(75, 85, 99, 0.3);
}

.section-panel.light .option-card {
  background: rgba(243, 244, 246, 1);
  border-color: rgba(229, 231, 235, 1);
}

.option-card:hover {
  transform: translateY(-2px);
  border-color: rgba(107, 114, 128, 0.5);
  background: rgba(55, 65, 81, 0.5);
}

.section-panel.light .option-card:hover {
  background: rgba(229, 231, 235, 1);
  border-color: rgba(209, 213, 219, 1);
}

.option-card.selected {
  background: rgba(var(--accent-rgb), 0.15);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 4px 12px rgba(var(--accent-rgb), 0.2);
}

.option-card:active {
  transform: scale(0.96);
}

.option-name {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.section-panel.dark .option-name {
  color: rgba(229, 231, 235, 1);
}

.option-price {
  font-size: 11px;
  font-weight: 600;
  color: rgb(251, 191, 36);
}

/* Chip Buttons (Plating, Backing, Packaging) */
.chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(55, 65, 81, 0.3);
  border: 2px solid rgba(75, 85, 99, 0.3);
}

.section-panel.light .chip-btn {
  background: rgba(243, 244, 246, 1);
  border-color: rgba(229, 231, 235, 1);
  color: rgba(55, 65, 81, 1);
}

.section-panel.dark .chip-btn {
  color: rgba(229, 231, 235, 1);
}

.chip-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(107, 114, 128, 0.5);
  background: rgba(55, 65, 81, 0.5);
}

.section-panel.light .chip-btn:hover:not(:disabled) {
  background: rgba(229, 231, 235, 1);
  border-color: rgba(209, 213, 219, 1);
}

.chip-btn.selected {
  background: rgba(var(--accent-rgb), 0.15);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

.chip-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.chip-btn:disabled {
  cursor: not-allowed;
}

.chip-price {
  font-size: 11px;
  color: rgb(251, 191, 36);
}

/* Size Cards */
.size-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(55, 65, 81, 0.3);
  border: 2px solid rgba(75, 85, 99, 0.3);
}

.section-panel.light .size-card {
  background: rgba(243, 244, 246, 1);
  border-color: rgba(229, 231, 235, 1);
}

.size-card:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(107, 114, 128, 0.5);
  background: rgba(55, 65, 81, 0.5);
}

.section-panel.light .size-card:hover:not(:disabled) {
  background: rgba(229, 231, 235, 1);
  border-color: rgba(209, 213, 219, 1);
}

.size-card.selected {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 4px 14px rgba(var(--accent-rgb), 0.35);
}

.size-card:active:not(:disabled) {
  transform: scale(0.94);
}

.size-card:disabled {
  cursor: not-allowed;
}

.size-value {
  font-size: 18px;
  font-weight: 700;
}

.section-panel.dark .size-value {
  color: rgba(229, 231, 235, 1);
}

.size-card.selected .size-value {
  color: white;
}

/* Quantity Cards */
.qty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(55, 65, 81, 0.3);
  border: 2px solid rgba(75, 85, 99, 0.3);
}

.section-panel.light .qty-card {
  background: rgba(243, 244, 246, 1);
  border-color: rgba(229, 231, 235, 1);
}

.qty-card:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(107, 114, 128, 0.5);
  background: rgba(55, 65, 81, 0.5);
}

.section-panel.light .qty-card:hover:not(:disabled) {
  background: rgba(229, 231, 235, 1);
  border-color: rgba(209, 213, 219, 1);
}

.qty-card.selected {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 4px 14px rgba(var(--accent-rgb), 0.35);
}

.qty-card:active:not(:disabled) {
  transform: scale(0.94);
}

.qty-card:disabled {
  cursor: not-allowed;
}

.qty-value {
  font-size: 15px;
  font-weight: 700;
}

.section-panel.dark .qty-value {
  color: rgba(229, 231, 235, 1);
}

.qty-card.selected .qty-value {
  color: white;
}

.qty-unit-price {
  font-size: 11px;
  color: rgba(156, 163, 175, 1);
}

.qty-card.selected .qty-unit-price {
  color: rgba(219, 234, 254, 1);
}

/* Custom Quantity Input */
.custom-qty-input {
  width: 150px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
}

.custom-qty-input.dark {
  background: rgba(55, 65, 81, 0.3);
  border: 2px solid rgba(75, 85, 99, 0.4);
  color: white;
}

.custom-qty-input.dark::placeholder {
  color: rgba(107, 114, 128, 1);
}

.custom-qty-input.dark:focus {
  border-color: var(--accent);
  background: rgba(55, 65, 81, 0.5);
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.15);
}

.custom-qty-input.light {
  background: rgba(243, 244, 246, 1);
  border: 2px solid rgba(229, 231, 235, 1);
  color: rgba(17, 24, 39, 1);
}

.custom-qty-input.light::placeholder {
  color: rgba(156, 163, 175, 1);
}

.custom-qty-input.light:focus {
  border-color: var(--accent);
  background: white;
  box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.1);
}

.custom-qty-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.custom-qty-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

/* Rush Toggle */
.rush-toggle {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.rush-toggle.dark {
  background: rgba(55, 65, 81, 0.3);
  border: 2px solid rgba(75, 85, 99, 0.3);
}

.rush-toggle.light {
  background: rgba(243, 244, 246, 1);
  border: 2px solid rgba(229, 231, 235, 1);
}

.rush-toggle:hover:not(:disabled) {
  border-color: rgba(251, 191, 36, 0.5);
}

.rush-toggle.active {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgb(251, 191, 36);
}

.rush-toggle:active:not(:disabled) {
  transform: scale(0.98);
}

.rush-toggle:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rush-switch {
  width: 52px;
  height: 28px;
  border-radius: 14px;
  padding: 3px;
  transition: background 0.25s ease;
  flex-shrink: 0;
}

.rush-toggle.dark .rush-switch {
  background: rgba(75, 85, 99, 0.6);
}

.rush-toggle.light .rush-switch {
  background: rgba(209, 213, 219, 1);
}

.rush-toggle.active .rush-switch {
  background: rgb(251, 191, 36);
}

.rush-switch-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.rush-toggle.active .rush-switch-thumb {
  transform: translateX(24px);
}

.rush-label {
  text-align: left;
}

.rush-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
}

.rush-toggle.dark .rush-title {
  color: rgba(229, 231, 235, 1);
}

.rush-subtitle {
  display: block;
  font-size: 12px;
  margin-top: 2px;
}

.rush-toggle.dark .rush-subtitle {
  color: rgba(156, 163, 175, 1);
}

.rush-toggle.light .rush-subtitle {
  color: rgba(107, 114, 128, 1);
}

.rush-toggle.active .rush-subtitle {
  color: rgb(251, 191, 36);
}

/* Summary Card */
.summary-card {
  border-radius: 14px;
  padding: 18px;
}

.summary-card.dark {
  background: rgba(31, 41, 55, 0.5);
}

.summary-card.light {
  background: rgba(243, 244, 246, 1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
}

.summary-label {
  color: rgba(156, 163, 175, 1);
}

.summary-value {
  font-weight: 600;
  transition: all 0.2s ease;
}

.summary-card.dark .summary-value {
  color: rgba(107, 114, 128, 1);
}

.summary-card.light .summary-value {
  color: rgba(156, 163, 175, 1);
}

.summary-value.active {
  color: rgba(243, 244, 246, 1);
}

.summary-card.light .summary-value.active {
  color: rgba(17, 24, 39, 1);
}

.summary-row.rush {
  color: rgb(251, 191, 36);
}

.summary-row.rush .summary-label,
.summary-row.rush .summary-value {
  color: rgb(251, 191, 36);
}

/* Breakdown Card */
.breakdown-card {
  border-radius: 14px;
  padding: 18px;
}

.breakdown-card.dark {
  background: rgba(31, 41, 55, 0.5);
}

.breakdown-card.light {
  background: rgba(243, 244, 246, 1);
}

.breakdown-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 14px;
}

.breakdown-card.dark .breakdown-title {
  color: rgba(107, 114, 128, 1);
}

.breakdown-card.light .breakdown-title {
  color: rgba(107, 114, 128, 1);
}

.breakdown-list {
  space-y: 10px;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.breakdown-card.dark .breakdown-row {
  color: rgba(209, 213, 219, 1);
}

.breakdown-card.light .breakdown-row {
  color: rgba(55, 65, 81, 1);
}

.breakdown-row.rush {
  color: rgb(251, 191, 36);
}

.waived-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.15);
  color: rgb(16, 185, 129);
  margin-left: 6px;
}

/* Total Card */
.total-card {
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.total-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.total-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.total-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.total-amount {
  font-size: 36px;
  font-weight: 800;
  color: white;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.total-unit {
  text-align: right;
}

.unit-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;
}

.unit-amount {
  font-size: 20px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

/* Quote Button */
.quote-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  background: rgba(75, 85, 99, 0.2);
  border: 2px solid rgba(75, 85, 99, 0.3);
  color: rgba(107, 114, 128, 1);
}

.quote-btn:disabled {
  cursor: not-allowed;
}

.quote-btn.ready {
  background: rgba(var(--accent-rgb), 0.1);
}

.quote-btn.ready:hover {
  background: rgba(var(--accent-rgb), 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(var(--accent-rgb), 0.25);
}

.quote-btn.ready:active {
  transform: scale(0.98);
}

/* Tabular nums */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
