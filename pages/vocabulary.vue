<template>
  <div class="flex flex-col gap-10 max-w-[105em] mx-auto px-4 py-8 md:py-12">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "commonboard",
})
useHead({
  title: "单词本",
})
</script>

<style scoped></style>
