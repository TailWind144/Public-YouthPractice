<template>
  <button
    class="select-none flex-1 cursor-pointer p-2 rounded-lg flex gap-2 active:scale-[.98] items-center justify-center duration-300 hover:translate-y-[-0.125rem]"
  >
    <div class="text-lg"><slot /></div>
    <div class="font-medium">{{ text }}</div>
  </button>
</template>

<script setup lang="ts">
const { text } = defineProps(["text"])
</script>

<style scoped></style>
