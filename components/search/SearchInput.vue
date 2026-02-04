<template>
  <input
    ref="inputRef"
    @input="(e) => emit('input', e)"
    class="w-full rounded-md border-0 placeholder:text-[var(--text-info)] text-base focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors px-2.5 py-1.5 gap-1.5 text-[var(--text-h1)] bg-transparent ps-9 pe-9"
    type="text"
    placeholder="输入你想搜索的单词"
  />
</template>

<script setup lang="ts">
const inputRef = ref()
const emit = defineEmits(["input"])
onMounted(() => {
  inputRef.value.focus()
})
</script>

<style scoped></style>
