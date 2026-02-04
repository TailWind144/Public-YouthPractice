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
          :loading="loading"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { login } from "../utils/fetch"
import type { User } from "~/types/user"
const formRef = ref()
const form = reactive({ username: "", password: "", isRead: false })
const visibility = ref(true)

const rules = {
  username: [
    {
      required: true,
      message: "用户名未输入",
    },
  ],
  password: [
    {
      required: true,
      message: "密码未输入",
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

const loading = ref(false)
const config = useRuntimeConfig()
const handleSubmit = async (values) => {
  loading.value = true
  try {
    const { username, password } = values
    const res = await login({ username, password })
    if (res.status === 200) {
      const userState = useState<User>("userState", () => ({
        ...res.data,
      }))
      navigateTo(config.public.homeBase)
    }
  } catch (error) {
    loading.value = false
  }
}
</script>

<style scoped></style>
