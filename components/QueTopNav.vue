<template>
  <div :class="(isTop ? '' : 'border-b') + ' sticky top-0 z-50'">
    <div
      :class="
        (isTop ? 'sm:px-12 sm:py-5' : 'backdrop-blur backdrop-saturate-50') +
        ' flex items-center px-4 sm:px-10 transition-all duration-500 ease-in-out'
      "
    >
      <MainHeader :title class="mr-auto" :icon="IconLeft" :backCb />
      <transition appear name="slide-up">
        <Countdown
          v-if="!isFinish"
          :time
          :showPause
          class="absolute left-[50%] translate-x-[-50%]"
          @end="() => $emit('end')"
        />
        <div
          v-else
          class="absolute left-[50%] translate-x-[-50%] text-2xl text-[var(--text-h1)]"
          :key="score"
        >
          <span class="text-[var(--text-primary)]">{{ score }}</span> 分
        </div>
      </transition>
      <div class="flex gap-4 sm:gap-8">
        <Redo v-if="showRedo" v-show="isFinish" />
        <History v-if="showHistory" :data="historys" />
        <UserAvatar class="hidden sm:block lg:mr-24" />
      </div>
    </div>
    <ScrollTop />
  </div>
</template>

<script setup lang="ts">
import { IconLeft } from "@arco-design/web-vue/es/icon"
import History from "./questions/History.vue"
import Redo from "./questions/Redo.vue"
const {
  isFinish,
  score,
  historys,
  time,
  backCb,
  title,
  showPause,
  showRedo,
  showHistory,
} = defineProps([
  "isFinish",
  "score",
  "historys",
  "time",
  "backCb",
  "title",
  "showPause",
  "showRedo",
  "showHistory",
])

// const isDark = useDark({
//   storageKey: "useDarkKEY",
//   valueDark: "dark",
//   valueLight: "light",
// })
// const toggleDark = useToggle(isDark)

const { y: scroll } = useWindowScroll()
const isTop = computed(() => scroll.value === 0)
// const isTop = true
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(1.5rem);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-1.5rem);
}
</style>
