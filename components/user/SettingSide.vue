<template>
  <div
    class="bg-[var(--bg-color-d)] w-[230px] h-[600px] p-2 flex flex-col gap-1 shadow-sm rounded-lg"
  >
    <RouterLink
      v-for="(item, index) in sideList"
      :key="index"
      class="flex rounded-lg py-2 px-5 h-[48px] text-[var(--text-info-2)] duration-300 hover:bg-[var(--bg-info-color-4)] items-center text-base gap-2 cursor-pointer"
      :class="{
        'bg-[var(--bg-info-color-4)]': route.fullPath === item.path,
      }"
      :to="item.path"
    >
      <span class="text-xl"><component :is="item.icon"></component></span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { IconIdcard } from "@arco-design/web-vue/es/icon"
const route = useRoute()

const sideList = ref([
  {
    icon: IconIdcard,
    label: "个人资料",
    path: "/user/profile",
  },
])
</script>

<style scoped></style>
