<template>
  <div class="grid grid-cols-7 gap-1 mb-2">
    <div
      v-for="day in weekdays"
      :key="day"
      class="text-center text-xs font-medium text-[var(--text-info)] py-1"
    >
      {{ day }}
    </div>
  </div>
</template>

<script setup lang="ts">
const weekdays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
</script>

<style scoped></style>
