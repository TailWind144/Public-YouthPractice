<template>
  <div
    class="flex flex-col gap-6 items-center absolute left-0 w-full h-[698px] duration-300"
    :style="{ top: `${offsetTop}px` }"
  >
    <div
      class="text-lg text-center text-white opacity-50 duration-300 flex flex-col gap-1"
      v-for="(lyric, index) in lyrics"
      :key="lyric.id"
      :class="{ '!opacity-100 scale-[1.3]': index === currentLyricIndex }"
    >
      <span class="font-[Inter]" v-html="lyric.lyrics_en"> </span>
      <span v-show="isChinese"> {{ lyric.lyrics_cn }} </span>
    </div>
    <div class="text-2xl text-center text-white" v-if="!lyrics.length">
      该歌曲暂无歌词
    </div>
  </div>
</template>

<script setup lang="ts">
const { lyrics, currentLyricIndex, isChinese } = defineProps([
  "lyrics",
  "currentLyricIndex",
  "isChinese",
])

const getOffsetTop = (index) =>
  (offsetTop.value = 284 - index * (isChinese ? 84 : 52))

const offsetTop = ref(284)
watch(
  () => currentLyricIndex,
  (newVal) => {
    getOffsetTop(newVal)
  }
)
watch(
  () => isChinese,
  () => {
    getOffsetTop(currentLyricIndex)
  }
)
</script>

<style scoped></style>
