<template>
  <div
    class="max-w-md w-full flex justify-between items-center duration-300 p-4 text-base rounded-xl bg-[var(--bg-info-color-2)] hover:translate-x-2"
    :class="{
      '!bg-[var(--bg-checked-color)]': data.active,
      'bg-[var(--bg-success-color)]': data.finish,
      'bg-[var(--bg-warn-color)]': !data.reward && data.finish,
      'cursor-not-allowed opacity-70 hover:transform-none': data.disable,
      'cursor-pointer': !data.disable,
      'ring-2 ring-[var(--text-primary)]': activeId === data.id,
    }"
  >
    <div class="flex gap-4 items-center">
      <div
        class="rounded-full h-10 w-10 flex items-center justify-center font-bold text-white bg-[var(--bg-info-color)]"
        :class="{
          'bg-[var(--text-primary)]': data.active,
          'bg-[var(--success-color)]': data.finish,
          'bg-[var(--warn-color)]': !data.reward && data.finish,
        }"
      >
        {{ index + 1 }}
      </div>
      <div class="text-[var(--text-h1)] font-medium">{{ data.title }}</div>
    </div>
    <div
      v-if="!data.disable"
      class="text-white h-4 w-4 text-xs rounded-full flex items-center justify-center"
      :class="{
        'bg-[var(--text-primary)]': data.active,
        'bg-[var(--success-color)]': data.finish,
        'bg-[var(--warn-color)]': !data.reward && data.finish,
      }"
    >
      <icon-exclamation v-if="!data.reward && data.finish" />
      <icon-check style="stroke-width: 8" v-else-if="data.finish" />
      <icon-play-arrow-fill v-else-if="data.active" />
    </div>
    <div v-else class="text-[var(--text-info)]">
      <icon-lock />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, index, activeId } = defineProps(["data", "index", "activeId"])
</script>

<style scoped></style>
