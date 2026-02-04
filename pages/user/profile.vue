<template>
  <div class="flex flex-col flex-1 gap-10">
    <div class="font-bold text-[var(--text-h1)] text-2xl">个人资料</div>
    <div class="grid grid-cols-3 gap-6">
      <a-form
        ref="formRef"
        class="col-span-2"
        :model="form"
        :rules
        :label-col-props="{ span: 3 }"
        size="large"
        @submit="handleSubmit"
      >
        <a-form-item field="nickname" label="昵称" hide-asterisk>
          <a-input v-model="form.nickname" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item field="grade" label="年级" hide-asterisk>
          <a-select
            v-model="form.grade"
            placeholder="请选择年级"
            :options="gradeOptions"
          >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">保存</a-button>
        </a-form-item>
      </a-form>
      <div class="flex items-center justify-start flex-col gap-4">
        <a-avatar
          :size="128"
          :style="{
            verticalAlign: 'middle',
            backgroundColor: 'var(--text-primary)',
          }"
        >
          {{ form.nickname }}
        </a-avatar>
        <div class="text-[var(--text-info)] text-base">暂不支持修改头像</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user"
import { editUserInfo } from "./utils/fetch"
import { Message } from "@arco-design/web-vue"

const userState = useState<User>("userState")
const form = ref<User>({ ...userState.value })
const rules = {
  nickname: [{ required: true, message: "请输入昵称" }],
  grade: [{ required: true, message: "请选择你的年级" }],
}

const formRef = ref()
const handleSubmit = async () => {
  formRef.value.validate().then(async (res) => {
    if (res) return
    try {
      const params = { nickname: form.value.nickname, grade: form.value.grade }
      await editUserInfo(params)
      userState.value.nickname = params.nickname
      userState.value.grade = params.grade
      Message.success("修改成功")
    } catch (error) {
      console.log(error)
    }
  })
}
</script>

<style scoped></style>
