<template>
  <div class="pricing-calculator max-w-6xl mx-auto p-3 xs:p-4 sm:p-6 space-y-6 xs:space-y-8">
    <!-- Progress Indicator -->
    <div 
      class="flex flex-row items-center justify-center space-x-2 sm:space-x-4 mb-6 xs:mb-8"
      role="progressbar"
      aria-label="Calculator progress"
      :aria-valuenow="getProgressValue()"
      aria-valuemin="0"
      aria-valuemax="4"
    >
      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          selectedProductionMethod 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-700 text-slate-400'
        ]">
          1
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          selectedProductionMethod ? 'text-slate-200' : 'text-slate-400'
        ]">
          Production
        </span>
      </div>
      
      <div class="hidden sm:block w-4 h-0.5 bg-slate-700"></div>
      
      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          selectedProductionMethod 
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-700 text-slate-400'
        ]">
          2
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          selectedProductionMethod ? 'text-slate-200' : 'text-slate-400'
        ]">
          Plating
        </span>
      </div>
      
      <div class="hidden sm:block w-4 h-0.5 bg-slate-700"></div>
      
      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          (selectedSize && selectedQuantity)
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-700 text-slate-400'
        ]">
          3
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          (selectedSize && selectedQuantity) ? 'text-slate-200' : 'text-slate-400'
        ]">
          Size
        </span>
      </div>
      
      <div class="hidden sm:block w-4 h-0.5 bg-slate-700"></div>
      
      <div class="flex items-center space-x-1 sm:space-x-2">
        <div :class="[
          'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
          (selectedBacking && selectedPackaging)
            ? 'bg-blue-600 text-white' 
            : 'bg-slate-700 text-slate-400'
        ]">
          4
        </div>
        <span :class="[
          'text-xs sm:text-sm font-medium',
          (selectedBacking && selectedPackaging) ? 'text-slate-200' : 'text-slate-400'
        ]">
          Options
        </span>
      </div>
    </div>

    <!-- Production Method Selection -->
    <section>
      <h2 class="text-lg xs:text-xl sm:text-2xl font-bold text-slate-50 mb-4 xs:mb-6 high-contrast:text-white leading-tight">
        Select Production Method
      </h2>
      <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 xs:gap-4">
        <label
          v-for="method in PRODUCTION_METHODS"
          :key="method.id"
          :class="getProductionMethodClasses(selectedProductionMethod?.id === method.id)"
        >
          <input
            type="radio"
            name="production-method"
            :value="method.id"
            :checked="selectedProductionMethod?.id === method.id"
            @change="handleProductionMethodChange(method)"
            class="sr-only"
          />
          <div class="flex-1 min-w-0">
            <div class="flex flex-col items-center space-y-1 min-h-[3rem] justify-center">
              <span class="font-medium text-sm xs:text-base leading-tight text-center">{{ method.name }}</span>
              <div
                v-if="method.setupFee"
                class="flex items-center space-x-1"
                :aria-label="`Setup fee: ${method.setupFee}`"
              >
                <svg
                  class="w-3 h-3 text-amber-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-xs text-amber-400 font-medium">+${{ method.setupFee }}</span>
              </div>
            </div>
          </div>
        </label>
      </div>
      
      <!-- Setup Fee Notice -->
      <div
        v-if="selectedProductionMethod?.setupFee"
        class="mt-4 p-4 bg-amber-900/20 border border-amber-700/30 rounded-xl"
      >
        <div class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="text-sm text-amber-200 leading-relaxed">
              <span class="font-medium">{{ selectedProductionMethod.name }}</span> includes a one-time setup fee of 
              <span class="font-semibold">${{ selectedProductionMethod.setupFee }}</span>
            </p>
            <p class="text-xs text-amber-300 mt-1 opacity-90">
              This fee applies once per order regardless of quantity
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Size & Quantity Selection -->
    <section v-if="selectedProductionMethod">
      <h2 class="text-lg xs:text-xl sm:text-2xl font-bold text-slate-50 mb-4 xs:mb-6 high-contrast:text-white leading-tight">
        Select Size & Quantity
      </h2>
      <div class="pricing-table-container" role="region" aria-label="Pricing table for size and quantity selection" tabindex="-1">
        <div class="overflow-x-auto px-1">
          <div class="min-w-[320px] xs:min-w-[480px] sm:min-w-[600px] lg:min-w-[700px]">
            <div 
              class="grid grid-cols-4 xs:grid-cols-6 sm:grid-cols-8 gap-1 mb-4"
              role="grid"
              aria-label="Price matrix with sizes and quantities"
            >
              <!-- Top-left empty cell -->
              <div 
                class="p-2 xs:p-3 text-center font-semibold text-slate-400 text-xs xs:text-sm"
                role="columnheader"
                aria-label="Size and quantity intersection"
              >
                <span class="hidden xs:inline">Size / Qty</span>
                <span class="xs:hidden">Size/Qty</span>
              </div>
              
              <!-- Quantity headers -->
              <div 
                v-for="quantity in QUANTITIES" 
                :key="quantity"
                class="p-2 xs:p-3 text-center font-semibold text-slate-200 text-xs xs:text-sm bg-slate-800 rounded-lg high-contrast:bg-slate-950 high-contrast:border high-contrast:border-slate-300"
                role="columnheader"
                :aria-label="`Quantity ${quantity.toLocaleString()}`"
              >
                <span class="hidden xs:inline">{{ quantity.toLocaleString() }}</span>
                <span class="xs:hidden">{{ formatQuantityShort(quantity) }}</span>
              </div>
              
              <!-- Size rows with pricing cells -->
              <template v-for="(size, sizeIndex) in SIZES" :key="size">
                <!-- Size header -->
                <div 
                  class="p-2 xs:p-3 text-center font-semibold text-slate-200 text-xs xs:text-sm bg-slate-800 rounded-lg high-contrast:bg-slate-950 high-contrast:border high-contrast:border-slate-300"
                  role="rowheader"
                  :aria-label="`Size ${size} inches`"
                >
                  {{ size }}"
                </div>
                
                <!-- Price cells for this size -->
                <button
                  v-for="(quantity, qtyIndex) in QUANTITIES"
                  :key="`${size}-${quantity}`"
                  @click="handleSizeQuantityChange(size, quantity)"
                  @keydown.enter="handleSizeQuantityChange(size, quantity)"
                  @keydown.space.prevent="handleSizeQuantityChange(size, quantity)"
                  :class="getPriceCellClasses(size, quantity)"
                  :aria-label="getPriceCellAriaLabel(size, quantity)"
                  :aria-pressed="selectedSize === size && selectedQuantity === quantity"
                  class="p-2 xs:p-3 cursor-pointer text-center text-xs xs:text-sm font-medium transition-all duration-250 rounded-lg border-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 min-h-[44px] reduced-motion:transition-none"
                  role="gridcell"
                  :tabindex="selectedSize === size && selectedQuantity === quantity ? 0 : -1"
                >
                  <div class="flex flex-col justify-center min-h-[2rem] xs:min-h-[2.5rem]">
                    <span class="font-semibold text-xs xs:text-sm">
                      ${{ (selectedProductionMethod.pricing[size]?.[quantity] || 0).toFixed(2) }}
                    </span>
                  </div>
                </button>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Selection Summary -->
        <div 
          v-if="selectedSize && selectedQuantity" 
          class="mt-4 p-3 xs:p-4 bg-slate-800 rounded-xl border border-slate-700 high-contrast:bg-slate-950 high-contrast:border-slate-300"
          role="status"
          aria-live="polite"
          aria-label="Current selection summary"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 xs:gap-3">
            <div class="text-slate-200">
              <span class="font-semibold">Selected:</span>
              <span class="ml-1">{{ selectedSize }}" × {{ selectedQuantity.toLocaleString() }} units</span>
            </div>
            <div class="text-left sm:text-right">
              <div class="text-sm text-slate-400">Unit Price: ${{ unitPrice.toFixed(2) }}</div>
              <div class="text-lg font-bold text-slate-100 high-contrast:text-white">
                Base Total: ${{ basePrice.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modifications Panel -->
    <section v-if="selectedSize && selectedQuantity">
      <h2 class="text-lg xs:text-xl sm:text-2xl font-bold text-slate-50 mb-4 xs:mb-6 high-contrast:text-white leading-tight">
        Select Options
      </h2>
      
      <div class="space-y-6 xs:space-y-8">
        <!-- Backing Options -->
        <fieldset>
          <legend class="text-lg font-semibold text-slate-200 mb-4 high-contrast:text-white">
            Backing Options
          </legend>
          <div 
            class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4"
            role="radiogroup"
            aria-labelledby="backing-options-legend"
          >
            <label
              v-for="option in BACKING_OPTIONS"
              :key="option.id"
              :class="getModificationOptionClasses(selectedBacking?.id === option.id)"
              @keydown.enter="selectedBacking = option"
              @keydown.space.prevent="selectedBacking = option"
            >
              <input
                type="radio"
                name="backing-option"
                :value="option.id"
                :checked="selectedBacking?.id === option.id"
                @change="selectedBacking = option"
                :aria-describedby="`backing-${option.id}-price`"
                class="sr-only"
              />
              <div class="flex-1 min-w-0">
                <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                  <span class="font-medium text-sm xs:text-base leading-tight">{{ option.name }}</span>
                  <span
                    :id="`backing-${option.id}-price`"
                    :class="[
                      'text-sm font-semibold flex-shrink-0',
                      option.isFree ? 'text-green-400 high-contrast:text-green-300' : 'text-slate-400 high-contrast:text-slate-300'
                    ]"
                  >
                    {{ option.isFree ? 'FREE' : `$${option.price.toFixed(2)}` }}
                  </span>
                </div>
              </div>
              <!-- Radio indicator -->
              <div
                :class="[
                  'ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-250 flex-shrink-0',
                  selectedBacking?.id === option.id
                    ? 'border-blue-500 bg-blue-500 high-contrast:border-blue-300 high-contrast:bg-blue-700'
                    : 'border-slate-500 high-contrast:border-slate-300'
                ]"
                aria-hidden="true"
              >
                <div
                  v-if="selectedBacking?.id === option.id"
                  class="w-2.5 h-2.5 rounded-full bg-white"
                />
              </div>
            </label>
          </div>
        </fieldset>
        
        <!-- Packaging Options -->
        <fieldset>
          <legend class="text-lg font-semibold text-slate-200 mb-4 high-contrast:text-white">
            Packaging Options
          </legend>
          <div 
            class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4"
            role="radiogroup"
            aria-labelledby="packaging-options-legend"
          >
            <label
              v-for="option in PACKAGING_OPTIONS"
              :key="option.id"
              :class="getModificationOptionClasses(selectedPackaging?.id === option.id)"
              @keydown.enter="selectedPackaging = option"
              @keydown.space.prevent="selectedPackaging = option"
            >
              <input
                type="radio"
                name="packaging-option"
                :value="option.id"
                :checked="selectedPackaging?.id === option.id"
                @change="selectedPackaging = option"
                :aria-describedby="`packaging-${option.id}-price`"
                class="sr-only"
              />
              <div class="flex-1 min-w-0">
                <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                  <span class="font-medium text-sm xs:text-base leading-tight">{{ option.name }}</span>
                  <span
                    :id="`packaging-${option.id}-price`"
                    :class="[
                      'text-sm font-semibold flex-shrink-0',
                      option.isFree ? 'text-green-400 high-contrast:text-green-300' : 'text-slate-400 high-contrast:text-slate-300'
                    ]"
                  >
                    {{ option.isFree ? 'FREE' : `$${option.price.toFixed(2)}` }}
                  </span>
                </div>
              </div>
              <!-- Radio indicator -->
              <div
                :class="[
                  'ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-250 flex-shrink-0',
                  selectedPackaging?.id === option.id
                    ? 'border-blue-500 bg-blue-500 high-contrast:border-blue-300 high-contrast:bg-blue-700'
                    : 'border-slate-500 high-contrast:border-slate-300'
                ]"
                aria-hidden="true"
              >
                <div
                  v-if="selectedPackaging?.id === option.id"
                  class="w-2.5 h-2.5 rounded-full bg-white"
                />
              </div>
            </label>
          </div>
        </fieldset>
        
        <!-- Rush Order Toggle -->
        <fieldset>
          <legend class="text-lg font-semibold text-slate-200 mb-4 high-contrast:text-white">
            Rush Order
          </legend>
          <label class="relative flex items-center p-3 xs:p-4 border rounded-xl cursor-pointer transition-all duration-250 ease-in-out focus-within:ring-3 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 min-h-[44px] reduced-motion:transition-none bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:shadow-sm active:bg-slate-700 active:scale-95 high-contrast:bg-slate-950 high-contrast:border-slate-300 high-contrast:text-white">
            <input
              v-model="isRushOrder"
              type="checkbox"
              class="sr-only"
            />
            <div class="flex-1 min-w-0">
              <div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
                <span class="font-medium text-sm xs:text-base leading-tight">Rush Order (+25%)</span>
                <span class="text-sm font-semibold flex-shrink-0 text-amber-400 high-contrast:text-amber-300">
                  Expedited Delivery
                </span>
              </div>
            </div>
            <!-- Toggle indicator -->
            <div
              :class="[
                'ml-3 w-12 h-6 rounded-full border-2 flex items-center transition-all duration-250 flex-shrink-0',
                isRushOrder
                  ? 'border-blue-500 bg-blue-500 justify-end high-contrast:border-blue-300 high-contrast:bg-blue-700'
                  : 'border-slate-500 bg-slate-700 justify-start high-contrast:border-slate-300'
              ]"
              aria-hidden="true"
            >
              <div
                :class="[
                  'w-4 h-4 rounded-full bg-white transition-all duration-250',
                  isRushOrder ? 'mr-1' : 'ml-1'
                ]"
              />
            </div>
          </label>
        </fieldset>
      </div>
    </section>

    <!-- Price Breakdown & Quote Summary Side by Side -->
    <section v-if="selectedSize && selectedQuantity && selectedBacking && selectedPackaging">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8">
        <!-- Price Breakdown -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 xs:p-6 high-contrast:bg-slate-950 high-contrast:border-slate-300">
          <h3 class="text-lg font-semibold text-slate-50 mb-4 xs:mb-6">
            Price Breakdown
          </h3>
          
          <div class="space-y-3 xs:space-y-4" role="status" aria-live="polite">
            <!-- Base Price -->
            <div class="flex justify-between items-center text-slate-200 high-contrast:text-slate-100">
              <span class="text-sm xs:text-base">
                Base Price 
                <span class="text-xs xs:text-sm text-slate-400 high-contrast:text-slate-300">
                  (${{ unitPrice.toFixed(2) }} each)
                </span>
              </span>
              <span class="font-medium text-sm xs:text-base">${{ basePrice.toFixed(2) }}</span>
            </div>
            
            <!-- Setup Fee (only show if applicable) -->
            <div 
              v-if="setupFee > 0" 
              class="flex justify-between items-center text-slate-200 high-contrast:text-slate-100"
            >
              <span class="text-sm xs:text-base">Setup Fee</span>
              <span class="font-medium text-sm xs:text-base">${{ setupFee.toFixed(2) }}</span>
            </div>
            
            <!-- Mold Fee (only show if applicable or waived) -->
            <div 
              v-if="moldFee > 0 || moldFeeWaived" 
              class="flex justify-between items-center text-slate-200 high-contrast:text-slate-100"
            >
              <span class="text-sm xs:text-base">Mold Fee</span>
              <span v-if="moldFeeWaived" class="font-medium text-sm xs:text-base text-green-400 high-contrast:text-green-300">
                Waived (500+ qty)
              </span>
              <span v-else class="font-medium text-sm xs:text-base">${{ moldFee.toFixed(2) }}</span>
            </div>
            
            <!-- Backing Cost (only show if applicable) -->
            <div 
              v-if="selectedBacking && !selectedBacking.isFree" 
              class="flex justify-between items-center text-slate-200 high-contrast:text-slate-100"
            >
              <span class="text-sm xs:text-base">{{ selectedBacking.name }}</span>
              <span class="font-medium text-sm xs:text-base">${{ (selectedBacking.price * selectedQuantity).toFixed(2) }}</span>
            </div>
            
            <!-- Packaging Cost (only show if applicable) -->
            <div 
              v-if="selectedPackaging && !selectedPackaging.isFree" 
              class="flex justify-between items-center text-slate-200 high-contrast:text-slate-100"
            >
              <span class="text-sm xs:text-base">{{ selectedPackaging.name }}</span>
              <span class="font-medium text-sm xs:text-base">${{ (selectedPackaging.price * selectedQuantity).toFixed(2) }}</span>
            </div>
            
            <!-- Rush Order (only show if applicable) -->
            <div 
              v-if="isRushOrder && rushOrderCost > 0" 
              class="flex justify-between items-center text-slate-200 high-contrast:text-slate-100"
            >
              <span class="text-sm xs:text-base">Rush Order (25%)</span>
              <span class="font-medium text-sm xs:text-base">${{ rushOrderCost.toFixed(2) }}</span>
            </div>
            
            <!-- Divider -->
            <hr class="border-slate-600 high-contrast:border-slate-400">
            
            <!-- Total Price -->
            <div class="flex justify-between items-center">
              <span class="text-base xs:text-lg font-semibold text-slate-50 high-contrast:text-white">Total Price</span>
              <span class="text-lg xs:text-xl font-bold text-blue-400 high-contrast:text-blue-300">${{ totalPrice.toFixed(2) }}</span>
            </div>
            
            <!-- Unit Price -->
            <div class="text-center">
              <span class="text-sm text-slate-400 high-contrast:text-slate-300">
                ${{ (totalPrice / selectedQuantity).toFixed(2) }} per unit
              </span>
            </div>
          </div>
        </div>

        <!-- Quote Summary -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 xs:p-6 high-contrast:bg-slate-950 high-contrast:border-slate-300">
          <div class="flex items-center justify-between mb-4 xs:mb-6">
            <div>
              <h3 class="text-lg font-semibold text-slate-50">Quote Summary</h3>
              <p class="text-slate-400 text-sm mt-1">Lapel Pin Price Calculator</p>
            </div>
            <button 
              @click="generateQuote"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 hover:text-slate-200 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-slate-200 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM6 9a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              Print Quote
            </button>
          </div>

          <div class="space-y-6">
            <!-- Product Specifications -->
            <div>
              <h4 class="text-base font-medium text-slate-200 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                Product Specifications
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Production Method:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selectedProductionMethod?.name }}</span>
                    <span v-if="selectedProductionMethod?.setupFee" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-amber-900/20 text-amber-400 border border-amber-700/30">
                      Setup Fee
                    </span>
                  </div>
                </div>
                <div class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Size:</span>
                  <span class="text-slate-200 font-medium">{{ selectedSize }}"</span>
                </div>
                <div class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Quantity:</span>
                  <span class="text-slate-200 font-medium">{{ selectedQuantity?.toLocaleString() }} pieces</span>
                </div>
                <div class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Unit Price:</span>
                  <span class="text-slate-200 font-medium">${{ unitPrice.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Modifications -->
            <div>
              <h4 class="text-base font-medium text-slate-200 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
                </svg>
                Modifications
              </h4>
              <div class="space-y-2">
                <div class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Backing:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selectedBacking?.name }}</span>
                    <span v-if="selectedBacking?.isFree" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-900/20 text-green-400 border border-green-700/30">FREE</span>
                    <span v-else class="text-slate-300 text-xs">${{ selectedBacking?.price.toFixed(2) }}/pc</span>
                  </div>
                </div>
                <div class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Packaging:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selectedPackaging?.name }}</span>
                    <span v-if="selectedPackaging?.isFree" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-900/20 text-green-400 border border-green-700/30">FREE</span>
                    <span v-else class="text-slate-300 text-xs">${{ selectedPackaging?.price.toFixed(2) }}/pc</span>
                  </div>
                </div>
                <div v-if="isRushOrder" class="flex justify-between items-center py-1 text-sm">
                  <span class="text-slate-400">Rush Order:</span>
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-amber-900/20 text-amber-400 border border-amber-700/30">
                    +25% Expedited
                  </span>
                </div>
              </div>
            </div>

            <!-- Final Summary -->
            <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div class="text-center">
                <p class="text-slate-400 text-xs mb-1">Total Project Cost</p>
                <p class="text-2xl font-bold text-slate-50">${{ totalPrice.toFixed(2) }}</p>
                <p class="text-slate-400 text-xs mt-1">${{ (totalPrice / selectedQuantity).toFixed(2) }} per unit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProductionMethod, PlatingOption, BackingOption, PackagingOption } from '~/types/pricingSimple'
import { PRODUCTION_METHODS, PLATING_OPTIONS, BACKING_OPTIONS, PACKAGING_OPTIONS, SIZES, QUANTITIES } from '~/data/pricing'
import { 
  calculateMoldFee, 
  calculateBasePrice, 
  calculateSetupFee,
  calculateAddOns, 
  calculateTotal,
  calculatePriceBreakdown
} from '~/utils/calculationsSimple'

// Form State (replace 353-line composable)
const selectedProductionMethod = ref<ProductionMethod | null>(null)
const selectedSize = ref<string>('')
const selectedQuantity = ref<number>(0)
const selectedPlating = ref<PlatingOption | null>(null)
const selectedBacking = ref<BackingOption | null>(null)
const selectedPackaging = ref<PackagingOption | null>(null)
const isRushOrder = ref<boolean>(false)

// Computed Properties
const basePrice = computed(() => calculateBasePrice(
  selectedProductionMethod.value,
  selectedSize.value,
  selectedQuantity.value
))

const setupFee = computed(() => calculateSetupFee(selectedProductionMethod.value))

const unitPrice = computed(() => {
  if (!selectedProductionMethod.value?.pricing?.[selectedSize.value]?.[selectedQuantity.value]) return 0
  return selectedProductionMethod.value.pricing[selectedSize.value][selectedQuantity.value]
})

const moldFeeResult = computed(() => {
  if (!selectedSize.value || !selectedQuantity.value) return { fee: 0, waived: false }
  return calculateMoldFee(selectedSize.value, selectedQuantity.value)
})

const moldFee = computed(() => moldFeeResult.value.fee)

const moldFeeWaived = computed(() => moldFeeResult.value.waived)

const addOnCosts = computed(() => calculateAddOns(
  selectedPlating.value,
  selectedBacking.value,
  selectedPackaging.value,
  selectedQuantity.value
))

const rushOrderCost = computed(() => {
  if (!isRushOrder.value) return 0
  const subtotal = basePrice.value + setupFee.value + moldFee.value + addOnCosts.value
  return subtotal * 0.25
})

const totalPrice = computed(() => calculateTotal(
  basePrice.value + setupFee.value,
  moldFee.value,
  addOnCosts.value,
  isRushOrder.value
))

// Event Handlers
const handleProductionMethodChange = (method: ProductionMethod) => {
  selectedProductionMethod.value = method
  // Reset dependent selections
  selectedSize.value = ''
  selectedQuantity.value = 0
}

// Progress indicator
const getProgressValue = () => {
  let progress = 0
  if (selectedProductionMethod.value) progress += 1
  if (selectedProductionMethod.value) progress += 1 // Step 2 (plating built-in to production method)
  if (selectedSize.value && selectedQuantity.value) progress += 1
  if (selectedBacking.value && selectedPackaging.value) progress += 1
  return progress
}

// Production method styling (matching original)
const getProductionMethodClasses = (isSelected: boolean): string => {
  const baseClasses = [
    'relative flex items-center p-3 xs:p-4 border rounded-xl cursor-pointer',
    'transition-all duration-250 ease-in-out',
    'focus-within:ring-3 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
    'min-h-[44px]', // Enhanced touch target
    'reduced-motion:transition-none'
  ].join(' ')
  
  if (isSelected) {
    return [
      baseClasses,
      'bg-blue-900/30 border-blue-500 text-blue-200 shadow-md',
      'high-contrast:bg-blue-800 high-contrast:border-blue-300 high-contrast:text-white'
    ].join(' ')
  }
  
  return [
    baseClasses,
    'bg-slate-800 border-slate-600 text-slate-300',
    'hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:shadow-sm',
    'active:bg-slate-700 active:scale-95',
    'high-contrast:bg-slate-950 high-contrast:border-slate-300 high-contrast:text-white'
  ].join(' ')
}

// Price cell styling (matching original PricingTable)
const getPriceCellClasses = (size: string, quantity: number): string => {
  const isSelected = selectedSize.value === size && selectedQuantity.value === quantity
  
  const baseClasses = [
    'high-contrast:border-slate-300',
    'hover:shadow-md active:scale-95'
  ].join(' ')
  
  if (isSelected) {
    return `bg-blue-900/30 border-blue-500 text-blue-200 shadow-md high-contrast:bg-blue-800 high-contrast:border-blue-300 high-contrast:text-white ${baseClasses}`
  }
  
  return `bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:shadow-sm ${baseClasses}`
}

const getPriceCellAriaLabel = (size: string, quantity: number): string => {
  const price = selectedProductionMethod.value?.pricing[size]?.[quantity] || 0
  const total = price * quantity
  return `Size ${size} inches, quantity ${quantity.toLocaleString()}, unit price $${price.toFixed(2)}, total $${total.toFixed(2)}`
}

// Modification option styling (matching original ModificationsPanel)
const getModificationOptionClasses = (isSelected: boolean): string => {
  const baseClasses = [
    'relative flex items-center p-3 xs:p-4 border rounded-xl cursor-pointer',
    'transition-all duration-250 ease-in-out',
    'focus-within:ring-3 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-slate-900',
    'min-h-[44px]', // Enhanced touch target
    'reduced-motion:transition-none'
  ].join(' ')
  
  if (isSelected) {
    return [
      baseClasses,
      'bg-blue-900/30 border-blue-500 text-blue-200 shadow-md',
      'high-contrast:bg-blue-800 high-contrast:border-blue-300 high-contrast:text-white'
    ].join(' ')
  }
  
  return [
    baseClasses,
    'bg-slate-800 border-slate-600 text-slate-300',
    'hover:bg-slate-700/50 hover:border-slate-500 hover:text-slate-200 hover:shadow-sm',
    'active:bg-slate-700 active:scale-95',
    'high-contrast:bg-slate-950 high-contrast:border-slate-300 high-contrast:text-white'
  ].join(' ')
}

const handleSizeQuantityChange = (size: string, quantity: number) => {
  selectedSize.value = size
  selectedQuantity.value = quantity
}

const generateQuote = () => {
  const quote = {
    selections: {
      productionMethod: selectedProductionMethod.value?.name || '',
      size: selectedSize.value,
      quantity: selectedQuantity.value,
      plating: selectedPlating.value?.name,
      backing: selectedBacking.value?.name,
      packaging: selectedPackaging.value?.name,
      rushOrder: isRushOrder.value
    },
    pricing: {
      basePrice: basePrice.value,
      setupFee: setupFee.value,
      moldFee: moldFee.value,
      platingCost: selectedPlating.value && !selectedPlating.value.isFree ? selectedPlating.value.price * selectedQuantity.value : 0,
      backingCost: selectedBacking.value && !selectedBacking.value.isFree ? selectedBacking.value.price * selectedQuantity.value : 0,
      packagingCost: selectedPackaging.value && !selectedPackaging.value.isFree ? selectedPackaging.value.price * selectedQuantity.value : 0,
      rushOrderMultiplier: isRushOrder.value ? 0.25 : 0,
      totalPrice: totalPrice.value
    },
    unitPrice: totalPrice.value / selectedQuantity.value,
    generatedAt: new Date()
  }
  
  console.log('Generated Quote:', quote)
  // Here you would typically send this to a backend or show a detailed quote modal
}

// Utility function for responsive quantity display
const formatQuantityShort = (quantity: number): string => {
  if (quantity >= 1000) return `${quantity / 1000}k`
  return quantity.toString()
}
</script>

<style scoped>
/* Component-specific styles if needed */
.pricing-calculator {
  /* Any specific styles for the calculator */
}
</style>