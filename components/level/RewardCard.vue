<template>
  <div
    class="items-center justify-center flex flex-col bg-[var(--bg-color-d)] gap-1 flex-1 p-3 rounded-lg relative"
  >
    <slot name="icon" />
    <div class="text-[var(--text-p)]">{{ value }}</div>
    <transition appear name="scale-out">
      <div
        v-if="reward"
        class="absolute border-2 border-[var(--success-color)] w-full h-full bg-[#e8ffea]/85 rounded-lg flex items-center justify-center"
      >
        <span class="text-[var(--success-color)] text-3xl">
          <icon-check style="stroke-width: 8" />
        </span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { value, reward } = defineProps(["value", "reward"])
</script>

<style scoped>
.scale-out-enter-active {
  transition: all 0.2s ease-out;
}
.scale-out-leave-active {
  transition: all 0.2s ease-in;
}
.scale-out-enter-from,
.scale-out-leave-to {
  opacity: 0;
  scale: 1.02;
}
</style>
