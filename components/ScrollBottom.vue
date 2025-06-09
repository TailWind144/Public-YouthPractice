<template>
  <transition name="slide-fade">
    <div
      v-show="!arrivedState.bottom"
      class="group opacity-50 hover:opacity-95 bg-gradient-to-b duration-300 from-transparent to-[#94bfff] flex items-center justify-center text-[var(--text-primary-2)] cursor-pointer w-[100vw] p-4 text-2xl"
      @click="toBottom"
    >
      <icon-double-down class="group-hover:translate-y-1 duration-300" />
    </div>
  </transition>
</template>

<script setup lang="ts">
const { arrivedState } = useWindowScroll()

function toBottom() {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  })
}
</script>

<style scoped></style>
