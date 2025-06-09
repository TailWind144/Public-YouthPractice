<template>
  <div class="home min-h-screen bg-[var(--bg-color)]">
    <TopNav></TopNav>
    <div class="max-w-[90em] flex gap-4 p-4 mx-auto">
      <div class="flex-[3]">
        <slot />
      </div>
      <div class="flex-1 hidden lg:block text-base">
        <div class="flex flex-col gap-4">
          <Calendar />
          <DailySentence />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from "~/components/calendar/Calendar.vue"
</script>

<style scoped></style>
