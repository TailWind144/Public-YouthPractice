<template>
  <div
    class="w-full bg-[var(--bg-color-d)] rounded-xl shadow-sm overflow-hidden"
  >
    <div class="bg-gradient-to-r from-blue-500 to-green-500 px-5 py-3">
      <CalendarHeader
        :isCheckin
        :isNextMonthDisabled
        :currentMonth
        :plusPoint
        :plusExp
        @prev-month="prevMonth"
        @next-month="nextMonth"
        @handle-checkin="handleCheckin"
      />
    </div>

    <div class="px-5 py-4">
      <CalendarDayHeader />
      <CalendarDayGrid :calendarDays />
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs"

const isCheckin = ref(false)
const initCheckin = async () => {
  const { data } = await getIsCheckin()
  isCheckin.value = data.isCheckin
}
initCheckin()

const plusPoint = ref()
const plusExp = ref()
const handleCheckin = async () => {
  const { status, data: pointAndExp } = await postCheckin()
  if (status === 200) {
    isCheckin.value = true
    plusPoint.value = pointAndExp.plusPoint
    plusExp.value = pointAndExp.plusExp
    const { data } = await getCheckinList({
      date: currentMonth.value.format("YYYY-MM%"),
    })
    checkinDateList.value = data.map((item) => dayjs(item.checkinDate))
  }
}

dayjs.locale("zh-cn")
const currentMonth = ref(dayjs().startOf("month"))
const selectedDate = ref(null)
const checkinDateList = ref([])
watchEffect(async () => {
  const { data } = await getCheckinList({
    date: currentMonth.value.format("YYYY-MM%"),
  })
  checkinDateList.value = data.map((item) => dayjs(item.checkinDate))
})

const calendarDays = computed(() => {
  const startOfMonth = currentMonth.value.startOf("month")
  const endOfMonth = currentMonth.value.endOf("month")

  // 计算日历开始日期（包含上个月的最后几天）
  const startDay = startOfMonth.subtract((startOfMonth.day() || 7) - 1, "day")

  // 计算日历结束日期（包含下个月的前几天）
  const endDay = endOfMonth.add(6 - (endOfMonth.day() || 7) + 1, "day")

  const days = []
  let currentDay = startDay

  while (currentDay.isBefore(endDay)) {
    days.push({
      day: currentDay.date(),
      date: currentDay,
      isCurrentMonth: currentMonth.value.isSame(currentDay, "month"),
      isToday: currentDay.isSame(dayjs(), "day"),
      isBefore: currentDay.isBefore(dayjs(), "day"),
      isSelected: selectedDate.value?.isSame(currentDay, "day"),
      isCheckin: checkinDateList.value.some((date) =>
        date.isSame(currentDay, "day")
      ),
    })
    currentDay = currentDay.add(1, "day")
  }

  return days
})

const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, "month")
}

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, "month")
}

const isNextMonthDisabled = computed(() => {
  const nextMonth = currentMonth.value.add(1, "month")
  return nextMonth.isAfter(dayjs(), "month")
})

// const selectDate = (date) => {
//   if (!date.isCurrentMonth) return
//   selectedDate.value = date.date
// }
</script>

<style scoped></style>
