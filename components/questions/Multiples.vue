<template>
  <div class="text-base flex flex-col gap-2">
    <div
      :class="(item.question ? '' : 'items-center') + ' border-b flex'"
      v-for="(item, index) in data"
      :key="index"
    >
      <div :class="(item.question ? 'flex-col' : 'flex-row') + ' flex gap-2'">
        <div class="flex items-center">
          <span class="no">{{ index + 1 }}. </span>
          <span class="text-base mr-4">{{ item.question }}</span>
        </div>
        <div class="relative">
          <a-radio-group
            v-model="answers[index]"
            :size="'large'"
            :options="item.options"
            :direction="item.question ? 'vertical' : 'horizontal'"
          >
          </a-radio-group>
          <div
            v-show="isFinish"
            class="absolute w-full h-full top-0 left-0 cursor-not-allowed"
          ></div>
        </div>
      </div>
      <transition name="fade-left">
        <div class="flex gap-2" v-if="isFinish">
          <div
            v-if="checkAnswersArr[index]?.isCorrect"
            class="text-[var(--success-color)]"
          >
            <icon-check />
          </div>
          <div v-else class="text-[var(--error-color)]">
            <icon-close />
          </div>
          <a-popover position="tl">
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
