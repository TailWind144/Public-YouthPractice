<template>
  <div class="flex gap-4">
    <NavItem
      v-for="(item, key) in typeToName"
      :key="key"
      :name="item.name"
      :isActive="type == key"
      @click="handleClick(key)"
    />
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

<style scoped></style>
