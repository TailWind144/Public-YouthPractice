<template>
  <div class="rounded-xl p-4 flex flex-col gap-1 items-center justify-center relative">
    <transition name="list">
      <div :key="value" class="font-bold text-2xl">{{ value }}</div>
    </transition>
    <div class="text-[var(--text-info-2)]">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
const { title, value } = defineProps(["title", "value"])
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.list-leave-active {
  position: absolute;
}
</style>
