<template>
  <div class="flex flex-col gap-6">
    <transition name="scale-fade" mode="out-in">
      <a-empty v-if="showList.length === 0"> 暂无听写任务 </a-empty>
      <div
        v-else
        :key="index"
        class="rounded-xl border p-5 flex flex-col gap-4"
        :class="{
          'bg-[#e8f3ff]/35 border-[#165dff]/10': !isRecord,
          'bg-[#e8ffea]/35 border-[#00b42a]/10': isRecord && !isLow,
          'bg-[#fff7e8]/35 border-[#ff7d00]/10': isRecord && isLow,
        }"
      >
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <div class="flex gap-2 items-center">
              <Tag
                class="text-xs rounded-full shrink-0 !px-2 !py-1"
                :class="{
                  'bg-[var(--bg-checked-color)] !text-[var(--text-primary)]':
                    !isRecord,
                  'bg-[var(--bg-success-color)] !text-[var(--level-color-1)]':
                    isRecord && !isLow,
                  'bg-[var(--bg-warn-color)] !text-[var(--warn-color)]':
                    isRecord && isLow,
                }"
              >
                {{ isRecord ? "已完成" : "进行中" }}
              </Tag>
              <div class="text-lg font-bold text-[var(--text-h1)]">
                {{ showList[index]?.title }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2" v-if="showList.length > 1">
            <div class="text-[var(--text-info-2)]">
              {{ index + 1 }} / {{ showList.length }}
            </div>
            <IconButton shape="circle" type="outline" @click="handleNext">
              <icon-right style="stroke-width: 6px" />
            </IconButton>
          </div>
          <div v-if="isRecord" class="flex flex-col items-center">
            <div
              class="text-lg font-semibold"
              :class="{
                'text-[var(--success-color)]': !isLow,
                'text-[var(--warn-color)]': isLow,
              }"
            >
              {{ showList[index]?.score }}分
            </div>
            <div class="text-xs text-[var(--text-info)]">得分</div>
          </div>
          <div v-else class="flex flex-col items-center">
            <div class="text-lg font-semibold text-[var(--text-p)]">
              {{ showList[index]?.total }}个
            </div>
            <div class="text-xs text-[var(--text-info)]">单词数</div>
          </div>
        </div>
        <div class="text-[var(--text-info-2)]">
          <span>
            {{
              isRecord
                ? `完成时间：${showList[index]?.finishTime}`
                : `创建时间：${showList[index]?.createTime}`
            }}
          </span>
        </div>
        <div v-if="!isRecord" class="flex gap-2 md:flex-row">
          <IconButton
            class="flex-1"
            text="开始听写"
            size="large"
            @click="
              () =>
                navigateTo({
                  path: '/dictation',
                  query: { did: showList[index].id },
                })
            "
          >
            <icon-play-circle-fill />
          </IconButton>
        </div>
      </div>
    </transition>
    <div class="flex flex-col gap-2">
      <div
        class="font-medium flex gap-2 items-center text-[var(--text-p)] text-lg"
      >
        <span class="text-[var(--warn-color)]">
          <icon-history />
        </span>
        <span>历史记录</span>
      </div>
      <LevelHistoryList
        :list
        :isBottom
        :threshold="200"
        @handleItemClick="
          (item) =>
            navigateTo({
              path: '/dictation',
              query: { did: item.task_id },
            })
        "
        @load="handleLoad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  unfinishedDictation,
  userDictationRecord,
} from "~/pages/home/utils/fetch"
import type { User } from "~/types/user"
const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 10,
})
const isBottom = computed(() => pagination.value.total === list.value.length)

const showList = ref([])
const index = ref(0)
const list = ref([])
const unfinishList = ref<any[]>([])
const initUnFinishList = async () => {
  const userState = useState<User>("userState")
  const { data } = await unfinishedDictation({
    grade: userState.value.grade,
    teacherId: userState.value.teacherId,
  })
  unfinishList.value = data
}
const initRecordList = async (params) => {
  const { data } = await userDictationRecord(params)
  list.value.push(...data.data)
  pagination.value.total = data.total
}

const isRecord = ref(false)
const isLow = ref(false)
const initData = async () => {
  await Promise.all([
    initUnFinishList(),
    initRecordList({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
    }),
  ])
  if (unfinishList.value.length) showList.value = unfinishList.value
  else if (list.value.length) {
    showList.value = [list.value[0]]
    isRecord.value = true
    isLow.value = list.value[0].score < 80
  }
}
initData()

const handleNext = () => {
  index.value = (index.value + 1) % showList.value.length
}
const handleLoad = () => {
  pagination.value.current++
  initRecordList({
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  })
}
</script>

<style scoped></style>
