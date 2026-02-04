<template>
  <div
    ref="listRef"
    class="grid grid-cols-2 gap-2 h-[20em] items-start overflow-y-auto py-1 pr-1"
  >
    <a-empty
      class="flex flex-col h-[20em] col-span-2 items-center justify-center"
      v-if="!list.length"
    />
    <transition-group name="scale-fade" appear>
      <home-plan-dictation-list-item
        v-for="(data, index) in list"
        :key="index"
        :data
        @handleItemClick="(item) => emit('handleItemClick', item)"
      />
    </transition-group>
    <a-skeleton v-show="!isBottom" animation>
      <a-skeleton-line :line-height="163" />
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["handleItemClick", "load"])
const { list, isBottom, threshold } = defineProps([
  "list",
  "isBottom",
  "threshold",
])

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

<style scoped>
.plan-transition-duration {
  transition-duration: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
