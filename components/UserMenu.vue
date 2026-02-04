<template>
  <div class="bg-[var(--bg-color-d)]">
    <div class="flex p-3 flex-col gap-4">
      <div class="flex items-center gap-4">
        <a-avatar
          trigger-type="mask"
          class="cursor-pointer"
          :size="52"
          :style="{
            verticalAlign: 'middle',
            backgroundColor: 'var(--text-primary)',
          }"
        >
          <template #trigger-icon>
            <IconEdit />
          </template>
          {{ userState?.nickname }}
        </a-avatar>
        <div>
          <div class="text-[var(--text-primary)] text-xl">
            {{ userState?.nickname }}
          </div>
          <div class="flex items-center gap-1">
            <CircleStackIcon class="w-4 h-4 text-[var(--point-yellow)]" />
            <span>积分: </span>
            <transition name="slide-up">
              <span :key="userState?.points" class="inline-block">{{
                userState?.points
              }}</span>
            </transition>
          </div>
        </div>
      </div>
      <UserLevel />
    </div>
    <div class="user-menu">
      <a-menu mode="vertical">
        <a-sub-menu key="0" @click="() => navigateTo('/user/profile')">
          <template #icon><icon-user /></template>
          <template #expand-icon-down><icon-right /></template>
          <template #title>个人中心</template>
        </a-sub-menu>
        <a-popconfirm
          :position="'left'"
          content="确定退出账号吗？"
          :type="'warning'"
          @ok="handleLogout"
        >
          <a-sub-menu key="1">
            <template #icon><icon-export /></template>
            <template #expand-icon-down><icon-right /></template>
            <template #title>注销</template>
          </a-sub-menu>
        </a-popconfirm>
      </a-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user"
import { CircleStackIcon } from "@heroicons/vue/24/solid"

const userState = useState<User>("userState")

const handleLogout = async () => {
  await c_fetch("/api/logout", {})
  userState.value = null
  return navigateTo("/login")
}
</script>

<style scoped>
.slide-up-leave-active {
  position: absolute;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(0.5rem);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
