<template>
  <div class="flex flex-col">
    <div class="flex-1">
      <video
        ref="videoRef"
        class="h-full w-full cursor-pointer"
        controls
        :src="`${ossBaseURL}${src}`"
      ></video>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ossBaseURL } from "~/pages/game/utils/const"
const { src } = defineProps(["src"])

const videoRef = ref()
onMounted(() => {
  videoRef.value.style.viewTransitionName = "full-video"
})
</script>

<style scoped></style>
