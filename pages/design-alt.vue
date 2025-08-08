<template>
  <!-- Neobrutalist concept: bold colors, thick borders, offset shadows -->
  <div class="min-h-screen w-full overflow-x-hidden bg-yellow-50 text-slate-900">
    <!-- Top navigation (neobrutalist) -->
    <header class="sticky top-0 z-40 border-b-4 border-black bg-white">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="grid h-9 w-9 place-items-center border-4 border-black bg-black text-white text-sm font-black shadow-[4px_4px_0_#000]">P</div>
          <span class="text-base font-black tracking-tight">Pin Pricer</span>
          <span class="ml-2 hidden border-4 border-black bg-yellow-300 px-2 py-1 text-[10px] font-black shadow-[3px_3px_0_#000] sm:inline">Design Alt</span>
        </div>
        <div class="flex items-center gap-3">
          <a href="#" class="hidden translate-x-0 translate-y-0 border-4 border-black bg-white px-3 py-2 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000] md:inline-block">Docs</a>
          <a href="#" class="translate-x-0 translate-y-0 border-4 border-black bg-pink-300 px-4 py-2 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">Start New Quote</a>
        </div>
      </nav>
    </header>

    <!-- Page content -->
    <main class="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <!-- Hero -->
      <section class="mb-8 sm:mb-12">
        <div class="relative border-4 border-black bg-white p-6 shadow-[8px_8px_0_#000] sm:p-10">
          <div class="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-2xl font-black tracking-tight sm:text-3xl">Pin Pricing Calculator</h1>
              <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">A concept redesign focused on clarity, speed, and delight. This page is a non-functional prototype showcasing neobrutalism with TailwindUI patterns.</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="border-4 border-black bg-yellow-200 px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_#000]">Neobrutalism</span>
              <span class="border-4 border-black bg-lime-200 px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_#000]">TailwindUI</span>
              <span class="border-4 border-black bg-cyan-200 px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_#000]">Prototype</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Layout: Left (Configurator) + Right (Summary) -->
      <section class="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.85fr]">
        <!-- Configurator Column -->
        <div class="space-y-6">
          <!-- Step 1: Basics -->
          <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8">
            <div class="mb-6 flex items-start justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">1</div>
                <div>
                  <h2 class="text-lg font-black tracking-tight">Basics</h2>
                  <p class="text-sm text-slate-700">Set size, quantity, and core attributes</p>
                </div>
              </div>
              <div class="hidden items-center gap-2 sm:flex">
                <span class="border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000]">Fast</span>
                <span class="border-4 border-black bg-white px-2 py-1 text-[10px] font-black shadow-[2px_2px_0_#000]">Simple</span>
              </div>
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <label class="mb-2 block text-xs font-black uppercase tracking-wider text-slate-800">Quantity</label>
              <div class="grid grid-cols-5 gap-2 rounded-none border-4 border-black bg-yellow-50 p-1">
                <button type="button" class="translate-x-0 translate-y-0 border-4 border-black bg-black px-3 py-2.5 text-center text-sm font-black text-white transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">50</button>
                <button type="button" class="translate-x-0 translate-y-0 border-4 border-black bg-white px-3 py-2.5 text-center text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">100</button>
                <button type="button" class="translate-x-0 translate-y-0 border-4 border-black bg-white px-3 py-2.5 text-center text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">200</button>
                <button type="button" class="translate-x-0 translate-y-0 border-4 border-black bg-white px-3 py-2.5 text-center text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">500</button>
                <button type="button" class="translate-x-0 translate-y-0 border-4 border-black bg-white px-3 py-2.5 text-center text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">1000</button>
              </div>
            </div>

            <!-- Size -->
            <div class="mb-6">
              <div class="mb-2 flex items-center justify-between">
                <label class="block text-xs font-black uppercase tracking-wider text-slate-800">Size</label>
                <span class="border-4 border-black bg-yellow-200 px-2 py-0.5 text-[11px] font-black">1.5"</span>
              </div>
              <div class="relative">
                <input type="range" min="0.75" max="2.5" step="0.25" value="1.5" aria-label="Pin size in inches" class="h-2 w-full appearance-none rounded-none border-2 border-black bg-slate-200 outline-none" />
                <div class="mt-1 flex justify-between text-[10px] font-semibold text-slate-700">
                  <span>0.75"</span>
                  <span>2.5"</span>
                </div>
              </div>
            </div>

            <!-- Shape & Colors -->
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-wider text-slate-800">Shape</label>
                <div class="grid grid-cols-3 gap-2">
                  <button type="button" class="group border-4 border-black bg-white p-3 text-center text-xs font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">
                    <span class="mb-1 block h-10 w-full border-2 border-black bg-slate-200"></span>
                    Rectangle
                  </button>
                  <button type="button" class="group border-4 border-black bg-white p-3 text-center text-xs font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">
                    <span class="mb-1 block h-10 w-full rounded-full border-2 border-black bg-slate-200"></span>
                    Circle
                  </button>
                  <button type="button" class="group border-4 border-black bg-white p-3 text-center text-xs font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">
                    <span class="mb-1 block h-10 w-full rotate-45 border-2 border-black bg-slate-200"></span>
                    Diamond
                  </button>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-xs font-black uppercase tracking-wider text-slate-800">Colors</label>
                <div class="flex flex-wrap items-center gap-2 border-4 border-black bg-white p-3 shadow-[4px_4px_0_#000]">
                  <span class="inline-flex items-center gap-2 border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black"><span class="h-3 w-3 rounded-sm border-2 border-black bg-indigo-400"></span>Indigo</span>
                  <span class="inline-flex items-center gap-2 border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black"><span class="h-3 w-3 rounded-sm border-2 border-black bg-pink-400"></span>Fuchsia</span>
                  <span class="inline-flex items-center gap-2 border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black"><span class="h-3 w-3 rounded-sm border-2 border-black bg-emerald-400"></span>Emerald</span>
                  <span class="inline-flex items-center gap-2 border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black"><span class="h-3 w-3 rounded-sm border-2 border-black bg-amber-400"></span>Amber</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Production Method -->
          <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8">
            <div class="mb-6 flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">2</div>
              <div>
                <h2 class="text-lg font-black">Production Method</h2>
                <p class="text-sm text-slate-700">Choose the approach that best fits your design</p>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <button type="button" class="group flex flex-col items-start gap-2 border-4 border-black bg-lime-200 p-4 text-left shadow-[6px_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="flex items-center gap-2">
                  <span class="grid h-8 w-8 place-items-center border-2 border-black bg-black text-white text-xs font-black">E</span>
                  <span class="text-sm font-black">Soft Enamel</span>
                </div>
                <p class="text-xs leading-5 text-slate-700">Crisp metal lines with recessed color fills. Vibrant and classic.</p>
              </button>
              <button type="button" class="group flex flex-col items-start gap-2 border-4 border-black bg-white p-4 text-left shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="flex items-center gap-2">
                  <span class="grid h-8 w-8 place-items-center border-2 border-black bg-white text-xs font-black">D</span>
                  <span class="text-sm font-black">Die Struck</span>
                </div>
                <p class="text-xs leading-5 text-slate-700">All-metal, high-relief detail with premium finish options.</p>
              </button>
              <button type="button" class="group flex flex-col items-start gap-2 border-4 border-black bg-white p-4 text-left shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="flex items-center gap-2">
                  <span class="grid h-8 w-8 place-items-center border-2 border-black bg-white text-xs font-black">P</span>
                  <span class="text-sm font-black">Printed</span>
                </div>
                <p class="text-xs leading-5 text-slate-700">Photoreal artwork and gradients with an optional epoxy dome.</p>
              </button>
            </div>
          </div>

          <!-- Step 3: Plating -->
          <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8">
            <div class="mb-6 flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">3</div>
              <div>
                <h2 class="text-lg font-black">Plating</h2>
                <p class="text-sm text-slate-700">Select the metal finish</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
              <button type="button" class="group border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="mb-2 h-10 w-full border-2 border-black bg-amber-300"></div>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-black">Gold</span>
                  <span class="border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">Popular</span>
                </div>
              </button>
              <button type="button" class="group border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="mb-2 h-10 w-full border-2 border-black bg-slate-300"></div>
                <div class="text-xs font-black">Silver</div>
              </button>
              <button type="button" class="group border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="mb-2 h-10 w-full border-2 border-black bg-neutral-800"></div>
                <div class="text-xs font-black">Black Nickel</div>
              </button>
              <button type="button" class="group border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">
                <div class="mb-2 h-10 w-full border-2 border-black bg-rose-300"></div>
                <div class="text-xs font-black">Rose Gold</div>
              </button>
            </div>
          </div>

          <!-- Step 4: Add-ons -->
          <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8">
            <div class="mb-6 flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">4</div>
              <div>
                <h2 class="text-lg font-black">Add‑ons</h2>
                <p class="text-sm text-slate-700">Enhance the pin with finishes and packaging</p>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label class="flex items-start gap-3 border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
                <input type="checkbox" class="mt-1 h-5 w-5 border-2 border-black accent-black" />
                <div>
                  <div class="text-sm font-black">Epoxy Dome</div>
                  <div class="text-xs text-slate-700">Adds glossy protection and smooth finish</div>
                </div>
                <span class="ml-auto border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">+$0.20</span>
              </label>
              <label class="flex items-start gap-3 border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
                <input type="checkbox" class="mt-1 h-5 w-5 border-2 border-black accent-black" />
                <div>
                  <div class="text-sm font-black">Glitter Enamel</div>
                  <div class="text-xs text-slate-700">Sparkle pigment in selected color areas</div>
                </div>
                <span class="ml-auto border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">+$0.15</span>
              </label>
              <label class="flex items-start gap-3 border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
                <input type="checkbox" class="mt-1 h-5 w-5 border-2 border-black accent-black" />
                <div>
                  <div class="text-sm font-black">Backstamp</div>
                  <div class="text-xs text-slate-700">Custom logo engraved on pin back</div>
                </div>
                <span class="ml-auto border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">+$0.10</span>
              </label>
              <label class="flex items-start gap-3 border-4 border-black bg-white p-4 shadow-[4px_4px_0_#000]">
                <input type="checkbox" class="mt-1 h-5 w-5 border-2 border-black accent-black" />
                <div>
                  <div class="text-sm font-black">Deluxe Clutch</div>
                  <div class="text-xs text-slate-700">Premium locking clasp for security</div>
                </div>
                <span class="ml-auto border-2 border-black bg-yellow-200 px-2 py-0.5 text-[10px] font-black">+$0.35</span>
              </label>
            </div>
          </div>

          <!-- Step 5: Packaging & Timeline -->
          <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8">
            <div class="mb-6 flex items-center gap-4">
              <div class="grid h-9 w-9 place-items-center border-4 border-black bg-yellow-300 text-[11px] font-black text-black shadow-[3px_3px_0_#000]">5</div>
              <div>
                <h2 class="text-lg font-black">Packaging & Timeline</h2>
                <p class="text-sm text-slate-700">Choose presentation and delivery speed</p>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div class="space-y-2">
                <div class="text-xs font-black uppercase tracking-wider">Packaging</div>
                <div class="grid grid-cols-2 gap-2">
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-white p-3 text-left text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Poly Bag</button>
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-white p-3 text-left text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Backing Card</button>
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-white p-3 text-left text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Gift Box</button>
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-white p-3 text-left text-sm font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Custom Card</button>
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-xs font-black uppercase tracking-wider">Timeline</div>
                <div class="grid grid-cols-3 gap-2">
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-white p-3 text-left text-xs font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Standard<br /><span class="text-[10px] font-medium text-slate-700">10–14 days</span></button>
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-yellow-200 p-3 text-left text-xs font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Rush<br /><span class="text-[10px] font-medium text-slate-800">7–9 days</span></button>
                  <button class="translate-x-0 translate-y-0 border-4 border-black bg-white p-3 text-left text-xs font-black shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1">Priority<br /><span class="text-[10px] font-medium text-slate-700">5–6 days</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Column -->
        <aside class="space-y-6 xl:sticky xl:top-24">
          <!-- Quote Card -->
          <div class="border-4 border-black bg-white shadow-[8px_8px_0_#000]">
            <div class="p-6 sm:p-8">
              <div class="mb-4 flex items-center justify-between">
                <h3 class="text-base font-black tracking-tight">Estimated Total</h3>
                <span class="border-2 border-black bg-yellow-200 px-2.5 py-1 text-[10px] font-black">Concept Only</span>
              </div>
              <div class="mb-4 flex items-baseline gap-3">
                <div class="text-4xl font-black tracking-tight">$489</div>
                <div class="border-2 border-black bg-white px-2 py-0.5 text-[11px] font-black">Unit $9.78</div>
              </div>
              <div class="mb-6 grid grid-cols-1 gap-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="text-slate-800">Pins (50 × 1.5")</span>
                  <span class="font-black">$459</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-800">Epoxy Dome</span>
                  <span class="font-black">$10</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-800">Glitter Enamel</span>
                  <span class="font-black">$15</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-800">Packaging</span>
                  <span class="font-black">$5</span>
                </div>
              </div>
              <div class="mb-6 h-2 w-full border-2 border-black bg-slate-200"></div>
              <div class="flex items-center gap-2">
                <button class="flex-1 translate-x-0 translate-y-0 border-4 border-black bg-lime-300 px-4 py-2.5 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">Download Quote</button>
                <button class="translate-x-0 translate-y-0 border-4 border-black bg-white px-4 py-2.5 text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0_#000]">Share</button>
              </div>
              <p class="mt-3 text-[11px] leading-5 text-slate-700">This is a static design prototype. Numbers are placeholders for layout and visual rhythm.</p>
            </div>
          </div>

          <!-- Helpful Notes -->
          <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:p-8">
            <h4 class="mb-3 text-sm font-black">What affects price?</h4>
            <ul class="space-y-2 text-sm text-slate-800">
              <li class="flex items-start gap-2"><span class="mt-1 h-2 w-2 border-2 border-black bg-pink-300"></span> Size and quantity have the biggest impact.</li>
              <li class="flex items-start gap-2"><span class="mt-1 h-2 w-2 border-2 border-black bg-pink-300"></span> Production method and plating can change base cost.</li>
              <li class="flex items-start gap-2"><span class="mt-1 h-2 w-2 border-2 border-black bg-pink-300"></span> Add-ons like epoxy or glitter add small per-unit fees.</li>
            </ul>
          </div>

          <!-- Pricing Matrix (Preview) -->
          <div class="border-4 border-black bg-white shadow-[6px_6px_0_#000]">
            <div class="border-b-4 border-black p-6">
              <h4 class="text-sm font-black">Pricing Matrix Preview</h4>
              <p class="mt-1 text-xs text-slate-700">Scrollable table showing example unit pricing</p>
            </div>
            <div class="relative max-h-80 overflow-auto">
              <table class="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead class="sticky top-0 border-b-4 border-black bg-slate-900 text-white">
                  <tr>
                    <th class="border-r-4 border-black px-6 py-3 font-black">Size</th>
                    <th class="border-r-4 border-black px-6 py-3 font-black">50</th>
                    <th class="border-r-4 border-black px-6 py-3 font-black">100</th>
                    <th class="border-r-4 border-black px-6 py-3 font-black">200</th>
                    <th class="border-r-4 border-black px-6 py-3 font-black">500</th>
                    <th class="px-6 py-3 font-black">1000</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="even:bg-yellow-50">
                    <td class="border-b-4 border-r-4 border-black px-6 py-3 font-black">1.0"</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$7.85</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$4.95</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$3.25</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$2.15</td>
                    <td class="border-b-4 border-black px-6 py-3">$1.85</td>
                  </tr>
                  <tr class="even:bg-yellow-50">
                    <td class="border-b-4 border-r-4 border-black px-6 py-3 font-black">1.25"</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$8.55</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$5.35</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$3.65</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$2.45</td>
                    <td class="border-b-4 border-black px-6 py-3">$2.15</td>
                  </tr>
                  <tr class="even:bg-yellow-50">
                    <td class="border-b-4 border-r-4 border-black px-6 py-3 font-black">1.5"</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$9.78</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$6.15</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$4.15</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$2.85</td>
                    <td class="border-b-4 border-black px-6 py-3">$2.55</td>
                  </tr>
                  <tr class="even:bg-yellow-50">
                    <td class="border-b-4 border-r-4 border-black px-6 py-3 font-black">1.75"</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$10.95</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$6.85</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$4.55</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$3.15</td>
                    <td class="border-b-4 border-black px-6 py-3">$2.85</td>
                  </tr>
                  <tr class="even:bg-yellow-50">
                    <td class="border-b-4 border-r-4 border-black px-6 py-3 font-black">2.0"</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$12.15</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$7.55</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$4.95</td>
                    <td class="border-b-4 border-r-4 border-black px-6 py-3">$3.45</td>
                    <td class="border-b-4 border-black px-6 py-3">$3.15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </section>
    </main>

    <!-- Footer note -->
    <footer class="mx-auto max-w-7xl px-4 pb-10 pt-2 text-center text-xs text-slate-600 sm:px-6 lg:px-8">
      Made with care as a visual exploration. This page is intentionally non-functional and self-contained.
    </footer>
  </div>
  
</template>

<script setup lang="ts">
// Intentionally empty: this is a static design prototype.
</script>

<!-- No component-scoped CSS; relying entirely on Tailwind classes for design. -->


