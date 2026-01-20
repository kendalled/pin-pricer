<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :aria-disabled="disabled"
    @click="$emit('click', $event)"
    @keydown.enter="$emit('click', $event)"
    @keydown.space.prevent="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-250 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none backdrop-blur-sm'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white shadow-sm hover:shadow-md hover:bg-blue-500 active:bg-blue-700 active:scale-95',
    secondary: 'glass text-slate-100 border border-slate-600 hover:bg-slate-700/60 active:bg-slate-700 active:scale-95',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-700 active:scale-95',
    soft: 'bg-blue-500/10 text-blue-300 border border-blue-400/20 hover:bg-blue-500/15 hover:border-blue-400/30 active:scale-95'
  }
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant]
  ].join(' ')
})
</script>