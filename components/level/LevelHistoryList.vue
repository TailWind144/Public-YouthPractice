<template>
  <div ref="listRef" class="flex flex-col gap-3 h-[20em] overflow-y-auto">
    <a-empty
      class="flex flex-col h-[20em] items-center justify-center"
      v-if="!list.length"
    />
    <div class="flex flex-col gap-3">
      <LevelHistoryItem
        v-for="(item, index) in list"
        :key="index"
        :data="item"
        @click="() => emit('handleItemClick', item)"
      />
    </div>
    <a-skeleton v-show="!isBottom" animation>
      <a-skeleton-line :line-height="52" />
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["handleItemClick", "load"])
const { list, isBottom, threshold } = defineProps({
  list: Array,
  isBottom: {
    type: Boolean,
    default: true,
  },
  threshold: {
    type: Number,
    default: 200,
  },
})

const listRef = ref()
const scroll = debounce(() => {
  const el = listRef.value
  if (
    !isBottom &&
    el.scrollTop + el.clientHeight >= el.scrollHeight - threshold
  )
    emit("load")
}, 500)
onMounted(() => {
  listRef.value.addEventListener("scroll", scroll)
})
onBeforeUnmount(() => {
  listRef.value.removeEventListener("scroll", scroll)
})
</script>

<style scoped></style>
