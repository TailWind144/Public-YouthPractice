<template>
  <div class="flex flex-col gap-4">
    <div class="cursor-default flex text-base gap-4 items-center">
      <a-button
        type="primary"
        @click="handleBackpackClick"
        :loading="backpackLoading"
      >
        <template #icon>
          <BriefcaseIcon class="w-4 h-4" />
        </template>
        背包
      </a-button>
      <ItemTag :data="userState.points" iconColor="text-[var(--point-yellow)]">
        <CircleStackIcon class="w-5 h-5 inline-block mr-1" />
      </ItemTag>
    </div>
    <ShopItemsGrid :data="shopItems" @handleClick="handleClick" />
    <ShopModal ref="modalRef" :selectedItem @handleOk="handleOk" />
    <BackpackModal ref="backpackRef" :userItems />
    <transition name="slide-fade">
      <ResultTip
        v-if="resultVisible"
        @click="resultVisible = false"
        :data="selectedItem"
        :buyNums
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
})
import type { User } from "~/types/user"
import ItemTag from "~/components/shop/ItemTag.vue"
import { CircleStackIcon, BriefcaseIcon } from "@heroicons/vue/24/solid"
import { getShopItems, getUserItems } from "./utils/fetch"
import ResultTip from "~/components/shop/ResultTip.vue"
import BackpackModal from "~/components/backpack/BackpackModal.vue"

const userState = useState<User>("userState")
const shopItems = ref()
const initData = async () => {
  const { data } = await getShopItems()
  shopItems.value = data
}
initData()

const modalRef = ref()
const selectedItem = ref()
const handleClick = (item) => {
  modalRef.value.visible = true
  selectedItem.value = item
}

const backpackRef = ref()
const userItems = ref()
const backpackLoading = ref(false)
const handleBackpackClick = async () => {
  backpackLoading.value = true
  const { data } = await getUserItems()
  userItems.value = data
  backpackRef.value.visible = true
  backpackLoading.value = false
}

const buyNums = ref()
const resultVisible = ref(false)
const handleOk = async (nums) => {
  buyNums.value = nums
  resultVisible.value = true
}

useHead({
  title: "商店",
})
</script>

<style scoped></style>
