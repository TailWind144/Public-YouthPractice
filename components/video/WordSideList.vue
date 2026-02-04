<template>
  <div
    class="py-3 bg-[var(--bg-info-color-2)] rounded-md text-[var(--text-h1)] flex flex-col gap-3"
  >
    <div class="px-4 flex items-center gap-2">
      <span class="pr-2 border-r-2">本集单词</span>
      <a-input-search
        v-model="searchWord"
        class="flex-1"
        placeholder="搜索单词（支持中英文）"
      />
    </div>
    <div class="side-list h-96 overflow-y-auto px-4">
      <a-skeleton v-if="loading" animation>
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-1" v-for="(_, index) in 2" :key="index">
            <a-skeleton-line :rows="1" :line-height="24" />
            <a-skeleton-line :rows="1" :line-height="40" />
          </div>
        </div>
      </a-skeleton>
      <div v-else-if="showList?.length" class="flex flex-col gap-2">
        <div
          class="flex flex-col gap-1 border-t pt-2 border-[var(--border-color)] cursor-pointer group"
          v-for="(item, index) in showList"
          :key="index"
          @click="handleSpeak(item.en)"
        >
          <div class="duration-200 flex group-hover:text-[var(--text-primary)]">
            <div class="flex-1 font-[Inter]">
              <span class="text-[var(--text-primary)] align-middle"
                >{{ index + 1 }}.
              </span>
              {{ item.en }}
              <Tag
                size="small"
                :color="
                  item.stage === 1 ? 'red' : item.stage === 2 ? 'orange' : ''
                "
              >
                {{ item.stage === 1 ? "中考" : item.stage === 2 ? "高考" : "" }}
              </Tag>
            </div>
            <div class="flex-1">
              {{ item.cn }}
            </div>
          </div>
          <div class="text-[var(--text-info)] text-sm">
            <div class="font-[Inter]">{{ item.exampleEn }}</div>
            <div>
              {{ item.exampleCn }}
            </div>
          </div>
        </div>
      </div>
      <a-empty description="找不到该单词" v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tag } from "@arco-design/web-vue"
const { list, loading } = defineProps(["list", "loading"])

const showList = computed(() => {
  if (!searchWord.value) return list
  return list.filter(
    (item) =>
      item.en.toLowerCase().includes(searchWord.value.toLowerCase()) ||
      item.cn.includes(searchWord.value)
  )
})
const searchWord = ref()

let audio
const handleSpeak = async (word) => {
  if (audio) audio.pause()
  audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${word}`)
  audio.play()
}
</script>

<style scoped>
.side-list::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: var(--bg-info-color-2);
}
</style>
