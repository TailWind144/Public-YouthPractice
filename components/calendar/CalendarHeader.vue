<template>
  <div
    class="flex justify-between items-center flex-col-reverse gap-3 xl:flex-row"
  >
    <div class="flex w-full items-center justify-between gap-1 flex-1">
      <button
        @click="prevMonth"
        class="shrink-0 flex p-1 text-[var(--text-white)] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <icon-left />
      </button>

      <span class="text-sm font-medium text-[var(--text-white)] text-center">
        {{ currentMonth.format("YYYY年MM月") }}
      </span>

      <button
        :disabled="isNextMonthDisabled"
        @click="nextMonth"
        class="shrink-0 flex p-1 text-[var(--text-white)] bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <icon-right />
      </button>
    </div>

    <!-- Check-in Button -->
    <div class="relative w-full xl:w-[88px]">
      <button
        :disabled="isCheckin"
        @click="handleSign"
        class="px-3 py-2 bg-white flex w-full justify-center rounded-lg text-[var(--text-primary-2)] font-medium text-sm xl:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        :class="{
          '!text-[var(--success-color)]': isCheckin,
          'hover:bg-white/95': !isCheckin,
        }"
      >
        <span class="flex items-center gap-2">
          <icon-check v-if="isCheckin" />
          <icon-check-circle v-else />
          {{ isCheckin ? "已签到" : "签到" }}
        </span>
      </button>

      <!-- Reward Animation -->
      <transition name="reward-bounce" appear>
        <div
          v-if="isCheckin"
          class="z-[999] flex gap-3 items-center absolute top-0 left-[50%] translate-x-[-50%] translate-y-[-2rem] invisible cursor-default opacity-0"
        >
          <div v-if="plusPoint" class="flex gap-1 items-center">
            <CircleStackIcon class="w-4 h-4 text-[var(--point-yellow)]" />
            <span class="text-[var(--point-yellow)]">+{{ plusPoint }}</span>
          </div>
          <div v-if="plusExp" class="flex gap-1 items-center">
            <span class="text-[var(--text-primary)] font-bold">Exp</span>
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
.reward-bounce-enter-active,
.reward-bounce-leave-active {
  visibility: visible;
  animation: reward-bounce 1.2s ease-out;
}

@keyframes reward-bounce {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(0) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-8px) scale(1.05);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-16px) scale(1);
  }
}
</style>
