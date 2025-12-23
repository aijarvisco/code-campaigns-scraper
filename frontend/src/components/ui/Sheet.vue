<script setup>
import { DialogRoot, DialogPortal, useForwardPropsEmits } from 'radix-vue'

const props = defineProps({
  open: Boolean,
  defaultOpen: Boolean,
  modal: Boolean
})

const emits = defineEmits(['update:open'])

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
