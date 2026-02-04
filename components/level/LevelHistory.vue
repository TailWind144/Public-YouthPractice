<template>
  <WrapperCard title="关卡挑战记录">
    <template #icon>
      <icon-history />
    </template>
    <LevelHistoryList :list />
  </WrapperCard>
</template>

<script setup lang="ts">
const { list } = defineProps(["list"])
</script>

<style scoped></style>
