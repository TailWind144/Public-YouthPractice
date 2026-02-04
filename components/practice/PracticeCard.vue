<template>
  <a-tooltip :content="`共${data.count}个练习`" mini position="top">
    <div
      class="flex-shrink-0 duration-300 hover:bg-[var(--bg-hover-color)] text-[var(--text-card)] bg-[var(--bg-color)] py-[10px] px-4 rounded cursor-pointer"
      :class="{
        '!bg-[var(--text-primary)] text-[var(--text-white)]':
          isActive,
      }"
    >
      <div class="text-base text-center">
        {{ data.name }}
      </div>
    </div>
  </a-tooltip>
</template>

<script setup lang="ts">
const { data, isActive } = defineProps(["data", "isActive"])
</script>

<style scoped></style>
