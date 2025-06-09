<template>
  <div class="flex flex-col">
    <LevelNode
      v-for="(node, index) in levels"
      :key="index"
      :data="node"
      :index
      @click="handleClick(node.id, node.disable)"
    />
  </div>
</template>

<script setup lang="ts">
import LevelNode from "./LevelNode.vue"
const emit = defineEmits(["nodeClick"])
const { levels } = defineProps(["levels"])

const handleClick = (id, isDisable) => {
  if (!isDisable) emit("nodeClick", id)
}
</script>

<style scoped></style>
