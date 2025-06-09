<template>
  <div>
    <a-popover trigger="click" position="br" @show="handleShow">
      <a-avatar
        class="cursor-pointer"
        :size="32"
        :style="{
          verticalAlign: 'middle',
          backgroundColor: 'var(--text-primary)',
        }"
      >
        {{ text }}
      </a-avatar>
      <template #content>
        <UserMenu :text />
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user"

const text = ref()
const userState = useState<User>("userState")
text.value = userState.value.nickname

const handleShow = async () => {
  const { data } = await getCheck()
  userState.value = data
}
</script>

<style scoped></style>
