<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-slate-700">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md'
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-slate-800 border border-slate-700 rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-lg shadow-slate-900/20'
  }
  
  const paddingClasses = {
    none: '[&>.p-6]:p-0',
    sm: '[&>.p-6]:p-3',
    md: '[&>.p-6]:p-6',
    lg: '[&>.p-6]:p-8'
  }
  
  return [
    baseClasses,
    variantClasses[props.variant],
    paddingClasses[props.padding]
  ].join(' ')
})
</script>