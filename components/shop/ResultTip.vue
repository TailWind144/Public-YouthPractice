<template>
  <div class="fixed inset-0 z-[100] text-[var(--text-h1)]">
    <div ref="mask" class="absolute inset-0 bg-[var(--bg-mask-color)]"></div>
    <div
      class="absolute inset-0 flex flex-col items-center justify-center gap-10"
    >
      <span class="text-[2rem] font-semibold">获取道具</span>
      <div ref="title" class="opacity-0 flex items-center">
        <div class="aspect-square w-36 h-36 mx-auto mb-2">
          <img :src="data?.imgUrl" />
        </div>
        <div class="text-3xl font-semibold opacity-80">× {{ buyNums }}</div>
      </div>
      <span ref="tip" class="text-base text-[var(--text-info)] opacity-70"
        >点击空白处关闭</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"

const { data, buyNums } = defineProps(["data", "buyNums"])

gsap.registerPlugin(CustomEase)

const mask = ref<HTMLElement>()
const title = ref<HTMLElement>()
const tip = ref<HTMLElement>()

onMounted(() => {
  const tl = gsap.timeline()

  tl.fromTo(
    title.value,
    {
      opacity: 0,
      y: 100,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.6)",
    }
  )

  tl.fromTo(
    tip.value,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.4,
    },
    0.6
  )
})
</script>

<style scoped></style>
