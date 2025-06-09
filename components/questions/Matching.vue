<template>
  <div class="flex gap-4">
    <div class="p-4 border flex flex-col gap-4 flex-1">
      <div
        class="flex gap-2 flex-col flex-1"
        v-for="(question, index) in data.questions"
        :key="index"
      >
        <div class="flex items-center gap-2">
          <div class="flex items-center question-select relative">
            <span class="no">{{ index + 1 }}. </span>
            <a-select
              :error="isFinish && !checkAnswersArr[index]?.isCorrect"
              v-model="answers[index]"
              :style="{ width: '5rem' }"
              :class="{
                'a-input-success':
                  isFinish && checkAnswersArr[index]?.isCorrect,
              }"
            >
              <a-option
                v-for="(option, index) in data.options"
                :key="index"
                :value="option.value"
                :label="option.value"
              />
            </a-select>
            <div
              v-show="isFinish"
              class="absolute w-full h-full top-0 left-0 cursor-not-allowed"
            ></div>
          </div>
          <transition name="fade-left">
            <div class="flex gap-4" v-if="isFinish">
              <a-popover position="right">
                <div class="text-[var(--text-info)] cursor-pointer">
                  <icon-question-circle />
                </div>
                <template #content>
                  <div class="text-base">
                    <p>
                      正确答案：<span class="text-[var(--text-primary)]">{{
                        checkAnswersArr[index]?.answer
                      }}</span>
                    </p>
                    <p>{{ checkAnswersArr[index]?.point }}</p>
                    <p class="max-w-[30vw]">
                      {{ checkAnswersArr[index]?.explanation }}
                    </p>
                  </div>
                </template>
              </a-popover>
            </div>
          </transition>
        </div>
        <div class="text-base">
          <span>{{ question }}</span>
        </div>
      </div>
    </div>
    <div class="p-4 border flex flex-col gap-4 flex-1">
      <div
        class="flex gap-2 flex-1"
        v-for="(option, index) in data.options"
        :key="index"
      >
        <div class="text-base">
          <span class="no">{{ option.value }}.</span>
          <span>{{ option.label }}</span>
        </div>
      </div>
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
</script>

<style scoped></style>
