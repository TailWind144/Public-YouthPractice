<template>
  <div
    class="pl-4 pr-2 py-1 border-l-4 flex flex-col gap-1 cursor-pointer duration-300 transition-all hover:bg-[var(--bg-info-color-4)] hover:shadow-sm hover:-translate-x-2"
    :class="{
      'border-[var(--success-color)]': data.isSuccess,
      'border-[var(--warn-color)]': !data.isSuccess,
    }"
  >
    <div class="flex justify-between items-center font-medium">
      <div class="text-base text-[var(--text-p)]">{{ data?.title }}</div>
      <div class="flex items-center gap-1">
        <div
          :class="{
            'text-[var(--success-color)]': data.isSuccess,
            'text-[var(--warn-color)]': !data.isSuccess,
          }"
        >
          {{ data.score }} 分
        </div>
        <div
          class="text-white h-4 w-4 text-xs rounded-full flex items-center justify-center"
          :class="{
            'bg-[var(--success-color)]': data.isSuccess,
            'bg-[var(--warn-color)]': !data.isSuccess,
          }"
        >
          <icon-check style="stroke-width: 8" v-if="data.isSuccess" />
          <icon-exclamation v-else />
        </div>
      </div>
    </div>
    <div class="text-[var(--text-info)]">完成于 {{ data.finishTime }}</div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
</script>

<style scoped></style>
