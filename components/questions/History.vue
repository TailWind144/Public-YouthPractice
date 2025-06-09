<template>
  <div>
    <a-popover trigger="click" position="br">
      <TooltipIconButton :content="'历史记录'"
        ><icon-history
      /></TooltipIconButton>
      <template #content>
        <PopBox :data @row-click="handleClick" />
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import PopBox from "../PopBox.vue"
const { data } = defineProps(["data"])

const handleClick = (row) => {
  useEmit("history-change", row)
}
</script>

<style scoped></style>
