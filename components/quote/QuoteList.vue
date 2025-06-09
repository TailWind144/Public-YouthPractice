<template>
  <div class="w-full sm:w-96">
    <QuoteSkeleton :rows="pageSize" v-if="!list?.length" />
    <div v-else class="flex flex-col gap-4">
      <QuoteListItem
        v-for="(item, index) in list"
        :id
        :key="index"
        :data="item"
        @click="handleClick(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { list, pageSize, id } = defineProps(["list", "pageSize", "id"])
const emit = defineEmits(["handleClick"])
const handleClick = (id) => {
  emit("handleClick", id)
}
</script>

<style scoped></style>
