<template>
  <div>
    <div v-if="list.length" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <vocabulary-record-item
        v-for="(data, index) in list"
        :key="data.id"
        :data
        :index
        @handle-switch="handleSwitch"
        @handle-delete="handleDelete"
      />
    </div>
    <a-empty v-else />
  </div>
</template>

<script setup lang="ts">
const { list } = defineProps(["list"])
const emit = defineEmits(["handleSwitch", "handleDelete"])

const handleSwitch = (id) => {
  emit("handleSwitch", id)
}
const handleDelete = (id) => {
  emit("handleDelete", id)
}
</script>

<style scoped></style>
