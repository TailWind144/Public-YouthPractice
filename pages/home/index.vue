<template>
  <div class="flex flex-col gap-8 max-w-[105em] mx-auto px-4 py-8">
    <div
      class="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center justify-between"
    >
      <div class="flex flex-col gap-2">
        <h2 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold">
          嗨，{{ userState.nickname }}！👋
        </h2>
        <p class="text-[var(--text-info)] text-base">开始你的英语学习之旅吧</p>
      </div>
      <div
        class="flex items-center gap-2 text-base bg-[var(--bg-checked-color)] text-[var(--text-h1)] px-4 py-2 rounded-full"
      >
        <span class="text-[var(--text-primary)]">
          <icon-calendar />
        </span>
        <span class="font-medium">{{ currentDate }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div
        class="md:col-span-4 lg:col-span-3 flex flex-col gap-6 order-2 md:order-1"
      >
        <home-data-detail-card :data="userDataDetail" />
        <home-continue-practice-card v-show="level" :level />
      </div>
      <div class="md:col-span-8 lg:col-span-6 order-1 md:order-2">
        <div class="card-3d-container">
          <transition name="card-swap">
            <HomeDictationCard
              v-if="swapVisible"
              class="absolute w-full"
              @swap="(flag) => (swapVisible = flag)"
            />
            <home-vocabulary-card
              v-else
              class="absolute w-full"
              @swap="(flag) => (swapVisible = flag)"
            />
          </transition>
        </div>
      </div>
      <div class="lg:col-span-3 order-3">
        <div class="flex-col gap-6 hidden lg:flex">
          <Calendar />
          <DailySentence />
        </div>
        <div class="fixed block lg:hidden bottom-12 right-2">
          <PopMenu />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import type { User } from "~/types/user"
import { getLastLevel, getUserDataDetail } from "./utils/fetch"
const swapVisible = ref(false)

definePageMeta({
  layout: "commonboard",
})
const userState = useState<User>("userState")
const currentDate = dayjs().format("YYYY年MM月DD日ddd")

const level = ref({ percent: 0 })
const userDataDetail = ref({ levelCount: 0, total: 1 })
const initUserDataDetail = async () => {
  const { data } = await getUserDataDetail()

  userDataDetail.value = data
}
const initLastLevel = async () => {
  const { data } = await getLastLevel()
  level.value = data
}
initUserDataDetail()
initLastLevel()

useHead({
  title: "首页",
})
</script>

<style scoped>
/* 3D 卡片切换容器 */
.card-3d-container {
  perspective: 1200px;
  -webkit-perspective: 1200px;
  position: relative;
}

/* 保持子元素的 3D 空间 */
.card-3d-container > * {
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

/* 过渡公共设置 */
.card-swap-enter-active,
.card-swap-leave-active {
  transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 420ms ease;
  transform-origin: center center;
}

/* 进入时：从后方向前推进并淡入 */
.card-swap-enter-from {
  transform: translateZ(-120px) rotateX(8deg) scale(0.98);
  opacity: 0;
  backface-visibility: hidden;
}
.card-swap-enter-to {
  transform: translateZ(0) rotateX(0) scale(1);
  opacity: 1;
}

/* 离开时：向后移动并淡出 */
.card-swap-leave-from {
  transform: translateZ(0) rotateX(0) scale(1);
  opacity: 1;
}
.card-swap-leave-to {
  transform: translateZ(-120px) rotateX(-8deg) scale(0.98);
  opacity: 0;
  backface-visibility: hidden;
}

/* 确保进入元素在上层（略微提高 z-index） */
.card-swap-enter-active {
  z-index: 2;
}
.card-swap-leave-active {
  z-index: 1;
}
</style>
