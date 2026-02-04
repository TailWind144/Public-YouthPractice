<template>
  <a-modal class="backpack" v-model:visible="visible" :footer="false" fullscreen>
    <template #title> 我的背包 </template>
    <div class="flex gap-8">
      <BackpackSideNav :selectedKind @handleChange="handleChange" />
      <BackpackGrid
        :data="showList"
        class="flex-1"
        @handleClick="handleClick"
      />
      <BackpackDetail ref="backpackDetailRef" :selectedItem />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
const { userItems } = defineProps(["userItems"])
const visible = ref(false)

const selectedKind = ref("道具")
const selectedItem = ref()
const showList = computed(() => userItems?.[selectedKind.value])

const handleChange = (kind) => {
  selectedKind.value = kind
}

const backpackDetailRef = ref()
const handleClick = (item) => {
  selectedItem.value = item
  backpackDetailRef.value.visible = true
}

defineExpose({ visible })
</script>

<style scoped></style>
