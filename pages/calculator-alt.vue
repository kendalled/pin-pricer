<template>
  <!-- Neobrutalist Calculator (functional) -->
  <div class="min-h-screen w-full overflow-x-hidden bg-yellow-50 text-slate-900">
    <!-- Header with progress -->
    <header class="sticky top-0 z-40 border-b-4 border-black bg-white">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="grid h-9 w-9 place-items-center border-4 border-black bg-black text-white text-sm font-black shadow-[4px_4px_0_#000]">P</div>
          <span class="text-base font-black tracking-tight">Pin Pricer</span>
          <span class="ml-2 hidden border-4 border-black bg-yellow-300 px-2 py-1 text-[10px] font-black shadow-[3px_3px_0_#000] sm:inline">Calculator Alt</span>
        </div>
        <div class="hidden w-full max-w-xl items-center gap-2 md:flex">
          <div class="flex w-full items-center gap-2">
            <div class="flex-1 border-4 border-black bg-lime-300 px-3 py-1.5 text-center text-[11px] font-black shadow-[3px_3px_0_#000]">Production</div>
            <div class="flex-1 border-4 border-black bg-white px-3 py-1.5 text-center text-[11px] font-black shadow-[3px_3px_0_#000]">Plating</div>
            <div class="flex-1 border-4 border-black bg-white px-3 py-1.5 text-center text-[11px] font-black shadow-[3px_3px_0_#000]">Size/Qty</div>
            <div class="flex-1 border-4 border-black bg-white px-3 py-1.5 text-center text-[11px] font-black shadow-[3px_3px_0_#000]">Mods</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a href="#" class="translate-x-0 translate-y-0 border-4 border-black bg-white px-3 py-2 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">Help</a>
          <a href="#" class="translate-x-0 translate-y-0 border-4 border-black bg-pink-300 px-4 py-2 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">New Quote</a>
        </div>
      </nav>
    </header>

    <!-- Main content: calculator layout -->
    <main class="mx-auto max-w-7xl gap-6 px-4 pb-28 pt-8 sm:px-6 lg:grid lg:grid-cols-[1.25fr_0.85fr] lg:px-8">
      <!-- Left: Unified form flow -->
      <form class="space-y-6" aria-label="Pin Calculator">
        <!-- Step 1: Production Method -->
        <section class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8" aria-labelledby="calc-method">
          <div class="mb-6 flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">1</div>
              <div>
                <h2 id="calc-method" class="text-lg font-black tracking-tight">Choose Production Method</h2>
                <p class="text-sm text-slate-700">Select a production process</p>
              </div>
            </div>
            <span class="hidden border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000] sm:inline">Step 1 out of 5</span>
          </div>

          <div class="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-5">
            <label
              v-for="m in productionMethods"
              :key="m.id"
              class="group flex cursor-pointer items-center gap-3 border-4 border-black p-3 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
              :class="state.selectedProductionMethod?.id === m.id ? 'bg-yellow-100' : 'bg-white'"
            >
              <input
                type="radio"
                name="prod"
                class="sr-only"
                :value="m.id"
                :checked="state.selectedProductionMethod?.id === m.id"
                @change="setProductionMethod(m)"
              />
              <span class="grid h-8 w-8 place-items-center border-2 border-black bg-black text-xs font-black text-white">{{ m.name.charAt(0) }}</span>
              <span class="text-sm font-black">{{ m.name }}</span>
              <span v-if="m.setupFee" class="ml-auto border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">+${{ m.setupFee }}</span>
            </label>
          </div>
        </section>

        <!-- Step 2: Plating Type -->
        <section class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8" aria-labelledby="calc-plating">
          <div class="mb-6 flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">2</div>
              <div>
                <h2 id="calc-plating" class="text-lg font-black tracking-tight">Choose Plating Type</h2>
                <p class="text-sm text-slate-700">Metal finish options</p>
              </div>
            </div>
            <span class="hidden border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000] sm:inline">Step 2 out of 5</span>
          </div>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <label
              v-for="p in platingOptions"
              :key="p.id"
              class="group flex cursor-pointer items-center gap-3 border-4 border-black p-3 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
              :class="state.selectedPlatingType?.id === p.id ? 'bg-yellow-100' : 'bg-white'"
            >
              <input
                type="radio"
                name="plating"
                class="sr-only"
                :value="p.id"
                :checked="state.selectedPlatingType?.id === p.id"
                @change="setPlatingType(p)"
              />
              <span class="text-sm font-black">{{ p.name }}</span>
              <span class="ml-auto border-2 border-black px-2 py-0.5 text-[10px] font-black" :class="p.isFree ? 'bg-emerald-200' : 'bg-amber-200'">{{ p.isFree ? 'FREE' : `+$${p.price.toFixed(2)}` }}</span>
            </label>
          </div>
        </section>

        <!-- Step 3: Size & Quantity (Pricing Matrix) -->
        <section class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8" aria-labelledby="calc-sizeqty">
          <div class="mb-6 flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">3</div>
              <div>
                <h2 id="calc-sizeqty" class="text-lg font-black tracking-tight">Select Size & Quantity</h2>
                <p class="text-sm text-slate-700">Tap any cell to pick a combo</p>
              </div>
            </div>
            <span class="hidden border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000] sm:inline">Step 3 out of 5</span>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-[720px] w-full border-collapse">
              <thead class="bg-slate-900 text-white">
                <tr>
                  <th class="border-4 border-black px-3 py-2 text-left text-xs font-black">Size/Qty</th>
                  <th
                    v-for="q in quantities"
                    :key="`h-${q}`"
                    class="border-4 border-black px-3 py-2 text-center text-xs font-black"
                  >
                    {{ q.toLocaleString() }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in sizes" :key="`r-${s}`" class="even:bg-yellow-50">
                  <th scope="row" class="border-4 border-black bg-slate-100 px-3 py-2 text-left text-xs font-black">{{ s }}"</th>
                  <td v-for="q in quantities" :key="`${s}-${q}`" class="border-4 border-black p-0">
                    <button
                      type="button"
                      @click="setSizeAndQuantity(s, q)"
                      class="block w-full px-3 py-2 text-center text-xs font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
                      :class="selectedSize === s && selectedQuantity === q ? 'bg-yellow-200' : 'bg-white'"
                    >
                      <span v-if="selectedProduction" class="inline-block">${{ getUnitPrice(s, q)?.toFixed(2) ?? '--' }}</span>
                      <span v-else class="inline-block text-slate-500">—</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="selectedSize && selectedQuantity" class="mt-4 border-4 border-black bg-yellow-100 p-3 text-sm font-black">
            Selected: {{ selectedSize }}" × {{ selectedQuantity.toLocaleString() }}
          </div>
        </section>

        <!-- Step 4: Modifications (Backing, Packaging, Rush) -->
        <section class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8" aria-labelledby="calc-mods">
          <div class="mb-6 flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">4</div>
              <div>
                <h2 id="calc-mods" class="text-lg font-black tracking-tight">Choose Modifications</h2>
                <p class="text-sm text-slate-700">Backing, packaging, and rush</p>
              </div>
            </div>
            <span class="hidden border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000] sm:inline">Step 4 out of 5</span>
          </div>

          <fieldset class="mb-6">
            <legend class="mb-3 text-sm font-black">Backing Options</legend>
            <div class="grid grid-cols-1 gap-2 xs:grid-cols-2 lg:grid-cols-3">
              <label
                v-for="b in backingOptions"
                :key="b.id"
                class="group flex cursor-pointer items-center gap-3 border-4 border-black p-3 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
                :class="state.selectedBacking?.id === b.id ? 'bg-yellow-100' : 'bg-white'"
              >
                <input
                  type="radio"
                  name="backing"
                  class="sr-only"
                  :value="b.id"
                  :checked="state.selectedBacking?.id === b.id"
                  @change="setBacking(b)"
                />
                <span class="text-sm font-black">{{ b.name }}</span>
                <span class="ml-auto border-2 border-black px-2 py-0.5 text-[10px] font-black" :class="b.isFree ? 'bg-emerald-200' : 'bg-amber-200'">{{ b.isFree ? 'FREE' : `+$${b.price.toFixed(2)}` }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="mb-6">
            <legend class="mb-3 text-sm font-black">Packaging Options</legend>
            <div class="grid grid-cols-1 gap-2 xs:grid-cols-2 lg:grid-cols-3">
              <label
                v-for="p in packagingOptions"
                :key="p.id"
                class="group flex cursor-pointer items-center gap-3 border-4 border-black p-3 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1"
                :class="state.selectedPackaging?.id === p.id ? 'bg-yellow-100' : 'bg-white'"
              >
                <input
                  type="radio"
                  name="packaging"
                  class="sr-only"
                  :value="p.id"
                  :checked="state.selectedPackaging?.id === p.id"
                  @change="setPackaging(p)"
                />
                <span class="text-sm font-black">{{ p.name }}</span>
                <span class="ml-auto border-2 border-black px-2 py-0.5 text-[10px] font-black" :class="p.isFree ? 'bg-emerald-200' : 'bg-amber-200'">{{ p.isFree ? 'FREE' : `+$${p.price.toFixed(2)}` }}</span>
              </label>
            </div>
          </fieldset>

          <div class="flex items-center justify-between gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
            <div>
              <h3 class="text-sm font-black">Rush Order</h3>
              <p class="text-xs text-slate-700">Adds ~20% for expedited processing</p>
            </div>
            <label class="inline-flex cursor-pointer items-center gap-3">
              <input type="checkbox" class="h-5 w-5 border-2 border-black accent-black" :checked="state.rushOrder" @change="setRushOrder(($event.target as HTMLInputElement).checked)" />
              <span class="text-xs font-black">{{ rushOrder ? 'Enabled' : 'Disabled' }}</span>
            </label>
          </div>
        </section>

        <!-- Group: Packaging & Timeline -->
        <section class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8" aria-labelledby="calc-pack">
          <div class="mb-6 flex items-start justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">5</div>
              <div>
                <h2 id="calc-pack" class="text-lg font-black tracking-tight">Packaging & Timeline</h2>
                <p class="text-sm text-slate-700">Presentation and delivery speed</p>
              </div>
            </div>
            <span class="hidden border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000] sm:inline">Step 5 out of 5</span>
          </div>
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div class="space-y-2">
              <div class="text-xs font-black uppercase tracking-wider">Packaging</div>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="p in packagingOptions"
                  :key="p.id"
                  type="button"
                  @click="setPackaging(p)"
                  :aria-pressed="state.selectedPackaging?.id === p.id"
                  :class="[
                    'translate-x-0 translate-y-0 border-4 border-black p-3 text-left text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1',
                    state.selectedPackaging?.id === p.id ? 'bg-yellow-200' : 'bg-white'
                  ]"
                >
                  {{ p.name }}
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <div class="text-xs font-black uppercase tracking-wider">Timeline</div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="selectTimeline('standard')"
                  :aria-pressed="selectedTimeline === 'standard'"
                  :class="[
                    'translate-x-0 translate-y-0 border-4 border-black p-3 text-left text-xs font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1',
                    selectedTimeline === 'standard' ? 'bg-yellow-200' : 'bg-white'
                  ]"
                >
                  Standard<br /><span class="text-[10px] font-medium text-slate-700">10–14 days</span>
                </button>
                <button
                  type="button"
                  @click="selectTimeline('rush')"
                  :aria-pressed="selectedTimeline === 'rush'"
                  :class="[
                    'translate-x-0 translate-y-0 border-4 border-black p-3 text-left text-xs font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1',
                    selectedTimeline === 'rush' ? 'bg-yellow-200' : 'bg-white'
                  ]"
                >
                  Rush<br /><span class="text-[10px] font-medium text-slate-800">7–9 days</span>
                </button>
                <button
                  type="button"
                  @click="selectTimeline('priority')"
                  :aria-pressed="selectedTimeline === 'priority'"
                  :class="[
                    'translate-x-0 translate-y-0 border-4 border-black p-3 text-left text-xs font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1',
                    selectedTimeline === 'priority' ? 'bg-yellow-200' : 'bg-white'
                  ]"
                >
                  Priority<br /><span class="text-[10px] font-medium text-slate-700">5–6 days</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </form>

      <!-- Right: Summary & preview -->
      <aside class="mt-6 space-y-6 lg:sticky lg:top-24 lg:mt-0">
        <!-- Visual preview (placeholder) -->
        <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000]">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-sm font-black">Design Preview</h3>
            <span class="border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">Preview</span>
          </div>
          <div class="grid place-items-center rounded-none border-4 border-dashed border-black py-12">
            <div class="h-28 w-28 rotate-3 border-4 border-black bg-gradient-to-br from-amber-200 to-pink-200"></div>
          </div>
          
        </div>

        <!-- Summary Card -->
        <div class="border-4 border-black bg-white shadow-[8px_8px_0_#000]">
          <div class="p-6 sm:p-8">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-base font-black tracking-tight">Your Quote</h3>
              
            </div>
            <div class="mb-4 flex items-end justify-between">
              <div>
                <div class="text-4xl font-black tracking-tight">{{ `$${liveTotal.toFixed(2)}` }}</div>
                <div class="mt-1 border-2 border-black bg-white px-2 py-0.5 text-[11px] font-black">Unit {{ `$${liveUnit.toFixed(2)}` }}</div>
              </div>
              <div class="text-right text-xs text-slate-700">
                <template v-if="state.selectedQuantity && state.selectedSize && state.selectedProductionMethod && state.selectedPlatingType">
                  {{ state.selectedQuantity.toLocaleString() }} units • {{ state.selectedSize }}" • {{ state.selectedProductionMethod.name }} • {{ state.selectedPlatingType.name }}
                </template>
                <template v-else>
                  Select options to see summary
                </template>
              </div>
            </div>
            <div class="mb-6 grid grid-cols-1 gap-2 text-sm">
              <div v-if="state.selectedQuantity && state.selectedSize && state.selectedProductionMethod" class="flex items-center justify-between">
                <span class="text-slate-800">Pins ({{ state.selectedQuantity.toLocaleString() }} × {{ state.selectedSize }}")</span>
                <span class="font-black">${{ basePricePreview.toFixed(2) }}</span>
              </div>
              <div v-if="setupFeePreview > 0" class="flex items-center justify-between">
                <span class="text-slate-800">Setup Fee</span>
                <span class="font-black">${{ setupFeePreview.toFixed(2) }}</span>
              </div>
              <div v-if="platingCostPreview > 0" class="flex items-center justify-between">
                <span class="text-slate-800">{{ state.selectedPlatingType?.name }}</span>
                <span class="font-black">${{ platingCostPreview.toFixed(2) }}</span>
              </div>
              <div v-if="backingCostPreview > 0" class="flex items-center justify-between">
                <span class="text-slate-800">{{ state.selectedBacking?.name }}</span>
                <span class="font-black">${{ backingCostPreview.toFixed(2) }}</span>
              </div>
              <div v-if="packagingCostPreview > 0" class="flex items-center justify-between">
                <span class="text-slate-800">{{ state.selectedPackaging?.name }}</span>
                <span class="font-black">${{ packagingCostPreview.toFixed(2) }}</span>
              </div>
              <div v-if="moldFeePreview > 0" class="flex items-center justify-between">
                <span class="text-slate-800">Mold Fee</span>
                <span class="font-black">${{ moldFeePreview.toFixed(2) }}</span>
              </div>
              <div v-if="rushCostPreview > 0" class="flex items-center justify-between">
                <span class="text-slate-800">Rush (20%)</span>
                <span class="font-black">${{ rushCostPreview.toFixed(2) }}</span>
              </div>
            </div>
            <div class="mb-6 h-2 w-full border-2 border-black bg-slate-200"></div>
            <div class="flex items-center gap-2">
              <button class="flex-1 translate-x-0 translate-y-0 border-4 border-black bg-lime-300 px-4 py-2.5 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">Generate Quote</button>
              <button class="translate-x-0 translate-y-0 border-4 border-black bg-white px-4 py-2.5 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">Share</button>
            </div>
            
          </div>
        </div>
      </aside>
    </main>

    <!-- Sticky action bar (visual only) -->
    <div class="fixed inset-x-0 bottom-0 border-t-4 border-black bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div class="hidden items-center gap-2 text-xs font-black md:flex">
          <span class="border-2 border-black bg-yellow-200 px-2 py-0.5">Step 1</span>
          <span class="border-2 border-black bg-white px-2 py-0.5">Step 2</span>
          <span class="border-2 border-black bg-white px-2 py-0.5">Step 3</span>
          <span class="border-2 border-black bg-white px-2 py-0.5">Step 4</span>
          <span class="border-2 border-black bg-white px-2 py-0.5">Step 5</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="translate-x-0 translate-y-0 border-4 border-black bg-white px-4 py-2 text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Save Draft</button>
          <button class="translate-x-0 translate-y-0 border-4 border-black bg-pink-300 px-4 py-2 text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Review</button>
        </div>
      </div>
    </div>

    <!-- Footer note -->
    <footer class="mx-auto max-w-7xl px-4 pb-10 pt-2 text-center text-xs text-slate-600 sm:px-6 lg:px-8">
      Route: /calculator-alt
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { PRODUCTION_METHODS, PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS, SIZES, QUANTITIES } from '~/data/pricing';
import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption } from '~/types/pricing';
import { usePricingCalculator } from '~/composables/usePricingCalculator';
import { calculateMoldFee } from '~/utils/calculationsSimple';

// Source data (same as real calculator)
const productionMethods: ProductionMethod[] = PRODUCTION_METHODS;
const platingOptions: PlatingOption[] = PLATING_OPTIONS;
const backingOptions: BackingOption[] = BACKING_OPTIONS;
const packagingOptions: PackagingOption[] = PACKAGING_OPTIONS;
const sizes: string[] = SIZES;
const quantities: number[] = QUANTITIES;

// Use the real calculator state/logic
const {
  state,
  priceBreakdown,
  isSelectionComplete,
  setProductionMethod,
  setPlatingType,
  setSizeAndQuantity,
  setBacking,
  setPackaging,
  setRushOrder
} = usePricingCalculator();

// Helpers for template bindings
const selectedProduction = computed(() => state.selectedProductionMethod);
const selectedSize = computed(() => state.selectedSize);
const selectedQuantity = computed(() => state.selectedQuantity);
const selectedPlating = computed(() => state.selectedPlatingType);
const selectedBacking = computed(() => state.selectedBacking);
const selectedPackaging = computed(() => state.selectedPackaging);
const rushOrder = computed(() => state.rushOrder);

const getUnitPrice = (size: string, quantity: number) => {
  const method = state.selectedProductionMethod;
  if (!method) return null;
  const value = method.pricing[size]?.[quantity];
  return typeof value === 'number' ? value : null;
};

// Live progressive pricing (updates as you go)
const basePricePreview = computed(() => {
  const method = state.selectedProductionMethod;
  const size = state.selectedSize;
  const qty = state.selectedQuantity;
  if (method && size && qty) {
    const unit = method.pricing[size]?.[qty] ?? 0;
    return unit * qty;
  }
  return 0;
});

const setupFeePreview = computed(() => state.selectedProductionMethod?.setupFee ?? 0);

const platingCostPreview = computed(() => {
  const qty = state.selectedQuantity ?? 0;
  const plating = state.selectedPlatingType;
  if (!qty || !plating || plating.isFree) return 0;
  return plating.price * qty;
});

const backingCostPreview = computed(() => {
  const qty = state.selectedQuantity ?? 0;
  const opt = state.selectedBacking;
  if (!qty || !opt || opt.isFree) return 0;
  return opt.price * qty;
});

const packagingCostPreview = computed(() => {
  const qty = state.selectedQuantity ?? 0;
  const opt = state.selectedPackaging;
  if (!qty || !opt || opt.isFree) return 0;
  return opt.price * qty;
});

const moldFeePreview = computed(() => {
  const size = state.selectedSize;
  const qty = state.selectedQuantity ?? 0;
  if (!size || !qty) return 0;
  try {
    const res = calculateMoldFee(size, qty);
    return res.waived ? 0 : res.fee;
  } catch {
    return 0;
  }
});

const subtotalPreview = computed(() => basePricePreview.value + setupFeePreview.value + platingCostPreview.value + backingCostPreview.value + packagingCostPreview.value + moldFeePreview.value);

const rushCostPreview = computed(() => (state.rushOrder ? subtotalPreview.value * 0.2 : 0));

const liveTotal = computed(() => subtotalPreview.value + rushCostPreview.value);
const liveUnit = computed(() => {
  const qty = state.selectedQuantity ?? 0;
  return qty > 0 ? liveTotal.value / qty : 0;
});

// Timeline selection (maps to rush boolean)
const selectedTimeline = ref<'standard' | 'rush' | 'priority'>('standard');
const selectTimeline = (choice: 'standard' | 'rush' | 'priority') => {
  selectedTimeline.value = choice;
  setRushOrder(choice !== 'standard');
};
watch(
  () => state.rushOrder,
  (isRush) => {
    if (!isRush) selectedTimeline.value = 'standard';
    else if (selectedTimeline.value === 'standard') selectedTimeline.value = 'rush';
  }
);
</script>

<!-- No component-scoped CSS; relying entirely on Tailwind classes for design. -->


