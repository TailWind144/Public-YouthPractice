<template>
  <div
    class="rounded-xl border border-[#165dff]/20 bg-white/90 p-5 group cursor-pointer plan-transition-duration hover:-translate-y-1 duration-300 hover:border-[var(--text-primary)] hover:shadow-md hover:shadow-[#165dff]/5"
    @click="() => emit('handleItemClick', data)"
  >
    <div
      class="mb-3 rounded-lg bg-[#e8f3ff]/50 px-3 py-2 duration-500 transition-title group-hover:-translate-y-1 group-hover:scale-105"
    >
      <h3
        class="text-lg font-bold text-[var(--text-h1)] transition-colors duration-300 group-hover:text-[var(--text-primary)]"
      >
        {{ data.title }}
      </h3>
    </div>

    <div class="my-3 h-px bg-[#165dff]/10"></div>

    <div class="flex justify-between items-center">
      <div class="text-[var(--text-info-2)]">
        <span class="text-xs uppercase tracking-wider">创建时间</span>
        <p class="mt-1">{{ data.createTime }}</p>
      </div>
      <div class="text-right">
        <span class="text-xs uppercase tracking-wider text-[var(--text-info)]">
          单词数
        </span>
        <p
          class="mt-1 text-2xl font-bold text-[var(--text-p)] transition-colors duration-300 hover:text-[var(--text-primary)]"
        >
          {{ data.total }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = defineProps(["data"])
const emit = defineEmits(["handleItemClick"])
</script>

<style scoped></style>
