<template>
  <a-spin class="z-[1000]" :loading tip="请等待">
    <div class="h-screen bg-[var(--bg-color)] flex flex-col">
      <QueTopNav
        :title
        :isFinish
        :score
        :time
        :showPause="false"
        :showHistory="false"
        :showRedo="false"
        :backCb="() => navigateTo('/home')"
      />
      <div
        class="flex-1 w-full flex-col justify-between items-center max-w-[80em] m-auto flex relative"
      >
        <div class="text-center text-2xl text-[var(--text-p)]">
          {{ curIndex + 1 }} / {{ list.length }}
        </div>
        <div
          class="fixed inset-0 flex flex-col gap-6 px-7 items-center justify-center"
        >
          <DictationAudio :isPlay @play="handlePlay" />
          <div class="text-xl font-medium">
            <span v-if="isFinish" class="text-[var(--text-info-2)]">
              答案：<span class="text-[var(--text-primary)]">{{ word }}</span>
            </span>
            <span v-else class="text-[var(--text-info-2)]">
              请输入你听到的内容
            </span>
          </div>
          <DictationInput
            :disabled="isFinish"
            :value="answer"
            :isCorrect="checkAnswersArr[curIndex]?.isCorrect"
            @input="handleInput"
          />
          <div class="h-[36px] mt-2">
            <transition name="scale-fade">
              <a-button
                v-show="answer && curIndex < list.length - 1"
                size="large"
                type="outline"
                @click="handleNext"
              >
                下一个
              </a-button>
            </transition>
          </div>
        </div>
        <DictationWordsNav
          class="relative z-10"
          :list
          :curIndex
          :isFinish
          :answers
          :checkAnswersArr
          @change="handleChange"
        />
      </div>
      <transition name="slide-fade">
        <Congratulation
          v-if="visible"
          :score
          :beforePoint
          :isBeforeReward="false"
          @click="visible = false"
        />
      </transition>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { Modal } from "@arco-design/web-vue"
import { checkAnswers, dictationContent, dictationDetail } from "./utils/fetch"
import Congratulation from "~/components/questions/Congratulation.vue"
import type { User } from "~/types/user"
const route = useRoute()
const visible = ref(false)
const beforePoint = ref()
const { did: id } = route.query

const title = ref("")
const time = ref(5)
const isPlay = ref(false)
const curPlayCount = ref<number[]>([])
const maxPlayCount = ref(3)
const curIndex = ref<number>(0)
const score = ref()
const isFinish = useState("isFinish")
const loading = ref(false)

isFinish.value = false
const word = computed(() => list.value[curIndex.value]?.word)
const answer = computed(() => answers.value[curIndex.value])
const list = ref<any[]>([])
const answers = ref<any>([])
const checkAnswersArr = ref([])
const initContent = async () => {
  const { data } = await dictationContent({ id })
  list.value = data.data
  time.value = data.time
  title.value = data.title
  maxPlayCount.value = data.maxPlayCount
  curPlayCount.value = new Array(list.value.length).fill(0)
  answers.value = new Array(list.value.length).fill("")
  await initRecord()
}
const initRecord = async () => {
  const { data } = await dictationDetail({ id })
  if (data) {
    isFinish.value = true
    curIndex.value = 0
    maxPlayCount.value = Infinity
    score.value = data.score
    answers.value = data.answers
    checkAnswersArr.value = data.checkAnswersArr
  }
}
initContent()

const handleInput = (val) => {
  answers.value[curIndex.value] = val
}

let audio
const handlePlay = () => {
  if (curPlayCount.value[curIndex.value] === maxPlayCount.value) return
  isPlay.value = !isPlay.value
  if (isPlay.value) {
    curPlayCount.value[curIndex.value]++
    if (audio) audio.pause()
    audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${word.value}`)
    audio.addEventListener("ended", function () {
      isPlay.value = false
    })
    audio.play()
  } else if (audio) audio.pause()
}
const handleChange = (index) => {
  if (audio) audio.pause()
  curIndex.value = index
}
const handleNext = () => {
  if (curIndex.value < list.value.length - 1) {
    curIndex.value++
    if (audio) audio.pause()
  }
}

const userState = useState<User>("userState")
const handleSubmitOk = async () => {
  useEmit("question-submit-success")
  if (!isFinish.value) {
    loading.value = true
    await checkAnswers({ id, answers: answers.value })
    await initRecord()
    loading.value = false
    if (score.value >= 80) {
      beforePoint.value = userState.value.points
      visible.value = true
    }
  }
}

const handleDictationSubmit = () => {
  Modal.warning({
    title: "注意",
    content: "你确定要提交吗？提交后不可修改答案。",
    hideCancel: false,
    simple: false,
    onOk() {
      handleSubmitOk()
    },
  })
}
useOn("question-submit", handleDictationSubmit)

onBeforeUnmount(() => {
  useOff("question-submit", handleDictationSubmit)
})
useHead({
  title: "听写练习",
})
definePageMeta({
  validate: async (route) => {
    return typeof route.query.did === "string" && /^\d+$/.test(route.query.did)
  },
})
</script>

<style scoped></style>
