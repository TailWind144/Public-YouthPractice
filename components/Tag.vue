<template>
  <div
    class="text-white rounded-sm inline-block py-[1px] px-[8px] scale-75"
    :class="{
      'text-xs': text === 'small',
      'text-lg': text === 'large',
      'text-2xl': text === 'huge',
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { text } = defineProps(["text"])
</script>

<style scoped></style>
