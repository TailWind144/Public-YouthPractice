<template>
  <div
    class="top-inter-bar flex justify-between items-center px-4 py-3 gap-20 rounded-md shadow-md bg-[var(--text-primary)]"
  >
    <div class="flex flex-col gap-2 text-[var(--text-white)]">
      <div class="text-base">{{ data.module }}</div>
      <div>{{ data.unit }}</div>
    </div>
    <div>
      <a-button
        @click="() => navigateTo({ path: '/practice/list', query: { module } })"
        >返回</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, module } = defineProps(["data", "module"])
</script>

<style scoped>
/* .top-inter-bar {
  filter: drop-shadow(1px 1px 6px var(--text-primary));
} */
</style>
