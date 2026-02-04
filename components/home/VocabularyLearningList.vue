<template>
  <div class="max-h-[160px] overflow-y-auto px-1">
    <transition name="scale-fade" mode="out-in">
      <a-skeleton v-if="!list.length">
        <a-skeleton-line :rows="1" :line-height="50" />
      </a-skeleton>
      <a-spin v-else :loading>
        <div class="flex flex-col gap-2 relative">
          <transition-group name="list">
            <div
              v-for="data in list"
              :key="data.id"
              class="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-color-d)] hover:border-[var(--text-primary)] duration-300"
            >
              <div
                class="flex flex-1 cursor-pointer"
                @click="() => handleSwitch(data.id)"
              >
                <div class="flex text-sm items-center min-w-0 gap-2">
                  <span class="truncate font-medium text-[var(--text-h1)]">
                    {{ data.title }}
                  </span>
                  <span
                    v-if="data.isCurrent"
                    class="text-xs px-2 py-1 bg-[var(--bg-checked-color)] text-[var(--text-primary)] rounded-full shrink-0"
                  >
                    当前
                  </span>
                </div>
                <div
                  class="flex gap-4 flex-1 font-medium justify-end items-center"
                >
                  <span
                    v-if="data.reviewCount > 0"
                    class="w-15 text-[var(--warn-color)]"
                  >
                    {{ data.reviewCount }}
                  </span>
                  <span v-else class="w-15 text-[var(--success-color)]">
                    已复习
                  </span>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </a-spin>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { getRecordList, switchRecord } from "~/pages/vocabulary/utils/fetch"

interface LearningRecord {
  id: number
  title: string
  reviewCount: number
  isCurrent?: boolean
}

const currentRecordId = ref()
const list = ref<LearningRecord[]>([])
const loading = ref(false)
const emit = defineEmits(["updateList"])

const fetchLearningRecords = async () => {
  loading.value = true
  const { data } = await getRecordList()
  currentRecordId.value = data[0].id

  const updatedList = data.map((record: any) => {
    return {
      id: record.id,
      title: record.title,
      reviewCount: record.reviewCount || 0,
      isCurrent: record.id === currentRecordId.value,
    }
  })
  list.value = updatedList
  loading.value = false
}

const handleSwitch = async (id) => {
  if (id === currentRecordId.value) return
  await switchRecord({ id })
  emit("updateList")
  await fetchLearningRecords()
}

fetchLearningRecords()
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
