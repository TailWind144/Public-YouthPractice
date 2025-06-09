<template>
  <div
    ref="sentenceImageRef"
    class="rounded-lg bg-cover bg-no-repeat bg-center"
    :style="`background-image: url('${imgURL}');`"
  >
    <div class="text-[var(--text-white)] flex flex-col gap-2 rounded-lg">
      <div
        class="flex items-center gap-1 bg-black/40 backdrop-blur px-4 p-2 rounded-t-lg"
      >
        <div>每日一句</div>
        <div>
          <a-tooltip
            :content="'查看详情'"
            mini
            :position="'right'"
            background-color="var(--text-primary)"
          >
            <div
              @click="navigateTo('/quote')"
              class="duration-200 cursor-pointer w-6 h-6 p-1 flex items-center justify-center text-base hover:bg-white/10 rounded-sm"
            >
              <icon-unordered-list />
            </div>
          </a-tooltip>
        </div>
      </div>
      <div class="flex flex-col italic px-4 pb-4">
        <span class="font-[Inter]">{{ sentence }}</span>
        <span class="text-end">--{{ origin }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSentence } from "~/pages/quote/utils/fetch"

const sentenceImageRef = ref()
const imgURL = ref(imgUrls[getRandomIndex(imgUrls.length)])
const sentence = ref("")
const origin = ref("")
const initData = async () => {
  const { data } = await getSentence()
  sentence.value = data.en
  origin.value = data.originEn || "佚名"
  imgURL.value = data.link || imgUrls[getRandomIndex(imgUrls.length)]
}
initData()

onMounted(() => {
  sentenceImageRef.value.style.viewTransitionName = "full-embed"
})
</script>

<style scoped></style>
