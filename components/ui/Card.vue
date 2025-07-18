<template>
  <div :class="cardClasses" role="region" :aria-labelledby="headerId">
    <div v-if="$slots.header" :class="headerClasses" :id="headerId">
      <slot name="header" />
    </div>
    <div :class="contentClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md'
})

// Generate unique ID for accessibility
const headerId = `card-header-${Math.random().toString(36).substr(2, 9)}`

const cardClasses = computed(() => {
  const baseClasses = [
    'bg-slate-800 border border-slate-700 rounded-xl',
    'transition-all duration-250 ease-in-out',
    // High contrast mode support
    'high-contrast:bg-slate-950 high-contrast:border-slate-300',
    // Reduced motion support
    'reduced-motion:transition-none'
  ].join(' ')
  
  const variantClasses = {
    default: 'shadow-sm hover:shadow-md',
    elevated: 'shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/25'
  }
  
  return [
    baseClasses,
    variantClasses[props.variant]
  ].join(' ')
})

const headerClasses = computed(() => {
  const basePadding = 'border-b border-slate-700 high-contrast:border-slate-300'
  
  const paddingClasses = {
    none: `${basePadding} px-0 py-0`,
    sm: `${basePadding} px-3 py-2 xs:px-4 xs:py-3`,
    md: `${basePadding} px-4 py-3 xs:px-6 xs:py-4`,
    lg: `${basePadding} px-6 py-4 xs:px-8 xs:py-6`
  }
  
  return paddingClasses[props.padding]
})

const contentClasses = computed(() => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 xs:p-4',
    md: 'p-4 xs:p-6',
    lg: 'p-6 xs:p-8'
  }
  
  return paddingClasses[props.padding]
})

const footerClasses = computed(() => {
  const basePadding = 'border-t border-slate-700 high-contrast:border-slate-300'
  
  const paddingClasses = {
    none: `${basePadding} px-0 py-0`,
    sm: `${basePadding} px-3 py-2 xs:px-4 xs:py-3`,
    md: `${basePadding} px-4 py-3 xs:px-6 xs:py-4`,
    lg: `${basePadding} px-6 py-4 xs:px-8 xs:py-6`
  }
  
  return paddingClasses[props.padding]
})
</script>