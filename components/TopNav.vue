<template>
  <div class="border-b sticky top-0 z-50">
    <!-- backdrop-blur backdrop-saturate-50 -->
    <div
      class="bg-[var(--bg-color-d)] flex items-center pl-4 pr-1 sm:px-8 transition-all duration-500 ease-in-out"
    >
      <MainHeader
        class="mr-auto hidden sm:block"
        :icon="IconHome"
        :backCb="() => navigateTo('/quote')"
      />
      <a-page-header
        title="YouthPractice"
        class="mr-auto sm:hidden block"
        @back="handleExpandList"
        :subtitle="''"
      >
        <template #back-icon>
          <component :is="IconList"></component>
        </template>
      </a-page-header>
      <TopMenu :mode="'horizontal'" class="hidden sm:block" />
      <UserAvatar />
    </div>
    <MenuDrawer v-model="drawerVisible" />
    <ScrollTop />
  </div>
</template>

<script setup lang="ts">
import { IconHome } from "@arco-design/web-vue/es/icon"
import { IconList } from "@arco-design/web-vue/es/icon"
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
