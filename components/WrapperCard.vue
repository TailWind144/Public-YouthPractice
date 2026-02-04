<template>
  <div class="bg-[var(--bg-color-d)] rounded-xl shadow-sm p-5">
    <div
      class="flex sm:flex-row sm:justify-between sm:items-center mb-4 gap-2"
      :class="{ 'flex-col': isWrap, 'justify-between items-center': !isWrap }"
    >
      <div
        class="text-lg font-medium flex gap-2 items-center text-[var(--text-h1)]"
        :class="{
          'text-lg': text === 'normal',
          'text-xl': text === 'large',
        }"
      >
        <span v-if="isIcon" class="text-[var(--text-primary)]">
          <slot name="icon" />
        </span>
        <span>{{ title }}</span>
      </div>
      <slot name="operation" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
const { title, text } = defineProps({
  title: String,
  text: {
    type: String,
    default: "normal",
  },
  isIcon: {
    type: Boolean,
    default: true,
  },
  isWrap: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped></style>
