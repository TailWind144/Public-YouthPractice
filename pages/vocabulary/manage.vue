<template>
  <div class="flex justify-between">
    <div class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[var(--text-h1)]">
      管理单词库
    </div>
    <div>
      <IconButton
        text="返回"
        size="medium"
        @click="
          () => navigateTo({ path: '/vocabulary/list', query: { key: 2 } })
        "
      >
        <icon-left-circle />
      </IconButton>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
    <vocabulary-manage-side
      class="lg:col-span-1"
      :data="listInfo"
      @handle-start="handleStart"
    />
    <vocabulary-manage-table
      class="lg:col-span-3"
      :id="listId"
      @handle-add-or-edit="handleAddOrEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { addBookWords, getListInfo } from "./utils/fetch"

definePageMeta({
  validate: async (route) => {
    return (
      typeof route.query.list === "string" && /^\d+$/.test(route.query.list)
    )
  },
})
const route = useRoute()
const { list: listId } = route.query

const listInfo = ref({})
const initListInfo = async () => {
  const { data } = await getListInfo({ id: listId })
  listInfo.value = data
}

initListInfo()

const handleAddOrEdit = () => initListInfo()
const handleStart = async (id) => {
  await addBookWords({
    bookId: id,
  }).then(() => {
    navigateTo({
      path: "/vocabulary/memory",
    })
  })
}
</script>

<style scoped></style>
