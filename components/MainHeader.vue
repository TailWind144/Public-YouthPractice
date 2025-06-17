<template>
  <div>
    <a-page-header :title @back="backCb" :subtitle>
      <template #back-icon>
        <component :is="icon"></component>
      </template>
    </a-page-header>
  </div>
</template>

<script setup lang="ts">
const { backCb, icon, subtitle, title } = defineProps({
  backCb: Function,
  icon: Object,
  subtitle: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "YouthPractice",
  },
})
</script>

<style scoped></style>
