<template>
  <div class="quote-display">
    <!-- Screen Version -->
    <div class="screen-version">
      <Card variant="elevated" class="max-w-4xl mx-auto">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-semibold text-slate-50">Quote Summary</h2>
              <p class="text-slate-400 mt-1">Challenge Coin Price Calculator</p>
            </div>
            <div class="flex gap-2">
              <Button variant="secondary" size="sm" @click="printQuote">
                <PrinterIcon class="w-4 h-4 mr-2" />
                Print Quote
              </Button>
              <Button variant="ghost" size="sm" @click="$emit('edit')">
                <PencilIcon class="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </template>

            <div class="space-y-8">
          <!-- Order Details Section -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Product Specifications -->
              <div>
              <h3 class="text-lg font-medium text-slate-200 mb-4 flex items-center">
                <CogIcon class="w-5 h-5 mr-2" />
                Product Specifications
              </h3>
              <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Color Option:</span>
                  <span class="text-slate-200 font-medium">{{ selections.colorOption.name }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Size:</span>
                  <span class="text-slate-200 font-medium">{{ selections.size }}"</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Quantity:</span>
                  <span class="text-slate-200 font-medium">{{ selections.quantity.toLocaleString() }} pieces</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Unit Price:</span>
                  <span class="text-slate-200 font-medium">{{ formatCurrency(breakdown.unitPrice) }}</span>
                </div>
              </div>
            </div>

            <!-- Modifications -->
              <div>
              <h3 class="text-lg font-medium text-slate-200 mb-4 flex items-center">
                <WrenchScrewdriverIcon class="w-5 h-5 mr-2" />
                Options
              </h3>
                <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Plating:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selections.platingType.name }}</span>
                    <Badge v-if="selections.platingType.isFree" variant="success" size="sm">FREE</Badge>
                    <span v-else class="text-slate-300">{{ formatCurrency(selections.platingType.price) }}/pc</span>
                  </div>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Packaging:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selections.packaging.name }}</span>
                    <Badge v-if="selections.packaging.isFree" variant="success" size="sm">FREE</Badge>
                    <span v-else class="text-slate-300">{{ formatCurrency(selections.packaging.price) }}/pc</span>
                  </div>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Design Type:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selections.designSides === 'two-sided' ? 'Two-Sided' : 'One-Sided' }}</span>
                    <Badge v-if="selections.designSides === 'two-sided'" variant="info" size="sm">2× mold fee</Badge>
                  </div>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-700">
                  <span class="text-slate-400">Rush Order:</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-200 font-medium">{{ selections.rushOrder ? 'Yes' : 'No' }}</span>
                    <Badge v-if="selections.rushOrder" variant="warning" size="sm">+20%</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Breakdown -->
            <div>
            <h3 class="text-lg font-medium text-slate-200 mb-4 flex items-center">
              <CalculatorIcon class="w-5 h-5 mr-2" />
              Price Breakdown
            </h3>
              <div class="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              <div class="space-y-3">
                <!-- Base Price -->
                <div class="flex justify-between items-center py-2">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-300">Base Price</span>
                    <span class="text-slate-500 text-sm">
                      ({{ selections.quantity.toLocaleString() }} × {{ formatCurrency(breakdown.unitPrice) }})
                    </span>
                  </div>
                  <span class="text-slate-200 font-medium tabular-nums">{{ formatCurrency(breakdown.basePrice) }}</span>
                </div>

                <!-- Plating Cost -->
                <div v-if="breakdown.platingCost > 0" class="flex justify-between items-center py-2">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-300">Plating Cost</span>
                    <span class="text-slate-500 text-sm">
                      ({{ selections.quantity.toLocaleString() }} × {{ formatCurrency(selections.platingType.price) }})
                    </span>
                  </div>
                  <span class="text-slate-200 font-medium tabular-nums">{{ formatCurrency(breakdown.platingCost) }}</span>
                </div>

                <!-- Packaging Cost -->
                <div v-if="breakdown.packagingCost > 0" class="flex justify-between items-center py-2">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-300">Packaging Cost</span>
                    <span class="text-slate-500 text-sm">
                      ({{ selections.quantity.toLocaleString() }} × {{ formatCurrency(selections.packaging.price) }})
                    </span>
                  </div>
                  <span class="text-slate-200 font-medium tabular-nums">{{ formatCurrency(breakdown.packagingCost) }}</span>
                </div>

                <!-- Mold Fee -->
                <div v-if="breakdown.moldFee > 0 || breakdown.moldFeeWaived" class="flex justify-between items-center py-2">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-300">Mold Fee</span>
                    <Badge v-if="selections.designSides === 'two-sided' && !breakdown.moldFeeWaived" variant="info" size="sm">2× (two-sided)</Badge>
                    <Badge v-if="breakdown.moldFeeWaived" variant="success" size="sm">Waived (300+ qty)</Badge>
                  </div>
                  <span 
                    class="font-medium tabular-nums"
                    :class="breakdown.moldFeeWaived ? 'text-green-400' : 'text-slate-200'"
                  >
                    {{ breakdown.moldFeeWaived ? 'Waived' : formatCurrency(breakdown.moldFee) }}
                  </span>
                </div>

                <!-- Rush Fee -->
                <div v-if="breakdown.rushFee > 0" class="flex justify-between items-center py-2">
                  <div class="flex items-center gap-2">
                    <span class="text-slate-300">Rush Fee</span>
                    <Badge variant="warning" size="sm">20% of subtotal</Badge>
                  </div>
                  <span class="text-slate-200 font-medium tabular-nums">{{ formatCurrency(breakdown.rushFee) }}</span>
                </div>

                  <!-- Divider -->
                  <div class="border-t border-slate-700 my-4"></div>

                <!-- Total -->
                <div class="flex justify-between items-center py-3">
                  <span class="text-xl font-semibold text-slate-100">Total</span>
                  <span class="text-2xl font-bold text-blue-400 tabular-nums">{{ formatCurrency(breakdown.total) }}</span>
                </div>

                <!-- Per Unit Cost -->
                <div class="flex justify-between items-center py-2 text-sm">
                  <span class="text-slate-400">Cost per unit (including all fees):</span>
                  <span class="text-slate-300 tabular-nums">{{ formatCurrency(breakdown.total / selections.quantity) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quote Footer -->
          <div class="text-center text-slate-400 text-sm border-t border-slate-700 pt-6">
            <p>Quote generated on {{ formatDate(new Date()) }}</p>
            <p class="mt-1">Valid for 30 days • Prices subject to change</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Print Version -->
    <div class="print-version">
      <div class="print-header">
        <h1>Challenge Coin Price Quote</h1>
        <div class="quote-date">{{ formatDate(new Date()) }}</div>
      </div>

      <div class="print-content">
        <div class="print-section">
          <h2>Product Specifications</h2>
          <table class="print-table">
            <tbody>
              <tr>
                <td>Color Option:</td>
                <td>{{ selections.colorOption.name }}</td>
              </tr>
              <tr>
                <td>Size:</td>
                <td>{{ selections.size }}"</td>
              </tr>
              <tr>
                <td>Quantity:</td>
                <td>{{ selections.quantity.toLocaleString() }} pieces</td>
              </tr>
              <tr>
                <td>Unit Price:</td>
                <td>{{ formatCurrency(breakdown.unitPrice) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="print-section">
          <h2>Options</h2>
          <table class="print-table">
            <tbody>
              <tr>
                <td>Plating:</td>
                <td>{{ selections.platingType.name }}{{ selections.platingType.isFree ? ' (FREE)' : ` (${formatCurrency(selections.platingType.price)}/pc)` }}</td>
              </tr>
              <tr>
                <td>Packaging:</td>
                <td>{{ selections.packaging.name }}{{ selections.packaging.isFree ? ' (FREE)' : ` (${formatCurrency(selections.packaging.price)}/pc)` }}</td>
              </tr>
              <tr>
                <td>Design Type:</td>
                <td>{{ selections.designSides === 'two-sided' ? 'Two-Sided (2× mold fee)' : 'One-Sided' }}</td>
              </tr>
              <tr>
                <td>Rush Order:</td>
                <td>{{ selections.rushOrder ? 'Yes (+20%)' : 'No' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="print-section">
          <h2>Price Breakdown</h2>
          <table class="print-breakdown-table">
            <tbody>
              <tr>
                <td>Base Price ({{ selections.quantity.toLocaleString() }} × {{ formatCurrency(breakdown.unitPrice) }}):</td>
                <td class="amount">{{ formatCurrency(breakdown.basePrice) }}</td>
              </tr>
              <tr v-if="breakdown.platingCost > 0">
                <td>Plating Cost ({{ selections.quantity.toLocaleString() }} × {{ formatCurrency(selections.platingType.price) }}):</td>
                <td class="amount">{{ formatCurrency(breakdown.platingCost) }}</td>
              </tr>
              <tr v-if="breakdown.packagingCost > 0">
                <td>Packaging Cost ({{ selections.quantity.toLocaleString() }} × {{ formatCurrency(selections.packaging.price) }}):</td>
                <td class="amount">{{ formatCurrency(breakdown.packagingCost) }}</td>
              </tr>
              <tr v-if="breakdown.moldFee > 0 || breakdown.moldFeeWaived">
                <td>Mold Fee{{ selections.designSides === 'two-sided' && !breakdown.moldFeeWaived ? ' (2× two-sided)' : '' }}{{ breakdown.moldFeeWaived ? ' (Waived - 300+ qty)' : '' }}:</td>
                <td class="amount">{{ breakdown.moldFeeWaived ? 'Waived' : formatCurrency(breakdown.moldFee) }}</td>
              </tr>
              <tr v-if="breakdown.rushFee > 0">
                <td>Rush Fee (20% of subtotal):</td>
                <td class="amount">{{ formatCurrency(breakdown.rushFee) }}</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total:</strong></td>
                <td class="amount"><strong>{{ formatCurrency(breakdown.total) }}</strong></td>
              </tr>
              <tr class="per-unit-row">
                <td>Cost per unit (including all fees):</td>
                <td class="amount">{{ formatCurrency(breakdown.total / selections.quantity) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="print-footer">
          <p>Quote valid for 30 days • Prices subject to change</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CoinOrderSelections, CoinPriceBreakdown } from '~/types/pricing';
import { formatCurrency } from '~/utils/calculations';
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';
import Badge from '~/components/ui/Badge.vue';
import { 
  PrinterIcon, 
  PencilIcon, 
  CogIcon, 
  WrenchScrewdriverIcon, 
  CalculatorIcon 
} from '@heroicons/vue/24/outline';

interface Props {
  selections: CoinOrderSelections;
  breakdown: CoinPriceBreakdown;
}

defineProps<Props>();

defineEmits<{
  edit: []
}>();

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const printQuote = () => {
  window.print();
};
</script>

<style scoped>
/* Screen styles */
.screen-version {
  display: block;
}

.print-version {
  display: none;
}

/* Tabular numbers for consistent price alignment */
.tabular-nums {
  font-feature-settings: 'tnum';
}

/* Print styles */
@media print {
  .screen-version {
    display: none;
  }
  
  .print-version {
    display: block;
  }
  
  .print-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #d1d5db;
  }
  
  .print-header h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .quote-date {
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .print-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .print-section {
    margin-bottom: 1.5rem;
  }
  
  .print-section h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.75rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #d1d5db;
  }
  
  .print-table {
    width: 100%;
  }
  
  .print-table td {
    padding: 0.25rem 0;
    color: #374151;
  }
  
  .print-table td:first-child {
    font-weight: 500;
    width: 33.333333%;
  }
  
  .print-breakdown-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .print-breakdown-table td {
    padding: 0.5rem 0;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .print-breakdown-table td:first-child {
    font-weight: 500;
  }
  
  .print-breakdown-table .amount {
    text-align: right;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  }
  
  .total-row td {
    border-top: 2px solid #9ca3af;
    padding-top: 0.75rem;
    font-size: 1.125rem;
  }
  
  .per-unit-row td {
    font-size: 0.875rem;
    color: #6b7280;
    border-bottom: none;
  }
  
  .print-footer {
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #d1d5db;
  }
  
  /* Ensure proper page breaks */
  .print-section {
    page-break-inside: avoid;
  }
  
  /* Hide any interactive elements in print */
  button {
    display: none;
  }
}
</style>
