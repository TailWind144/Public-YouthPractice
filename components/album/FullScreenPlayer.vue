<template>
  <div
    class="full-screen w-screen h-screen fixed z-[100] top-0 transition-colors duration-1000 p-8"
    :style="{ backgroundColor: dynamicBackgroundColor }"
  >
    <div class="max-w-[90em] h-full flex flex-col mx-auto gap-2">
      <div class="flex justify-end text-white text-xl">
        <IconWrapper @click="handleExpan">
          <icon-down />
        </IconWrapper>
      </div>
      <div class="flex gap-12 flex-1">
        <div class="flex-1 w-full flex items-center justify-center">
          <div class="w-[400px] flex flex-col gap-6 justify-center">
            <img
              class="rounded-2xl"
              :src="cover ? `${ossBaseURL}${cover}` : ''"
              :alt="song?.title"
              style="view-transition-name: img-cover"
            />
            <div class="flex flex-col">
              <div class="text-xl font-bold text-[var(--player-text-color)]">
                {{ song?.title }}
              </div>
              <div class="text-base text-[var(--player-info-color)]">
                {{ song?.singer }}
              </div>
            </div>
            <div
              class="flex gap-3 h-[66px] text-[var(--player-info-color)] items-center"
            >
              <div>{{ formatTime(currentTime) }}</div>
              <MusicInputRange
                :currentTime
                :duration="duration"
                @handleTimeChange="handleTimeChange"
              />
              <div>{{ formatTime(duration) }}</div>
            </div>
            <div class="music-player grid gap-4 items-center text-white">
              <div>
                <IconWrapper class="text-2xl" @click="handleLanguage">
                  <icon-language />
                </IconWrapper>
              </div>
              <MusicControl
                class="text-3xl"
                :isPlaying="isPlaying"
                @handlePrevious="handlePrevious"
                @handlePause="handlePause"
                @handlePlay="handlePlay"
                @handleNext="handleNext"
              />
              <div></div>
            </div>
          </div>
        </div>
        <div class="flex-1 lyrics overflow-hidden relative">
          <Lyrics :lyrics :currentLyricIndex :isChinese />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MusicInputRange from "./MusicInputRange.vue"
import MusicControl from "./MusicControl.vue"
import IconWrapper from "./IconWrapper.vue"
import { getDarkBackgroundFromImage } from "~/utils/image-color-analyzer"
import { getAlbumLyrics } from "~/pages/album/utils/fetch"
import Lyrics from "./Lyrics.vue"

const { song, cover, duration, isPlaying, currentTime } = defineProps([
  "song",
  "cover",
  "isPlaying",
  "duration",
  "currentTime",
])
const emit = defineEmits([
  "handlePrevious",
  "handlePause",
  "handlePlay",
  "handleNext",
  "handleTimeChange",
  "handleExpan",
])

const dynamicBackgroundColor = ref("rgb(15, 23, 42)") // 默认slate-900

// 监听封面变化，分析颜色并更新背景
watch(
  () => cover,
  async (newCover) => {
    if (newCover) {
      try {
        const imageUrl = `${ossBaseURL}${newCover}`
        const backgroundColor = await getDarkBackgroundFromImage(
          imageUrl,
          false,
        )
        dynamicBackgroundColor.value = backgroundColor
      } catch (error) {
        console.error("分析封面颜色失败:", error)
        // 保持默认背景色
        dynamicBackgroundColor.value = "rgb(15, 23, 42)"
      }
    } else {
      // 没有封面时使用默认背景色
      dynamicBackgroundColor.value = "rgb(15, 23, 42)"
    }
  },
  { immediate: true },
)

const handlePrevious = () => {
  emit("handlePrevious")
}
const handleNext = () => {
  emit("handleNext")
}
const handlePause = () => {
  emit("handlePause")
}
const handlePlay = () => {
  emit("handlePlay")
}
const handleExpan = () => {
  emit("handleExpan")
}

const handleTimeChange = (value: number) => {
  emit("handleTimeChange", value)
}

const lyrics = ref([])
const currentLyricIndex = ref(0)
const initLyrics = async (id) => {
  const { data } = await getAlbumLyrics({ musicId: id })
  lyrics.value = data || []
  currentLyricIndex.value = 0
}

watchEffect(() => {
  initLyrics(song?.id)
})

const findLyricIndex = (time: number): number => {
  if (!lyrics.value.length) return 0

  let left = 0
  let right = lyrics.value.length - 1
  let index = 0

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midTime = timestampToSeconds(lyrics.value[mid].timestamp)

    if (midTime <= time) {
      index = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return index
}

watch(
  () => currentTime,
  (newTime) => {
    if (!lyrics.value.length) return

    const newIndex = findLyricIndex(newTime)
    if (newIndex !== currentLyricIndex.value) {
      currentLyricIndex.value = newIndex
    }
  },
)

const isChinese = ref(false)
const handleLanguage = () => {
  isChinese.value = !isChinese.value
}

function timestampToSeconds(timestamp: string): number {
  const [minutes, seconds] = timestamp.split(":")
  return parseInt(minutes) * 60 + parseFloat(seconds)
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
</script>

<style scoped>
.full-screen {
  --player-text-color: #f6f6f6;
  --player-info-color: #929293;
}
.lyrics::-webkit-scrollbar {
  width: 6px;
}
.lyrics::-webkit-scrollbar-track,
.lyrics::-webkit-scrollbar-corner {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.lyrics::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.lyrics::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.35);
}

.music-player {
  grid-template-columns: 1fr auto 1fr;
}
</style>
