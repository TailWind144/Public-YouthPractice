<template>
  <div class="level-node relative">
    <div
      class="tail absolute top-0 left-5 w-[1px] pt-11 pb-1 h-full z-0"
      :class="{
        'cursor-not-allowed': data.disable,
        'cursor-pointer': !data.disable,
      }"
    ></div>
    <a-popover position="right">
      <div
        class="rounded-full h-10 w-10 text-[var(--text-white)] flex items-center justify-center text-base bg-[var(--bg-info-color)]"
        :class="{
          'bg-[var(--text-primary)]': data.active,
          'bg-[var(--success-color)]': data.finish,
          'bg-[var(--warn-color)]': !data.reward && data.finish,
          'cursor-not-allowed': data.disable,
          'cursor-pointer': !data.disable,
        }"
      >
        <icon-check v-if="data.finish && data.reward" />
        <span v-else>{{ index + 1 }}</span>
      </div>
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="text-base">{{ data.title }}</div>
          <div
            v-if="data.finish && !data.reward"
            class="text-[var(--text-info)] text-end"
          >
            注意：奖励未获取
          </div>
          <div class="text-[var(--text-info)] flex gap-2 justify-end">
            <span>积分 <span class="text-[var(--text-yellow)]">+1</span></span>
            <span
              >经验值 <span class="text-[var(--text-primary-2)]">+5</span></span
            >
            <span
              v-if="data.reward"
              class="text-[var(--success-color-2)] align-middle"
            >
              <icon-check />
            </span>
          </div>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
const { data, index } = defineProps(["data", "index"])
</script>

<style scoped>
.level-node:not(:last-child) {
  min-height: 5rem;
}
.level-node:not(:last-child) .tail::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--bg-info-color);
}
</style>
