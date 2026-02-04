<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-6 gap-2 border p-2 text-base">
      <span
        class="flex gap-1 items-center justify-center"
        v-for="(item, index) in data"
        :key="index"
      >
        <span
          class="box-text cursor-pointer duration-300"
          @click="handleBoxTextClick"
          @mouseout="handleMouseOut"
          @contextmenu.prevent="showPopMenu(index, $event)"
        >
          {{ item.word }}
        </span>
        <div
          v-if="posArr[index]"
          :class="`${posArr[index].value} text-xs box-text-tip`"
        >
          {{ posArr[index]?.label }}
        </div>
      </span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 text-base">
      <div
        class="flex items-center gap-2"
        v-for="(item, index) in answers"
        :key="index"
      >
        <div class="flex items-center question-box relative">
          <span class="no w-5">{{ index + 1 }}.</span>
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
    <BoxPopMenu
      ref="popMenu"
      v-model:visible="menuVisible"
      :menuItems="menuItems"
      @menu-item-click="handleMenuItemClick"
    />
  </div>
</template>

<script setup lang="ts">
import BoxPopMenu from "./BoxPopMenu.vue"
const { data, answers, isFinish, checkAnswersArr } = defineProps([
  "data",
  "answers",
  "isFinish",
  "checkAnswersArr",
])

const popMenu = ref()
const menuVisible = ref(false)
const menuItems = ref([
  { label: "名词", value: "noun" },
  { label: "限定词", value: "determiner" },
  { label: "形容词", value: "adjective" },
  { label: "副词", value: "adverb" },
  { label: "动词", value: "verb" },
  { label: "介词", value: "preposition" },
  { label: "连词", value: "conjunction" },
  { label: "代词", value: "pronoun" },
  { label: "其他", value: "other" },
])
const posArr = ref<{ label: string; value: string }[]>([])

const handleBoxTextClick = (e) => {
  e.target.classList.remove("reactive")
  e.target.classList.toggle("delete")
  if (!Array.from(e.target.classList).includes("delete"))
    e.target.classList.add("reactive")
}
const handleMouseOut = (e) => {
  e.target.classList.remove("reactive")
}

let posIndex = -1
const showPopMenu = (index, e) => {
  popMenu.value.showMenu(e)
  posIndex = index
}
const handleMenuItemClick = (item) => {
  posArr.value[posIndex] = item
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
.box-text::selection {
  background-color: transparent;
}
.box-text.delete {
  opacity: 0.5;
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
  background-color: var(--error-color);
  transform: scaleX(0);
  transition: 0.3s ease-out;
  transform-origin: left center;
}
.box-text:hover::after {
  transform: scaleX(1);
}

.box-text-tip {
  --tip-padding: 2px 4px;
  --tip-border-radius: 4px;
}
.noun {
  color: #00b42a;
  background-color: rgba(0, 180, 42, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.determiner {
  color: #168cff;
  background-color: rgba(22, 140, 255, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.adjective {
  color: #165dff;
  background-color: rgba(22, 93, 255, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.adverb {
  color: #ffb400;
  background-color: rgba(255, 180, 0, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.verb {
  color: #ff7d00;
  background-color: rgba(255, 125, 0, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.preposition {
  color: #f53f3f;
  background-color: rgba(245, 63, 63, 0.1);
  padding: var(--tip-padding);
  border-radius: 4px;
}

.conjunction {
  color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.pronoun {
  color: #06b6d4;
  background-color: rgba(6, 182, 212, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}

.other {
  color: #6b7280;
  background-color: rgba(107, 114, 128, 0.1);
  padding: var(--tip-padding);
  border-radius: var(--tip-border-radius);
}
</style>
