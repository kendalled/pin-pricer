<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-100 text-zinc-900']">

    <!-- Header -->
    <header :class="['border-b transition-colors duration-300', isDark ? 'bg-zinc-950/90 border-zinc-800 backdrop-blur-xl' : 'bg-white/90 border-zinc-200 backdrop-blur-xl']">
      <div class="max-w-[1600px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="['w-8 h-8 rounded-lg font-bold flex items-center justify-center', isDark ? 'bg-violet-600 text-white' : 'bg-violet-600 text-white']">
            P
          </div>
          <span class="font-semibold">Pin Pricer</span>
          <span :class="['text-xs px-2 py-0.5 rounded-full', isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600']">Pro</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="toggleDark"
            :class="['w-9 h-9 rounded-lg flex items-center justify-center transition-colors', isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600']"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          </button>
          <button
            @click="resetAll"
            :class="['px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900']"
          >
            Reset
          </button>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="max-w-[1600px] mx-auto">
      <div class="flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">

        <!-- Left Panel: Inputs -->
        <div class="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">

            <!-- Production Method -->
            <div :class="['rounded-xl p-4 transition-colors duration-300', isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm']">
              <div class="flex items-center gap-2 mb-3">
                <div :class="['w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold', state.selectedProductionMethod ? 'bg-violet-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')]">
                  <svg v-if="state.selectedProductionMethod" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  <span v-else>1</span>
                </div>
                <h3 class="font-semibold">Production Style</h3>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  v-for="method in productionMethods"
                  :key="method.id"
                  @click="setProductionMethod(method)"
                  :class="[
                    'px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left',
                    state.selectedProductionMethod?.id === method.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                    'active:scale-[0.97]'
                  ]"
                >
                  {{ method.name }}
                  <span v-if="method.setupFee" :class="['block text-xs mt-0.5', state.selectedProductionMethod?.id === method.id ? 'text-violet-200' : (isDark ? 'text-amber-400' : 'text-amber-600')]">+${{ method.setupFee }}</span>
                </button>
              </div>
            </div>

            <!-- Plating -->
            <div :class="['rounded-xl p-4 transition-all duration-300', isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm', !state.selectedProductionMethod ? 'opacity-50' : '']">
              <div class="flex items-center gap-2 mb-3">
                <div :class="['w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold', state.selectedPlatingType ? 'bg-violet-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')]">
                  <svg v-if="state.selectedPlatingType" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  <span v-else>2</span>
                </div>
                <h3 class="font-semibold">Metal Finish</h3>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="plating in platingOptions"
                  :key="plating.id"
                  @click="setPlatingType(plating)"
                  :disabled="!state.selectedProductionMethod"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    state.selectedPlatingType?.id === plating.id
                      ? (plating.isFree ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25' : 'bg-amber-500 text-white shadow-lg shadow-amber-500/25')
                      : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                    'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
                  ]"
                >
                  {{ plating.name }}
                  <span v-if="!plating.isFree" class="opacity-70 ml-1">+${{ plating.price.toFixed(2) }}</span>
                </button>
              </div>
            </div>

            <!-- Size -->
            <div :class="['rounded-xl p-4 transition-all duration-300', isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm', !state.selectedPlatingType ? 'opacity-50' : '']">
              <div class="flex items-center gap-2 mb-3">
                <div :class="['w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold', state.selectedSize ? 'bg-violet-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')]">
                  <svg v-if="state.selectedSize" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  <span v-else>3</span>
                </div>
                <h3 class="font-semibold">Pin Size</h3>
              </div>

              <div class="flex gap-1.5">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="selectSize(size)"
                  :disabled="!state.selectedPlatingType"
                  :class="[
                    'flex-1 py-3 rounded-lg font-bold transition-all duration-200',
                    state.selectedSize === size
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                    'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
                  ]"
                >
                  {{ size }}"
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div :class="['rounded-xl p-4 transition-all duration-300', isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm', !state.selectedSize ? 'opacity-50' : '']">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div :class="['w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold', state.selectedQuantity ? 'bg-violet-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')]">
                    <svg v-if="state.selectedQuantity" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                    <span v-else>4</span>
                  </div>
                  <h3 class="font-semibold">Quantity</h3>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="isCustomQuantitySelected" :class="['text-xs px-2 py-0.5 rounded-full font-medium', isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700']">
                    Custom
                  </span>
                  <span v-if="state.selectedQuantity && state.selectedQuantity >= 500" :class="['text-xs px-2 py-0.5 rounded-full font-medium', isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700']">
                    Mold fee waived!
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                <button
                  v-for="qty in quantities"
                  :key="qty"
                  @click="selectQuantity(qty)"
                  :disabled="!state.selectedSize"
                  :class="[
                    'py-2.5 rounded-lg font-medium transition-all duration-200',
                    state.selectedQuantity === qty && !isCustomQuantitySelected
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                    'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
                  ]"
                >
                  <span class="block text-sm">{{ qty }}</span>
                  <span v-if="state.selectedSize && state.selectedProductionMethod" :class="['block text-xs', state.selectedQuantity === qty && !isCustomQuantitySelected ? 'text-violet-200' : (isDark ? 'text-zinc-500' : 'text-zinc-400')]">
                    ${{ getUnitPrice(state.selectedSize, qty) }}
                  </span>
                </button>
              </div>

              <!-- Custom Quantity Toggle & Input -->
              <div class="mt-3">
                <button
                  @click="showCustomQuantity = !showCustomQuantity"
                  :disabled="!state.selectedSize"
                  :class="[
                    'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2 border-dashed',
                    showCustomQuantity
                      ? (isDark ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-violet-500 bg-violet-50 text-violet-700')
                      : (isDark ? 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400' : 'border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:text-zinc-600'),
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  ]"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  {{ showCustomQuantity ? 'Hide Custom Quantity' : 'Enter Custom Quantity' }}
                </button>

                <div v-if="showCustomQuantity && state.selectedSize" class="mt-3 flex gap-2">
                  <input
                    v-model="customQuantityInput"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 175"
                    @input="handleCustomQuantityInput"
                    @keydown.enter="applyCustomQuantity"
                    :class="[
                      'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
                      isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-violet-500' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-violet-500',
                      'focus:outline-none focus:ring-2 focus:ring-violet-500/20'
                    ]"
                  />
                  <button
                    @click="applyCustomQuantity"
                    :disabled="!customQuantityInput"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                      customQuantityInput
                        ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25'
                        : (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'),
                      'active:scale-[0.97]'
                    ]"
                  >
                    Apply
                  </button>
                </div>

                <p v-if="isCustomQuantitySelected && state.selectedQuantity && state.selectedSize" :class="['mt-2 text-xs text-center', isDark ? 'text-violet-400' : 'text-violet-600']">
                  {{ state.selectedQuantity.toLocaleString() }} pcs @ ${{ getInterpolatedPrice(state.selectedSize, state.selectedQuantity).toFixed(2) }}/ea (interpolated)
                </p>
              </div>
            </div>

            <!-- Backing -->
            <div :class="['rounded-xl p-4 transition-all duration-300', isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm', !state.selectedQuantity ? 'opacity-50' : '']">
              <div class="flex items-center gap-2 mb-3">
                <div :class="['w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold', state.selectedBacking ? 'bg-violet-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')]">
                  <svg v-if="state.selectedBacking" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  <span v-else>5</span>
                </div>
                <h3 class="font-semibold">Backing</h3>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="backing in backingOptions"
                  :key="backing.id"
                  @click="setBacking(backing)"
                  :disabled="!state.selectedQuantity"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    state.selectedBacking?.id === backing.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                    'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
                  ]"
                >
                  {{ backing.name }}
                  <span v-if="!backing.isFree" :class="['ml-1', state.selectedBacking?.id === backing.id ? 'text-violet-200' : (isDark ? 'text-amber-400' : 'text-amber-600')]">+${{ backing.price.toFixed(2) }}</span>
                </button>
              </div>
            </div>

            <!-- Packaging & Rush -->
            <div :class="['rounded-xl p-4 transition-all duration-300', isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200 shadow-sm', !state.selectedBacking ? 'opacity-50' : '']">
              <div class="flex items-center gap-2 mb-3">
                <div :class="['w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold', state.selectedPackaging ? 'bg-violet-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-200 text-zinc-500')]">
                  <svg v-if="state.selectedPackaging" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  <span v-else>6</span>
                </div>
                <h3 class="font-semibold">Packaging</h3>
              </div>

              <div class="flex flex-wrap gap-1.5 mb-4">
                <button
                  v-for="pkg in packagingOptions"
                  :key="pkg.id"
                  @click="setPackaging(pkg)"
                  :disabled="!state.selectedBacking"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    state.selectedPackaging?.id === pkg.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                    'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed'
                  ]"
                >
                  {{ pkg.name }}
                  <span v-if="!pkg.isFree" :class="['ml-1', state.selectedPackaging?.id === pkg.id ? 'text-violet-200' : (isDark ? 'text-amber-400' : 'text-amber-600')]">+${{ pkg.price.toFixed(2) }}</span>
                </button>
              </div>

              <!-- Rush Toggle -->
              <button
                @click="setRushOrder(!state.rushOrder)"
                :disabled="!state.selectedPackaging"
                :class="[
                  'w-full p-3 rounded-lg flex items-center justify-between transition-all duration-200',
                  state.rushOrder
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                    : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'),
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                ]"
              >
                <div class="text-left">
                  <span class="font-medium block">Rush Order</span>
                  <span :class="['text-xs', state.rushOrder ? 'text-amber-100' : (isDark ? 'text-zinc-500' : 'text-zinc-500')]">+20% faster production</span>
                </div>
                <div :class="['w-10 h-6 rounded-full relative transition-colors', state.rushOrder ? 'bg-amber-600' : (isDark ? 'bg-zinc-700' : 'bg-zinc-300')]">
                  <span :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow', state.rushOrder ? 'translate-x-5' : 'translate-x-1']"/>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Panel: Live Preview -->
        <div :class="['lg:w-[380px] xl:w-[420px] p-4 lg:p-6 lg:border-l transition-colors duration-300', isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white']">
          <div class="lg:sticky lg:top-20">
            <h2 :class="['text-lg font-bold mb-4', isDark ? 'text-white' : 'text-zinc-900']">Live Quote</h2>

            <!-- Progress -->
            <div class="mb-6">
              <div class="flex justify-between text-xs mb-1.5">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Progress</span>
                <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">{{ completionPercent }}%</span>
              </div>
              <div :class="['h-2 rounded-full overflow-hidden', isDark ? 'bg-zinc-800' : 'bg-zinc-200']">
                <div
                  class="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500 ease-out"
                  :style="{ width: `${completionPercent}%` }"
                />
              </div>
            </div>

            <!-- Current Selections -->
            <div :class="['rounded-xl p-4 mb-4 space-y-2 text-sm', isDark ? 'bg-zinc-800' : 'bg-zinc-100']">
              <div class="flex justify-between">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Style</span>
                <span :class="['font-medium', isDark ? 'text-zinc-200' : 'text-zinc-800']">{{ state.selectedProductionMethod?.name || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Plating</span>
                <span :class="['font-medium', isDark ? 'text-zinc-200' : 'text-zinc-800']">{{ state.selectedPlatingType?.name || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Size</span>
                <span :class="['font-medium', isDark ? 'text-zinc-200' : 'text-zinc-800']">{{ state.selectedSize ? `${state.selectedSize}"` : '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Quantity</span>
                <span :class="['font-medium', isDark ? 'text-zinc-200' : 'text-zinc-800']">
                  {{ state.selectedQuantity?.toLocaleString() || '—' }}
                  <span v-if="isCustomQuantitySelected" :class="['ml-1 text-xs', isDark ? 'text-violet-400' : 'text-violet-600']">(custom)</span>
                </span>
              </div>
              <div class="flex justify-between">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Backing</span>
                <span :class="['font-medium', isDark ? 'text-zinc-200' : 'text-zinc-800']">{{ state.selectedBacking?.name || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">Packaging</span>
                <span :class="['font-medium', isDark ? 'text-zinc-200' : 'text-zinc-800']">{{ state.selectedPackaging?.name || '—' }}</span>
              </div>
              <div v-if="state.rushOrder" class="flex justify-between text-amber-500">
                <span>Rush Order</span>
                <span class="font-medium">+20%</span>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div v-if="priceBreakdown" :class="['rounded-xl p-4 mb-4', isDark ? 'bg-zinc-800' : 'bg-zinc-100']">
              <h3 :class="['text-xs font-semibold uppercase tracking-wider mb-3', isDark ? 'text-zinc-500' : 'text-zinc-500']">Breakdown</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">Base</span>
                  <span :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">${{ priceBreakdown.basePrice.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.setupFee > 0" class="flex justify-between">
                  <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">Setup</span>
                  <span :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">${{ priceBreakdown.setupFee.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.platingCost > 0" class="flex justify-between">
                  <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">Plating</span>
                  <span :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">${{ priceBreakdown.platingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.backingCost > 0" class="flex justify-between">
                  <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">Backing</span>
                  <span :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">${{ priceBreakdown.backingCost.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.packagingCost > 0" class="flex justify-between">
                  <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">Packaging</span>
                  <span :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">${{ priceBreakdown.packagingCost.toFixed(2) }}</span>
                </div>
                <div v-if="moldFeeWaived" class="flex justify-between text-emerald-500">
                  <span>Mold Fee</span>
                  <span class="font-medium">Waived</span>
                </div>
                <div v-else-if="hasMoldFee" class="flex justify-between">
                  <span :class="isDark ? 'text-zinc-400' : 'text-zinc-600'">Mold Fee</span>
                  <span :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">${{ moldFeeAmount.toFixed(2) }}</span>
                </div>
                <div v-if="priceBreakdown.rushFee > 0" class="flex justify-between text-amber-500">
                  <span>Rush Fee</span>
                  <span>${{ priceBreakdown.rushFee.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div :class="['rounded-xl p-5 mb-4', isDark ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600' : 'bg-gradient-to-br from-violet-600 to-fuchsia-600']">
              <div class="flex justify-between items-end">
                <div>
                  <span class="text-violet-200 text-sm">Total</span>
                  <span class="block text-4xl font-bold text-white tabular-nums">
                    ${{ priceBreakdown?.total.toFixed(2) || '0.00' }}
                  </span>
                </div>
                <div v-if="priceBreakdown && state.selectedQuantity" class="text-right">
                  <span class="text-violet-200 text-sm block">Per Piece</span>
                  <span class="text-xl font-bold text-white">${{ (priceBreakdown.total / state.selectedQuantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="copyQuote"
                :disabled="!isSelectionComplete"
                :class="[
                  'flex-1 py-3 rounded-xl font-semibold transition-all duration-200',
                  isSelectionComplete
                    ? (isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300')
                    : (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'),
                  'active:scale-[0.98]'
                ]"
              >
                Copy
              </button>
              <button
                @click="printQuote"
                :disabled="!isSelectionComplete"
                :class="[
                  'flex-1 py-3 rounded-xl font-semibold transition-all duration-200',
                  isSelectionComplete
                    ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25'
                    : (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'),
                  'active:scale-[0.98]'
                ]"
              >
                Print Quote
              </button>
            </div>

            <p :class="['text-xs text-center mt-3', isDark ? 'text-zinc-600' : 'text-zinc-400']">
              Quote valid for 30 days
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

// Dark mode
const isDark = ref(true) // Default to dark for this "pro" theme

onMounted(() => {
  const saved = localStorage.getItem('pin-pricer-dark-mode-two')
  if (saved !== null) {
    isDark.value = saved === 'true'
  }
})

const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('pin-pricer-dark-mode-two', String(isDark.value))
}

// Data
const productionMethods = getAvailableProductionMethods()
const platingOptions = getAvailablePlatingOptions()
const backingOptions = getAvailableBackingOptions()
const packagingOptions = getAvailablePackagingOptions()

const sizes = SIZES
const quantities = QUANTITIES

// Custom quantity state
const showCustomQuantity = ref(false)
const customQuantityInput = ref('')

// Check if current selection is a custom quantity (not in standard tiers)
const isCustomQuantitySelected = computed(() => {
  if (!state.selectedQuantity) return false
  return !quantities.includes(state.selectedQuantity)
})

// Handle custom quantity input
const handleCustomQuantityInput = () => {
  // Only allow digits
  customQuantityInput.value = customQuantityInput.value.replace(/\D/g, '')
}

// Apply custom quantity
const applyCustomQuantity = () => {
  const value = customQuantityInput.value.trim()
  if (!value || !state.selectedSize) return

  const numValue = parseInt(value, 10)
  if (isNaN(numValue) || numValue < 1) return

  setSizeAndQuantity(state.selectedSize, numValue)
}

// Get interpolated price for custom quantities
const getInterpolatedPrice = (size: string, quantity: number): number => {
  if (!state.selectedProductionMethod) return 0
  const pricing = state.selectedProductionMethod.pricing[size]
  if (!pricing) return 0

  const sortedQuantities = [...quantities].sort((a, b) => a - b)

  // If quantity matches a tier exactly, return that price
  if (pricing[quantity] !== undefined) {
    return pricing[quantity]
  }

  // Find bounding quantities for interpolation
  let lowerQty = sortedQuantities[0]
  let upperQty = sortedQuantities[sortedQuantities.length - 1]

  for (let i = 0; i < sortedQuantities.length - 1; i++) {
    if (quantity > sortedQuantities[i] && quantity < sortedQuantities[i + 1]) {
      lowerQty = sortedQuantities[i]
      upperQty = sortedQuantities[i + 1]
      break
    }
  }

  // Handle edge cases
  if (quantity <= sortedQuantities[0]) {
    return pricing[sortedQuantities[0]]
  }
  if (quantity >= sortedQuantities[sortedQuantities.length - 1]) {
    return pricing[sortedQuantities[sortedQuantities.length - 1]]
  }

  // Linear interpolation
  const lowerPrice = pricing[lowerQty]
  const upperPrice = pricing[upperQty]
  const ratio = (quantity - lowerQty) / (upperQty - lowerQty)

  return lowerPrice + (upperPrice - lowerPrice) * ratio
}

// Progress calculation
const completionPercent = computed(() => {
  let steps = 0
  if (state.selectedProductionMethod) steps++
  if (state.selectedPlatingType) steps++
  if (state.selectedSize) steps++
  if (state.selectedQuantity) steps++
  if (state.selectedBacking) steps++
  if (state.selectedPackaging) steps++
  return Math.round((steps / 6) * 100)
})

// Helpers
const getUnitPrice = (size: string, qty: number): string => {
  if (!state.selectedProductionMethod) return '—'
  const price = state.selectedProductionMethod.pricing[size]?.[qty]
  return price?.toFixed(2) ?? '—'
}

const selectSize = (size: string) => {
  if (state.selectedQuantity) {
    setSizeAndQuantity(size, state.selectedQuantity)
  } else {
    // Just update the size visually, will complete when quantity selected
    setSizeAndQuantity(size, quantities[0])
    // Clear qty selection to force re-select
    state.selectedQuantity
  }
}

const selectQuantity = (qty: number) => {
  if (state.selectedSize) {
    // Clear custom input when selecting a standard quantity
    customQuantityInput.value = ''
    setSizeAndQuantity(state.selectedSize, qty)
  }
}

const resetAll = () => {
  resetSelections()
  showCustomQuantity.value = false
  customQuantityInput.value = ''
}

const copyQuote = () => {
  if (!priceBreakdown.value || !state.selectedQuantity) return
  const text = `Pin Quote — ${state.selectedProductionMethod?.name}

Plating: ${state.selectedPlatingType?.name}
Size: ${state.selectedSize}"
Qty: ${state.selectedQuantity.toLocaleString()}
Backing: ${state.selectedBacking?.name}
Packaging: ${state.selectedPackaging?.name}
${state.rushOrder ? 'Rush: Yes (+20%)\n' : ''}
TOTAL: $${priceBreakdown.value.total.toFixed(2)}
Per piece: $${(priceBreakdown.value.total / state.selectedQuantity).toFixed(2)}

Valid 30 days.`

  navigator.clipboard.writeText(text)
}

const printQuote = () => {
  window.print()
}
</script>
