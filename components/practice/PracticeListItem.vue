<template>
  <div
    class="group hover:bg-[var(--bg-color-d)] hover:translate-y-[-4px] gap-2 hover:shadow-normal bg-[var(--bg-color)] items-center flex flex-col p-4 rounded-lg cursor-pointer transition duration-300"
  >
    <div class="mr-auto text-base flex items-center gap-2">
      <span
        class="duration-300 text-[var(--text-p)] group-hover:text-[var(--text-primary)]"
        >{{ data.name }}</span
      >
      <span
        v-if="data.passedCount === data.count"
        ref="trophy"
        class="text-[var(--text-yellow)]"
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
    <div class="flex gap-2 items-center mr-auto">
      <div>
        <a-progress
          size="mini"
          :percent="data.passedCount / data.count"
          animation
        />
      </div>
      <div class="text-[var(--text-info)]">
        {{ data.passedCount }}/{{ data.count }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap"
const { data, index } = defineProps(["data", "index"])

const trophy = ref()
const initTrophyAnimate = () => {
  const delayTime = index * 0.1
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
      delay: delayTime,
    }
  )
}

onMounted(() => {
  initTrophyAnimate()
})
</script>

<style scoped></style>
