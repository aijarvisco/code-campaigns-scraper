<script setup>
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  class: String
})

const emit = defineEmits(['close'])

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        success: 'border-green-500/50 bg-green-500/10 text-green-500',
        destructive: 'border-destructive/50 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const toastClass = computed(() =>
  cn(toastVariants({ variant: props.variant }), props.class)
)
</script>

<template>
  <div :class="toastClass">
    <div class="flex-1">
      <slot />
    </div>
    <button
      @click="emit('close')"
      class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>
