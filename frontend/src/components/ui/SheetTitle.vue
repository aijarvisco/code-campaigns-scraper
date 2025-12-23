<script setup>
import { DialogTitle } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: String
})
</script>

<template>
  <DialogTitle :class="cn('text-lg font-semibold text-foreground', props.class)">
    <slot />
  </DialogTitle>
</template>
