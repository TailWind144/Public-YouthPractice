<template>
  <div
    class="grid gap-5"
    :class="{
      'grid-cols-large': size === 'large',
      'grid-cols-2 sm:grid-cols-normal': size === 'normal',
    }"
  >
    <MediaListItem
      v-for="item in list"
      :key="item.id"
      :data="item"
      @click="handleClick(item, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import MediaListItem from "./MediaListItem.vue"
const { list, size } = defineProps({
  list: Object,
  size: {
    type: String,
    default: "large",
  },
})
const emit = defineEmits(["handleClick"])
const handleClick = (item, e) => {
  emit("handleClick", item, e)
}
</script>

<style scoped></style>
