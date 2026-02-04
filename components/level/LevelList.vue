<template>
  <div
    class="flex gap-3 flex-col items-center max-h-[70vh] overflow-y-auto p-2"
  >
    <LevelItem
      v-for="(item, index) in list"
      :key="index"
      :data="item"
      :index
      :activeId
      @click="handleClick(index, item.disable)"
    />
  </div>
</template>

<script setup lang="ts">
import LevelItem from "./LevelItem.vue"
const emit = defineEmits(["itemClick"])
const { list, activeId } = defineProps(["list", "activeId"])

const handleClick = (index, isDisable) => {
  if (!isDisable) emit("itemClick", index)
}
</script>

<style scoped></style>
