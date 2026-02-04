<template>
  <div class="flex flex-col">
    <div class="bg-[var(--bg-color-d)] rounded-xl shadow-sm flex flex-col">
      <div class="flex justify-between items-center p-6">
        <div
          class="text-lg font-medium flex gap-2 items-center text-[var(--text-h1)]"
        >
          <div
            class="rounded-full bg-[var(--text-primary)] flex justify-center items-center text-white font-bold w-8 h-8"
          >
            {{ index + 1 }}
          </div>
          <div class="font-semibold">
            {{ `关卡 ${index + 1}：${title}` }}
          </div>
        </div>
        <Tag
          :key="index"
          class="text-xs rounded-full shrink-0 bg-[var(--bg-checked-color)] !text-[var(--text-primary)]"
        >
          限时 5 分钟
        </Tag>
      </div>
      <div class="flex flex-col gap-3 bg-[var(--bg-info-color-3)] p-6">
        <div class="flex gap-2 items-center text-base">
          <span class="text-[var(--text-yellow)]">
            <icon-trophy />
          </span>
          <span class="text-[var(--text-h1)] font-semibold">关卡奖励</span>
          <span v-if="isNotGet">
            <Tag
              :key="index"
              class="text-xs rounded-full shrink-0 bg-[var(--bg-warn-color)] !text-[var(--warn-color)]"
            >
              注意，该关卡奖励仍未获取
            </Tag>
          </span>
        </div>
        <div class="flex gap-4 text-sm">
          <RewardCard value="5 经验" :reward>
            <template #icon>
              <div class="text-base text-[var(--text-primary)] font-bold">
                Exp
              </div>
            </template>
          </RewardCard>
          <RewardCard value="1 积分" :reward>
            <template #icon>
              <div class="h-6 flex items-center">
                <CircleStackIcon class="w-4 h-4 text-[var(--point-yellow)]" />
              </div>
            </template>
          </RewardCard>
        </div>
      </div>
      <div class="p-6">
        <IconButton
          class="w-full"
          :text="`开始挑战关卡 ${index + 1}`"
          size="large"
          status="warning"
          @click="() => emit('handleStart')"
        >
          <icon-play-circle-fill />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleStackIcon } from "@heroicons/vue/24/solid"
import RewardCard from "./RewardCard.vue"
const { index, title, isNotGet } = defineProps([
  "index",
  "title",
  "isNotGet",
  "reward",
])
const emit = defineEmits(["handleStart"])
</script>

<style scoped></style>
