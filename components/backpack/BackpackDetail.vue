<template>
  <a-modal v-model:visible="visible" :footer="false">
    <template #title> 详情 </template>
    <div class="flex w-full gap-1">
      <div class="flex flex-col gap-1">
        <div class="aspect-square w-28 h-28">
          <img :src="selectedItem.imgUrl" />
        </div>
        <div class="text-[var(--text-p)] text-center">
          拥有 {{ selectedItem.nums }}
        </div>
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
  </a-modal>
</template>

<script setup lang="ts">
const visible = ref(false)
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

defineExpose({ visible })
</script>

<style scoped></style>
