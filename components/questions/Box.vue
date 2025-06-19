<template>
  <div class="flex flex-col gap-4">
    <div
      class="grid grid-cols-6 gap-2 border p-2 text-base text-[var(--text-primary-2)]"
    >
      <span class="text-center" v-for="(item, index) in data" :key="index">
        <span
          class="box-text cursor-pointer"
          @click="handleBoxTextClick"
          @mouseout="handleMouseOut"
        >
          {{ item.word }}
        </span>
      </span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 text-base">
      <div
        class="flex items-center gap-2"
        v-for="(item, index) in answers"
        :key="index"
      >
        <div class="flex items-center gap-2 question-box relative">
          <span class="no">{{ index + 1 }}.</span>
          <a-input
            :readonly="isFinish"
            :error="isFinish && !checkAnswersArr[index]?.isCorrect"
            :class="{
              'a-input-success': isFinish && checkAnswersArr[index]?.isCorrect,
            }"
            v-model="answers[index]"
          ></a-input>
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

const handleBoxTextClick = (e) => {
  e.target.classList.remove("reactive")
  e.target.classList.toggle("delete")
  if (!Array.from(e.target.classList).includes("delete"))
    e.target.classList.add("reactive")
}
const handleMouseOut = (e) => {
  e.target.classList.remove("reactive")
}
</script>

<style scoped>
@keyframes reactive {
  to {
    transform: scaleX(0);
  }
}

.box-text {
  position: relative;
  display: inline-block;
}
.box-text.delete::after {
  transform: scaleX(1);
}
.reactive::after {
  animation: reactive 0.3s ease-out forwards;
}
.box-text::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: var(--text-primary);
  transform: scaleX(0);
  transition: 0.3s ease-out;
  transform-origin: left center;
}
.box-text:hover::after {
  transform: scaleX(1);
}
</style>
