<template>
  <div class="flex flex-col gap-1 w-full">
    <div class="w-full bg-white rounded-full h-2.5">
      <div
        class="bg-[var(--text-primary)] h-2.5 rounded-full progress-shine duration-300"
        id="progress-bar"
        :style="{ width: `${percent}%` }"
      ></div>
    </div>
    <div class="flex justify-between text-sm text-[var(--text-info)]">
      <span>当前进度</span>
      <span>{{ percent }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { percent } = defineProps(["percent"])
</script>

<style scoped>
.progress-shine {
  position: relative;
  overflow: hidden;
}
.progress-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shine 2s infinite;
}
@keyframes shine {
  100% {
    left: 100%;
  }
}
</style>
