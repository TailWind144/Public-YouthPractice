<template>
  <div class="min-h-screen bg-[var(--bg-color)]">
    <TopNav></TopNav>
    <div class="max-w-[90em] lg:flex lg:gap-6 p-4 mx-auto relative">
      <div class="flex-[3] mt-5">
        <slot />
      </div>
      <div class="flex-1 hidden lg:block text-base mt-5">
        <div class="flex flex-col gap-4 sticky top-16">
          <Calendar />
          <DailySentence />
        </div>
      </div>
      <div class="fixed block lg:hidden bottom-12 right-2">
        <PopMenu />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Calendar from "~/components/calendar/Calendar.vue"
</script>

<style scoped></style>
