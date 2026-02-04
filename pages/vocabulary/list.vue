<template>
  <div class="flex flex-col gap-3 items-center justify-center">
    <div
      class="font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-[var(--text-h1)]"
    >
      选择单词库
    </div>
    <div class="text-base text-[var(--text-info)]">
      从系统推荐的词库中选择，或使用你自己创建的自定义词库开始学习
    </div>
  </div>
  <div class="vocabulary-tabs">
    <a-tabs
      v-model:active-key="tabKey"
      default-active-key="1"
      size="large"
      class="max-w-3xl mx-auto"
      @change="handleKeyChange"
    >
      <a-tab-pane key="1" title="系统词库" />
      <a-tab-pane key="2" title="自定义词库" />
      <a-tab-pane key="3" title="词库记录" />
    </a-tabs>
  </div>
  <transition appear name="scale-fade" mode="out-in">
    <div :key="tabKey" class="relative">
      <a-spin :loading="loading" tip="加载中" :size="48">
        <VocabularyBookList
          v-if="tabKey === '1'"
          :type="selectType"
          :list
          :isBottom
          @handle-click="handleBookClick"
          @chang-type="handleTypeChange"
        />
        <VocabularyCustomList
          v-if="tabKey === '2'"
          :list
          @handle-add-click="handleAddClick"
          @handle-manage="handleManage"
          @handle-edit="handleCustomEdit"
          @handle-delete="handleCustomDelete"
        />
        <VocabularyRecordList
          v-else-if="tabKey === '3'"
          :list
          @handle-delete="handleRecordDelete"
          @handle-switch="handleRecordSwitch"
        />
      </a-spin>
    </div>
  </transition>
  <AddOrEditModal
    :form
    :rules
    :formItems
    :isEdit
    ref="addOrEditModalRef"
    @handle-add-or-edit-before-ok="handleBeforeOk"
  />
</template>

<script setup lang="ts">
import { Message, Modal } from "@arco-design/web-vue"
import {
  addBookWords,
  addCustom,
  deleteCustom,
  deleteRecord,
  editCustom,
  getBookList,
  getCustomList,
  getRecordList,
  switchRecord,
} from "./utils/fetch"
import AddOrEditModal from "~/components/vocabulary/AddOrEditModal.vue"
const route = useRoute()

const loading = ref(false)
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
})

const addOrEditModalRef = ref()
const tabKey = ref(route.query.key || "1")
const list = ref([])
const initPageList = (cb) => {
  return async function (params = {}) {
    const { data } = await cb(params)
    if (!data.data.length) isBottom.value = true
    list.value.push(...data.data)
    pagination.value.total = data.total
  }
}
const initList = (cb) => {
  return async function () {
    loading.value = true
    const { data } = await cb()
    list.value = data
    loading.value = false
  }
}
const selectType = ref(0)
const initSystemBookList = initPageList(getBookList)
const initCustomList = initList(getCustomList)
const initRecordList = initList(getRecordList)
const initFuncArr = [initSystemBookList, initCustomList, initRecordList]
watchEffect(() => {
  const obj = {
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  }
  if (tabKey.value === "1") obj.type = selectType.value
  initFuncArr[Number(tabKey.value) - 1](obj)
})

const isBottom = computed(() => pagination.value.total === list.value.length)
const scroll = debounce(() => {
  const el = document.documentElement
  if (
    !isBottom.value &&
    el.scrollTop + el.clientHeight >= el.scrollHeight - 200
  )
    pagination.value.current++
}, 500)
watch(
  tabKey,
  () => {
    if (import.meta.server) return
    if (tabKey.value === "1")
      window.addEventListener("scroll", scroll, { passive: true })
    else window.removeEventListener("scroll", scroll)
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  window.removeEventListener("scroll", scroll)
})

// 系统词库
const isNavModal = () => {
  Modal.warning({
    title: "提示",
    content: "已添加该词库到记录，是否跳转到首页开始学习？",
    hideCancel: false,
    simple: false,
    onOk() {
      return navigateTo({
        path: "/home",
      })
    },
  })
}

const handleBookClick = async (item) => {
  await addBookWords({
    bookId: item.id,
  })
  isNavModal()
}

// 词库记录
const handleRecordSwitch = async (id) => {
  await switchRecord({ id })
  await initRecordList()

  Message.success("切换成功")
}
const handleRecordDelete = async (id) => {
  const res = await deleteRecord({ id })
  if (res.status === 200) Message.success("删除成功")

  initRecordList()
}

// 自定义词库
const isEdit = ref(false)
const form = ref({})
const rules = {
  title: [{ required: true, message: "请输入单词库名称" }],
}
const formItems = ref([
  {
    name: "title",
    label: "单词库名称",
    type: "input",
    span: 24,
    props: {
      placeholder: "请输入单词库名称",
      allowClear: true,
      maxLength: 16,
      showWordLimit: true,
    },
  },
  {
    name: "remark",
    label: "描述（可选）",
    type: "textarea",
    span: 24,
    props: {
      placeholder: "简要描述这个单词库的内容和用途",
      allowClear: true,
      maxLength: 50,
      showWordLimit: true,
    },
  },
])
const handleAddClick = () => {
  isEdit.value = false
  form.value = { title: "", remark: "" }
  addOrEditModalRef.value.visible = true
}
const handleCustomEdit = (item) => {
  isEdit.value = true
  addOrEditModalRef.value.visible = true
  form.value = {
    id: item.id,
    title: item.title,
    remark: item.remark,
  }
}
const handleBeforeOk = async (resolve, formRef, preTitle) => {
  await formRef.value.validate().then(async (err) => {
    if (err) {
      resolve(false)
      return false
    } else {
      if (isEdit.value) await editCustom(form.value)
      else await addCustom(form.value)

      resolve(true)
      Message.success(`${preTitle.value}成功`)
    }
  })
  initCustomList()
}
const handleCustomDelete = async (id) => {
  const res = await deleteCustom({ id })
  if (res.status === 200) Message.success("删除成功")

  initCustomList()
}
const handleManage = (id) => {
  return navigateTo({ path: "/vocabulary/manage", query: { list: id } })
}

const handleKeyChange = (val) => {
  list.value = []
  pagination.value = {
    total: 0,
    current: 1,
    pageSize: 10,
  }
  return navigateTo({ path: "/vocabulary/list", query: { key: val } })
}

const handleTypeChange = (val) => {
  selectType.value = val
  list.value = []
  pagination.value = {
    total: 0,
    current: 1,
    pageSize: 10,
  }
}
useHead({
  title: "单词本",
})
</script>

<style scoped></style>
