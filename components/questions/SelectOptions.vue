<template>
  <div class="text-base flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <div class="flex gap-2 flex-wrap">
        <div
          class="duration-200 border border-[var(--border-color)] hover:text-[var(--text-white)] flex items-center justify-center rounded-full w-11 h-11 cursor-pointer"
          :class="{
            'text-[var(--text-info)]  hover:!bg-[var(--text-primary)] hover:border-[var(--text-primary)] bg-[var(--bg-color-d)]':
              !isFinish,
            '!bg-[var(--text-primary)] !text-[var(--text-white)]':
              !isFinish && index === curIndex,
            '!bg-[var(--bg-checked-color)] text-[var(--text-primary)] border-[var(--text-primary)]':
              !isFinish && answers[index],
            'border-[var(--success-color)] bg-[var(--bg-success-color)] text-[var(--success-color)] hover:bg-[var(--success-color)]':
              isSuccess(index),
            'border-[var(--error-color)] bg-[var(--bg-error-color)] text-[var(--error-color)] hover:bg-[var(--error-color)]':
              isError(index),
            'border-[var(--success-color)]  text-[var(--text-white)] bg-[var(--success-color)]':
              isSuccess(index) && index === curIndex,
            'border-[var(--error-color)] text-[var(--text-white)] bg-[var(--error-color)]':
              isError(index) && index === curIndex,
          }"
          v-for="(_, index) in data"
          :key="index"
          @click="handleChange(index)"
        >
          {{ index + 1 }}
        </div>
      </div>
      <div class="flex-col flex gap-2 flex-1">
        <div class="flex mt-2 mb-4 items-center">
          <span class="no question-title">{{ curIndex + 1 }}. </span>
          <span class="question-title">{{ data[curIndex]?.question }}</span>
          <transition name="scale-x">
            <Tag
              v-if="isFinish && checkAnswersArr[curIndex]?.point"
              class="ml-4 hidden sm:inline-block bg-[var(--text-primary)] text-sm rounded-full"
            >
              {{ checkAnswersArr[curIndex]?.point }}
            </Tag>
          </transition>
        </div>
        <div class="relative">
          <a-radio-group
            v-model="answers[curIndex]"
            direction="vertical"
            class="!flex flex-col gap-2"
          >
            <template
              v-for="(option, index) in data[curIndex]?.options"
              :key="index"
            >
              <a-radio :value="option.value">
                <template #radio="{ checked }">
                  <div
                    class="active:scale-[.99] hover:border-[var(--text-primary)] border border-[var(--border-color)] px-4 py-2 flex-1 rounded-md duration-200"
                    :class="{
                      'border-[var(--text-primary)] bg-[var(--bg-checked-color)]':
                        checked && !isFinish,
                      'border-[var(--success-color)] bg-[var(--bg-success-color)]':
                        isSuccess(curIndex, checked),
                      'border-[var(--error-color)] bg-[var(--bg-error-color)]':
                        isError(curIndex, checked),
                    }"
                  >
                    <span
                      :class="{
                        checked: checked,
                        success: isSuccess(curIndex, checked),
                        error: isError(curIndex, checked),
                      }"
                    >
                      {{ option.value }}. {{ option.label }}
                    </span>
                  </div>
                </template>
              </a-radio>
            </template>
          </a-radio-group>
          <div
            v-show="isFinish"
            class="absolute w-full h-full top-0 left-0 cursor-not-allowed"
          ></div>
        </div>
      </div>
      <transition name="fade-down">
        <a-collapse v-if="isFinish" :bordered="false">
          <a-collapse-item
            class="answer-header"
            header="查看答案和解析"
            key="1"
          >
            <div class="text-base">
              <p>
                正确答案：<span class="!text-[var(--text-primary)]">{{
                  checkAnswersArr[curIndex]?.answer
                }}</span>
              </p>
              <p>
                {{ checkAnswersArr[curIndex]?.explanation }}
              </p>
            </div>
          </a-collapse-item>
        </a-collapse>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, answers, isFinish, checkAnswersArr } = defineProps([
  "data",
  "answers",
  "isFinish",
  "checkAnswersArr",
])

const curIndex = ref(0)
const handleChange = (index) => {
  curIndex.value = index
}
watch(
  () => data,
  () => (curIndex.value = 0)
)

const isSuccess = (index, checked = true) =>
  checked && isFinish && checkAnswersArr[index]?.isCorrect
const isError = (index, checked = true) =>
  checked && isFinish && !checkAnswersArr[index]?.isCorrect
</script>

<style scoped>
.question span.checked {
  color: var(--text-primary);
}
.question span.success {
  color: var(--success-color);
}
.question span.error {
  color: var(--error-color);
}

.fade-down-enter-active {
  transition: all 0.3s ease-out;
}
.fade-down-leave-active {
  transition: all 0.3s ease-in;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
