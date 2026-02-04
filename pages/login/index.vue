<template>
  <div
    class="flex items-center justify-center min-h-screen bg-[var(--bg-color)]"
  >
    <div
      class="flex gap-2 flex-col justify-center items-center py-8 px-4 md:border md:rounded-lg md:bg-[#fff]"
    >
      <div class="text-[var(--text-primary)] font-semibold text-3xl mb-4">
        YouthPractice
      </div>
      <transition name="slide-fade" mode="out-in">
        <component :is="isLogin ? Login : Register"></component>
      </transition>
      <a-link v-if="isLogin" @click="() => (isLogin = !isLogin)">注册</a-link>
      <a-link v-else @click="() => (isLogin = !isLogin)">登录</a-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
const isLogin = ref(true)

useHead({
  title: "登录",
})
</script>

<style scoped></style>
