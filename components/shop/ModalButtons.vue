<template>
  <div class="flex justify-center gap-2 text-base flex-col items-center">
    <div>
      当前兑换
      <span :class="{ 'text-[var(--error-color)]': isNotFulfill }">
        {{ buyNums }}
      </span>
    </div>
    <div class="flex gap-4">
      <div class="flex gap-2">
        <a-button
          type="primary"
          size="small"
          @click="handleMin"
          :disabled="buyNums === 1"
          >最小</a-button
        >
        <IconButton @click="handleMinus" :disabled="buyNums === 1">
          <icon-minus />
        </IconButton>
      </div>
      <a-slider
        :disabled="isNotFulfill"
        :model-value="buyNums"
        :default-value="1"
        :style="{ width: '230px' }"
        :min="1"
        :max="maxNums"
        @change="updateBuyNums"
      />
      <div class="flex gap-2">
        <IconButton @click="handlePlus" :disabled="buyNums >= maxNums">
          <icon-plus />
        </IconButton>
        <a-button
          type="primary"
          size="small"
          @click="handleMax"
          :disabled="buyNums >= maxNums"
        >
          最大
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { buyNums, maxNums, isNotFulfill } = defineProps([
  "buyNums",
  "maxNums",
  "isNotFulfill",
])
const emit = defineEmits([
  "update:buyNums",
  "handleMin",
  "handleMinus",
  "handlePlus",
  "handleMax",
])

const updateBuyNums = (value) => {
  emit("update:buyNums", value)
}
const handleMin = () => {
  emit("handleMin")
}
const handleMax = () => {
  emit("handleMax")
}
const handleMinus = () => {
  emit("handleMinus")
}
const handlePlus = () => {
  emit("handlePlus")
}
</script>

<style scoped></style>
