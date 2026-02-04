<template>
  <button
    class="flex items-center gap-4 rounded-lg text-nowrap px-2 py-1 duration-300 border bg-[#f6f6f7] border-transparent hover:border-[var(--text-primary)] text-[var(--text-info-2)]"
    @click="showModal(true)"
  >
    <span class="flex gap-2 text-sm">
      <span><icon-search /></span>
      <span>搜索</span>
    </span>
    <span
      class="border text-xs px-2 py-1 font-medium rounded-lg bg-[var(--bg-color-d)]"
    >
      Ctrl + K
    </span>
  </button>
  <transition name="scale-fade" appear>
    <search-modal
      v-if="visible"
      ref="searchModalRef"
      @closed="() => showModal(false)"
    />
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue"

const searchModalRef = ref()
const visible = ref(false)
const showModal = (flag) => (visible.value = flag)

function onKeyUp(e: KeyboardEvent) {
  if (e.ctrlKey && (e.key === "k" || e.key === "K")) {
    e.preventDefault()
    showModal(true)
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyUp)
})
</script>

<style scoped></style>
