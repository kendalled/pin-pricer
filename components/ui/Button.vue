<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :aria-disabled="disabled"
    @click="$emit('click', $event)"
    @keydown.enter="$emit('click', $event)"
    @keydown.space.prevent="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-250 ease-in-out',
    'focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    // Enhanced touch targets for mobile
    'min-h-[44px] min-w-[44px]',
    // High contrast mode support
    'high-contrast:border-2 high-contrast:border-current',
    // Reduced motion support
    'reduced-motion:transition-none'
  ].join(' ')
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm xs:px-4 xs:py-2.5',
    md: 'px-4 py-2.5 text-base xs:px-5 xs:py-3',
    lg: 'px-6 py-3 text-lg xs:px-8 xs:py-4'
  }
  
  const variantClasses = {
    primary: [
      'bg-blue-550 text-white shadow-sm',
      'hover:bg-blue-600 hover:shadow-md',
      'active:bg-blue-700 active:scale-95 active:shadow-sm',
      'focus-visible:bg-blue-600',
      // High contrast improvements
      'high-contrast:bg-blue-700 high-contrast:text-white high-contrast:border-blue-300'
    ].join(' '),
    secondary: [
      'bg-slate-700 text-slate-200 border border-slate-600 shadow-sm',
      'hover:bg-slate-600 hover:text-white hover:border-slate-500 hover:shadow-md',
      'active:bg-slate-500 active:scale-95 active:shadow-sm',
      'focus-visible:bg-slate-600 focus-visible:text-white',
      // High contrast improvements
      'high-contrast:bg-slate-800 high-contrast:text-white high-contrast:border-slate-300'
    ].join(' '),
    ghost: [
      'text-slate-300 bg-transparent',
      'hover:bg-slate-800 hover:text-white',
      'active:bg-slate-700 active:scale-95',
      'focus-visible:bg-slate-800 focus-visible:text-white',
      // High contrast improvements
      'high-contrast:text-white high-contrast:border-slate-300'
    ].join(' ')
  }
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].join(' ')
})
</script>