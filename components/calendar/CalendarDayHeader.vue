<template>
  <div class="grid grid-cols-7 gap-1 mb-2">
    <div
      v-for="day in weekdays"
      :key="day"
      class="text-center text-sm font-medium text-[var(--text-info)] py-1"
    >
      {{ day }}
    </div>
  </div>
</template>

<script setup lang="ts">
const weekdays = ["Mon", "Tue", "Web", "Thu", "Fri", "Sat", "Sun"]
</script>

<style scoped></style>
