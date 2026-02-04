<template>
  <WrapperCard title="练习概况">
    <template #icon>
      <icon-bar-chart />
    </template>

    <div
      class="data-detail-card flex flex-col gap-6 justify-center items-center"
    >
      <a-progress
        type="circle"
        size="large"
        :percent="Number((data?.levelCount / data?.total).toFixed(3))"
        animation
        :stroke-width="15"
        :width="160"
      />
      <div class="flex flex-col gap-1 w-full text-base">
        <div class="flex justify-between">
          <div class="flex gap-2 items-center">
            <div
              class="text-white h-4 w-4 text-xs rounded-full flex items-center justify-center bg-[var(--success-color)]"
            >
              <icon-check style="stroke-width: 8" />
            </div>
            <span class="text-[var(--text-p)]">已完成关卡</span>
          </div>
          <div class="text-[var(--text-primary)] font-semibold">
            {{ data?.levelCount }} / {{ data?.total }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="flex gap-2 items-center">
            <span class="text-[var(--warn-color)]">
              <icon-calendar-clock />
            </span>
            <span class="text-[var(--text-p)]">连续签到</span>
          </div>
          <div class="text-[var(--warn-color)] font-semibold">
            {{ data?.streak }} 天
          </div>
        </div>
      </div>
    </div>
  </WrapperCard>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
</script>

<style scoped></style>
