<template>
  <div v-if="hasError" class="error-boundary">
    <div class="bg-red-900/20 border border-red-700/30 rounded-lg p-6">
      <div class="flex items-center space-x-3 mb-4">
        <svg class="w-6 h-6 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-lg font-semibold text-red-200">Something went wrong</h3>
      </div>
      
      <div class="space-y-3">
        <p class="text-red-300 text-sm">
          {{ errorMessage || 'An unexpected error occurred while processing your request.' }}
        </p>
        
        <div v-if="showDetails && errorDetails" class="bg-red-950/50 rounded p-3">
          <details class="text-xs text-red-300">
            <summary class="cursor-pointer font-medium mb-2">Error Details</summary>
            <pre class="whitespace-pre-wrap">{{ errorDetails }}</pre>
          </details>
        </div>
        
        <div class="flex flex-wrap gap-3 pt-2">
          <Button 
            variant="secondary" 
            size="sm" 
            @click="retry"
            class="bg-red-800 hover:bg-red-700 border-red-600"
          >
            Try Again
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            @click="reset"
            class="text-red-300 hover:text-red-200"
          >
            Reset
          </Button>
          
          <Button 
            v-if="!showDetails" 
            variant="ghost" 
            size="sm" 
            @click="showDetails = true"
            class="text-red-400 hover:text-red-300"
          >
            Show Details
          </Button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick } from 'vue';
import Button from './Button.vue';

interface Props {
  fallbackMessage?: string;
  showRetry?: boolean;
  showReset?: boolean;
}

interface Emits {
  (e: 'error', error: Error): void;
  (e: 'retry'): void;
  (e: 'reset'): void;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: '',
  showRetry: true,
  showReset: true
});

const emit = defineEmits<Emits>();

const hasError = ref(false);
const errorMessage = ref('');
const errorDetails = ref('');
const showDetails = ref(false);

// Capture errors from child components
onErrorCaptured((error: Error) => {
  console.error('ErrorBoundary caught error:', error);
  
  hasError.value = true;
  errorMessage.value = props.fallbackMessage || error.message || 'An unexpected error occurred';
  errorDetails.value = error.stack || error.toString();
  
  emit('error', error);
  
  // Prevent the error from propagating further
  return false;
});

const retry = async () => {
  hasError.value = false;
  errorMessage.value = '';
  errorDetails.value = '';
  showDetails.value = false;
  
  emit('retry');
  
  // Wait for next tick to allow component to re-render
  await nextTick();
};

const reset = () => {
  hasError.value = false;
  errorMessage.value = '';
  errorDetails.value = '';
  showDetails.value = false;
  
  emit('reset');
};

// Expose methods for parent components
defineExpose({
  retry,
  reset,
  hasError: () => hasError.value
});
</script>

<style scoped>
.error-boundary {
  width: 100%;
}

pre {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 11px;
  line-height: 1.4;
  max-height: 200px;
  overflow-y: auto;
}

details summary {
  outline: none;
}

details[open] summary {
  margin-bottom: 8px;
}
</style>