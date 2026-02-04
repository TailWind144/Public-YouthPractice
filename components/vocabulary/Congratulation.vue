<template>
  <div class="text-center py-10 flex flex-col gap-4">
    <div class="text-6xl text-primary flex items-center justify-center">
      <TrophyIcon class="w-16 h-16 text-[var(--text-yellow)]" />
    </div>
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <div class="text-2xl font-bold">恭喜完成学习！</div>
        <div class="text-[var(--text-info)] text-base">
          你已经完成了今天所有的单词
        </div>
      </div>
      <div>
        <IconButton text="回到首页" size="large" @click="handleBackHome">
          <icon-home />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrophyIcon } from "@heroicons/vue/24/solid"

const handleBackHome = () => {
  return navigateTo("/home")
}

onMounted(() => realisticFire())
</script>

<style scoped></style>
