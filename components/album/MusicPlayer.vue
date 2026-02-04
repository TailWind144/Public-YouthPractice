<template>
  <div
    class="fixed bottom-0 w-full p-3 backdrop-blur bg-[var(--bg-mask-color)] z-[100] duration-300"
  >
    <MusicInputRange
      class="!absolute top-0 left-0 w-full music-player-range"
      :currentTime
      :duration
      @handleTimeChange="handleTimeChange"
    />
    <div
      class="music-player max-w-[80em] mx-auto grid gap-4 items-center justify-between relative"
    >
      <div class="flex gap-4 items-center">
        <img
          v-show="!isExpan"
          class="w-12 h-12 rounded"
          :src="cover ? `${ossBaseURL}${cover}` : ''"
          :alt="song?.title"
          style="view-transition-name: img-cover"
        />
        <div class="flex flex-col">
          <div class="text-base font-bold text-[var(--text-h1)]">
            {{ song?.title }}
          </div>
          <div class="text-sm text-[var(--text-info)]">{{ song?.singer }}</div>
        </div>
      </div>
      <MusicControl
        class="text-3xl"
        :isPlaying
        @handlePrevious="handlePrevious"
        @handlePause="handlePause"
        @handlePlay="handlePlay"
        @handleNext="handleNext"
      />
      <div class="flex gap-4 justify-end text-xl">
        <VolumeRange
          :isMute
          v-model:volume="volume"
          @handleMute="handleMute"
          @handleChange="handleVolumeChange"
        />
        <IconWrapper @click="handleExpan">
          <icon-up />
        </IconWrapper>
      </div>
    </div>
  </div>
  <FullScreenPlayer
    v-show="isExpan"
    :song
    :cover
    :currentTime
    :duration
    :isPlaying
    @handleNext="handleNext"
    @handlePause="handlePause"
    @handlePlay="handlePlay"
    @handlePrevious="handlePrevious"
    @handleTimeChange="handleTimeChange"
    @handleExpan="handleExpan"
  />
</template>

<script setup lang="ts">
import VolumeRange from "./VolumeRange.vue"
import IconWrapper from "./IconWrapper.vue"
import MusicControl from "./MusicControl.vue"
import MusicInputRange from "./MusicInputRange.vue"
import FullScreenPlayer from "./FullScreenPlayer.vue"
const { song, cover } = defineProps(["song", "cover"])
const emit = defineEmits(["handlePrevious", "handleNext", "handleExpan"])
const handlePrevious = () => {
  emit("handlePrevious")
}
const handleNext = () => {
  emit("handleNext")
}

const audioRef = ref()
const volume = ref(
  import.meta.client ? localStorage.getItem("volume") || 0.2 : null
)
const isPlaying = ref(false)
const isMute = computed(() => Number(volume.value) === 0)
const isExpan = ref(false)
const currentTime = ref()
const duration = ref()
const play = (url) => {
  audioRef.value && audioRef.value.pause()
  audioRef.value = new Audio(url)
  audioRef.value.play()
  audioRef.value.volume = volume.value

  audioRef.value.addEventListener("play", () => {
    isPlaying.value = true
  })
  audioRef.value.addEventListener("pause", () => {
    isPlaying.value = false
  })
  audioRef.value.addEventListener("ended", handleNext)
  audioRef.value.addEventListener("loadedmetadata", () => {
    duration.value = audioRef.value.duration
  })
  audioRef.value.addEventListener("timeupdate", () => {
    currentTime.value = audioRef.value.currentTime
  })
}
watch(
  () => song,
  () => {
    play(`${ossBaseURL}${song.resource}`)
  },
  { immediate: true }
)
watch(volume, () => {
  audioRef.value.volume = volume.value
})
const handlePause = () => {
  audioRef.value.pause()
}
const handlePlay = () => {
  audioRef.value.play()
}
const handleMute = () => {
  volume.value = !isMute.value ? 0 : 0.2
}
const handleVolumeChange = () => {
  localStorage.setItem("volume", volume.value as string)
}
const handleTimeChange = (value: number) => {
  currentTime.value = value
  audioRef.value.currentTime = value
}

const handleExpan = () => {
  if (!document.startViewTransition) {
    isExpan.value = !isExpan.value
    return
  }

  document.startViewTransition(() => {
    isExpan.value = !isExpan.value
    emit("handleExpan")
  })
}

onBeforeUnmount(() => {
  audioRef.value && audioRef.value.pause()
})
</script>

<style scoped>
.music-player {
  grid-template-columns: 1fr auto 1fr;
}
.music-player-range {
  --progress-bg-color: #e6e6e64e;
  --progress-hover-bg-color: #e6e6e68c;
  --progress-filled-color: var(--text-primary-2);
  --progress-thumb-color: var(--text-primary-2);
  --progress-wrapper-height: 3px;
  --thumb-width: 9px;
  --thumb-height: 9px;
}
</style>
