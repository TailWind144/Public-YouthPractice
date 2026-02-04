<template>
  <WrapperCard title="单词本" text="large">
    <template #icon>
      <icon-book />
    </template>
    <template #operation>
      <a-badge :count>
        <TooltipIconButton
          :content="'切换'"
          position="top"
          @click="() => emit('swap', true)"
        >
          <icon-swap />
        </TooltipIconButton>
      </a-badge>
    </template>

    <transition name="slide-fade" mode="out-in">
      <div :key="Number(loading)">
        <a-skeleton v-if="loading">
          <a-skeleton-line :rows="1" :line-height="290" />
        </a-skeleton>
        <VocabularyData v-else-if="vocabularyData" :data="vocabularyData" @refresh="initData" />
        <HomePictureContent
          v-else
          button-text="开始"
          @handel-click="handelClick"
        >
          <div class="text-2xl md:text-3xl font-bold">开始背单词吧！</div>
          <div class="max-w-md opacity-90 text-base mb-2">
            每天15分钟，轻松掌握新词汇
          </div>
        </HomePictureContent>
      </div>
    </transition>
  </WrapperCard>
</template>

<script setup lang="ts">
import type { User } from "~/types/user"
import VocabularyData from "./VocabularyData.vue"
import {
  getOngoingVocabularyData,
  unfinishedDictation,
} from "~/pages/home/utils/fetch"
const emit = defineEmits(["swap"])

const handelClick = () => {
  return navigateTo({
    path: "/vocabulary/list",
  })
}

const loading = ref(true)
const vocabularyData = ref()
const initData = async () => {
  const { data } = await getOngoingVocabularyData()

  vocabularyData.value = data
  loading.value = false
}
initData()

const count = ref(0)
const initTip = async () => {
  const userState = useState<User>("userState")
  if (userState.value.role !== 2) {
    console.log(userState.value)
    const { data } = await unfinishedDictation({
      grade: userState.value.grade,
      teacherId: userState.value.teacherId,
    })
    count.value = data.length
  }
}
initTip()
</script>

<style scoped></style>
