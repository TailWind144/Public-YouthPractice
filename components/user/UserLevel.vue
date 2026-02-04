<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center gap-1">
      <Tag :text :class="`level-color-${l} scale-75 rounded-sm`">{{
        level
      }}</Tag>
      <a-progress
        :size="size"
        :percent="levelObj.percent"
        animation
        :show-text="false"
        :color="{
          '0%': '#e5e6eb',
          '100%': `var(--level-color-${nextl})`,
        }"
      />
      <Tag :text :class="`level-color-${nextl} scale-75 rounded-sm`">{{
        nextlevel
      }}</Tag>
    </div>
    <div v-if="isShowText" class="text-[var(--text-info)] text-center">
      当前经验值{{ userState.experience }}，距离下一等级还需要{{
        levelObj.nextNeedExp
      }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user"

const { isShowText, size } = defineProps({
  isShowText: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: "small",
  },
  text: {
    type: String,
    default: "small",
  },
})

const userState = useState<User>("userState")
const l = computed(() => getLevelColor(userState.value.level))
const nextl = computed(() => getLevelColor(userState.value.level + 1))
const level = computed(() => `Lv.${userState.value.level}`)
const nextlevel = computed(() => `Lv.${userState.value.level + 1}`)
const levelObj = computed(() =>
  getLevelPercentAndNextNeedExp(
    userState.value.level,
    userState.value.experience
  )
)

const getLevelColor = (curLevel) => {
  const res = Math.ceil(curLevel / 5) + (curLevel % 5 === 0 ? 1 : 0)
  return Math.min(res, 6)
}

const getLevelPercentAndNextNeedExp = (curLevel, userExperience) => {
  const x = curLevel % 10
  const y = Math.min(Math.floor(curLevel / 10), 3)
  const curExp = expArr[y]
  let exp = (x + (y === 0 ? -1 : 0)) * curExp

  for (let i = 0; i < y; i++) {
    exp += expArr[i] * (9 + (i === 0 ? 0 : 1))
  }

  const now = userExperience - exp
  return { percent: now / curExp, nextNeedExp: curExp - now }
}
</script>

<style scoped>
.level-color-1 {
  background-color: var(--level-color-1);
}
.level-color-2 {
  background-color: var(--level-color-2);
}
.level-color-3 {
  background-color: var(--level-color-3);
}
.level-color-4 {
  background-color: var(--level-color-4);
}
.level-color-5 {
  background-color: var(--level-color-5);
}
.level-color-6 {
  background-color: var(--level-color-6);
}
</style>
