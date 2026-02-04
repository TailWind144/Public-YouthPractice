<template>
  <div class="bg-white rounded-2xl p-6 md:p-8 min-h-[264px]">
    <div class="flex flex-col gap-8">
      <vocabulary-operation-bar
        :class="{
          invisible: index !== 0,
        }"
        @click-is-remember="clickIsRemember"
        @click-next-word="clickNextWord"
        :id="card.id"
        :index
      />
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <div
            class="text-[clamp(2rem,5vw,3rem)] font-bold text-[var(--text-h1)] transition-all duration-300 flex gap-2 items-center"
            :class="{
              '!text-[var(--success-color)]': isShowMeaning && isRememberFlag,
              '!text-[var(--error-color)]': isShowMeaning && !isRememberFlag,
            }"
          >
            <span
              ref="wordRef"
              class="font-[Poppins]"
              :class="{ 'text-3xl': isOver }"
            >
              {{ front }}
            </span>
            <TooltipIconButton
              v-if="isRememberFlag"
              position="top"
              iconColor="text-[var(--point-yellow)]"
              content="标记为已掌握，之后将不再出现该单词"
              @click="clickMaster"
            >
              <BookmarkIcon class="w-6 h-6" v-if="isMark" />
              <OulineBookmarkIcon class="w-6 h-6" v-else />
            </TooltipIconButton>
          </div>
          <div
            v-if="card.symbol"
            class="text-[var(--text-info)] text-base flex gap-3 items-center"
          >
            <div class="italic">{{ symbol }}</div>
            <div
              class="text-[var(--text-primary)] cursor-pointer text-xl"
              @click="handleSpeak(card.word)"
            >
              <icon-sound-fill />
            </div>
          </div>
          <div
            v-if="card.stage"
            class="rounded-full bg-[var(--bg-checked-color)] text-[var(--text-primary)] px-3 py-1 w-fit"
          >
            {{ stageToName[card.stage] }}
          </div>
        </div>
        <transition name="fade-y">
          <div v-show="isShowMeaning" class="flex flex-col gap-6">
            <div class="flex flex-col gap-3">
              <div
                class="text-lg font-semibold text-[var(--text-h1)] flex items-center gap-2"
              >
                <BookOpenIcon class="w-5 h-5 text-[var(--text-primary)]" />
                <span>释义</span>
              </div>
              <div class="space-y-2 pl-1 text-base">
                <div class="flex items-start">
                  <span class="text-[var(--text-primary)] mr-2">•</span>
                  <span class="text-[var(--text-p)]">
                    {{ back }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="card.example" class="flex flex-col gap-3">
              <div
                class="text-lg font-semibold text-[var(--text-h1)] flex items-center gap-2"
              >
                <ChatBubbleOvalLeftEllipsisIcon
                  class="w-5 h-5 text-[var(--text-primary)]"
                />
                <span>例句</span>
              </div>
              <div class="border border-[var(--border-color)] rounded-lg p-4">
                <span class="text-[var(--text-p)] text-base italic">
                  "{{ card.example }}"
                </span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookmarkIcon } from "@heroicons/vue/24/solid"
import { BookmarkIcon as OulineBookmarkIcon } from "@heroicons/vue/24/outline"
import TooltipIconButton from "../TooltipIconButton.vue"
import { stageToName } from "~/pages/vocabulary/utils/const"
import {
  BookOpenIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/vue/24/solid"
import { markMasterWord } from "~/pages/vocabulary/utils/fetch"
import { Message } from "@arco-design/web-vue"

const emit = defineEmits(["clickNextWord", "clickIsRemember"])
const { card, index } = defineProps(["card", "index"])

const isShowMeaning = ref(false)
const isRememberFlag = ref()
const clickIsRemember = async (id, isRemember) => {
  isShowMeaning.value = true
  isRememberFlag.value = isRemember
  handleSpeak(card.word)
  emit("clickIsRemember", id, isRemember)
}
const clickNextWord = () => {
  emit("clickNextWord", isRememberFlag.value)
  isRememberFlag.value = undefined
  isShowMeaning.value = false
}

const isMark = ref(false)
const clickMaster = async () => {
  isMark.value = !isMark.value
  await markMasterWord({ id: card.id, isMark: isMark.value })
  isMark.value ? Message.success("标记掌握成功") : Message.info("取消标记")
}

let audio
const handleSpeak = async (word) => {
  if (audio) audio.pause()
  audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${word}`)
  audio.play()
}

const wordLimit = computed(() => (card.card_mode === 1 ? 9 : 16))
const isOver = computed(() =>
  front.value.length >= wordLimit.value ? true : false
)

// 卡片展示模式 0：英→中；1：中→英
const front = computed(() => {
  if (card.card_mode === 1) {
    return card.book_meaning
  }
  return card.word
})

const symbol = computed(() => {
  if (card.card_mode === 1) {
    return "" // 中文模式下不显示音标
  }
  return card.symbol
})

const back = computed(() => {
  if (card.card_mode === 1) {
    return card.word
  }
  return card.book_meaning
})
</script>

<style scoped></style>
