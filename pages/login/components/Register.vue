<template>
  <div class="w-[90vw] md:w-[45vw] xl:w-[30vw]">
    <a-form
      ref="formRef"
      :model="form"
      auto-label-width
      :rules="rules"
      :label-col-props="{ span: 0 }"
      @submit-success="handleSubmit"
    >
      <a-form-item field="username">
        <a-input
          v-model="form.username"
          size="large"
          placeholder="请输入用户名"
          allow-clear
          ><template #prefix> <icon-user /> </template
        ></a-input>
      </a-form-item>
      <a-form-item field="password">
        <a-input-password
          size="large"
          v-model="form.password"
          v-model:visibility="visibility"
          placeholder="请输入密码"
          :defaultVisibility="false"
          allow-clear
          ><template #prefix> <icon-lock /> </template>
        </a-input-password>
      </a-form-item>
      <a-form-item field="rePassword">
        <a-input-password
          size="large"
          v-model="form.rePassword"
          v-model:visibility="visibility"
          placeholder="请确认密码"
          :defaultVisibility="false"
          allow-clear
          ><template #prefix> <icon-lock /> </template>
        </a-input-password>
      </a-form-item>
      <a-form-item field="isRead">
        <a-checkbox v-model="form.isRead"> 我已阅读并同意 </a-checkbox
        ><a-link>用户协议</a-link>
      </a-form-item>
      <a-form-item style="margin-top: 0.5rem">
        <a-button
          html-type="submit"
          type="primary"
          long
          size="large"
          :status="btnStatus"
          >注册</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { register } from "../utils/fetch"
import { Message } from "@arco-design/web-vue"
const btnStatus = ref<"normal" | "success" | "warning" | "danger">("normal")
const formRef = ref()
const form = reactive({
  username: "",
  password: "",
  rePassword: "",
  isRead: false,
})
const visibility = ref(true)

const rules = {
  username: [
    {
      required: true,
      message: "用户名未输入",
    },
    {
      minLength: 4,
      message: "用户名需要至少4位",
    },
  ],
  password: [
    {
      required: true,
      message: "密码未输入",
    },
    {
      minLength: 6,
      message: "密码需要至少6位",
    },
    {
      match: /^(?=.*[a-z])(?=.*\d)[a-z\d]+$/,
      message: "密码至少需要由小写字母和数字构成",
    },
  ],
  rePassword: [
    {
      validator: (value, cb) => {
        if (value !== form.password) cb("两次密码不一致")
      },
    },
  ],
  isRead: [
    {
      type: "boolean",
      true: true,
      message: "请阅读并同意用户协议",
    },
  ],
}

const handleSubmit = async (values) => {
  const { username, password } = values
  const res = await register({ username, password })
  if (res.status === 200) {
    Message.success("注册成功")
    btnStatus.value = "success"
    formRef.value.resetFields()
  } else btnStatus.value = "danger"
}
</script>

<style scoped></style>
