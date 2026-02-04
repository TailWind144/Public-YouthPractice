<template>
  <div
    class="max-w-[105em] mx-auto py-8 px-4 flex flex-col items-center justify-start gap-4"
  >
    <TopInterBar :data="types" :module />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <WrapperCard title="关卡列表">
        <template #icon>
          <icon-ordered-list />
        </template>
        <template #default>
          <LevelList
            v-if="list.length"
            :list="list"
            :activeId="level.id"
            @item-click="handleClick"
          />
          <a-empty
            class="flex flex-col gap-4 h-[20em] items-center justify-center"
            v-else
          />
        </template>
      </WrapperCard>
      <div class="flex flex-col gap-4">
        <LevelDetail
          v-if="level"
          :index="levelIndex"
          :title="level?.title"
          :reward="level?.reward"
          :isNotGet="!level?.reward && level?.finish"
          @handleStart="handleStart"
        />
        <LevelHistory :list="listHistory" />
      </div>
    </div>
    <!-- <div class="py-4" v-if="list.length">
      <LevelTree :levels @node-click="handleClick" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  validate: async (route) => {
    return (
      typeof route.query.module === "string" &&
      /^\d+$/.test(route.query.module) &&
      typeof route.query.unit === "string" &&
      /^\d+$/.test(route.query.unit)
    )
  },
})
import type { User } from "~/types/user"
import { getLevels, getLevelHistory } from "./utils/fetch"

const userState = useState<User>("userState")
const level = computed<any>(() => list.value[levelIndex.value])
const levelIndex = ref(0)
const route = useRoute()
const list = ref([])
const listHistory = ref([])
const types = ref()

let module
const initData = async () => {
  module = route.query.module
  const id = route.query.unit
  const { data } = await getLevels({ id })

  list.value = data.arr
  const index = list.value.findIndex((item) => item.active)
  levelIndex.value = index === -1 ? 0 : index
  types.value = data.types
}
const initHistory = async () => {
  const id = route.query.unit
  const { data } = await getLevelHistory({
    uid: userState.value.uid,
    unitId: id,
  })
  listHistory.value = data
}
initData()
initHistory()

const handleClick = (index) => {
  levelIndex.value = index
}

const handleStart = () => {
  return navigateTo({
    path: "/questions",
    query: { ...route.query, level: level.value.id },
  })
}

const { arrivedState } = useWindowScroll()
const isTop = computed(() => arrivedState.top)
</script>

<style scoped></style>
