<template>
  <div
    class="border border-[var(--border-color)] flex justify-between p-4 rounded-xl items-center cursor-pointer duration-300"
  >
    <div class="flex gap-3 items-center">
      <slot />

      <div class="w-full flex flex-col gap-1">
        <div class="text-base text-[var(--text-p)] font-medium">
          {{ title }}
        </div>
        <div class="text-[var(--text-info)]">{{ subTitle }}</div>
      </div>
    </div>
    <div class="text-[var(--text-info)] text-base">
      <icon-right style="stroke-width: 8" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { title, subTitle } = defineProps(["title", "subTitle"])
</script>

<style scoped></style>
