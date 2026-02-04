<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      class="border-2 border-dashed border-[var(--border-color)] rounded-xl p-5 flex flex-col items-center justify-center min-h-[280px] hover:border-[var(--text-primary)] hover:bg-[var(--bg-primary-hover)] transition-all duration-300 cursor-pointer group"
      @click="() => emit('handleAddClick')"
    >
      <div class="flex flex-col gap-4 items-center">
        <div
          class="text-2xl h-16 w-16 rounded-full bg-[#165dff]/10 flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--text-white)] transition-all duration-300"
        >
          <icon-plus style="stroke-width: 8" />
        </div>
        <div class="flex flex-col gap-2 justify-center items-center">
          <div
            class="text-[var(--text-p)] group-hover:text-[var(--text-primary)] duration-300 font-bold text-lg"
          >
            创建新单词库
          </div>
          <div
            class="text-[var(--text-info)] max-w-[200px] text-center text-sm"
          >
            自定义你的专属单词库，添加需要记忆的词汇
          </div>
        </div>
      </div>
    </div>
    <vocabulary-custom-list-item
      v-for="(data, index) in list"
      :key="index"
      :data
      @handle-manage="(id) => emit('handleManage', id)"
      @handle-edit="(item) => emit('handleEdit', item)"
      @handle-delete="(id) => emit('handleDelete', id)"
    />
  </div>
</template>

<script setup lang="ts">
const { list } = defineProps(["list"])

const emit = defineEmits([
  "handleAddClick",
  "handleManage",
  "handleEdit",
  "handleDelete",
])
</script>

<style scoped></style>
