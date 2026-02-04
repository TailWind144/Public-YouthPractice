<template>
  <div class="flex gap-2 items-center">
    <IconWrapper v-if="isMute" @click="handleMute">
      <icon-mute-fill />
    </IconWrapper>
    <IconWrapper v-else @click="handleMute">
      <icon-sound-fill />
    </IconWrapper>
    <input
      class="slider"
      type="range"
      max="1"
      step="0.01"
      v-model="volume"
      @input="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import IconWrapper from "./IconWrapper.vue"
const { isMute } = defineProps(["isMute"])
const volume = defineModel("volume")
const emit = defineEmits(["handleMute", "handleChange"])

const handleMute = () => {
  emit("handleMute")
}

const handleChange = () => {
  emit("handleChange")
}
</script>

<style scoped>
input[type="range"].slider {
  --slider-width: 100%;
  --slider-height: 6px;
  --slider-bg: #e0e0e0;
  --slider-border-radius: 999px;
  --level-color: black;
  --level-transition-duration: 0.1s;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--slider-width);
  height: var(--slider-height);
  background: var(--slider-bg);
  overflow: hidden;
  border-radius: var(--slider-border-radius);
  -webkit-transition: height var(--level-transition-duration);
  -o-transition: height var(--level-transition-duration);
  transition: height var(--level-transition-duration);
}
input[type="range"].slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  -webkit-box-shadow: -200px 0 0 200px var(--level-color);
  box-shadow: -200px 0 0 200px var(--level-color);
}

input[type="range"].slider:hover {
  height: calc(var(--slider-height) * 1.4);
}
</style>
