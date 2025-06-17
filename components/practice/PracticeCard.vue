<template>
  <a-tooltip :content="`共${data.count}个练习`" mini position="top">
    <div
      class="flex-shrink-0 hover:border-[var(--text-primary)] hover:bg-[var(--bg-color-d)] text-[var(--text-card)] bg-[var(--bg-color)] py-[10px] px-4 rounded-full border cursor-pointer duration-300"
      :class="{
        '!bg-[var(--text-primary)] text-[var(--text-white)] border-[var(--text-primary)]':
          isActive,
      }"
    >
      <div class="text-base duration-300 text-center">
        {{ data.name }}
      </div>
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
const { data, isActive } = defineProps(["data", "isActive"])
</script>

<style scoped></style>
