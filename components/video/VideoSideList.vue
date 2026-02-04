<template>
  <div
    class="py-3 bg-[var(--bg-info-color-2)] rounded-md text-[var(--text-h1)] flex flex-col gap-3"
  >
    <div class="text-base px-4">
      选集
      <span class="text-sm text-[var(--text-info)]">{{
        `(${curIndex + 1}/${list.length})`
      }}</span>
    </div>
    <div
      class="side-list grid grid-cols-fix gap-2 max-h-32 lg:max-h-96 overflow-y-auto px-4"
    >
      <div
        class="duration-300 hover:text-[var(--text-primary)] hover:bg-[var(--bg-checked-color)] hover:border-[var(--text-primary)] border border-transparent bg-[var(--bg-color-d)] flex items-center justify-center rounded-md w-14 h-14 cursor-pointer"
        :class="{
          '!bg-[var(--text-primary)] !text-[var(--text-white)]':
            item.index === curIndex + 1,
        }"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(index)"
      >
        {{ item.index }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { list, curIndex } = defineProps({
  curIndex: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array,
    default: [0],
  },
})
const emit = defineEmits(["handleClick"])

const handleClick = (index) => {
  emit("handleClick", index)
}
</script>

<style scoped>
.side-list::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background: var(--bg-info-color-2);
}
</style>
