<template>
  <div
    class="flex items-center gap-4 p-4 hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary-hover)] duration-300 rounded-lg cursor-pointer"
    :class="{
      'text-[var(--text-primary)] bg-[var(--bg-primary-hover)]': isActive,
    }"
    @click="handleClick"
  >
    <div v-if="isActive"><icon-sound /></div>
    <div v-else class="text-[var(--text-info)]">
      {{ (index + 1).toString().padStart(2, "0") }}
    </div>
    <div class="flex justify-between flex-1 gap-4">
      <div
        class="font-bold text-[var(--text-h1)]"
        :class="{
          'text-[var(--text-primary)]': isActive,
        }"
      >
        {{ data.title }}
      </div>
      <div
        class="text-[var(--text-info)]"
        :class="{
          'text-[var(--text-primary)]': isActive,
        }"
      >
        {{ data.singer }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, index, activeId } = defineProps(["data", "index", "activeId"])
const emit = defineEmits(["handleClick"])

const isActive = computed(() => activeId === data.id)
const handleClick = () => {
  emit("handleClick", { ...data, index })
}
</script>
