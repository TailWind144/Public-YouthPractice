<template>
  <a-modal
    v-model:visible="visible"
    :on-before-ok="handleBeforeOk"
    @before-open="handleBeforeOpen"
  >
    <template #title> 兑换 </template>
    <div
      class="flex flex-col justify-center items-center gap-2 text-[var(--text-p)]"
    >
      <div class="flex w-full gap-1">
        <div class="aspect-square w-32 h-32">
          <img :src="selectedItem.imgUrl" />
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <div class="text-base font-semibold">
            {{ selectedItem.name }}
          </div>
          <div class="text-[var(--text-info)] flex-1">
            {{ selectedItem.desc }}
          </div>
        </div>
      </div>
      <ModalButtons
        v-model:buyNums="buyNums"
        :maxNums
        :isNotFulfill
        @handleMin="handleMin"
        @handleMax="handleMax"
        @handleMinus="handleMinus"
        @handlePlus="handlePlus"
      />
      <ItemTag
        :text="'消耗'"
        :data="selectedItem.point * buyNums"
        :iconColor="'text-[var(--point-yellow)]'"
        :textColor="isNotFulfill ? 'text-[var(--error-color)]' : ''"
      >
        <CircleStackIcon class="w-5 h-5 inline-block mr-1" />
      </ItemTag>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue"
import { CircleStackIcon } from "@heroicons/vue/24/solid"
import { buyShopItems } from "~/pages/shop/utils/fetch"
import ItemTag from "./ItemTag.vue"
import ModalButtons from "./ModalButtons.vue"
import type { User } from "~/types/user"

const { selectedItem } = defineProps({
  selectedItem: {
    type: Object,
    default: {
      point: 0,
      name: "",
      desc: "",
      imgUrl: "",
    },
  },
})
const visible = ref(false)
const emit = defineEmits(["handleOk"])

const buyNums = ref(1)
const userState = useState<User>("userState")
const maxNums = computed(
  () => Math.floor(userState.value.points / selectedItem?.point) || 0
)
const isNotFulfill = computed(() => maxNums.value === 0)

const handleMin = () => {
  buyNums.value = 1
}
const handleMax = () => {
  buyNums.value = maxNums.value
}
const handleMinus = () => {
  buyNums.value = --buyNums.value || 1
}
const handlePlus = () => {
  buyNums.value = Math.min(++buyNums.value, maxNums.value)
}

const handleBeforeOpen = () => {
  buyNums.value = 1
}
const handleBeforeOk = async () => {
  if (isNotFulfill.value) {
    Message.error("你的积分不足，无法兑换")
    return false
  }
  const { status } = await buyShopItems({
    id: selectedItem.id,
    nums: buyNums.value,
  })
  const { data } = await getCheck()
  userState.value = data
  if (status === 200) {
    emit("handleOk", buyNums.value)
    return true
  }
}
defineExpose({ visible })
</script>

<style scoped></style>
