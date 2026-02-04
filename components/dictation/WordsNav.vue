<template>
  <div
    class="pt-4 pb-3 px-6 rounded-t-xl flex gap-2 words-nav flex-wrap max-w-[80em] max-h-[100px] overflow-y-auto bg-[var(--bg-color-d)]"
  >
    <div
      class="duration-200 border border-[var(--border-color)] hover:text-[var(--text-white)] flex items-center justify-center rounded-full w-8 h-8 cursor-pointer"
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
      v-for="(item, index) in list"
      :key="index"
      @click="() => emit('change', index)"
    >
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { list, isFinish, answers, checkAnswersArr, curIndex } = defineProps([
  "list",
  "curIndex",
  "isFinish",
  "answers",
  "checkAnswersArr",
])
const emit = defineEmits(["change"])

const isSuccess = (index, checked = true) =>
  checked && isFinish && checkAnswersArr[index]?.isCorrect
const isError = (index, checked = true) =>
  checked && isFinish && !checkAnswersArr[index]?.isCorrect
</script>

<style scoped>
.words-nav {
  box-shadow: 0 -6px 10px 0 rgba(60, 70, 79, 0.07);
}
</style>
