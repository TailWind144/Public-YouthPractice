<template>
  <a-modal
    class="auto-width-modal"
    v-model:visible="visible"
    @before-open="handleBeforeOpen"
    @before-ok="handleBeforeOk"
    :title
  >
    <div class="flex flex-col">
      <a-form ref="formRef" :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="bookId" label="课本">
              <a-select
                :disabled="isCheckSelect"
                :options="bookOptions"
                v-model="form.bookId"
                placeholder="请选择课本"
                :field-names="{ value: 'id', label: 'title' }"
                allow-search
                :filter-option="handleSearchOption"
                @change="handleBookChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="unit" label="单元">
              <a-select
                :disabled="isCheckSelect"
                :options="unitOptions"
                v-model="form.unit"
                placeholder="请选择单元"
                allow-search
                allow-clear
                :filter-option="handleSearchOption"
                @change="handleUnitChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="section" label="Section">
              <a-select
                :disabled="isCheckSelect"
                :options="sectionOptions"
                v-model="form.section"
                placeholder="请选择 Section"
                allow-search
                allow-clear
                :filter-option="handleSearchOption"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="flex justify-between">
        <a-form-item label="查看当前页你选择的单词">
          <a-switch
            type="round"
            v-model="isCheckSelect"
            @change="handleCheckChange"
          />
        </a-form-item>
        <div class="text-[var(--text-info-2)] shrink-0 leading-8">
          当前已选择 {{ selectedKeys.length }} 个单词
        </div>
      </div>
      <a-table
        :loading
        class="flex"
        :scroll="{ y: 400 }"
        row-key="id"
        :columns="columns"
        :data="list"
        :row-selection="rowSelection"
        v-model:selectedKeys="selectedKeys"
        :pagination="pagination"
        @page-change="handlePageChange"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {
  getBookOptions,
  getSectionsOfUnit,
  getSystemWordList,
  getUnitsOfBook,
} from "~/pages/vocabulary/utils/fetch"
const { title, selected } = defineProps({
  title: String,
  selected: {
    type: Array,
    default: [],
  },
})
const emit = defineEmits(["handleBeforeOk"])

const isCheckSelect = ref(false)
const handleCheckChange = (val) => {
  if (val) {
    const set = new Set(selectedKeys.value)
    list.value = tempList.value.filter((item) => set.has(item.id))
  } else list.value = tempList.value
}

const loading = ref(false)
const form = ref({ bookId: "", unit: "", section: "" })

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
  {
    title: "来源",
    dataIndex: "title",
  },
  {
    title: "单元",
    dataIndex: "unit",
    width: 60,
  },
]

const bookOptions = ref([])
const unitOptions = ref([])
const sectionOptions = ref([])
const initOptions = async () => {
  const { data } = await getBookOptions()
  bookOptions.value = data
  form.value.bookId = data[0]?.id
  handleBookChange(data[0].id)
}
initOptions()
const handleSearchOption = (value, option) => {
  return option.title.includes(value)
}
const handleBookChange = async (value) => {
  page.value = 1
  if (!value) {
    unitOptions.value = []
    sectionOptions.value = []
    return
  }
  const { data } = await getUnitsOfBook({ id: value })
  unitOptions.value = data
  form.value.unit = ""
  form.value.section = ""
}
const handleUnitChange = async (value) => {
  page.value = 1
  if (!value) {
    sectionOptions.value = []
    return
  }
  const { data } = await getSectionsOfUnit({
    id: form.value.bookId,
    unit: value,
  })
  sectionOptions.value = data
  form.value.section = ""
}

const selectedKeys = ref([])
const rowSelection = reactive({
  type: "checkbox",
  showCheckedAll: true,
  onlyCurrent: false,
})
const tempList = ref([])
const list = ref([])
const page = ref(1)
const pageSize = ref(100)
const total = ref(0)
const pagination = computed(() => ({
  current: page.value,
  page: page.value,
  pageSize: pageSize.value,
  total: total.value,
}))
const initListWords = async () => {
  const { data } = await getSystemWordList({
    ...form.value,
    ...pagination.value,
  })
  total.value = data.pagination.total
  tempList.value = data.data
  list.value = data.data
}
const initData = async () => {
  loading.value = true
  await initListWords()
  loading.value = false
}
const handlePageChange = (num) => {
  page.value = num
  initData()
}
watch(form.value, async () => {
  initData()
})

const handleBeforeOpen = () => {
  page.value = 1
  selectedKeys.value = selected
}
const handleBeforeOk = async () => {
  return await new Promise<boolean>((resolve) => {
    emit("handleBeforeOk", resolve, selectedKeys.value)
  })
}

const visible = ref(false)
defineExpose({ visible })
</script>

<style scoped></style>
