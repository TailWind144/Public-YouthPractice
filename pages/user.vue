<template>
  <div class="max-w-[90em] mx-auto px-4 py-8 md:py-12">
    <div class="flex gap-5">
      <SettingSide />
      <div
        class="flex flex-1 flex-col px-10 py-8 bg-[var(--bg-color-d)] shadow-sm rounded-lg"
      >
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingSide from "~/components/user/SettingSide.vue"

definePageMeta({
  layout: "commonboard",
})
useHead({
  title: "个人中心",
})
</script>

<style scoped></style>
