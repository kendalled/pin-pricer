<template>
  <span 
    :class="badgeClasses"
    role="status"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error'
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
  ariaDescribedBy?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-250 px-2.5 py-1 border backdrop-blur-sm'
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const variantClasses = {
    default: 'bg-slate-800/60 text-slate-200 border-slate-600/70',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    info: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    error: 'bg-red-500/15 text-red-300 border-red-500/30'
  }
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].join(' ')
})
</script>