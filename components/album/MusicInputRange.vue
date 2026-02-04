<template>
  <div
    class="progress-wrapper"
    ref="wrapper"
    @mouseenter="handleWrapperHover"
    @mouseleave="handleWrapperLeave"
  >
    <div
      class="progress-filled"
      ref="filled"
      :style="{ width: filledWidth }"
    ></div>
    <input
      type="range"
      :value="fakeTimeStamp"
      min="0"
      :max="duration"
      step="1"
      class="progress-slider slider-hidden"
      ref="slider"
      @mousedown="handleDrag"
      @mouseup="handleUp"
      @input="handleInput($event)"
      @change="handleChange($event)"
    />
  </div>
</template>

<script setup lang="ts">
const { duration, currentTime } = defineProps(["duration", "currentTime"])
const emit = defineEmits(["handleTimeChange"])
const wrapper = ref()
const filled = ref()
const slider = ref()
const fakeTimeStamp = ref(0)
const filledWidth = ref("0%")

const updateWidth = () => {
  const percentage = (Number(fakeTimeStamp.value) / duration) * 100
  filledWidth.value = `${percentage}%`
}

watch(
  () => currentTime,
  () => {
    if (!isDragging) {
      fakeTimeStamp.value = Number(currentTime)
      updateWidth()
    }
  }
)

watch(
  () => fakeTimeStamp.value,
  () => {
    updateWidth()
  }
)

const handleInput = (e) => {
  fakeTimeStamp.value = Number(e.target.value)
}

const handleChange = (e) => {
  emit("handleTimeChange", Number(e.target.value))
}

let isDragging = false
const handleWrapperHover = () => {
  slider.value.classList.remove("slider-hidden")
  slider.value.classList.add("slider-visible")
}
const handleWrapperLeave = () => {
  if (!isDragging) {
    slider.value.classList.remove("slider-visible")
    slider.value.classList.add("slider-hidden")
  }
}
const handleDrag = () => {
  isDragging = true
  slider.value.classList.remove("slider-hidden")
  slider.value.classList.add("slider-visible")
}
const handleUp = () => {
  isDragging = false
  if (!wrapper.value.matches(":hover")) {
    slider.value.classList.remove("slider-visible")
    slider.value.classList.add("slider-hidden")
  }
}
</script>

<style scoped>
.progress-wrapper {
  --progress-wrapper-height: 6px;
  --progress-bg-color: #e0e0e04e;
  --progress-hover-bg-color: #e0e0e08c;
  --progress-filled-color: #f6f6f6;
  --progress-thumb-color: #f6f6f6;
  --thumb-width: 14px;
  --thumb-height: 14px;
  position: relative;
  width: 100%;
  height: var(--progress-wrapper-height);
  background-color: var(--progress-bg-color);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.progress-wrapper:hover {
  background-color: var(--progress-hover-bg-color);
  height: calc(var(--progress-wrapper-height) * 1.4);
}

.progress-filled {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: var(--progress-filled-color);
  border-radius: 3px;
}

.progress-slider {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 2;
  margin: 0;
  cursor: pointer;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--thumb-width);
  height: var(--thumb-height);
  border-radius: 50%;
  background: var(--progress-thumb-color);
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.progress-slider::-moz-range-thumb {
  width: var(--thumb-width);
  height: var(--thumb-height);
  border-radius: 50%;
  background: var(--progress-thumb-color);
  cursor: pointer;
  transition: all 0.1s ease;
  border: none;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.slider-hidden::-webkit-slider-thumb {
  opacity: 0;
  visibility: hidden;
}

.slider-hidden::-moz-range-thumb {
  opacity: 0;
  visibility: hidden;
}

.slider-visible::-webkit-slider-thumb {
  opacity: 1;
  visibility: visible;
}

.slider-visible::-moz-range-thumb {
  opacity: 1;
  visibility: visible;
}

.slider-visible::-webkit-slider-thumb:hover {
  transform: translateY(-50%) scale(1.1);
}

.slider-visible::-moz-range-thumb:hover {
  transform: translateY(-50%) scale(1.1);
}

.slider-visible::-webkit-slider-thumb:active,
.slider-visible::-moz-range-thumb:active {
  transform: translateY(-50%) scale(1);
}

.progress-slider::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  height: 6px;
}

.progress-slider::-moz-range-track {
  height: 6px;
  border: none;
  background: transparent;
}
</style>
