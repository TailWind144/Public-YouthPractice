<template>
  <WrapperCard title="听写" text="large">
    <template #icon>
      <icon-customer-service />
    </template>
    <template #operation>
      <TooltipIconButton
        :content="'切换'"
        position="top"
        @click="() => emit('swap', false)"
      >
        <icon-swap />
      </TooltipIconButton>
    </template>

    <HomeAdminDictation v-if="isAdmin" />
    <HomeUserDictation v-else />
  </WrapperCard>
</template>

<script setup lang="ts">
import type { User } from "~/types/user"
const emit = defineEmits(["swap"])

const userState = useState<User>("userState")
const isAdmin = computed(() => userState.value.role === 2)
</script>

<style scoped></style>
