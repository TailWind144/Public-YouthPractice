<template>
  <div class="border-b sticky top-0 z-50">
    <!-- backdrop-blur backdrop-saturate-50 -->
    <div
      class="bg-[var(--bg-color-d)] flex items-center px-8 transition-all duration-500 ease-in-out"
    >
      <MainHeader
        class="mr-auto"
        :icon="IconHome"
        :backCb="() => navigateTo('/quote')"
      />
      <TopMenu />
      <UserAvatar />
    </div>
    <ScrollTop />
  </div>
</template>

<script setup lang="ts">
import { IconHome } from "@arco-design/web-vue/es/icon"
import ScrollTop from "./ScrollTop.vue"

// const isDark = useDark({
//   storageKey: "useDarkKEY",
//   valueDark: "dark",
//   valueLight: "light",
// })
// const toggleDark = useToggle(isDark)

const { y: scroll } = useWindowScroll()
const isTop = computed(() => scroll.value === 0)
// const isTop = true
</script>

<style scoped></style>
