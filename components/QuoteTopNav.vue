<template>
  <div class="sticky top-0 z-50 w-full">
    <div
      class="flex items-center sm:px-12 sm:py-8 py-4 transition-all duration-500 ease-in-out"
    >
      <MainHeader
        :icon="IconLeft"
        :subtitle="time"
        :backCb="
          () =>
            historyRef!.length !== 1 ? $router.back() : navigateTo('/learn')
        "
      />
      <TooltipIconButton
        :content="'查看历史句子'"
        :iconColor="'text-[var(--text-white)]'"
        @click="handleClick"
      >
        <CalendarIcon class="w-5 h-5" />
      </TooltipIconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon } from "@heroicons/vue/24/outline"
import { IconLeft } from "@arco-design/web-vue/es/icon"
const { time } = defineProps(["time"])
const historyRef = ref(import.meta.client ? history : null)

const emit = defineEmits(["showListModal"])
const handleClick = () => {
  emit("showListModal")
}
</script>

<style scoped></style>
