<template>
  <div class="border-b sticky top-0 z-50 bg-[var(--bg-color-d)]">
    <!-- backdrop-blur backdrop-saturate-50 -->
    <div
      class="max-w-[90em] mx-auto h-[50px] flex items-center pl-4 pr-1 sm:px-4 transition-all duration-500 ease-in-out"
    >
      <MainHeader class="mr-auto hidden sm:block" :showBack="false" />
      <a-page-header
        title="YouthPractice"
        class="mr-auto sm:hidden block"
        @back="handleExpandList"
        :subtitle="''"
      >
        <template #back-icon>
          <component :is="IconMenu"></component>
        </template>
      </a-page-header>
      <TopMenu :mode="'horizontal'" class="hidden sm:block" />
      <div class="flex gap-4">
        <SearchButton />
        <UserAvatar />
      </div>
    </div>
    <MenuDrawer v-model="drawerVisible" />
    <ScrollTop />
  </div>
</template>

<script setup lang="ts">
import { IconMenu } from "@arco-design/web-vue/es/icon"
import ScrollTop from "./ScrollTop.vue"

const drawerVisible = ref(false)
// const isDark = useDark({
//   storageKey: "useDarkKEY",
//   valueDark: "dark",
//   valueLight: "light",
// })
// const toggleDark = useToggle(isDark)

const { y: scroll } = useWindowScroll()
const isTop = computed(() => scroll.value === 0)
// const isTop = true

const handleExpandList = () => {
  drawerVisible.value = true
}
</script>

<style scoped></style>
