<template>
  <div
    class="cursor-pointer min-w-20 px-4 h-10 rounded-lg text-[var(--text-h1)] hover:bg-[var(--bg-hover-color)] duration-300"
    :class="{
      'bg-[var(--bg-info-color-3)] font-bold': isActive,
    }"
  >
    <div class="text-base text-center leading-10">
      {{ name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { isActive, name } = defineProps(["name", "isActive"])
</script>
