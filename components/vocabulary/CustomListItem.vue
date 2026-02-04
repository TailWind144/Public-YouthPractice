<template>
  <div
    class="bg-[var(--bg-color-d)] flex flex-col rounded-xl overflow-hidden shadow transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
  >
    <div
      class="h-36 bg-gradient-to-r from-neutral-700 to-neutral-900 relative overflow-hidden"
    >
      <span class="text-white/20 text-6xl absolute top-2 right-2">
        <icon-list />
      </span>
      <div class="absolute bottom-4 left-4 text-white flex">
        <div
          class="text-sm font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded"
        >
          自定义
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4 p-5 justify-between flex-1">
      <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <div class="text-lg text-[var(--text-h1)] font-bold">
            {{ data.title }}
          </div>
          <div class="flex gap-1">
            <a-button
              class="active:scale-95 scale-100"
              type="text"
              @click="handleEdit(data)"
            >
              <template #icon>
                <span class="text-xl text-[var(--warn-color)]">
                  <icon-edit />
                </span>
              </template>
            </a-button>
            <a-popconfirm
              content="你确定要删除这个词库吗?"
              type="warning"
              @ok="handleDelete(data.id)"
            >
              <a-button class="active:scale-95 scale-100" type="text">
                <template #icon>
                  <span class="text-xl text-[var(--error-color)]">
                    <icon-delete />
                  </span>
                </template>
              </a-button>
            </a-popconfirm>
          </div>
        </div>
        <div class="text-[var(--text-info)]">{{ data.remark }}</div>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex gap-1 text-[var(--text-info-2)] text-sm">
          <span><icon-history /></span>
          更新于 {{ data.updateTime }}
        </div>
        <a-button
          type="primary"
          status="warning"
          @click="handleManage(data.id)"
        >
          管理单词
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])

const emit = defineEmits(["handleManage", "handleEdit", "handleDelete"])

const handleManage = (id) => {
  emit("handleManage", id)
}
const handleDelete = (id) => {
  emit("handleDelete", id)
}
const handleEdit = (item) => {
  emit("handleEdit", item)
}
</script>

<style scoped></style>
