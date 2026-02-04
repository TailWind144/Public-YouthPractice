<template>
  <a-modal
    class="auto-width-modal"
    v-model:visible="visible"
    :on-before-ok="handleBeforeOk"
    @before-open="handleBeforeOpen"
  >
    <template #title> 选择单元 </template>
    <div class="flex flex-col gap-6">
      <div class="text-[var(--text-info-2)]">
        请选择你想学习的单元，可以多选，完成后点击 "确定" 按钮开始学习
      </div>
      <div class="flex flex-col gap-2">
        <div v-if="isError" class="text-[--error-color]">
          请选择至少一个 Section
        </div>
        <div class="flex flex-col gap-4 overflow-y-auto max-h-96 pr-2">
          <div
            class="rounded-xl flex flex-col bg-gray-50 p-4 shadow-sm gap-3"
            v-for="(data, unit) in list"
            :key="unit"
          >
            <div class="flex flex-col">
              <div class="text-[var(--text-h1)] font-bold text-lg">
                {{ data.title }}
              </div>
              <a-progress :percent="data.percent" animation>
                <template v-slot:text="scope">
                  进度 {{ (data.percent * 100).toFixed(1) }}%
                </template>
              </a-progress>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="(item, index) in data.sections"
                :key="index"
                class="relative bg-[var(--bg-color-d)] cursor-pointer flex flex-col items-center justify-center rounded-xl p-3 border border-[var(--border-color)] hover:border-[var(--text-primary)] duration-300"
                :class="{
                  'border-[var(--text-primary)] !bg-[var(--bg-checked-color)]':
                    selectUnit.get(unit)?.has(item.key),
                  'pointer-events-none border-[var(--success-color)]':
                    item.isFinish,
                }"
                @click="handleItemClick(unit, item.key, item.total)"
              >
                <div class="text-[var(--text-p)] font-medium text-base">
                  {{ item.name }}
                </div>
                <div class="text-[var(--text-info)]">
                  {{ item.total }} 个单词
                </div>
                <div
                  v-if="item.isFinish"
                  class="absolute w-full h-full bg-[#e8ffea]/85 rounded-xl flex items-center justify-center"
                >
                  <span class="text-[var(--success-color)] text-3xl">
                    <icon-check style="stroke-width: 8" />
                  </span>
                </div>
                <div
                  class="absolute top-2 right-2 text-[var(--text-primary)] text-xs flex gap-1 items-center"
                  :class="{ '!text-[var(--success-color)]': item.isFinish }"
                >
                  <span>{{ item.learned }}/{{ item.total }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-[var(--text-p)]">
        已选择：<span class="text-[--text-primary]">{{ total }}</span> 个
        Section，共
        <span class="text-[--text-primary]">{{ totalWordsNums }}</span> 个单词
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
const emit = defineEmits(["handleUnitOk"])

const { list } = defineProps(["list"])
const visible = ref(false)
const selectUnit = ref<any>(new Map())
const total = ref(0)
const totalWordsNums = ref(0)

const handleBeforeOpen = () => {
  selectUnit.value.clear()
  isError.value = false
  total.value = 0
  totalWordsNums.value = 0
}

const handleItemClick = (unit, section, nums) => {
  const sections = selectUnit.value.get(unit)
  if (sections) {
    if (sections.has(section)) {
      sections.delete(section)
      total.value--
      totalWordsNums.value -= nums
    } else {
      sections.add(section)
      total.value++
      totalWordsNums.value += nums
    }
  } else {
    const set = new Set()
    set.add(section)
    total.value++
    totalWordsNums.value += nums
    selectUnit.value.set(unit, set)
  }
}

const isError = ref(false)
const handleBeforeOk = async () => {
  if (!total.value) {
    isError.value = true
    return false
  }

  const obj = {}
  for (const [key, value] of selectUnit.value) obj[key] = Array.from(value)
  const selectedUnitState = useState("selectedUnitState")
  selectedUnitState.value = obj
  await navigateTo("/vocabulary/memory")
}
defineExpose({ visible })
</script>

<style scoped></style>
