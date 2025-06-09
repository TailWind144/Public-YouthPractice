<template>
  <div class="grid grid-cols-7 gap-1">
    <!-- @click="selectDate(date)" -->
    <!-- date.isSelected && '!bg-[var(--text-primary)] text-[var(--text-white)]' -->
    <div
      v-for="(date, index) in calendarDays"
      :key="index"
      class="aspect-square relative rounded-full transition-colors cursor-pointer"
      :class="[
        date.isCurrentMonth
          ? 'hover:bg-[var(--bg-checked-color)] text-[var(--text-p)]'
          : 'text-[var(--text-info)] invisible',
        date.isToday && 'font-semibold text-[var(--text-primary)]',
        date.isCheckin && '!bg-[var(--success-color)] text-[var(--text-white)]',
      ]"
    >
      <div class="w-full h-full flex items-center justify-center">
        {{ date.day }}
        <div
          v-if="date.isCheckin"
          class="text-[var(--text-white)] absolute bottom-[-7px] translate-x-[2px] scale-75"
        >
          <icon-check />
        </div>
        <div
          v-else="date.isToday"
          class="absolute bottom-[3px] w-1 h-1 rounded-full"
          :class="{
            'bg-[var(--text-primary)]': date.isToday,
            'bg-[var(--error-color)]': date.isBefore,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { calendarDays } = defineProps(["calendarDays"])
</script>

<style scoped></style>
