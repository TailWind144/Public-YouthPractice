<template>
  <VocabularyAddOrEditModal
    :form
    :rules
    :formItems
    :isEdit="false"
    :title
    ref="addOrEditModalRef"
    @handle-add-or-edit-before-ok="handleAddOrEditBeforeOk"
  >
    <template #extra>
      <a-table
        v-if="isEdit"
        :columns="columns"
        :data="wordsTableData"
        :loading="loading"
        :scroll="{ y: 200 }"
      >
      </a-table>
      <div v-else>
        <a-form-item label="听写单词">
          <a-button
            type="primary"
            @click="() => (importSystemWordsModalRef.visible = true)"
          >
            选择单词
          </a-button>
        </a-form-item>
        <div class="text-[var(--text-info-2)]">
          当前已选择 {{ selectedWords.length }} 个单词
        </div>
      </div>
    </template>
  </VocabularyAddOrEditModal>
  <VocabularyImpotSystemWordsModal
    title="选择听写单词"
    ref="importSystemWordsModalRef"
    :selected="selectedWords"
    @handle-before-ok="handleImportSystemBeforeOk"
  />
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue"
import {
  dictationContent,
  editDictationTask,
  planDictationTask,
} from "~/pages/dictation/utils/fetch"
const { isEdit } = defineProps(["isEdit"])
const emit = defineEmits(["handleAddOrEditOk"])
const title = computed(() => (isEdit ? "编辑听写任务" : "安排听写任务"))

const importSystemWordsModalRef = ref()

const form = ref({
  title: "",
  time: 15,
  maxPlayCount: 3,
})
const rules = {
  title: [{ required: true, message: "请输入任务名称" }],
  time: [{ required: true, message: "请输入限制时间" }],
  grade: [{ required: true, message: "请选择年级" }],
  maxPlayCount: [{ required: true, message: "请输入最大音频播放次数" }],
}
const formItems = computed(() => [
  {
    name: "title",
    label: "任务名称",
    type: "input",
    span: 12,
    props: {
      disabled: isEdit,
      placeholder: "请输入任务名称",
      allowClear: true,
      maxLength: 16,
      showWordLimit: true,
    },
  },
  {
    name: "grade",
    label: "安排年级",
    type: "select",
    span: 12,
    props: {
      options: gradeOptions,
      placeholder: "请选择需要安排该任务的年级",
      allowClear: true,
    },
  },
  {
    name: "time",
    label: "限制时间（分钟）",
    type: "input-number",
    span: 12,
    props: {
      mode: "button",
      step: 1,
      placeholder: "请输入限制时间",
      parser: (value) => {
        return Math.ceil(value)
      },
    },
  },
  {
    name: "maxPlayCount",
    label: "最大音频播放次数",
    type: "input-number",
    span: 12,
    props: {
      mode: "button",
      step: 1,
      placeholder: "请输入最大音频播放次数",
      parser: (value) => {
        return Math.ceil(value)
      },
    },
  },
])

const handleAddOrEditBeforeOk = async (resolve, formRef) => {
  await formRef.value.validate().then(async (err) => {
    if (err) {
      resolve(false)
      return false
    } else {
      if (isEdit) {
        await editDictationTask({
          id: form.value.id,
          grade: form.value.grade,
          time: form.value.time,
          maxPlayCount: form.value.maxPlayCount,
        })
      } else
        await planDictationTask({
          selectedWords: selectedWords.value,
          ...form.value,
        })

      resolve(true)
      Message.success(`${title.value}成功`)
      emit("handleAddOrEditOk")
    }
  })
}

const selectedWords = ref([])
const handleImportSystemBeforeOk = async (resolve, selectedKeys) => {
  selectedWords.value = selectedKeys
  resolve(true)
  return true
}

const loading = ref(false)
const addOrEditModalRef = ref()
const wordsTableData = ref([])
const columns = [
  {
    title: "序号",
    dataIndex: "index",
  },
  {
    title: "单词",
    dataIndex: "word",
  },
]
const showModal = async (
  isEdit,
  data = {
    title: "",
    time: 15,
    maxPlayCount: 3,
  }
) => {
  form.value = data
  selectedWords.value = []
  addOrEditModalRef.value.visible = true
  if (isEdit) {
    loading.value = true
    const { data } = await dictationContent({ id: form.value.id })
    wordsTableData.value = data.data
    loading.value = false
  }
}
defineExpose({ showModal })
</script>

<style scoped></style>
