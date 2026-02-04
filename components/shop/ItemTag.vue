<template>
  <div class="px-2 py-1 bg-[var(--bg-info-color-2)] rounded">
    {{ text }}
    <span :class="`${iconColor}`">
      <slot />
      <span :class="`align-middle ${textColor}`">{{ data }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const { data, text, iconColor, textColor } = defineProps({
  data: {
    type: Number,
  },
  text: {
    type: String,
    default: "",
  },
  iconColor: {
    type: String,
    default: "",
  },
  textColor: {
    type: String,
    default: "",
  },
})
</script>

<style scoped></style>
