<template>
  <div class="min-h-[80vh] py-8 flex flex-col items-center justify-start gap-4">
    <TopInterBar :data="types" :module />
    <div class="py-4" v-if="levels.length">
      <LevelTree :levels @node-click="handleClick" />
    </div>
    <a-empty v-else> 暂无关卡 </a-empty>
    <!-- <ScrollBottom class="fixed bottom-0" /> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    return (
      typeof route.query.module === "string" &&
      /^\d+$/.test(route.query.module) &&
      typeof route.query.id === "string" &&
      /^\d+$/.test(route.query.id)
    )
  },
})
import { getLevels } from "./utils/fetch"

const route = useRoute()
const levels = ref([])
const types = ref([])

let module
const initData = async () => {
  module = route.query.module
  const id = route.query.id
  const { data } = await getLevels({ id })

  levels.value = data.arr
  types.value = data.types
}
initData()

const handleClick = (id) => {
  return navigateTo({ path: "/questions", query: { id } })
}

const { arrivedState } = useWindowScroll()
const isTop = computed(() => arrivedState.top)
</script>

<style scoped></style>
