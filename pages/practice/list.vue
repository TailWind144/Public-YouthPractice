<template>
  <div>
    <section
      class="bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-primary-2)] text-white py-6 md:py-8"
    >
      <div class="container mx-auto px-4 md:px-6">
        <div class="max-w-3xl">
          <div class="text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-2">
            英语练习闯关
          </div>
          <p class="text-white/90 text-base md:text-xl">
            完成当前关卡才能解锁下一关，挑战你的英语能力极限！
          </p>
        </div>
      </div>
    </section>
    <div class="max-w-[105em] px-7 py-10 mx-auto">
      <div class="flex gap-6 flex-col">
        <div
          class="grid grid-cols-normal md:flex md:flex-col"
          v-if="isCardLoading"
        >
          <a-skeleton animation>
            <a-skeleton-line :rows="1" :line-height="45" />
          </a-skeleton>
        </div>
        <div
          class="overflow-x-auto flex sm:grid sm:grid-cols-normal gap-2 py-2"
          v-else
        >
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
  </div>
</template>

<script setup lang="ts">
import { getUnits, getModules } from "./utils/fetch"
import KeyToNames from "./utils/KeyToNames"

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
    query: { module: curId.value, unit: id },
  })
}
</script>

<style scoped></style>
