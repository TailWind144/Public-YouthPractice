<template>
  <div>
    <WrapperCard class="flex flex-col" title="单词列表" :is-wrap="true">
      <template #icon>
        <icon-list />
      </template>
      <template #operation>
        <div class="flex gap-2 items-center">
          <a-input-search
            :style="{ width: '320px' }"
            placeholder="请输入搜索内容"
            search-button
            @search="handleSearch"
          />
          <IconButton text="新增单词" size="medium" @click="handleAdd">
            <icon-plus />
          </IconButton>
          <IconButton
            text="导入系统词库"
            size="medium"
            status="success"
            @click="handleImportSystem"
          >
            <icon-import />
          </IconButton>
        </div>
      </template>
      <a-table
        class="h-[568px] flex"
        :loading
        :scroll="{ y: 568 }"
        row-key="id"
        :columns="columns"
        :data="words"
        :pagination="pagination"
        @page-change="handlePageChange"
      >
        <template #columns>
          <a-table-column
            v-for="({ title, dataIndex, ellipsis, tooltip }, index) in columns"
            :key="index"
            :title
            :data-index
            :ellipsis
            :tooltip
          />
          <a-table-column title="操作" :width="120">
            <template #cell="{ record }">
              <div class="flex gap-2">
                <a-button
                  class="active:scale-95 scale-100"
                  type="text"
                  size="small"
                  @click="handleEdit(record)"
                >
                  <template #icon>
                    <span class="text-lg text-[var(--warn-color)]">
                      <icon-edit />
                    </span>
                  </template>
                </a-button>
                <a-popconfirm
                  content="正在进行的记录中该单词也会被删除，你确定要删除这个单词吗？"
                  type="warning"
                  :content-style="{ maxWidth: '280px' }"
                  @ok="handleDelete(record)"
                >
                  <a-button
                    class="active:scale-95 scale-100"
                    type="text"
                    size="small"
                  >
                    <template #icon>
                      <span class="text-lg text-[var(--error-color)]">
                        <icon-delete />
                      </span>
                    </template>
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </WrapperCard>
    <vocabulary-add-or-edit-modal
      :form
      :rules
      :formItems
      :isEdit
      ref="addOrEditModalRef"
      @handle-add-or-edit-before-ok="handleAddOrEditBeforeOk"
    >
      <template #tip>
        <div v-if="!isEdit" class="mb-4 text-[var(--text-info)]">
          新增的单词会直接添加进现有的词库记录中
        </div>
      </template>
    </vocabulary-add-or-edit-modal>
    <VocabularyImpotSystemWordsModal
      title="导入系统单词"
      ref="importSystemWordsModalRef"
      @handle-before-ok="handleImportSystemBeforeOk"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue"
import { addOrEditFormItems } from "~/pages/vocabulary/utils/const"
import {
  addCustomWord,
  deleteCustomWord,
  editCustomWord,
  getListWords,
  importSystemWords,
} from "~/pages/vocabulary/utils/fetch"
const emit = defineEmits(["handleAddOrEdit"])

const { id } = defineProps(["id"])
const addOrEditModalRef = ref()

const columns = [
  {
    title: "单词",
    dataIndex: "word",
  },
  {
    title: "音标",
    dataIndex: "symbol",
  },
  {
    title: "释义",
    dataIndex: "bookMeaning",
  },
  {
    title: "例句",
    dataIndex: "example",
    ellipsis: true,
    tooltip: true,
  },
]

const loading = ref(false)
const search = ref("")
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pagination = computed(() => ({
  current: page.value,
  pageSize: pageSize.value,
  total: total.value,
}))
const words = ref([])
const initListWords = async () => {
  loading.value = true
  const { data } = await getListWords({
    id,
    search: search.value,
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  })
  total.value = data.pagination.total
  words.value = data.data
  loading.value = false
}
watchEffect(() => {
  initListWords()
})

const handleSearch = (val) => (search.value = val)
const handlePageChange = (num) => (page.value = num)

const isEdit = ref(false)
const form = ref({})
const rules = {
  word: [{ required: true, message: "请输入单词" }],
  bookMeaning: [{ required: true, message: "请输入单词释义" }],
}
const formItems = computed(() => {
  if (isEdit.value) addOrEditFormItems[0].props.disabled = true
  else addOrEditFormItems[0].props.disabled = false
  return addOrEditFormItems
})
const handleAdd = () => {
  isEdit.value = false
  form.value = {
    word: "",
    bookMeaning: "",
    example: "",
  }
  addOrEditModalRef.value.visible = true
}
const handleEdit = (item) => {
  isEdit.value = true
  form.value = {
    id: item.id,
    word: item.word,
    symbol: item.symbol,
    bookMeaning: item.bookMeaning,
    example: item.example,
  }
  addOrEditModalRef.value.visible = true
}
const handleAddOrEditBeforeOk = async (resolve, formRef, preTitle) => {
  await formRef.value.validate().then(async (err) => {
    if (err) {
      resolve(false)
      return false
    } else {
      if (isEdit.value) editCustomWord({ listId: id, ...form.value })
      else {
        await addCustomWord({ id, ...form.value })
        emit("handleAddOrEdit")
      }

      resolve(true)
      Message.success(`${preTitle.value}成功`)
    }
  })
  initListWords()
}

const handleDelete = async (item) => {
  await deleteCustomWord({ listId: id, id: item.id })
  total.value--
  page.value = Math.min(page.value, Math.ceil(total.value / pageSize.value))
  Message.success("删除成功")
  emit("handleAddOrEdit")
  initListWords()
}

const importSystemWordsModalRef = ref()
const handleImportSystem = () => {
  importSystemWordsModalRef.value.visible = true
}
const handleImportSystemBeforeOk = async (resolve, selectedKeys) => {
  await importSystemWords({ id, wordIds: selectedKeys })

  resolve(true)
  Message.success("导入成功")
  initListWords()
  emit("handleAddOrEdit")
  return true
}
</script>

<style scoped></style>
