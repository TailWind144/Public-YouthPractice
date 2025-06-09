<template>
  <a-tooltip :content="`共${data.count}个练习`" mini position="top">
    <div
      :class="
        (isActive
          ? '!bg-[var(--text-primary)] shadow text-[var(--text-white)] border-[var(--text-primary)]'
          : '') +
        ' hover:border-[var(--text-primary)] hover:bg-[var(--bg-color-d)] hover:shadow text-[var(--text-card)] bg-[var(--bg-color)] flex flex-1 flex-col gap-2 py-[10px] px-4 rounded-full border cursor-pointer group transition duration-300'
      "
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
