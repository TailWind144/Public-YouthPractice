<template>
  <div>
    <QueTopNav
      title=""
      :isFinish
      :historys
      :score
      :time="5"
      :showPause="true"
      :showHistory="true"
      :showRedo="true"
      :backCb="
        () =>
          navigateTo({
            path: '/practice/level',
            query: { module: $route.query.module, unit: $route.query.unit },
          })
      "
    />
    <div class="flex-1 max-w-[80em] m-auto">
      <div class="question m-auto px-7 py-10">
        <a-spin :loading="loading" tip="请等待">
          <h1 class="text-3xl font-bold text-[var(--text-h1)]">{{ types }}</h1>
          <Stem :isFinish :stem :answers :multiples :checkAnswersArr :kind />
          <component
            class="slide-enter-content"
            :data="multiples"
            :isFinish
            :answers
            :checkAnswersArr
            :is="answerArea[kind]"
          ></component>
        </a-spin>
      </div>
    </div>
    <transition name="slide-fade">
      <Congratulation
        :score
        :beforePoint
        :isBeforeReward
        v-if="visible"
        @click="visible = false"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    return (
      typeof route.query.level === "string" && /^\d+$/.test(route.query.level)
    )
  },
})
import Stem from "~/components/questions/Stem.vue"
import Multiples from "~/components/questions/Multiples.vue"
import Box from "~/components/questions/Box.vue"
import Matching from "~/components/questions/Matching.vue"
import SelectOptions from "~/components/questions/SelectOptions.vue"
import { Modal } from "@arco-design/web-vue"
import Congratulation from "~/components/questions/Congratulation.vue"
import { checkAns, getContent, getDetail, getHistory } from "./utils/fetch"
import type { User } from "~/types/user"
const route = useRoute()

const answerArea = {
  options: Multiples,
  box: Box,
  matching: Matching,
  selectOptions: SelectOptions,
}
const loading = ref(false)
const id = ref<string>()
const isFinish = useState("isFinish")
const historys = ref()
const score = ref()
const kind = ref()
const userState = useState<User>("userState")

isFinish.value = false
const userLevelId = ref()
const multiples = ref<any[]>([])
const types = ref()
const answers = ref<any[]>([])
const checkAnswersArr = ref<any[]>([])
const stem = ref("")
const answersLength = ref(0)
const visible = ref(false)
let unitId = null

const initHistory = async () => {
  const levelId = route.query.level
  const uid = userState.value.uid
  const { data } = await getHistory({ uid, levelId })
  historys.value = data
}

const initDetail = async (userLevelId) => {
  const { data: res } = await getDetail({
    levelId: id.value,
    userLevelId: userLevelId,
  })
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

const initData = async () => {
  id.value = route.query.level as string
  const { data } = await getContent({ id: id.value })
  unitId = data.types.unitId
  types.value = `${data.types.unit} - ${data.types.module}(${data.types.index})`

  kind.value = data.kind
  multiples.value = data.multiples
  stem.value = data.stem
  answersLength.value = data.answersLength
  answers.value = new Array(answersLength.value).fill(null)

  await initHistory()

  if (historys.value.length) {
    userLevelId.value = historys.value[0].id
    score.value = historys.value[0].score
    isFinish.value = true
    await initDetail(userLevelId.value)
  }
}
initData()

const isBeforeReward = ref(false)
const beforePoint = ref()
const handleSubmitOk = async () => {
  useEmit("question-submit-success")
  if (!isFinish.value) {
    loading.value = true
    const { data: res } = await checkAns({
      id: id.value,
      unitId,
      answers: answers.value,
    })
    const { data } = res
    isFinish.value = true
    score.value = res.score
    userLevelId.value = res.userLevelId
    isBeforeReward.value = res.isBeforeReward
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
    if (score.value >= 80) {
      beforePoint.value = userState.value.points
      visible.value = true
    }
    await initHistory()
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
useOn("question-submit", handleQuestionSubmit)

const handleHistoryChange = async (row) => {
  if (isFinish.value && row.id !== userLevelId.value) {
    loading.value = true
    userLevelId.value = row.id
    score.value = row.score
    await initDetail(row.id)
    loading.value = false
  }
}
useOn("history-change", handleHistoryChange)

const handleRedoOk = () => {
  isFinish.value = false
  answers.value = new Array(answersLength.value).fill(null)
}
const handleQuestionRedo = async () => {
  await handleItemUseModal(
    "重做卡",
    "你确定要重做吗？这将消耗一张重做卡。",
    handleItemUseOk("重做卡", handleRedoOk)
  )
}
useOn("question-redo", handleQuestionRedo)
onBeforeUnmount(() => {
  useOff("question-submit", handleQuestionSubmit)
  useOff("history-change", handleHistoryChange)
  useOff("question-redo", handleQuestionRedo)
})
useHead({
  title: "练习",
})
</script>

<style scoped></style>
