<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- Sidebar -->
    <aside class="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col">
      <div class="p-6 border-b border-slate-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span class="text-white font-bold text-sm">P</span>
          </div>
          <span class="font-semibold text-slate-800">Pin Pricer</span>
        </div>
      </div>

      <nav class="flex-1 p-4">
        <ul class="space-y-1">
          <li v-for="(section, index) in sections" :key="section.id">
            <button
              @click="activeSection = section.id"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSection === section.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              <span :class="[
                'w-6 h-6 rounded flex items-center justify-center text-xs font-bold',
                isSectionComplete(section.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
              ]">
                <svg v-if="isSectionComplete(section.id)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span v-else>{{ index + 1 }}</span>
              </span>
              {{ section.label }}
            </button>
          </li>
        </ul>
      </nav>

      <!-- Summary in Sidebar -->
      <div v-if="isSelectionComplete && priceBreakdown" class="p-4 border-t border-slate-100">
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <p class="text-sm text-indigo-100 mb-1">Quote Total</p>
          <p class="text-2xl font-bold">${{ priceBreakdown.total.toFixed(2) }}</p>
          <p class="text-xs text-indigo-200 mt-1">${{ (priceBreakdown.total / state.selectedQuantity!).toFixed(2) }}/piece</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="lg:hidden flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span class="text-white font-bold text-sm">P</span>
            </div>
            <span class="font-semibold text-slate-800">Pin Pricer</span>
          </div>
          <h1 class="text-lg font-semibold text-slate-800 hidden lg:block">{{ currentSectionTitle }}</h1>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="completionPercent > 0" class="text-sm text-slate-500">{{ completionPercent }}% complete</span>
          <button
            @click="resetSelections"
            class="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      <!-- Mobile Section Tabs -->
      <div class="lg:hidden overflow-x-auto border-b border-slate-200 bg-white">
        <div class="flex px-4 gap-1">
          <button
            v-for="(section, index) in sections"
            :key="section.id"
            @click="activeSection = section.id"
            :class="[
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              activeSection === section.id
                ? 'text-indigo-600 border-indigo-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            ]"
          >
            {{ section.label }}
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <main class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-4xl mx-auto">

          <!-- Production Method Section -->
          <section v-if="activeSection === 'method'" class="space-y-4">
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="method in productionMethods"
                :key="method.id"
                @click="setProductionMethod(method)"
                :class="[
                  'bg-white rounded-xl p-5 border-2 cursor-pointer transition-all',
                  state.selectedProductionMethod?.id === method.id
                    ? 'border-indigo-500 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-indigo-300'
                ]"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-semibold text-slate-800">{{ method.name }}</h3>
                    <p v-if="method.setupFee" class="text-sm text-amber-600 mt-1">+${{ method.setupFee }} setup</p>
                  </div>
                  <div v-if="state.selectedProductionMethod?.id === method.id" class="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Plating Section -->
          <section v-if="activeSection === 'plating'" class="space-y-4">
            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50">
                <h3 class="font-medium text-slate-700">Standard Finishes (Free)</h3>
              </div>
              <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="plating in freePlating"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :class="[
                    'p-3 rounded-lg border transition-all text-left',
                    state.selectedPlatingType?.id === plating.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300'
                  ]"
                >
                  <span class="text-sm font-medium text-slate-700">{{ plating.name }}</span>
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50">
                <h3 class="font-medium text-slate-700">Premium Finishes</h3>
              </div>
              <div class="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="plating in premiumPlating"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :class="[
                    'p-3 rounded-lg border transition-all text-left',
                    state.selectedPlatingType?.id === plating.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300'
                  ]"
                >
                  <span class="text-sm font-medium text-slate-700">{{ plating.name }}</span>
                  <span class="block text-xs text-indigo-600">+${{ plating.price.toFixed(2) }}/ea</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Size & Quantity Section -->
          <section v-if="activeSection === 'sizing'" class="space-y-4">
            <div v-if="!state.selectedProductionMethod" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p class="text-amber-800 text-sm">Please select a production method first.</p>
            </div>

            <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50">
                <h3 class="font-medium text-slate-700">Price Matrix</h3>
                <p class="text-sm text-slate-500">Click a cell to select size and quantity</p>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full min-w-[600px]">
                  <thead>
                    <tr class="border-b border-slate-100">
                      <th class="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Size</th>
                      <th v-for="qty in quantities" :key="qty" class="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">{{ qty }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="size in sizes" :key="size" class="border-b border-slate-50 hover:bg-slate-25">
                      <td class="p-3 font-medium text-slate-700">{{ size }}"</td>
                      <td v-for="qty in quantities" :key="`${size}-${qty}`" class="p-2">
                        <button
                          @click="setSizeAndQuantity(size, qty)"
                          :class="[
                            'w-full py-2 px-3 rounded-lg text-sm font-medium transition-all',
                            state.selectedSize === size && state.selectedQuantity === qty
                              ? 'bg-indigo-600 text-white shadow-md'
                              : 'bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
                          ]"
                        >
                          ${{ getUnitPrice(size, qty) }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="state.selectedQuantity && state.selectedQuantity >= 500" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <p class="font-medium text-emerald-800">Mold fee waived!</p>
                <p class="text-sm text-emerald-600">Orders of 500+ pieces qualify for free mold fees.</p>
              </div>
            </div>
          </section>

          <!-- Options Section -->
          <section v-if="activeSection === 'options'" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Backing -->
              <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 class="font-medium text-slate-700">Backing Type</h3>
                </div>
                <div class="p-4 space-y-2 max-h-64 overflow-y-auto">
                  <button
                    v-for="backing in backingOptions"
                    :key="backing.id"
                    @click="setBacking(backing)"
                    :class="[
                      'w-full p-3 rounded-lg border transition-all flex justify-between items-center',
                      state.selectedBacking?.id === backing.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    ]"
                  >
                    <span class="text-sm text-slate-700">{{ backing.name }}</span>
                    <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', backing.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700']">
                      {{ backing.isFree ? 'Free' : `+$${backing.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Packaging -->
              <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 class="font-medium text-slate-700">Packaging</h3>
                </div>
                <div class="p-4 space-y-2">
                  <button
                    v-for="pkg in packagingOptions"
                    :key="pkg.id"
                    @click="setPackaging(pkg)"
                    :class="[
                      'w-full p-3 rounded-lg border transition-all flex justify-between items-center',
                      state.selectedPackaging?.id === pkg.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-indigo-300'
                    ]"
                  >
                    <span class="text-sm text-slate-700">{{ pkg.name }}</span>
                    <span :class="['text-xs font-medium px-2 py-0.5 rounded-full', pkg.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700']">
                      {{ pkg.isFree ? 'Free' : `+$${pkg.price.toFixed(2)}` }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Rush Order -->
            <div class="bg-white rounded-xl border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-700">Rush Order</h3>
                  <p class="text-sm text-slate-500">20% surcharge for expedited production</p>
                </div>
                <button
                  @click="setRushOrder(!state.rushOrder)"
                  :class="[
                    'relative w-12 h-7 rounded-full transition-colors',
                    state.rushOrder ? 'bg-indigo-600' : 'bg-slate-300'
                  ]"
                >
                  <span :class="[
                    'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform',
                    state.rushOrder ? 'translate-x-6' : 'translate-x-1'
                  ]"/>
                </button>
              </div>
            </div>
          </section>

          <!-- Summary Section -->
          <section v-if="activeSection === 'summary'" class="space-y-6">
            <div v-if="!isSelectionComplete" class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <p class="text-amber-800 font-medium">Please complete all selections to view your quote.</p>
              <p class="text-sm text-amber-600 mt-1">Missing: {{ missingSelections.join(', ') }}</p>
            </div>

            <div v-else-if="priceBreakdown" class="space-y-6">
              <!-- Specs Cards -->
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl border border-slate-200 p-4">
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Production</p>
                  <p class="mt-1 font-semibold text-slate-800">{{ state.selectedProductionMethod?.name }}</p>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-4">
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Plating</p>
                  <p class="mt-1 font-semibold text-slate-800">{{ state.selectedPlatingType?.name }}</p>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-4">
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Size & Qty</p>
                  <p class="mt-1 font-semibold text-slate-800">{{ state.selectedSize }}" x {{ state.selectedQuantity?.toLocaleString() }}</p>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-4">
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Backing</p>
                  <p class="mt-1 font-semibold text-slate-800">{{ state.selectedBacking?.name }}</p>
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-4">
                  <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">Packaging</p>
                  <p class="mt-1 font-semibold text-slate-800">{{ state.selectedPackaging?.name }}</p>
                </div>
                <div v-if="state.rushOrder" class="bg-amber-50 rounded-xl border border-amber-200 p-4">
                  <p class="text-xs font-medium text-amber-600 uppercase tracking-wide">Rush Order</p>
                  <p class="mt-1 font-semibold text-amber-800">Yes (+20%)</p>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div class="p-4 border-b border-slate-100 bg-slate-50">
                  <h3 class="font-semibold text-slate-700">Price Breakdown</h3>
                </div>
                <div class="p-6">
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-slate-600">Base Price</span>
                      <span class="font-medium text-slate-800">${{ priceBreakdown.basePrice.toFixed(2) }}</span>
                    </div>
                    <div v-if="priceBreakdown.setupFee > 0" class="flex justify-between">
                      <span class="text-slate-600">Setup Fee</span>
                      <span class="font-medium text-slate-800">${{ priceBreakdown.setupFee.toFixed(2) }}</span>
                    </div>
                    <div v-if="priceBreakdown.platingCost > 0" class="flex justify-between">
                      <span class="text-slate-600">Plating Upgrade</span>
                      <span class="font-medium text-slate-800">${{ priceBreakdown.platingCost.toFixed(2) }}</span>
                    </div>
                    <div v-if="priceBreakdown.backingCost > 0" class="flex justify-between">
                      <span class="text-slate-600">Backing Upgrade</span>
                      <span class="font-medium text-slate-800">${{ priceBreakdown.backingCost.toFixed(2) }}</span>
                    </div>
                    <div v-if="priceBreakdown.packagingCost > 0" class="flex justify-between">
                      <span class="text-slate-600">Packaging Upgrade</span>
                      <span class="font-medium text-slate-800">${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
                    </div>
                    <div v-if="moldFeeWaived || hasMoldFee" class="flex justify-between">
                      <span class="text-slate-600">Mold Fee</span>
                      <span :class="moldFeeWaived ? 'text-emerald-600 font-semibold' : 'font-medium text-slate-800'">
                        {{ moldFeeWaived ? 'Waived' : `$${moldFeeAmount.toFixed(2)}` }}
                      </span>
                    </div>
                    <div v-if="priceBreakdown.rushFee > 0" class="flex justify-between text-amber-600">
                      <span>Rush Fee (+20%)</span>
                      <span class="font-medium">${{ priceBreakdown.rushFee.toFixed(2) }}</span>
                    </div>
                  </div>

                  <div class="mt-6 pt-6 border-t border-slate-200">
                    <div class="flex justify-between items-end">
                      <span class="text-lg font-semibold text-slate-700">Total</span>
                      <div class="text-right">
                        <span class="text-3xl font-bold text-indigo-600">${{ priceBreakdown.total.toFixed(2) }}</span>
                        <span class="block text-sm text-slate-500">${{ (priceBreakdown.total / state.selectedQuantity!).toFixed(2) }} per piece</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-4">
                <button @click="copyQuote" class="flex-1 py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                  Copy to Clipboard
                </button>
                <button @click="printQuote" class="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                  Print Quote
                </button>
              </div>

              <p class="text-xs text-center text-slate-400">Quote valid for 30 days. Prices subject to change.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { SIZES, QUANTITIES } from '~/data/pricing'

const {
  state,
  isSelectionComplete,
  priceBreakdown,
  hasMoldFee,
  moldFeeWaived,
  moldFeeAmount,
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
} = usePricingCalculator()

const activeSection = ref('method')

const sections = [
  { id: 'method', label: 'Production' },
  { id: 'plating', label: 'Plating' },
  { id: 'sizing', label: 'Size & Qty' },
  { id: 'options', label: 'Options' },
  { id: 'summary', label: 'Summary' }
]

const productionMethods = getAvailableProductionMethods()
const platingOptions = getAvailablePlatingOptions()
const backingOptions = getAvailableBackingOptions()
const packagingOptions = getAvailablePackagingOptions()

const freePlating = computed(() => platingOptions.filter(p => p.isFree))
const premiumPlating = computed(() => platingOptions.filter(p => !p.isFree))

const sizes = SIZES
const quantities = QUANTITIES

const isSectionComplete = (sectionId: string): boolean => {
  switch (sectionId) {
    case 'method': return !!state.selectedProductionMethod
    case 'plating': return !!state.selectedPlatingType
    case 'sizing': return !!state.selectedSize && !!state.selectedQuantity
    case 'options': return !!state.selectedBacking && !!state.selectedPackaging
    case 'summary': return isSelectionComplete.value
    default: return false
  }
}

const currentSectionTitle = computed(() => {
  return sections.find(s => s.id === activeSection.value)?.label || ''
})

const completionPercent = computed(() => {
  const completed = sections.filter(s => s.id !== 'summary' && isSectionComplete(s.id)).length
  return Math.round((completed / 4) * 100)
})

const missingSelections = computed(() => {
  const missing = []
  if (!state.selectedProductionMethod) missing.push('Production')
  if (!state.selectedPlatingType) missing.push('Plating')
  if (!state.selectedSize || !state.selectedQuantity) missing.push('Size & Quantity')
  if (!state.selectedBacking) missing.push('Backing')
  if (!state.selectedPackaging) missing.push('Packaging')
  return missing
})

const getUnitPrice = (size: string, qty: number): string => {
  if (!state.selectedProductionMethod) return '—'
  const price = state.selectedProductionMethod.pricing[size]?.[qty]
  return price?.toFixed(2) ?? '—'
}

const copyQuote = () => {
  if (!priceBreakdown.value) return
  const text = `Pin Quote - ${state.selectedProductionMethod?.name}
Size: ${state.selectedSize}" | Qty: ${state.selectedQuantity?.toLocaleString()}
Plating: ${state.selectedPlatingType?.name}
Backing: ${state.selectedBacking?.name}
Packaging: ${state.selectedPackaging?.name}
${state.rushOrder ? 'Rush Order: Yes (+20%)\n' : ''}
Total: $${priceBreakdown.value.total.toFixed(2)} ($${(priceBreakdown.value.total / state.selectedQuantity!).toFixed(2)}/ea)`

  navigator.clipboard.writeText(text)
}

const printQuote = () => {
  window.print()
}
</script>
