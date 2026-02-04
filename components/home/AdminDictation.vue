<template>
  <div class="flex flex-col gap-6">
    <HomePictureContent
      class="h-48"
      button-text="安排！"
      @handel-click="handleClick"
    >
      <div class="text-2xl md:text-3xl font-bold">安排听写任务</div>
    </HomePictureContent>
    <div class="flex flex-col gap-2">
      <div
        class="font-medium flex gap-2 items-center text-[var(--text-p)] text-lg"
      >
        <span class="text-[var(--warn-color)]">
          <icon-history />
        </span>
        <span>听写记录</span>
      </div>
      <HomePlanDictationList
        :list
        :isBottom
        :threshold="200"
        @handle-item-click="handleItemClick"
        @load="handleLoad"
      />
    </div>
  </div>
  <HomePlanDictationModal
    :isEdit
    ref="planModalRef"
    @handle-add-or-edit-ok="handleAddOrEditOk"
  />
</template>

<script setup lang="ts">
import { adminDictationRecord } from "~/pages/home/utils/fetch"

const pagination = ref({
  total: 0,
  page: 1,
  pageSize: 10,
})
const isBottom = computed(() => pagination.value.total === list.value.length)

const isEdit = ref(false)
const planModalRef = ref()
const handleClick = () => {
  isEdit.value = false
  planModalRef.value.showModal(isEdit.value)
}

const list = ref([])
const initData = async (params) => {
  const { data } = await adminDictationRecord(params)
  list.value.push(...data.data)
  pagination.value.total = data.total
}
initData(pagination.value)

const handleLoad = () => {
  pagination.value.page++
  initData(pagination.value)
}

const handleItemClick = (item) => {
  isEdit.value = true
  planModalRef.value.showModal(isEdit.value, item)
}
const handleAddOrEditOk = () => {
  list.value = []
  pagination.value = {
    total: 0,
    page: 1,
    pageSize: 10,
  }
  initData(pagination.value)
}
</script>

<style scoped></style>
