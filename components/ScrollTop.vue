<template>
  <button
    :class="
      (scroll > 100 ? 'opacity-30' : 'pointer-events-none opacity-0') +
      ' fixed bg-[var(--text-primary-2)] text-white bottom-3 text-xl right-3 z-50 flex h-10 w-10 items-center justify-center rounded-full transition duration-300 hover:opacity-100 print:hidden'
    "
    @click="toTop()"
  >
    <icon-arrow-up />
  </button>
</template>

<script setup lang="ts">
const { y: scroll } = useWindowScroll()
function toTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}
</script>

<style scoped></style>
