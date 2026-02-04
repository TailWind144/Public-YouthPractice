<template>
  <div class="fixed inset-0 z-[100] text-[var(--text-h1)]">
    <div ref="mask" class="absolute inset-0 bg-[var(--bg-mask-color)]"></div>
    <div
      class="absolute inset-0 flex flex-col justify-center items-center gap-10"
    >
      <div class="flex flex-col items-center justify-center gap-2">
        <span ref="title1" class="text-[4rem] opacity-0">恭喜</span>
        <span ref="title2" class="text-[10rem] opacity-0">
          <span class="text-[var(--text-primary)] relative"> {{ score }} </span
          >分
        </span>
      </div>
      <div
        ref="userLevelRef"
        class="px-8 w-full lg:px-0 lg:w-[50%] opacity-0 flex items-center"
      >
        <UserLevel
          class="w-full"
          :size="'large'"
          :text="'huge'"
          :isShowText="false"
        />
        <TooltipIconButton
          v-if="!isUse && !isBeforeReward"
          :content="'双倍经验'"
          :position="'top'"
          @click.stop="handleUseExpUp"
        >
          <icon-double-up />
        </TooltipIconButton>
      </div>
      <div
        ref="pointRef"
        class="flex gap-1 opacity-0 relative w-full justify-center"
      >
        <CircleStackIcon class="w-8 h-8 text-[var(--point-yellow)]" />
        <transition name="slide-up">
          <span class="text-[var(--point-yellow)] text-2xl" :key="point">
            {{ point }}
          </span>
        </transition>
        <span
          v-if="!isBeforeReward"
          ref="plusPoint"
          class="text-[var(--point-yellow)] text-2xl"
          >+1</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue"
import { CircleStackIcon } from "@heroicons/vue/24/solid"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import type { User } from "~/types/user"

const { score, beforePoint, isBeforeReward } = defineProps([
  "score",
  "beforePoint",
  "isBeforeReward",
])

const point = ref()
watchEffect(() => {
  point.value = beforePoint
})

gsap.registerPlugin(CustomEase)

const userState = useState<User>("userState")
const userLevelRef = ref<HTMLElement>()
const pointRef = ref<HTMLElement>()
const plusPoint = ref<HTMLElement>()
const title1 = ref<HTMLElement>()
const title2 = ref<HTMLElement>()

const isUse = ref(false)
const handleExpUpOk = async () => {
  const { data } = await getCheck()
  userState.value = data
  isUse.value = true
  Message.success("使用成功")
}
const handleUseExpUp = async () => {
  await handleItemUseModal(
    "经验药水",
    "你确定要使用吗？这将消耗一个经验药水。",
    handleItemUseOk("经验药水", handleExpUpOk)
  )
}

CustomEase.create(
  "superBounce",
  "M0,0 C0.266,0.412 0.378,0.982 0.44,0.987 0.511,0.993 0.638,1.001 1,1"
)
onMounted(() => {
  const tl = gsap.timeline()

  tl.fromTo(
    title1.value,
    { opacity: 0, scale: 0.5, filter: "blur(20px)" },
    {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "superBounce",
    },
    0.5
  )

  tl.fromTo(
    title2.value,
    {
      opacity: 0,
      scale: 0.8,
      y: 100,
      rotation: 15,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      rotation: 0,
      duration: 1.5,
      ease: "elastic.out(1, 0.3)",
      onStart: () => realisticFire(),
    },
    0.8
  )

  tl.fromTo(
    userLevelRef.value,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.6,
      ease: "power1.in",
      onComplete: async () => {
        const { data } = await getCheck()
        userState.value = data
      },
    },
    1.3
  )
  tl.fromTo(
    pointRef.value,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.6,
      ease: "power1.in",
    },
    1.3
  )
  tl.fromTo(
    plusPoint.value,
    {
      opacity: 1,
    },
    {
      opacity: 0,
      x: -20,
      duration: 0.6,
      ease: "power1.out",
      onComplete: async () => {
        if (isBeforeReward) return
        point.value = String(userState.value.points)
      },
    },
    1.6
  )
})
</script>

<style scoped>
.slide-up-leave-active {
  position: absolute;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
