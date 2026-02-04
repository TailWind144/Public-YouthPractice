<template>
  <a-modal
    v-model:visible="visible"
    :title="title || `${preTitle}单词`"
    @before-ok="handleBeforeOk"
    @before-close="() => formRef.clearValidate()"
  >
    <slot name="tip" />
    <a-form ref="formRef" :model="form" layout="vertical" :rules>
      <a-row :gutter="16">
        <a-col
          :span="item.span"
          v-for="(item, index) in formItems"
          :key="index"
        >
          <a-form-item :field="item.name" :label="item.label">
            <component
              :is="components[item.type]"
              v-model="form[item.name]"
              v-bind="item.props || {}"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <slot name="extra" />
  </a-modal>
</template>

<script setup lang="ts">
import { Input, Select, Textarea, InputNumber } from "@arco-design/web-vue"
const emit = defineEmits(["handleAddOrEditBeforeOk"])
const { isEdit, form, rules, formItems, title } = defineProps({
  isEdit: Boolean,
  form: Object,
  rules: Object,
  formItems: Array,
  title: {
    type: String,
    default: "",
  },
})
const preTitle = computed(() => (isEdit ? "编辑" : "新增"))

const components = {
  input: Input,
  textarea: Textarea,
  select: Select,
  "input-number": InputNumber,
}

const formRef = ref()
const visible = ref(false)
const handleBeforeOk = async () => {
  return await new Promise<boolean>((resolve) => {
    emit("handleAddOrEditBeforeOk", resolve, formRef, preTitle)
  })
}
defineExpose({ visible })
</script>

<style scoped></style>
