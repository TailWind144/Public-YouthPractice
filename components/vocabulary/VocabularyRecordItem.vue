<template>
  <div
    class="flex border border-[var(--border-color)] rounded-xl bg-[var(--bg-color-d)] shadow hover:shadow-xl hover:-translate-y-1 relative duration-300"
    :class="{
      'ring-2 ring-[var(--text-primary-2)]': index === 0,
    }"
  >
    <div
      class="absolute right-0 text-[var(--text-white)] bg-[var(--text-primary-2)] px-2 py-1 rounded-tr-xl rounded-bl-xl"
      v-if="index === 0"
    >
      进行中
    </div>
    <div v-if="data.cover" class="w-[200px] h-[276px] hidden sm:block">
      <a-image
        width="100%"
        height="100%"
        class="!rounded-l-xl record-img"
        :src="`${ossBaseURL}${data.cover}`"
      />
    </div>
    <div class="p-6 flex flex-col gap-4 flex-1">
      <div
        class="flex flex-col sm:flex-row justify-between sm:items-center gap-1"
      >
        <div class="text-xl font-bold text-[var(--text-h1)]">
          {{ data.title }}
        </div>
        <div class="text-[var(--text-info-2)]">
          上一次学习：{{ data.update_time }}
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center text-[var(--text-info)]">
          <div>学习进度</div>
          <div>{{ percent }}%</div>
        </div>
        <a-progress
          size="large"
          :percent="Number(percent) / 100"
          animation
          :show-text="false"
        />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
        <VocabularyDataItem
          v-for="(item, index) in vocabularyDataItems"
          :key="index"
          :class="item.class"
          :title="item.title"
          :value="item.value"
        />
      </div>
      <div class="flex gap-2">
        <IconButton
          class="flex-1"
          text="切换词库"
          size="large"
          @click="() => emit('handleSwitch', data.id)"
        >
          <icon-swap />
        </IconButton>
        <a-popconfirm
          content="你确定要删除这个记录吗?"
          type="warning"
          @ok="handleDelete(data.id)"
        >
          <IconButton
            class="flex-1"
            text="删除记录"
            size="large"
            type="secondary"
            status="danger"
          >
            <icon-delete />
          </IconButton>
        </a-popconfirm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VocabularyDataItem from "../home/VocabularyDataItem.vue"
const { data, index } = defineProps(["data", "index"])
const emit = defineEmits(["handleSwitch", "handleDelete"])

const percent = computed(() =>
  (
    (data.masteredSum / data.total + (data.ongoningSum / data.total) * 0.3) *
    100
  ).toFixed(1)
)

const vocabularyDataItems = [
  {
    class: "bg-[var(--bg-checked-color)] text-[var(--text-primary)]",
    title: "总单词数",
    value: data.total,
  },
  {
    class: "bg-[var(--bg-success-color)] text-[var(--success-color)]",
    title: "已掌握",
    value: data.masteredSum,
  },
  {
    class: "bg-[var(--bg-warn-color)] text-[var(--warn-color)]",
    title: "进行中",
    value: data.ongoningSum,
  },
  {
    class: "bg-[var(--bg-error-color)] text-[var(--error-color)]",
    title: "未学习",
    value: data.notLearnSum,
  },
]

const handleDelete = (id) => {
  emit("handleDelete", id)
}
</script>

<style scoped></style>
