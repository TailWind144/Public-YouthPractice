<template>
  <div class="slide-enter-content">
    <p v-for="(stem, index) in parsedStem" :key="index">
      <template v-for="(segment, index) in stem" :key="index">
        <transition appear name="answer">
          <span
            v-if="answers[segment.index!]"
            :class="{
              tip: true,
              correct: isFinish && checkAnswersArr[segment.index!].isCorrect,
              wrong: isFinish && !checkAnswersArr[segment.index!].isCorrect,
            }"
            :key="answers[segment.index!]"
          >
            {{
              kind === "options"
                ? multiples[segment.index!].options[
                    valueToIndex[answers[segment.index!]]
                  ]?.label
                : answers[segment.index!]
            }}
          </span>
          <span
            v-else-if="segment.type === 'placeholder'"
            :class="{ tip: true, wrong: isFinish }"
          >
            {{
              `${"&nbsp".repeat(4)}${segment.index! + 1}${"&nbsp".repeat(4)}`
            }}
          </span>
          <span v-else v-html="segment.content"></span>
        </transition>
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
const { isFinish, stem, multiples, answers, kind, checkAnswersArr } =
  defineProps([
    "isFinish",
    "stem",
    "multiples",
    "answers",
    "kind",
    "checkAnswersArr",
  ])

const valueToIndex = computed(() => {
  const obj = {}
  multiples[0].options.forEach((item, index) => {
    obj[item.value] = index
  })
  return obj
})

const parseStem = (html: string) => {
  const pattern = /<(\d+)\/>/g
  const segments: { type: string; content?: string; index?: number }[] = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: html.slice(lastIndex, match.index),
      })
    }
    segments.push({
      type: "placeholder",
      index: parseInt(match[1]) - 1,
    })
    lastIndex = pattern.lastIndex
  }

  if (lastIndex < html.length) {
    segments.push({
      type: "text",
      content: html.slice(lastIndex),
    })
  }
  return segments
}

const parsedStem = computed(() => {
  const PTagReg = /<p>(.*?)<\/p>/g
  const matchArr = [...stem.matchAll(PTagReg)]
  return matchArr.map((content) => {
    return parseStem(content[1])
  })
})
</script>

<style scoped>
.correct {
  color: var(--success-color);
}
.wrong {
  color: var(--error-color);
}
.answer-enter-active {
  transition: all 0.5s;
}
.answer-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.answer-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
