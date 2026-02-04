<template>
  <div
    class="group border border-gray-100 hover:shadow-xl hover:-translate-y-1 gap-3 bg-[var(--bg-color-d)] items-center flex flex-col p-5 rounded-lg cursor-pointer transition duration-300"
  >
    <div class="flex w-full items-center justify-between">
      <div class="flex text-lg items-center gap-1 w-full">
        <span
          class="duration-300 font-semibold text-[var(--text-p)] group-hover:text-[var(--text-primary)]"
          >{{ data.name }}</span
        >
        <span
          v-if="isCompleted"
          ref="trophy"
          class="text-[var(--text-yellow)] ml-1"
        >
          <icon-trophy />
        </span>
        <div
          v-else
          class="text-[var(--text-primary)] duration-300 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0"
        >
          <icon-right style="stroke-width: 5" />
        </div>
      </div>
      <transition appear name="scale-x">
        <Tag
          class="text-xs rounded-full shrink-0"
          :class="{
            'bg-[var(--bg-checked-color)] !text-[var(--text-primary)]':
              !isCompleted,
            'bg-[var(--bg-success-color)] !text-[var(--level-color-1)]':
              isCompleted,
          }"
        >
          {{ isCompleted ? "已完成" : "进行中" }}
        </Tag>
      </transition>
    </div>
    <div class="flex w-full text-[var(--text-info)] justify-between">
      <div class="flex gap-1">
        <div><icon-clock-circle /></div>
        <div>预计耗时：20分钟</div>
      </div>
      <div class="flex gap-2 items-center">
        <div>
          <a-progress
            size="mini"
            :percent="data.passedCount / data.count"
            animation
          />
        </div>
        <div>{{ data.passedCount }}/{{ data.count }}</div>
      </div>
    </div>
    <IconButton
      class="w-full"
      :text="isCompleted ? '重新练习' : '开始练习'"
      size="large"
      type="secondary"
      :status="isCompleted ? 'normal' : 'warning'"
      @click="emit('handleClick')"
    >
      <icon-refresh v-if="isCompleted" />
      <icon-play-arrow-fill v-else />
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap"
const { data, index } = defineProps(["data", "index"])
const emit = defineEmits(["handleClick"])

const isCompleted = computed(() => data.passedCount === data.count)
const trophy = ref()
const initTrophyAnimate = () => {
  // const delayTime = index * 0.1
  gsap.fromTo(
    trophy.value,
    {
      opacity: 0,
      scale: 2,
    },
    {
      opacity: 1,
      scale: 1.2,
      duration: 0.4,
      delay: 0.2,
    }
  )
}

onMounted(() => {
  initTrophyAnimate()
})
</script>

<style scoped></style>
