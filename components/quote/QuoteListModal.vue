<template>
  <a-drawer
    class="quote-drawer"
    width="auto"
    :footer="false"
    placement="left"
    v-model:visible="visible"
    @before-open="handleBeforeOpen"
  >
    <template #title> 历史句子 </template>
    <div class="flex flex-col items-center gap-4">
      <QuoteList
        ref="listRef"
        :id
        :list
        :pageSize="pagination.pageSize"
        @handleClick="handleQuoteChange"
      />
      <a-pagination
        :total="pagination.total"
        :current="pagination.current"
        :page-size="pagination.pageSize"
        @change="handlePageChange"
      />
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { getQuoteList } from "~/pages/quote/utils/fetch"
const { id } = defineProps(["id"])
const emit = defineEmits(["handleQuoteChange"])

const listRef = ref()
const list = ref()
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 5,
})
const visible = ref(false)
const handlePageChange = async (current) => {
  list.value = []
  pagination.value.current = current
  const { data } = await getQuoteList({
    current,
    pageSize: pagination.value.pageSize,
  })
  list.value = data.data
}

const handleBeforeOpen = async () => {
  list.value = []
  const { data } = await getQuoteList({
    current: pagination.value.current,
    pageSize: pagination.value.pageSize,
  })
  list.value = data.data
  pagination.value.total = data.pagination.total
}
const handleQuoteChange = (id) => {
  emit("handleQuoteChange", id)
  visible.value = false
}
defineExpose({ visible })
</script>

<style scoped></style>
