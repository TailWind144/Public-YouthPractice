<template>
  <div
    class="flex justify-between items-center flex-col-reverse gap-2 xl:flex-row mb-2 xl:mb-4"
  >
    <div class="flex w-full items-center justify-between gap-2 flex-1">
      <button
        @click="prevMonth"
        class="p-2 hover:bg-[var(--bg-hover-color)] rounded-full transition-colors"
      >
        <icon-left />
      </button>

      <span class="text-sm font-medium text-[var(--text-h1)] text-center">
        {{ currentMonth.format("YYYY年MM月") }}
      </span>

      <button
        :disabled="isNextMonthDisabled"
        @click="nextMonth"
        class="p-2 hover:bg-[var(--bg-hover-color)] rounded-full transition-colors"
        :class="[
          isNextMonthDisabled
            ? 'cursor-not-allowed opacity-30'
            : 'hover:bg-[var(--bg-hover-color)]',
        ]"
      >
        <icon-right />
      </button>
    </div>
    <div class="w-full xl:w-24 relative">
      <a-button
        :disabled="isCheckin"
        class="w-full xl:w-24"
        type="primary"
        size="large"
        @click="handleSign"
      >
        {{ isCheckin ? "已签到" : "签到" }}
      </a-button>
      <transition name="slide-up">
        <div
          v-if="isCheckin"
          class="z-[999] flex gap-3 items-center absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-2rem] invisible cursor-default opacity-0"
        >
          <div v-if="plusPoint" class="flex gap-1 items-center">
            <CircleStackIcon class="w-4 h-4 text-[var(--point-yellow)]" />
            <span class="text-[var(--point-yellow)]">+{{ plusPoint }}</span>
          </div>
          <div v-if="plusExp" class="flex gap-1 items-center">
            <span class="text-[var(--text-primary)]">exp</span>
            <span class="text-[var(--text-primary)]">+{{ plusExp }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleStackIcon } from "@heroicons/vue/24/solid"

const { isCheckin, isNextMonthDisabled, currentMonth, plusPoint, plusExp } =
  defineProps([
    "isCheckin",
    "isNextMonthDisabled",
    "currentMonth",
    "plusPoint",
    "plusExp",
  ])
const emit = defineEmits(["prevMonth", "nextMonth", "handleCheckin"])

const prevMonth = () => {
  emit("prevMonth")
}
const nextMonth = () => {
  emit("nextMonth")
}
const emitSign = () => {
  emit("handleCheckin")
}
const handleSign = throttle(emitSign, 1000)
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  visibility: visible;
  transition: all 1.6s ease-out;
}
.slide-up-enter-from {
  opacity: 100;
  transform: translateX(-50%) translateY(-1rem);
}
</style>
