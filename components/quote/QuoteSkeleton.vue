<template>
  <a-skeleton animation>
    <a-skeleton-line :rows :line-height="136" :line-spacing="16" />
  </a-skeleton>
</template>

<script setup lang="ts">
const { rows } = defineProps({
  rows: { type: Number, default: 1 },
})
</script>

<style scoped></style>
