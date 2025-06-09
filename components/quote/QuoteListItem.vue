<template>
  <div
    class="group flex flex-col bg-[#202023] rounded cursor-pointer duration-300 active:scale-[0.98] border border-[#ffffff1f]"
  >
    <div
      class="duration-300 py-2 px-4 text-xs font-semibold group-hover:bg-[#363636] flex items-center justify-between"
      :class="{
        'bg-[#363636] text-[#3c7eff]': isActive,
      }"
    >
      <span>{{ data.publishTime }}</span>
      <span v-if="data.isLove" class="text-[#f87171] flex gap-1">
        <HeartIcon class="w-4 h-4" />
        已收藏
      </span>
    </div>
    <div
      class="duration-500 min-h-[6.5rem] bg-no-repeat bg-center bg-100% rounded-b flex group-hover:bg-110%"
      :class="{
        'bg-110%': isActive,
      }"
      :style="`background-image: url('${imgURL}');`"
    >
      <div class="flex flex-1 bg-black/40 rounded-b">
        <div class="flex flex-col italic p-4 flex-1 justify-between">
          <span>{{ data.cn }}</span>
          <span class="text-end">--{{ data.originCn || "佚名" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartIcon } from "@heroicons/vue/24/solid"
const { data, id } = defineProps(["data", "id"])
const isActive = computed(() => id === data?.id)
const imgURL = imgUrls[getRandomIndex(imgUrls.length, data?.publishTime)]
</script>

<style scoped></style>
