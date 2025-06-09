<template>
  <div class="grid grid-cols-large gap-5">
    <MediaListItem
      v-for="(item, index) in list"
      :key="index"
      :data="item"
      @click="handleClick(item.id, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import MediaListItem from "./MediaListItem.vue"
const { list } = defineProps(["list"])
const emit = defineEmits(["handleClick"])
const handleClick = (id, e) => {
  emit("handleClick", id, e)
}
</script>

<style scoped></style>
