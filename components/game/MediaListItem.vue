<template>
  <div class="flex flex-col gap-1 cursor-pointer group">
    <div class="rounded-lg flex-1 relative">
      <img class="rounded-lg" :src="`${ossBaseURL}${data.cover}`" alt="" />
      <div
        class="absolute rounded-lg left-0 top-0 w-full h-full duration-300 bg-black/40 flex items-center backdrop-blur justify-center opacity-0 group-hover:opacity-100"
      >
        <div class="text-[var(--text-white)]">
          <PlayCircleIcon class="w-14 h-14" />
        </div>
      </div>
    </div>
    <div
      class="hover:text-[var(--text-primary)] text-base font-[Inter] text-center overflow-hidden whitespace-nowrap text-ellipsis text-[var(--text-p)]"
    >
      {{ data.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ossBaseURL } from "~/pages/game/utils/const"
import { PlayCircleIcon } from "@heroicons/vue/24/outline"

const { data } = defineProps(["data"])
</script>

<style scoped></style>
