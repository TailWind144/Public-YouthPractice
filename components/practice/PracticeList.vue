<template>
  <div class="p-2">
    <a-skeleton
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      animation
      v-if="isLoading"
    >
      <a-skeleton-shape
        class="!w-full !h-[84px]"
        v-for="(item, index) in 3"
        :key="index"
      />
    </a-skeleton>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
    >
      <PracticeListItem
        @handleClick="handleClick(item.id)"
        v-for="(item, index) in list"
        :key="item.id"
        :data="item"
        :index="list.length"
        :data-index="index"
      />
    </div>
    <a-empty v-if="!isLoading && !list.length"> 暂无 </a-empty>
  </div>
</template>

<script setup lang="ts">
// import gsap from "gsap"
const { list, isLoading } = defineProps(["list", "isLoading"])
const emit = defineEmits(["itemClick"])

const handleClick = (id) => {
  emit("itemClick", id)
}

// function onEnter(el, done) {
//   gsap.to(el, {
//     opacity: 1,
//     scale: 1,
//     duration: el.dataset.index ? 0 : 0.4,
//     delay: el.dataset.index * 0.1,
//     onComplete: done,
//   })
// }
</script>

<style scoped></style>
