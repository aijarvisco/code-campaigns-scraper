<script setup>
import { DialogTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  asChild: Boolean,
  class: String
})
</script>

<template>
  <DialogTrigger :as-child="asChild" :class="cn(props.class)">
    <slot />
  </DialogTrigger>
</template>
