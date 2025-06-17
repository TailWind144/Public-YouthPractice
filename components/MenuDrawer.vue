<template>
  <a-drawer
    :visible="visible"
    @cancel="() => (visible = false)"
    :footer="false"
    placement="left"
  >
    <template #title> YouthPractice </template>
    <TopMenu :mode="'vertical'" @menuClick="() => (visible = false)" />
  </a-drawer>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>()
</script>

<style scoped></style>
