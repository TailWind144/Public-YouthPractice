<template>
  <WrapperCard :title="data.title" :isIcon="false">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-3">
        <div class="flex gap-2 text-base justify-between">
          <div class="flex gap-2">
            <span class="text-[var(--text-primary)]">
              <icon-book />
            </span>
            <span class="text-[var(--text-info-2)]">单词总数</span>
          </div>
          <span class="text-[var(--text-p)]">{{ data.total }}</span>
        </div>
        <div class="flex gap-2 text-base justify-between">
          <div class="flex gap-2">
            <span class="text-[var(--text-primary)]">
              <icon-calendar />
            </span>
            <span class="text-[var(--text-info-2)]">创建时间</span>
          </div>
          <span class="text-[var(--text-info-2)]">{{ data.createTime }}</span>
        </div>
        <div class="flex gap-2 text-base justify-between">
          <div class="flex gap-2">
            <span class="text-[var(--text-primary)]">
              <icon-history />
            </span>
            <span class="text-[var(--text-info-2)]">更新时间</span>
          </div>
          <span class="text-[var(--text-info-2)]">
            <span class="text-[var(--text-p)]">{{ data.updateTime }}</span>
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="text-[var(--text-p)] font-medium">词库描述</div>
        <div
          class="text-sm bg-neutral-50 text-[var(--text-info-2)] p-3 rounded-lg border border-[var(--border-color)]"
        >
          {{ data.remark || "暂无描述" }}
        </div>
      </div>
      <div class="pt-4 border-t border-[var(--border-color)] w-full">
        <IconButton
          class="w-full"
          text="开始学习"
          size="large"
          @click="() => emit('handleStart', data.id)"
        >
          <icon-play-circle-fill />
        </IconButton>
      </div>
    </div>
  </WrapperCard>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
const emit = defineEmits(["handleStart"])
</script>

<style scoped></style>
