<template>
  <div class="text-base">
    <div class="flex gap-3" v-if="!isOperated">
      <vocabulary-operation-item
        class="error-shadow text-[var(--error-color)] border border-[var(--error-color)] bg-[var(--bg-error-color)]"
        text="不认识"
        @click="clickIsRemember(false)"
      >
        <icon-close style="stroke-width: 8" />
      </vocabulary-operation-item>
      <vocabulary-operation-item
        class="success-shadow text-[var(--success-color)] border border-[var(--success-color)] bg-[var(--bg-success-color)]"
        text="认识"
        @click="clickIsRemember(true)"
      >
        <icon-check style="stroke-width: 8" />
      </vocabulary-operation-item>
    </div>
    <div class="flex" v-else>
      <vocabulary-operation-item
        class="flex-row-reverse text-[var(--text-white)] bg-[var(--text-primary)]"
        text="下一个单词"
        @click="clickNextWord"
      >
        <icon-arrow-right style="stroke-width: 8" />
      </vocabulary-operation-item>
    </div>
  </div>
</template>

<script setup lang="ts">
const { id, index } = defineProps(["id", "index"])
const emit = defineEmits(["clickIsRemember", "clickNextWord"])

const isOperated = ref(false)
const clickIsRemember = (isRemember) => {
  if (index !== 0) return

  isOperated.value = true
  emit("clickIsRemember", id, isRemember)
}
const clickNextWord = () => {
  if (index !== 0) return

  emit("clickNextWord")
  isOperated.value = false
}
</script>

<style scoped>
.error-shadow:hover {
  box-shadow: 0 10px 25px -5px rgba(245, 63, 63, 0.2),
    0 8px 10px -6px rgba(245, 63, 63, 0.1);
}
.success-shadow:hover {
  box-shadow: 0 10px 25px -5px rgba(35, 195, 67, 0.2),
    0 8px 10px -6px rgba(35, 195, 67, 0.1);
}
</style>
