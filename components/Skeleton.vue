<template>
  <a-skeleton class="w-full" animation>
    <a-space direction="vertical" :style="{ width: '100%' }" size="large">
      <a-skeleton-line :rows :lineSpacing :lineHeight />
    </a-space>
  </a-skeleton>
</template>

<script setup lang="ts">
const { lineHeight, lineSpacing, rows } = defineProps([
  "lineHeight",
  "lineSpacing",
  "rows",
])
</script>
