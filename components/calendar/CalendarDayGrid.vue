<template>
  <div class="grid grid-cols-7 gap-2">
    <div
      v-for="(date, index) in calendarDays"
      :key="index"
      class="aspect-square relative rounded-xl transition-all duration-200 cursor-pointer group"
      :class="[
        date.isCurrentMonth
          ? 'hover:bg-[var(--bg-info-color-3)] hover:scale-105 hover:shadow-md'
          : 'opacity-30 cursor-default',
        date.isToday &&
          'ring-2 ring-[var(--text-primary-2)] ring-offset-2 ring-offset-white',
        date.isCheckin &&
          'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg',
        !date.isCurrentMonth && 'invisible transition-none',
      ]"
    >
      <div
        class="w-full h-full flex flex-col items-center justify-center relative"
      >
        <!-- Date Number -->
        <span
          class="text-sm font-medium"
          :class="{
            'text-[var(--text-p)]': date.isCurrentMonth && !date.isCheckin,
            'text-[var(--text-info)]': !date.isCurrentMonth,
            'text-[var(--text-white)] font-semibold': date.isCheckin,
            'text-[var(--text-primary)] font-bold':
              date.isToday && !date.isCheckin,
          }"
        >
          {{ date.day }}
        </span>

        <!-- Check-in Icon -->
        <div
          v-if="date.isCheckin"
          class="absolute text-[var(--success-color)] text-xs -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <icon-check />
        </div>

        <!-- Today Indicator -->
        <!-- <div
          v-else-if="date.isToday"
          class="absolute bottom-[2px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--text-primary)] rounded-full"
        /> -->

        <!-- Past Date Indicator -->
        <div
          v-else-if="date.isBefore"
          class="absolute bottom-[2px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--bg-info-color)] rounded-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { calendarDays } = defineProps(["calendarDays"])
</script>

<style scoped></style>
