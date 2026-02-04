<template>
  <WrapperCard
    title="继续练习"
    class="!bg-[var(--bg-checked-color)] border border-[#165dff]/10"
  >
    <template #icon>
      <icon-play-circle-fill />
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1 bg-[var(--bg-color-d)] rounded-xl p-4">
        <div class="flex gap-3 items-center">
          <div
            class="shrink-0 rounded-lg w-10 h-10 flex items-center justify-center bg-[var(--bg-checked-color)]"
          >
            <RocketLaunchIcon class="w-5 h-5 text-[var(--text-primary)]" />
          </div>
          <div class="w-full flex flex-col gap-1">
            <div class="text-base font-medium text-[var(--text-p)]">
              {{ level?.module }}
            </div>
            <div class="flex justify-between text-[var(--text-info)]">
              <div>{{ level?.unit }}</div>
              <div>已完成 {{ Math.round(level?.percent * 100) }}%</div>
            </div>
          </div>
        </div>
        <div>
          <a-progress
            size="large"
            :percent="Number(level?.percent)"
            animation
            :show-text="false"
          />
        </div>
      </div>
      <IconButton
        class="w-full"
        text="继续练习"
        size="large"
        shape="round"
        @click="handleContinue"
      >
        <icon-play-arrow-fill />
      </IconButton>
    </div>
  </WrapperCard>
</template>

<script setup lang="ts">
import { RocketLaunchIcon } from "@heroicons/vue/24/solid"
const { level } = defineProps(["level"])

const handleContinue = () => {
  return navigateTo({
    path: "/practice/level",
    query: {
      module: level.moduleId,
      unit: level.unitId,
    },
  })
}
</script>

<style scoped></style>
