<template>
  <div class="flex w-screen md:w-auto md:gap-4">
    <button
      v-for="(action, index) in actions"
      :key="index"
      @click="action.handler"
      class="quote-btn flex-1 p-3 flex items-center justify-center backdrop-blur-lg bg-white/20 hover:bg-white/30 md:rounded-full transition-all duration-300 hover:scale-110 hover:z-10"
      :title="action.title"
    >
      <component :is="action.icon" :class="action.name"></component>
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  HeartIcon,
  ShareIcon,
  ClipboardDocumentListIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/vue/24/solid"
import gsap from "gsap"
const { cardRef, currentQuote, isLove } = defineProps([
  "cardRef",
  "currentQuote",
  "isLove",
])
const emit = defineEmits(["love", "switchLang"])

const heartRef = computed(() => (isLove ? HeartSolidIcon : HeartIcon))
const { copy } = useClipboard()
const actions = ref([
  {
    name: "love",
    icon: heartRef,
    title: "收藏",
    handler: () => {
      if (actions.value[0].icon === HeartIcon) {
        gsap.fromTo(
          cardRef,
          {
            scale: 1,
          },
          {
            scale: 1.03,
            duration: 0.2,
            yoyo: true,
            repeat: 3,
          }
        )
        nextTick(() => {
          gsap.fromTo(
            ".love",
            {
              scale: 1,
            },
            {
              scale: 1.2,
              duration: 0.2,
              yoyo: true,
              repeat: 3,
            }
          )
        })
      }
      emit("love")
    },
  },
  {
    name: "switch",
    icon: ArrowPathIcon,
    title: "切换中/英文",
    handler: async () => {
      gsap.fromTo(
        ".switch",
        {
          rotation: 0,
        },
        {
          rotation: 360,
          duration: 0.5,
          ease: "power2.out",
        }
      )
      emit("switchLang")
    },
  },
  {
    name: "copy",
    icon: ClipboardDocumentListIcon,
    title: "复制",
    handler: (() => {
      let isRunning = false
      return async function () {
        if (!isRunning) {
          isRunning = true
          await copy(`${currentQuote.content} —— ${currentQuote.author}`)
          gsap.to(cardRef, {
            y: -10,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
          })
          actions.value[2].icon = CheckIcon
          actions.value[2].name = "check"
          await sleep(1000)
          gsap.to(".check", {
            opacity: 0,
            y: 2,
            duration: 0.5,
          })
          await sleep(500)
          actions.value[2].icon = ClipboardDocumentListIcon
          actions.value[2].name = "copy"
          nextTick(async () => {
            gsap.from(".copy", {
              opacity: 0,
              y: -2,
              duration: 0.5,
            })
            await sleep(500)
            isRunning = false
          })
        }
      }
    })(),
  },
  {
    name: "share",
    icon: ShareIcon,
    title: "分享",
    handler: async () => {
      await copy(`凯凯's 每日一句——${location.href}`)
      gsap
        .timeline()
        .to(cardRef, {
          rotation: -1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        })
        .to(cardRef, {
          rotation: 1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        })
      gsap
        .timeline()
        .to(".share", {
          rotation: -10,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        })
        .to(".share", {
          rotation: 10,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        })
    },
  },
])
</script>

<style scoped>
.quote-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}
.love {
  color: #f87171;
}
.switch {
  color: #b1b3b8;
}
.copy {
  color: #fbbf24;
}
.share {
  color: #60a5fa;
}
.check {
  color: #67c23a;
}
</style>
