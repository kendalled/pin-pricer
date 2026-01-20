<template>
  <div :class="['min-h-screen transition-colors duration-500', isDark ? 'bg-slate-950' : 'bg-stone-50']">

    <!-- Floating Header -->
    <header :class="['sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500', isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-stone-50/80 border-stone-200']">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors duration-500', isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-700 text-white']">
            P
          </div>
          <div>
            <h1 :class="['font-semibold transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">Pin Pricer</h1>
            <p :class="['text-xs transition-colors duration-500', isDark ? 'text-slate-500' : 'text-stone-500']">Quote Builder</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDark"
            :class="['w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110', isDark ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-stone-200 text-slate-700 hover:bg-stone-300']"
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
            :class="['text-sm font-medium px-3 py-1.5 rounded-lg transition-colors', isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-stone-500 hover:text-slate-900 hover:bg-stone-200']"
          >
            Start Over
          </button>
        </div>
      </div>
    </header>

    <!-- Floating Price Card -->
    <div class="fixed bottom-6 right-6 z-40 hidden lg:block">
      <div :class="['rounded-3xl p-6 shadow-2xl transition-all duration-500 min-w-[200px]', isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-stone-200 shadow-stone-200/50']">
        <p :class="['text-xs font-medium uppercase tracking-wider mb-1', isDark ? 'text-slate-500' : 'text-stone-500']">Your Quote</p>
        <div class="flex items-baseline gap-1">
          <span :class="['text-4xl font-bold tabular-nums transition-all duration-300', isDark ? 'text-emerald-400' : 'text-emerald-700', priceAnimating ? 'scale-110' : '']">
            ${{ displayTotal }}
          </span>
        </div>
        <p v-if="isSelectionComplete && priceBreakdown" :class="['text-sm mt-1', isDark ? 'text-slate-400' : 'text-stone-600']">
          ${{ (priceBreakdown.total / state.selectedQuantity!).toFixed(2) }}/ea
        </p>
        <p v-else :class="['text-sm mt-1', isDark ? 'text-slate-500' : 'text-stone-400']">
          Complete selections below
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-6 py-12 pb-32">

      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h2 :class="['text-4xl sm:text-5xl font-bold mb-4 transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">
          Build Your Quote
        </h2>
        <p :class="['text-lg transition-colors duration-500', isDark ? 'text-slate-400' : 'text-stone-600']">
          Select your options below. We'll guide you through.
        </p>
      </div>

      <!-- Sections -->
      <div class="space-y-8">

        <!-- Section 1: Production Method -->
        <section
          ref="section1"
          :class="['rounded-3xl p-8 transition-all duration-500', isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-stone-200 shadow-lg shadow-stone-100']"
        >
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-500', state.selectedProductionMethod ? (isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white') : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-400')]">
              <svg v-if="state.selectedProductionMethod" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else>1</span>
            </div>
            <div>
              <h3 :class="['text-2xl font-bold transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">Production Style</h3>
              <p :class="['transition-colors duration-500', isDark ? 'text-slate-400' : 'text-stone-500']">How should your pins be made?</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="method in productionMethods"
              :key="method.id"
              @click="selectProductionMethod(method)"
              :class="[
                'relative p-5 rounded-2xl text-left transition-all duration-300 border-2',
                state.selectedProductionMethod?.id === method.id
                  ? (isDark ? 'bg-emerald-500/10 border-emerald-500 ring-4 ring-emerald-500/20' : 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-500/20')
                  : (isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800' : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100'),
                'active:scale-[0.98]'
              ]"
            >
              <span :class="['font-semibold block transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">{{ method.name }}</span>
              <span v-if="method.setupFee" :class="['text-sm mt-1 block', isDark ? 'text-amber-400' : 'text-amber-600']">+${{ method.setupFee }} setup</span>
            </button>
          </div>
        </section>

        <!-- Section 2: Plating -->
        <section
          ref="section2"
          :class="['rounded-3xl p-8 transition-all duration-500', isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-stone-200 shadow-lg shadow-stone-100', !state.selectedProductionMethod ? 'opacity-40 pointer-events-none' : '']"
        >
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-500', state.selectedPlatingType ? (isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white') : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-400')]">
              <svg v-if="state.selectedPlatingType" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else>2</span>
            </div>
            <div>
              <h3 :class="['text-2xl font-bold transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">Metal Finish</h3>
              <p :class="['transition-colors duration-500', isDark ? 'text-slate-400' : 'text-stone-500']">Choose your plating type</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <p :class="['text-sm font-semibold uppercase tracking-wider mb-3', isDark ? 'text-emerald-400' : 'text-emerald-700']">Included</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="plating in freePlating"
                  :key="plating.id"
                  @click="selectPlating(plating)"
                  :class="[
                    'px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border-2',
                    state.selectedPlatingType?.id === plating.id
                      ? (isDark ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'bg-emerald-600 border-emerald-600 text-white')
                      : (isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50' : 'bg-stone-100 border-stone-200 text-slate-700 hover:border-emerald-500/50'),
                    'active:scale-[0.97]'
                  ]"
                >
                  {{ plating.name }}
                </button>
              </div>
            </div>

            <div>
              <p :class="['text-sm font-semibold uppercase tracking-wider mb-3', isDark ? 'text-amber-400' : 'text-amber-600']">Premium</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="plating in premiumPlating"
                  :key="plating.id"
                  @click="selectPlating(plating)"
                  :class="[
                    'px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border-2',
                    state.selectedPlatingType?.id === plating.id
                      ? (isDark ? 'bg-amber-500 border-amber-500 text-slate-950' : 'bg-amber-500 border-amber-500 text-white')
                      : (isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/50' : 'bg-stone-100 border-stone-200 text-slate-700 hover:border-amber-500/50'),
                    'active:scale-[0.97]'
                  ]"
                >
                  {{ plating.name }} <span class="opacity-70">+${{ plating.price.toFixed(2) }}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Size & Quantity -->
        <section
          ref="section3"
          :class="['rounded-3xl p-8 transition-all duration-500', isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-stone-200 shadow-lg shadow-stone-100', !state.selectedPlatingType ? 'opacity-40 pointer-events-none' : '']"
        >
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-500', state.selectedSize && state.selectedQuantity ? (isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white') : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-400')]">
              <svg v-if="state.selectedSize && state.selectedQuantity" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else>3</span>
            </div>
            <div>
              <h3 :class="['text-2xl font-bold transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">Size & Quantity</h3>
              <p :class="['transition-colors duration-500', isDark ? 'text-slate-400' : 'text-stone-500']">Pick your pin size, then quantity</p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Size Selection -->
            <div>
              <p :class="['text-sm font-semibold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-stone-500']">Size</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="tempSize = size"
                  :class="[
                    'w-20 h-20 rounded-2xl font-bold text-lg transition-all duration-300 border-2',
                    tempSize === size
                      ? (isDark ? 'bg-emerald-500 border-emerald-500 text-slate-950 scale-105' : 'bg-emerald-600 border-emerald-600 text-white scale-105')
                      : (isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50' : 'bg-stone-100 border-stone-200 text-slate-700 hover:border-emerald-500/50'),
                    'active:scale-[0.95]'
                  ]"
                >
                  {{ size }}"
                </button>
              </div>
            </div>

            <!-- Quantity Selection -->
            <div v-if="tempSize" class="animate-fade-in">
              <div class="flex items-center justify-between mb-3">
                <p :class="['text-sm font-semibold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-stone-500']">Quantity</p>
                <button
                  @click="showCustomQuantity = !showCustomQuantity"
                  :class="[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border',
                    showCustomQuantity
                      ? (isDark ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-emerald-100 border-emerald-500 text-emerald-700')
                      : (isDark ? 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500' : 'bg-stone-100 border-stone-300 text-stone-500 hover:border-stone-400')
                  ]"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Custom Qty
                </button>
              </div>

              <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                <button
                  v-for="qty in quantities"
                  :key="qty"
                  @click="selectSizeAndQty(tempSize, qty)"
                  :class="[
                    'py-4 rounded-xl font-semibold transition-all duration-300 border-2',
                    state.selectedSize === tempSize && state.selectedQuantity === qty && !isCustomQuantitySelected
                      ? (isDark ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'bg-emerald-600 border-emerald-600 text-white')
                      : (isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500/50' : 'bg-stone-100 border-stone-200 text-slate-700 hover:border-emerald-500/50'),
                    'active:scale-[0.95]'
                  ]"
                >
                  <span class="block">{{ qty }}</span>
                  <span :class="['text-xs block mt-0.5', state.selectedSize === tempSize && state.selectedQuantity === qty && !isCustomQuantitySelected ? 'opacity-80' : 'opacity-60']">
                    ${{ getUnitPrice(tempSize, qty) }}
                  </span>
                </button>
              </div>

              <!-- Custom Quantity Input -->
              <div v-if="showCustomQuantity" class="mt-4 animate-fade-in">
                <div :class="['p-4 rounded-xl border-2 border-dashed transition-all duration-300', isCustomQuantitySelected ? (isDark ? 'border-emerald-500 bg-emerald-500/10' : 'border-emerald-500 bg-emerald-50') : (isDark ? 'border-slate-600 bg-slate-800/50' : 'border-stone-300 bg-stone-50')]">
                  <label :class="['block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-stone-600']">
                    Enter custom quantity:
                  </label>
                  <div class="flex gap-3">
                    <input
                      v-model="customQuantityInput"
                      type="text"
                      inputmode="numeric"
                      pattern="[0-9]*"
                      placeholder="e.g. 175"
                      @input="handleCustomQuantityInput"
                      @keydown.enter="applyCustomQuantity"
                      :class="[
                        'flex-1 px-4 py-3 rounded-xl text-center font-semibold transition-all duration-300 border-2',
                        isDark ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500' : 'bg-white border-stone-300 text-slate-900 placeholder-stone-400 focus:border-emerald-500',
                        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
                      ]"
                    />
                    <button
                      @click="applyCustomQuantity"
                      :disabled="!customQuantityInput"
                      :class="[
                        'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
                        customQuantityInput
                          ? (isDark ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-emerald-600 text-white hover:bg-emerald-500')
                          : (isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-stone-200 text-stone-400 cursor-not-allowed'),
                        'active:scale-[0.97]'
                      ]"
                    >
                      Apply
                    </button>
                  </div>
                  <p v-if="isCustomQuantitySelected && state.selectedQuantity" :class="['mt-3 text-sm', isDark ? 'text-emerald-400' : 'text-emerald-600']">
                    Custom: {{ state.selectedQuantity.toLocaleString() }} pcs @ ${{ getInterpolatedPrice(tempSize, state.selectedQuantity).toFixed(2) }}/ea (interpolated)
                  </p>
                </div>
              </div>

              <!-- Mold Fee Tip -->
              <div v-if="tempSize" :class="['mt-4 p-4 rounded-xl border transition-colors duration-500', isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200']">
                <p :class="['text-sm', isDark ? 'text-emerald-300' : 'text-emerald-700']">
                  <strong>Tip:</strong> Order 500+ pieces to waive the mold fee!
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 4: Backing & Packaging -->
        <section
          ref="section4"
          :class="['rounded-3xl p-8 transition-all duration-500', isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-stone-200 shadow-lg shadow-stone-100', !state.selectedQuantity ? 'opacity-40 pointer-events-none' : '']"
        >
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-500', state.selectedBacking && state.selectedPackaging ? (isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white') : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-400')]">
              <svg v-if="state.selectedBacking && state.selectedPackaging" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else>4</span>
            </div>
            <div>
              <h3 :class="['text-2xl font-bold transition-colors duration-500', isDark ? 'text-white' : 'text-slate-900']">Finishing Touches</h3>
              <p :class="['transition-colors duration-500', isDark ? 'text-slate-400' : 'text-stone-500']">Backing, packaging & extras</p>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Backing -->
            <div>
              <p :class="['text-sm font-semibold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-stone-500']">Backing Type</p>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="backing in backingOptions"
                  :key="backing.id"
                  @click="setBacking(backing)"
                  :class="[
                    'p-3 rounded-xl text-left transition-all duration-300 border-2',
                    state.selectedBacking?.id === backing.id
                      ? (isDark ? 'bg-emerald-500/10 border-emerald-500' : 'bg-emerald-50 border-emerald-500')
                      : (isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-stone-50 border-stone-200 hover:border-stone-300'),
                    'active:scale-[0.97]'
                  ]"
                >
                  <span :class="['text-sm font-medium block', isDark ? 'text-white' : 'text-slate-900']">{{ backing.name }}</span>
                  <span :class="['text-xs', backing.isFree ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-amber-400' : 'text-amber-600')]">
                    {{ backing.isFree ? 'Free' : `+$${backing.price.toFixed(2)}/ea` }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Packaging -->
            <div>
              <p :class="['text-sm font-semibold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-stone-500']">Packaging</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="pkg in packagingOptions"
                  :key="pkg.id"
                  @click="setPackaging(pkg)"
                  :class="[
                    'p-4 rounded-xl text-left transition-all duration-300 border-2',
                    state.selectedPackaging?.id === pkg.id
                      ? (isDark ? 'bg-emerald-500/10 border-emerald-500' : 'bg-emerald-50 border-emerald-500')
                      : (isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-stone-50 border-stone-200 hover:border-stone-300'),
                    'active:scale-[0.97]'
                  ]"
                >
                  <span :class="['font-medium block', isDark ? 'text-white' : 'text-slate-900']">{{ pkg.name }}</span>
                  <span :class="['text-sm', pkg.isFree ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-amber-400' : 'text-amber-600')]">
                    {{ pkg.isFree ? 'Included' : `+$${pkg.price.toFixed(2)}/ea` }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Rush Order -->
            <div :class="['p-4 rounded-xl border-2 transition-all duration-300', state.rushOrder ? (isDark ? 'bg-amber-500/10 border-amber-500' : 'bg-amber-50 border-amber-400') : (isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-stone-50 border-stone-200')]">
              <div class="flex items-center justify-between">
                <div>
                  <span :class="['font-semibold block', isDark ? 'text-white' : 'text-slate-900']">Rush Order</span>
                  <span :class="['text-sm', isDark ? 'text-amber-400' : 'text-amber-600']">+20% for faster production</span>
                </div>
                <button
                  @click="setRushOrder(!state.rushOrder)"
                  :class="[
                    'w-14 h-8 rounded-full transition-all duration-300 relative',
                    state.rushOrder ? 'bg-amber-500' : (isDark ? 'bg-slate-600' : 'bg-stone-300')
                  ]"
                >
                  <span :class="[
                    'absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300',
                    state.rushOrder ? 'translate-x-7' : 'translate-x-1'
                  ]"/>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Final Summary Card -->
        <section
          v-if="isSelectionComplete && priceBreakdown"
          ref="summarySection"
          :class="['rounded-3xl overflow-hidden transition-all duration-500', isDark ? 'bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-800' : 'bg-gradient-to-br from-emerald-600 to-emerald-700']"
        >
          <div class="p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">Quote Complete!</h3>
            </div>

            <!-- Specs -->
            <div class="bg-white/10 rounded-2xl p-5 mb-6 space-y-2 text-white/90">
              <div class="flex justify-between"><span class="opacity-70">Style</span><span class="font-medium">{{ state.selectedProductionMethod?.name }}</span></div>
              <div class="flex justify-between"><span class="opacity-70">Plating</span><span class="font-medium">{{ state.selectedPlatingType?.name }}</span></div>
              <div class="flex justify-between"><span class="opacity-70">Size</span><span class="font-medium">{{ state.selectedSize }}"</span></div>
              <div class="flex justify-between">
                <span class="opacity-70">Quantity</span>
                <span class="font-medium">
                  {{ state.selectedQuantity?.toLocaleString() }}
                  <span v-if="isCustomQuantitySelected" class="text-emerald-300 text-xs ml-1">(custom)</span>
                </span>
              </div>
              <div class="flex justify-between"><span class="opacity-70">Backing</span><span class="font-medium">{{ state.selectedBacking?.name }}</span></div>
              <div class="flex justify-between"><span class="opacity-70">Packaging</span><span class="font-medium">{{ state.selectedPackaging?.name }}</span></div>
              <div v-if="state.rushOrder" class="flex justify-between text-amber-300"><span class="opacity-70">Rush</span><span class="font-medium">Yes (+20%)</span></div>
            </div>

            <!-- Breakdown -->
            <div class="space-y-2 text-white/80 text-sm mb-6">
              <div class="flex justify-between"><span>Base Price</span><span>${{ priceBreakdown.basePrice.toFixed(2) }}</span></div>
              <div v-if="priceBreakdown.setupFee > 0" class="flex justify-between"><span>Setup Fee</span><span>${{ priceBreakdown.setupFee.toFixed(2) }}</span></div>
              <div v-if="priceBreakdown.platingCost > 0" class="flex justify-between"><span>Plating</span><span>${{ priceBreakdown.platingCost.toFixed(2) }}</span></div>
              <div v-if="priceBreakdown.backingCost > 0" class="flex justify-between"><span>Backing</span><span>${{ priceBreakdown.backingCost.toFixed(2) }}</span></div>
              <div v-if="priceBreakdown.packagingCost > 0" class="flex justify-between"><span>Packaging</span><span>${{ priceBreakdown.packagingCost.toFixed(2) }}</span></div>
              <div v-if="moldFeeWaived" class="flex justify-between text-emerald-300"><span>Mold Fee</span><span>Waived!</span></div>
              <div v-else-if="hasMoldFee" class="flex justify-between"><span>Mold Fee</span><span>${{ moldFeeAmount.toFixed(2) }}</span></div>
              <div v-if="priceBreakdown.rushFee > 0" class="flex justify-between text-amber-300"><span>Rush Fee</span><span>${{ priceBreakdown.rushFee.toFixed(2) }}</span></div>
            </div>

            <!-- Total -->
            <div class="border-t border-white/20 pt-6 mb-6">
              <div class="flex justify-between items-end">
                <span class="text-xl font-semibold text-white">Total</span>
                <div class="text-right">
                  <span class="text-5xl font-bold text-white">${{ priceBreakdown.total.toFixed(2) }}</span>
                  <span class="block text-white/60 mt-1">${{ (priceBreakdown.total / state.selectedQuantity!).toFixed(2) }} per piece</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button @click="copyQuote" class="flex-1 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-white transition-all active:scale-[0.98]">
                Copy Quote
              </button>
              <button @click="printQuote" class="flex-1 py-4 bg-white hover:bg-white/90 rounded-xl font-semibold text-emerald-700 transition-all active:scale-[0.98]">
                Print Quote
              </button>
            </div>

            <p class="text-center text-white/50 text-sm mt-4">Valid for 30 days</p>
          </div>
        </section>
      </div>
    </main>

    <!-- Mobile Bottom Bar -->
    <div v-if="isSelectionComplete && priceBreakdown" :class="['lg:hidden fixed bottom-0 left-0 right-0 p-4 border-t transition-colors duration-500', isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-stone-200']">
      <div class="flex items-center justify-between">
        <div>
          <span :class="['text-sm', isDark ? 'text-slate-400' : 'text-stone-500']">Total</span>
          <span :class="['block text-2xl font-bold', isDark ? 'text-emerald-400' : 'text-emerald-700']">${{ priceBreakdown.total.toFixed(2) }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="copyQuote" :class="['px-4 py-2 rounded-xl font-medium transition-colors', isDark ? 'bg-slate-800 text-white' : 'bg-stone-100 text-slate-900']">Copy</button>
          <button @click="printQuote" :class="['px-4 py-2 rounded-xl font-medium', isDark ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-600 text-white']">Print</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { SIZES, QUANTITIES } from '~/data/pricing'
import type { ProductionMethod, PlatingOption } from '~/types/pricing'

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
const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('pin-pricer-dark-mode')
  if (saved !== null) {
    isDark.value = saved === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('pin-pricer-dark-mode', String(isDark.value))
}

// Section refs for auto-scroll
const section1 = ref<HTMLElement | null>(null)
const section2 = ref<HTMLElement | null>(null)
const section3 = ref<HTMLElement | null>(null)
const section4 = ref<HTMLElement | null>(null)
const summarySection = ref<HTMLElement | null>(null)

// Temp state
const tempSize = ref<string | null>(null)

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
  if (!value || !tempSize.value) return

  const numValue = parseInt(value, 10)
  if (isNaN(numValue) || numValue < 1) return

  setSizeAndQuantity(tempSize.value, numValue)
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

// Price animation
const priceAnimating = ref(false)
const displayTotal = computed(() => {
  if (!priceBreakdown.value) return '0.00'
  return priceBreakdown.value.total.toFixed(2)
})

// Watch price changes for animation
watch(() => priceBreakdown.value?.total, () => {
  priceAnimating.value = true
  setTimeout(() => { priceAnimating.value = false }, 300)
})

// Data
const productionMethods = getAvailableProductionMethods()
const platingOptions = getAvailablePlatingOptions()
const backingOptions = getAvailableBackingOptions()
const packagingOptions = getAvailablePackagingOptions()

const freePlating = computed(() => platingOptions.filter(p => p.isFree))
const premiumPlating = computed(() => platingOptions.filter(p => !p.isFree))

const sizes = SIZES
const quantities = QUANTITIES

// Helpers
const getUnitPrice = (size: string, qty: number): string => {
  if (!state.selectedProductionMethod) return '—'
  const price = state.selectedProductionMethod.pricing[size]?.[qty]
  return price?.toFixed(2) ?? '—'
}

// Auto-scroll helper
const scrollToSection = (el: HTMLElement | null) => {
  if (!el) return
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, 200)
}

// Selection handlers with auto-scroll
const selectProductionMethod = (method: ProductionMethod) => {
  setProductionMethod(method)
  scrollToSection(section2.value)
}

const selectPlating = (plating: PlatingOption) => {
  setPlatingType(plating)
  scrollToSection(section3.value)
}

const selectSizeAndQty = (size: string, qty: number) => {
  // Clear custom input when selecting a standard quantity
  customQuantityInput.value = ''
  setSizeAndQuantity(size, qty)
  scrollToSection(section4.value)
}

// Watch for final completion
watch(isSelectionComplete, (complete) => {
  if (complete) {
    nextTick(() => {
      scrollToSection(summarySection.value)
    })
  }
})

const resetAll = () => {
  resetSelections()
  tempSize.value = null
  showCustomQuantity.value = false
  customQuantityInput.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const copyQuote = () => {
  if (!priceBreakdown.value) return
  const text = `Custom Pin Quote

${state.selectedProductionMethod?.name} - ${state.selectedPlatingType?.name}
${state.selectedSize}" × ${state.selectedQuantity?.toLocaleString()} pieces
Backing: ${state.selectedBacking?.name}
Packaging: ${state.selectedPackaging?.name}
${state.rushOrder ? 'Rush Order: Yes (+20%)\n' : ''}
TOTAL: $${priceBreakdown.value.total.toFixed(2)}
Per piece: $${(priceBreakdown.value.total / state.selectedQuantity!).toFixed(2)}

Quote valid for 30 days.`

  navigator.clipboard.writeText(text)
}

const printQuote = () => {
  window.print()
}
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
