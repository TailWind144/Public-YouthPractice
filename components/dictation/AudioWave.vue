<template>
  <div
    class="space-x-1 audio-wave"
    :style="{
      height: `${height}px`,
      'justify-content': justify,
    }"
  >
    <div
      v-for="(bar, index) in barCount"
      :key="index"
      class="audio-wave-bar"
      :class="{
        'animate-wave': isActive,
      }"
      :style="{
        backgroundColor: color,
        height: `${getRandomHeight()}px`,
        width: `${barWidth}px`,
        'animation-delay': `${index * delay}ms`,
        'animation-duration': `${duration}s`,
      }"
    ></div>
  </div>
</template>
<script setup>
import { defineProps } from "vue"

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },

  color: {
    type: String,
    default: "#4080ff",
  },

  height: {
    type: Number,
    default: 32,
  },

  barCount: {
    type: Number,
    default: 10,
  },
  barWidth: {
    type: Number,
    default: 4,
  },

  space: {
    type: Number,
    default: 4,
  },

  duration: {
    type: Number,
    default: 1.5,
  },

  delay: {
    type: Number,
    default: 100,
  },

  justify: {
    type: String,
    default: "center",
    validator: (value) =>
      [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
      ].includes(value),
  },

  minHeightRatio: {
    type: Number,
    default: 0.5,
    validator: (value) => value >= 0 && value <= 1,
  },

  maxHeightRatio: {
    type: Number,
    default: 1.0,
    validator: (value) => value >= 0 && value <= 1,
  },
})

const getRandomHeight = () => {
  const minHeight = props.height * props.minHeightRatio
  const maxHeight = props.height * props.maxHeightRatio
  return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight
}
</script>

<style scoped>
.audio-wave {
  display: flex;
  align-items: center;
}

.audio-wave-bar {
  border-radius: 9999px;
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.animate-wave {
  animation: wave 1.5s infinite;
}

.hidden {
  display: none;
}
</style>
