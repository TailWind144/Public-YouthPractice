<template>
  <div class="max-w-3xl mx-auto mt-10">
    <div class="card-stack sm:w-[500px] w-auto" ref="cardStack">
      <transition-group name="card" tag="div">
        <VocabularyCard
          v-for="(card, index) in visibleCards"
          :key="card.id"
          :card
          :index
          class="stacked-card bg-white rounded-2xl card-shadow p-6 md:p-8"
          :style="getCardStyle(index)"
          @click-is-remember="clickIsRemember"
          @click-next-word="clickNextWord"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { postMemoryWord } from "~/pages/vocabulary/utils/fetch"
import VocabularyCard from "./VocabularyCard.vue"

const emit = defineEmits(["clickNextWord", "clickRemember"])
const { visibleCards } = defineProps(["visibleCards"])

const clickIsRemember = async (id, isRemember) => {
  await postMemoryWord({ id, isRemember })

  if (isRemember) emit("clickRemember")
}
const clickNextWord = (isRememberFlag) => {
  emit("clickNextWord", isRememberFlag)
}

const getCardStyle = (index) => {
  const totalCards = visibleCards.value?.length || 3
  const zIndex = totalCards - index
  const translateY = index * 15
  // 随机旋转角度(-3到3度)
  const rotate = index === 0 ? index : Math.random() * 6 - 3

  return {
    zIndex,
    transform: `translateX(${translateY}px) translateY(-${translateY}px) rotate(${rotate}deg)`,
    opacity: 1 - index * 0.15,
  }
}
</script>

<style scoped>
.card-stack {
  perspective: 1000px;
  position: relative;
  margin: 0 auto;
}
.stacked-card {
  position: absolute;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.card-shadow {
  box-shadow: 0 10px 25px -5px rgba(22, 93, 255, 0.1),
    0 8px 10px -6px rgba(22, 93, 255, 0.05);
}

.card-enter-from,
.card-leave-to {
  opacity: 0 !important;
  transform: translateX(-150%) rotate(-30deg) !important;
  pointer-events: none;
}
.card-leave-active {
  position: absolute;
}
</style>
