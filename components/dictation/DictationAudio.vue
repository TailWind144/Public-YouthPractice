<template>
  <div class="flex gap-4 items-center">
    <div
      class="text-[var(--text-white)] cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-[var(--text-primary-2)] text-xl hover:scale-[1.02] active:scale-95 duration-300"
      @click="() => emit('play')"
    >
      <icon-pause v-if="isPlay" />
      <PlayIcon class="w-5 h-5 ml-[1.5px]" v-else />
    </div>
    <dictation-audio-wave :isActive="isPlay" />
  </div>
</template>

<script setup lang="ts">
import { PlayIcon } from "@heroicons/vue/24/solid"

const { isPlay } = defineProps(["isPlay"])
const emit = defineEmits(["play"])
</script>

<style scoped></style>
