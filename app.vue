<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (productCategory) => {
    return productCategory
      ? `${productCategory} - YouthPractice`
      : "YouthPractice"
  },
})
</script>

<style></style>
