<template>
  <div class="flex justify-center gap-4">
    <IconWrapper @click="handlePrevious">
      <icon-skip-previous-fill />
    </IconWrapper>
    <IconWrapper v-if="isPlaying" @click="handlePause">
      <icon-pause />
    </IconWrapper>
    <IconWrapper v-else @click="handlePlay">
      <icon-play-arrow-fill />
    </IconWrapper>
    <IconWrapper @click="handleNext">
      <icon-skip-next-fill />
    </IconWrapper>
  </div>
</template>

<script setup lang="ts">
import IconWrapper from "./IconWrapper.vue"
const { isPlaying } = defineProps(["isPlaying"])
const emit = defineEmits([
  "handlePrevious",
  "handlePause",
  "handlePlay",
  "handleNext",
])

const handlePrevious = () => {
  emit("handlePrevious")
}
const handlePause = () => {
  emit("handlePause")
}
const handlePlay = () => {
  emit("handlePlay")
}
const handleNext = () => {
  emit("handleNext")
}
</script>
