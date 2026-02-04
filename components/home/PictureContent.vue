<template>
  <div
    class="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-r from-blue-500 to-[var(--text-primary)]"
  >
    <img
      src="https://picsum.photos/id/20/800/400"
      alt="单词学习插图"
      class="w-full h-full object-cover opacity-40"
    />
    <div
      class="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center gap-3"
    >
      <slot />
      <AnimateButton
        class="bg-[var(--warn-color)]"
        @click="() => emit('handelClick')"
      >
        {{ buttonText }}
      </AnimateButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const { buttonText } = defineProps(["buttonText"])
const emit = defineEmits(["handelClick"])
</script>

<style scoped></style>
