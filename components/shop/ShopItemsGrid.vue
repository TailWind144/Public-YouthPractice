<template>
  <div v-for="(arr, key) in data" :key="key" class="flex flex-col gap-2">
    <div class="text-xl text-[var(--text-h1)] font-medium">
      {{ key }}
    </div>
    <div class="grid grid-cols-normal gap-4 scale-enter-content">
      <div
        @click="handleClick(item)"
        v-for="(item, index) in arr"
        :key="index"
        class="duration-300 cursor-pointer bg-[var(--bg-color-d)] rounded-lg p-4 border border-transparent hover:border-[var(--text-primary)]"
      >
        <div class="aspect-square w-32 h-32 mx-auto mb-2">
          <img :src="item.imgUrl" />
        </div>
        <div class="text-center">
          <div class="text-[var(--text-p)] text-base">{{ item.name }}</div>
          <div
            class="my-3 text-[var(--text-info)] text-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ item.desc }}
          </div>
          <div
            class="flex items-center justify-center gap-1 text-[var(--point-yellow)]"
          >
            <CircleStackIcon class="w-4 h-4" />
            <span>{{ item.point }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleStackIcon } from "@heroicons/vue/24/solid"
const { data } = defineProps(["data"])
const emit = defineEmits(["handleClick"])

const handleClick = (item) => {
  emit("handleClick", item)
}
</script>

<style scoped>
@keyframes scale-enter {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }

  to {
    opacity: 1;
  }
}
.scale-enter-content > * {
  --stagger: 0;
  --delay: 90ms;
  --start: 0ms;
  animation: scale-enter 0.6s both 1;
  animation-delay: calc(var(--start) + var(--stagger) * var(--delay));
}

.scale-enter-content > *:nth-child(1) {
  --stagger: 1;
}
.scale-enter-content > *:nth-child(2) {
  --stagger: 2;
}
.scale-enter-content > *:nth-child(3) {
  --stagger: 3;
}
.scale-enter-content > *:nth-child(4) {
  --stagger: 4;
}
.scale-enter-content > *:nth-child(5) {
  --stagger: 5;
}
.scale-enter-content > *:nth-child(6) {
  --stagger: 6;
}
.scale-enter-content > *:nth-child(7) {
  --stagger: 7;
}
.scale-enter-content > *:nth-child(8) {
  --stagger: 8;
}
.scale-enter-content > *:nth-child(9) {
  --stagger: 9;
}
.scale-enter-content > *:nth-child(10) {
  --stagger: 10;
}
.scale-enter-content > *:nth-child(11) {
  --stagger: 11;
}
.scale-enter-content > *:nth-child(12) {
  --stagger: 12;
}
.scale-enter-content > *:nth-child(13) {
  --stagger: 13;
}
.scale-enter-content > *:nth-child(14) {
  --stagger: 14;
}
.scale-enter-content > *:nth-child(15) {
  --stagger: 15;
}
.scale-enter-content > *:nth-child(16) {
  --stagger: 16;
}
.scale-enter-content > *:nth-child(17) {
  --stagger: 17;
}
.scale-enter-content > *:nth-child(18) {
  --stagger: 18;
}
.scale-enter-content > *:nth-child(19) {
  --stagger: 19;
}
.scale-enter-content > *:nth-child(20) {
  --stagger: 20;
}
</style>
