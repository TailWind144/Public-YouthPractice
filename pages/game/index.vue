<template>
  <div class="flex flex-col gap-4">
    <MediaNav :type @changeType="handleChange" />
    <div v-if="list?.length">
      <transition name="slide-fade" mode="out-in" appear>
        <MediaList
          :key="type"
          :list
          :size="typeToName[type].size"
          @handleClick="handleClick"
        />
      </transition>
    </div>
    <div v-else class="h-[80vh] flex items-center">
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
import { typeToName } from "./utils/const"

const list = ref()
const type = ref(1)
watchEffect(async () => {
  const { data } = await getMediaLibrary({ type: type.value })
  list.value = data
})

const handleChange = (val) => {
  type.value = val
}

const handleClick = (item, e) => {
  e.target.style.viewTransitionName = "full-image"
  const gameImgSrc = useState("gameImgSrc")
  gameImgSrc.value = item.cover
  return navigateTo({
    path: typeToName[type.value].path,
    query: { id: item.id },
  })
}

useHead({
  title: "娱乐",
})
</script>

<style scoped></style>
