<template>
  <div>
    <a-page-header
      title="YouthPractice"
      @back="backCb"
      :subtitle="subtitle || ''"
    >
      <template #back-icon>
        <component :is="icon"></component>
      </template>
    </a-page-header>
  </div>
</template>

<script setup lang="ts">
const { backCb, icon, subtitle } = defineProps(["backCb", "icon", "subtitle"])
</script>

<style scoped></style>
