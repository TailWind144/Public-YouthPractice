<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <VocabularyDataItem
        v-for="(item, index) in vocabularyDataItems"
        :key="index"
        :class="item.class"
        :title="item.title"
        :value="item.value"
      />
    </div>
    <div
      class="rounded-xl bg-[#e8f3ff]/35 border border-[#165dff]/10 p-5 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="flex gap-2 items-center">
            <Tag
              class="text-xs rounded-full shrink-0 bg-[var(--bg-checked-color)] !text-[var(--text-primary)] !px-2 !py-1"
            >
              进行中
            </Tag>
            <div class="text-lg font-bold text-[var(--text-h1)]">
              {{ data.record.title }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="text-lg font-semibold text-[var(--text-h1)]">
            {{
              (
                (data.masteredSum / data.total +
                  (data.ongoningSum / data.total) * 0.3) *
                100
              ).toFixed(1)
            }}%
          </div>
          <div class="text-xs text-[var(--text-info)]">总进度</div>
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center text-[var(--text-info)]">
          <div>今日复习进度</div>
          <div>
            <span v-if="data.todayReadyToLearnNums">
              {{ data.todayHaveLearnNums }}/{{ data.todayReadyToLearnNums }}
            </span>
            <span v-else>无单词</span>
          </div>
        </div>
        <a-progress
          size="large"
          :percent="
            Number(
              (data.todayHaveLearnNums / data.todayReadyToLearnNums).toFixed(2)
            )
          "
          animation
          :show-text="false"
        />
      </div>
      <div class="flex gap-2 flex-col md:flex-row">
        <IconButton
          v-if="data.record.isSystem"
          class="w-full"
          text="学习新单词"
          size="large"
          @click="handleLearn"
        >
          <icon-play-circle-fill />
        </IconButton>
        <IconButton
          v-else
          class="w-full"
          text="查看词表"
          size="large"
          status="success"
          @click="handleManage"
        >
          <icon-eye />
        </IconButton>
        <IconButton
          class="w-full"
          text="开始复习"
          size="large"
          status="warning"
          @click="handleReview"
        >
          <icon-calendar-clock />
        </IconButton>
      </div>
      <home-vocabulary-learning-list @updateList="handleUpdate" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <home-vocabulary-more-button
        title="更多词库"
        sub-title="查看更多课本词库"
        class="hover:border-[var(--text-primary)]"
        @click="
          () => navigateTo({ path: '/vocabulary/list', query: { key: 1 } })
        "
      >
        <div
          class="text-lg shrink-0 rounded-lg w-10 h-10 flex items-center justify-center bg-[var(--bg-checked-color)] text-[var(--text-primary)]"
        >
          <icon-common />
        </div>
      </home-vocabulary-more-button>
      <home-vocabulary-more-button
        title="词库记录"
        sub-title="查看你不同词库的学习记录"
        class="hover:border-[var(--warn-color)]"
        @click="
          () => navigateTo({ path: '/vocabulary/list', query: { key: 3 } })
        "
      >
        <div
          class="text-lg shrink-0 rounded-lg w-10 h-10 flex items-center justify-center bg-[var(--bg-warn-color)] text-[var(--warn-color)]"
        >
          <icon-clock-circle />
        </div>
      </home-vocabulary-more-button>
    </div>
    <VocabularyBookUnitModal ref="bookModal" :list="unitList" />
  </div>
</template>

<script setup lang="ts">
import { getBookUnitList } from "~/pages/vocabulary/utils/fetch"
import VocabularyDataItem from "./VocabularyDataItem.vue"
const { data } = defineProps(["data"])
const emit = defineEmits(["refresh"])
const handleUpdate = () => {
  emit("refresh")
}
const bookModal = ref()
const vocabularyDataItems = computed(() => [
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
])

const unitList = ref({})
const initUnitList = async (id) => {
  const { data } = await getBookUnitList({ id })
  unitList.value = data
}

const handleLearn = async () => {
  await initUnitList(data.record.id)
  bookModal.value.visible = true
}
const handleReview = () => {
  return navigateTo("/vocabulary/memory")
}
const handleManage = () => {
  return navigateTo({
    path: "/vocabulary/manage",
    query: { list: data.record.book_id },
  })
}
</script>

<style scoped></style>
