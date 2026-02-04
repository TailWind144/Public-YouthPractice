<template>
  <div class="w-[90vw] sm:w-[40vw] h-[50vh] px-4 py-2 flex flex-col gap-4">
    <div class="text-lg text-[var(--text-primary)]">历史记录</div>
    <a-table
      :data="data"
      stripe
      @row-click="handleClick"
      row-class="history-row"
    >
      <template #columns>
        <a-table-column
          title="状态"
          data-index="status"
          :bodyCellStyle="{ color: 'var(--success-color)' }"
        ></a-table-column>
        <a-table-column
          title="得分"
          data-index="score"
          :sortable="{ sortDirections: ['ascend', 'descend'] }"
        ></a-table-column>
        <a-table-column
          title="通关时间"
          data-index="finishTime"
          :sortable="{ sortDirections: ['ascend'] }"
        ></a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
const emit = defineEmits(["rowClick"])

const handleClick = (row) => emit("rowClick", row)
</script>

<style scoped></style>
