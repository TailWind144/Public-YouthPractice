<template>
  <div class="flex flex-col gap-1">
    <div
      class="duration-300 text-lg py-2 px-4 cursor-pointer hover:bg-[var(--bg-info-color-3)] rounded"
      :class="{
        'bg-[var(--bg-info-color-3)]': selectedKind === item,
      }"
      v-for="(item, index) in backpackSideNav"
      :key="index"
      @click="handleChange(item)"
    >
      <div class="flex items-center gap-2">
        <div class="text-[var(--text-card)]">{{ `${item}物品` }}</div>
        <div class="text-[var(--text-info)]">
          <transition name="fade-right">
            <icon-right v-show="selectedKind === item" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { backpackSideNav } from "~/utils/const"

const { selectedKind } = defineProps(["selectedKind"])
const emit = defineEmits(["handleChange"])

const handleChange = (kind) => {
  emit("handleChange", kind)
}
</script>

<style scoped>
.fade-right-enter-active {
  transition: all 0.3s ease-out;
}
.fade-right-leave-active {
  transition: all 0.3s ease-in;
}
.fade-right-enter-from {
  opacity: 0;
  transform: translateX(-2px);
}
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(2px);
}
</style>
