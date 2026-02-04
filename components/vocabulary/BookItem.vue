<template>
  <div
    class="cursor-pointer relative h-96 overflow-hidden flex flex-col rounded-lg shadow hover:shadow-xl hover:-translate-y-1 duration-300"
  >
    <a-image width="100%" height="100%" :src="`${ossBaseURL}${data.cover}`" />
    <div
      class="p-4 flex flex-col absolute w-full bottom-0 bg-[var(--bg-color-d)] rounded-b-lg"
    >
      <div class="flex flex-col gap-2">
        <div class="font-bold text-lg text-[var(--text-h1)]">
          {{ data.title }}
        </div>
      </div>
      <div class="flex items-center justify-between mt-1">
        <div class="flex gap-2 text-[var(--text-info)]">
          <div><icon-bookmark /></div>
          <div>{{ data.total }} 个单词</div>
        </div>
        <a-button type="primary" @click="() => emit('handleClick')">
          开始学习
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
const emit = defineEmits(["handleClick"])
</script>

<style scoped></style>
