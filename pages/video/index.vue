<template>
  <div class="flex flex-col">
    <h1 class="text-3xl text-[var(--text-h1)]">{{ curVideo?.title }}</h1>
    <div class="flex gap-4 flex-col lg:flex-row">
      <div class="flex-1 flex flex-col gap-4">
        <div>
          <MediaVideo :src="curVideo?.resource" />
        </div>
        <a-spin :loading="loading" tip="请等待">
          <div
            v-if="multiples.length"
            class="flex flex-col gap-4 border-t py-4"
          >
            <div class="text-xl text-[var(--text-h1)] font-medium">
              回答下列问题：
            </div>
            <SelectOptions
              class="question"
              :data="multiples"
              :isFinish
              :answers
              :checkAnswersArr
            />
            <a-button
              :disabled="isFinish"
              class="w-16"
              type="primary"
              @click="handleQuestionSubmit"
              >提交</a-button
            >
          </div>
        </a-spin>
      </div>
      <div class="text-base lg:w-[355px]">
        <div class="flex flex-col-reverse lg:flex-col gap-4">
          <VideoWordSideList :loading="wordsListLoading" :list="wordsList" />
          <VideoSideList
            :list="videoList"
            :curIndex
            @handleClick="handleClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "gameboard",
  validate: async (route) => {
    return typeof route.query.id === "string" && /^\d+$/.test(route.query.id)
  },
})
import { Modal } from "@arco-design/web-vue"
import MediaVideo from "~/components/video/MediaVideo.vue"
import {
  checkMediaAnswers,
  getMediaExercise,
  getMediaExerciseDetail,
  getMediaWords,
  getVideoChapters,
} from "./utils/fetch"
import SelectOptions from "~/components/questions/SelectOptions.vue"

const route = useRoute()
const curMediaId = ref(route.query.id)
const curIndex = ref(
  import.meta.client ? Number(localStorage.getItem(curMediaId.value)) || 0 : 0
)
const curVideo = computed(() => videoList.value?.[curIndex.value])
const videoList = ref()
const initData = async () => {
  const { data: res } = await getVideoChapters({ id: curMediaId.value })
  videoList.value = res

  const { data: res2 } = await getMediaExercise({ id: curVideo.value.id })
  isFinish.value = false
  multiples.value = res2.multiples
  answers.value = new Array(res2.multiples.length).fill(null)
  checkAnswersArr.value = []
  initDetail()
  initWordsList()
}
initData()

watchEffect(() => {
  if (import.meta.client) localStorage.setItem(curMediaId.value, curIndex.value)
})

const handleClick = async (index) => {
  curIndex.value = index
}
watch(curIndex, async () => {
  initData()
  initWordsList()
})

const initDetail = async () => {
  const { data: res } = await getMediaExerciseDetail({
    exerciseId: curVideo.value.id,
  })
  if (res) {
    isFinish.value = true
    const { answers: ans, checkAnswersArr: data } = res
    answers.value = ans
    checkAnswersArr.value = answers.value.map((userAnswer, index) => {
      const { answer, isCorrect, point, explanation } = data[index]
      return {
        answer,
        isCorrect,
        point,
        explanation,
      }
    })
  }
}

const loading = ref(false)
const isFinish = ref(false)
const multiples = ref<any[]>([])
const answers = ref<any[]>([])
const checkAnswersArr = ref<any[]>([])
const handleSubmitOk = async () => {
  if (!isFinish.value) {
    loading.value = true
    const { data } = await checkMediaAnswers({
      id: curVideo.value.id,
      mediaId: curMediaId.value,
      answers: answers.value,
    })
    isFinish.value = true
    checkAnswersArr.value = answers.value.map((userAnswer, index) => {
      const { answer, isCorrect, point, explanation } = data[index]
      return {
        answer,
        isCorrect,
        point,
        explanation,
      }
    })
    loading.value = false
  }
}
const handleQuestionSubmit = () => {
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

const wordsListLoading = ref(true)
const wordsList = ref()
const initWordsList = async () => {
  wordsListLoading.value = true
  const { data } = await getMediaWords({ id: curVideo.value.id })
  wordsListLoading.value = false
  wordsList.value = data
}
useHead({
  title: "娱乐",
})
</script>

<style scoped></style>
