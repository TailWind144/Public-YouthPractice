<template>
  <div class="grid grid-cols-normal2 gap-2">
    <div
      class="duration-300 rounded-lg border flex items-center justify-center cursor-pointer hover:translate-y-[-4px]"
      v-for="(item, index) in data"
      :key="index"
      @click="handleClick(item)"
    >
      <div
        class="w-32 h-32 flex-1 relative bg-cover bg-no-repeat bg-center"
        :style="`background-image: url('${item.imgUrl}');`"
      >
        <div
          class="text-base absolute bg-black/40 backdrop-blur-sm text-center p-2 bottom-0 text-[var(--text-white)] w-full rounded-b-lg"
        >
          {{ item.nums }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
const emit = defineEmits(["handleClick"])

const handleClick = (item) => {
  emit("handleClick", item)
}
</script>

<style scoped></style>
