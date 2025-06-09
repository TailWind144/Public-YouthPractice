<template>
  <div class="bg-[#e8f3ff] rounded-t-xl">
    <div class="flex">
      <div
        class="flex-1 bg-transparent rounded-t-xl"
        :class="{
          '!bg-[var(--bg-color-d)]':
            type == Number(key) + 1 || type == Number(key) - 1,
        }"
        v-for="(item, key) in typeToName"
        :key="key"
        @click="handleClick(key)"
      >
        <div
          class="media-tag duration-300 p-4 text-center bg-[#e8f3ff] text-xl rounded-t-xl text-[var(--text-card)] hover:text-[var(--text-primary)] font-semibold cursor-pointer"
          :class="{
            'bg-[var(--bg-color-d)] text-[var(--text-primary)] ': type == key,
            'active-left': type == Number(key) + 1,
            'active-right': type == Number(key) - 1,
          }"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { typeToName } from "~/pages/game/utils/const"
const { type } = defineProps(["type"])
const emit = defineEmits(["changeType"])

const handleClick = (key) => {
  emit("changeType", key)
}
</script>

<style scoped>
.media-tag:last-child {
  border-top-right-radius: 12px;
}
.active-left {
  border-bottom-right-radius: 12px;
}
.active-right {
  border-bottom-left-radius: 12px;
}
</style>
