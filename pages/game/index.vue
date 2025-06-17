<template>
  <div class="shadow-down">
    <MediaNav :type @changeType="handleChange" />
    <div
      v-if="list?.length"
      class="bg-[var(--bg-color-d)] h-[80vh] rounded-b-xl p-4 overflow-y-auto"
    >
      <MediaList :list @handleClick="handleClick" />
    </div>
    <div
      v-else
      class="bg-[var(--bg-color-d)] h-[80vh] rounded-b-xl p-4 overflow-y-auto flex items-center"
    >
      <a-empty />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
})
import MediaList from "~/components/game/MediaList.vue"
import { getMediaLibrary } from "./utils/fetch"
import MediaNav from "~/components/game/MediaNav.vue"

const list = ref()
const type = ref(1)
watchEffect(async () => {
  const { data } = await getMediaLibrary({ type: type.value })
  list.value = data
})

const handleChange = (val) => {
  type.value = val
}

const handleClick = (id, e) => {
  e.target.style.viewTransitionName = "full-video"
  return navigateTo({ path: "/video", query: { id } })
}

useHead({
  title: "娱乐",
})
</script>

<style scoped></style>
