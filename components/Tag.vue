<template>
  <div
    class="text-white inline-block py-[2px] px-[10px]"
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
