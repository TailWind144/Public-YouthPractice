<template>
  <div class="w-full flex items-center justify-between">
    <div>
      <h2 class="text-xl font-semibold" id="level-header-title">
        {{ data?.unit }} · 关卡选择
      </h2>
      <p class="text-gray-500 mt-1 text-base" id="level-header-desc">
        完成当前关卡才能解锁下一关卡
      </p>
    </div>
    <div>
      <IconButton
        text="返回"
        size="medium"
        @click="() => navigateTo({ path: '/practice/list', query: { module } })"
      >
        <icon-left-circle />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, module } = defineProps(["data", "module"])
</script>

<style scoped>
/* .top-inter-bar:hover {
  filter: drop-shadow(0 0 6px var(--text-primary-2));
} */
</style>
