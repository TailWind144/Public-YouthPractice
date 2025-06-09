<template>
  <div
    class="bg-[var(--bg-color-d)] min-h-[80vh] rounded-lg px-7 py-10 shadow-down"
  >
    <div class="flex gap-6 flex-col">
      <div
        class="grid grid-cols-normal md:flex md:flex-col"
        v-if="isCardLoading"
      >
        <a-skeleton animation>
          <a-skeleton-line :rows="1" :line-height="45" />
        </a-skeleton>
      </div>
      <div class="grid grid-cols-normal gap-2" v-else>
        <PracticeCard
          @click="handleCardClick(item.id)"
          v-for="(item, index) in modules"
          :isActive="item.id === curId"
          :key="index"
          :data="item"
        />
      </div>
      <transition name="slide-fade" mode="out-in">
        <div
          class="flex-1 overflow-x-hidden overflow-y-auto max-h-[70vh]"
          :key="curId"
        >
          <PracticeList
            :isLoading="isListLoading"
            @item-click="handleItemClick"
            :list="units"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUnits, getModules } from "./utils/fetch"
import KeyToNames from "./utils/KeyToNames"

definePageMeta({
  layout: "dashboard",
})

const route = useRoute()
const router = useRouter()
const curId = ref()
const modules = ref([])
const units = ref([])
const moduleIdToNames = ref({})
const unitIdToNames = ref({})
const isCardLoading = ref(true)
const isListLoading = ref(true)

const initData = async () => {
  const { data: res } = await getModules()
  curId.value = Number(route.query.module) || res[0].id
  const { data: res2 } = await getUnits({ id: curId.value })

  modules.value = res
  moduleIdToNames.value = KeyToNames(modules.value, "id")
  units.value = res2
  unitIdToNames.value = KeyToNames(units.value, "id")
  isCardLoading.value = false
  isListLoading.value = false
}
initData()

const handleCardClick = async (id) => {
  curId.value = id
  router.replace({ query: { ...route.query, module: id } })
  isListLoading.value = true
  const { data } = await getUnits({ id })
  units.value = data
  unitIdToNames.value = KeyToNames(units.value, "id")
  isListLoading.value = false
}

const handleItemClick = (id) => {
  return navigateTo({
    path: "/practice/level",
    query: { module: curId.value, id },
  })
}
</script>

<style scoped></style>
