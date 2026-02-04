<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <div
        class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[var(--text-h1)]"
      >
        今日{{ text }}单词
      </div>
      <div class="text-[var(--text-info)] text-base">
        继续加油，你已{{ text }}了
        <span class="text-[var(--text-primary)] font-semibold">
          {{ masteredWords }}/{{ todayReadyToLearnRows }}
        </span>
        个单词
      </div>
    </div>
    <vocabulary-memory-progress :percent="progressPercentage" />
  </div>
  <my-loading v-if="loading" />
  <transition tag="div" v-else>
    <div>
      <vocabulary-card-stack
        v-if="visibleCards.length"
        :visibleCards
        :total
        @click-next-word="clickNextWord"
        @click-remember="clickRemember"
      />
      <VocabularyCongratulation v-else-if="isCompleted" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { getDailyWords } from "./utils/fetch"

const loading = ref(false)

const vocabularyList = ref<any>([])
const visibleCards = ref<any>([])
const words = ref([])
const masteredWords = ref(0)
const currentIndex = ref(0)
const total = ref(0)
const todayReadyToLearnRows = ref(0)
const progressPercentage = computed(() =>
  todayReadyToLearnRows.value > 0
    ? Math.round((masteredWords.value / todayReadyToLearnRows.value) * 100)
    : 0
)

const selectedUnitState = useState("selectedUnitState")
const text = computed(() => (selectedUnitState.value ? "学习" : "复习"))
const initData = async () => {
  loading.value = true
  const { data } = await getDailyWords({ units: selectedUnitState.value })
  words.value = data.words
  total.value = data.words.length
  vocabularyList.value = [...data.words]
  masteredWords.value = data.todayHaveLearnNums
  todayReadyToLearnRows.value = data.todayReadyToLearnNums

  initializeCardStack()
  loading.value = false
}
initData()

const initializeCardStack = () => {
  visibleCards.value = []
  currentIndex.value = 0

  const initialCount = Math.min(3, total.value)
  for (let i = 0; i < initialCount; i++) {
    visibleCards.value.push({ ...vocabularyList.value[i] })
  }
}

const clickRemember = () => {
  masteredWords.value++
}

const isCompleted = computed(
  () => masteredWords.value === todayReadyToLearnRows.value
)
const clickNextWord = (isRememberFlag) => {
  if (visibleCards.value.length === 0) return

  const word = visibleCards.value.shift()
  if (!isRememberFlag) {
    vocabularyList.value.push(word)
  }

  const nextAvailableIndex = currentIndex.value + visibleCards.value.length + 1
  if (nextAvailableIndex < vocabularyList.value.length) {
    visibleCards.value.push({ ...vocabularyList.value[nextAvailableIndex] })
  }

  currentIndex.value++
}

onBeforeUnmount(() => {
  selectedUnitState.value = null
})
</script>

<style scoped></style>
