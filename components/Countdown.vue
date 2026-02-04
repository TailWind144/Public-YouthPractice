<template>
  <div>
    <div class="flex gap-4 items-center justify-center">
      <TooltipIconButton v-if="showPause" :content="'暂停'" @click="handleStop">
        <icon-pause />
      </TooltipIconButton>
      <div class="text-2xl" :style="`color: ${color};`">{{ coutdownTime }}</div>
      <a-button type="primary" @click="handleSubmit">提交</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs"
import { Notification, Message } from "@arco-design/web-vue"
const { time, showPause } = defineProps(["time", "showPause"])
const emit = defineEmits(["end"])

const format = "HH:mm:ss"
const now = Date.now()
const targetTime = computed(() => now + 1000 * 60 * time)
const color = ref("var(--text-h1)")
const coutdownTime = ref(
  getDateString(
    Math.max(dayjs(targetTime.value).diff(dayjs(now), "millisecond"), 0),
    format
  )
)
let intervalId: number | undefined

const countDown = (targetTime) => {
  const remainTime = dayjs(targetTime).diff(dayjs(), "millisecond")
  if (remainTime <= 0) {
    clearInterval(intervalId)
    handelFinish()
    return
  }
  coutdownTime.value = getDateString(Math.max(remainTime, 0), format)
}

onMounted(() => {
  intervalId = window.setInterval(() => {
    countDown(targetTime.value)
  }, 1000 / 30)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
  intervalId = undefined
})

const handelFinish = () => {
  color.value = "var(--warn-color)"
  Notification.warning({
    title: "通知",
    content: "请注意，当前已超时！",
    closable: true,
    duration: 10000,
    style: { fontFamily: "PingFang SC" },
  })
  emit("end")
}

const isUse = ref(false)
const handleStopOk = () => {
  clearInterval(intervalId)
  intervalId = undefined
  color.value = "var(--success-color)"
  isUse.value = true
}
const handleStop = async () => {
  if (isUse.value) {
    Message.warning("你已经使用过了")
  } else
    await handleItemUseModal(
      "专注药水",
      "你确定要暂停吗？这将消耗一个专注药水。",
      handleItemUseOk("专注药水", handleStopOk)
    )
}

const handleSubmit = () => {
  useEmit("question-submit")
}

const handleSubmitSuccess = () => {
  clearInterval(intervalId)
}
useOn("question-submit-success", handleSubmitSuccess)
onBeforeUnmount(() => {
  useOff("question-submit-success", handleSubmitSuccess)
})
</script>

<style scoped></style>
