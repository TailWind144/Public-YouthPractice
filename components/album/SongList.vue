<template>
  <div class="flex flex-col gap-2 w-full overflow-hidden">
    <div class="text-base font-bold text-[var(--text-h1)]">歌曲列表</div>
    <div class="flex flex-col gap-1 w-full overflow-y-auto px-1 max-h-[308px]">
      <SongListItem
        v-for="(item, index) in songs"
        :key="index"
        :data="item"
        :index="index"
        :activeId
        @handleClick="handleClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SongListItem from "./SongListItem.vue"
const { songs, activeId } = defineProps(["songs", "activeId"])
const emit = defineEmits(["handleClick"])
const handleClick = (item) => {
  emit("handleClick", item)
}
</script>
