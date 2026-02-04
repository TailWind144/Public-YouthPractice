<template>
  <div class="flex gap-6 w-full md:flex-row flex-col">
    <div class="w-60 h-60 flex-shrink-0 relative">
      <img
        class="w-full h-full rounded-lg"
        :src="imgSrc"
        :style="transitionName ? `view-transition-name: ${transitionName}` : ''"
      />
      <a-skeleton
        v-if="!gameImgSrc && !album?.cover"
        class="!w-full !h-full absolute top-0"
        animation
      >
        <a-skeleton-shape class="!w-full !h-full !rounded-lg" />
      </a-skeleton>
    </div>
    <div class="flex flex-col justify-between flex-1 gap-2">
      <div class="flex flex-col flex-1 gap-2">
        <div class="flex gap-3 items-end">
          <span
            v-if="album?.title"
            class="text-4xl font-bold text-[var(--text-h1)]"
          >
            {{ album.title }}
          </span>
          <Skeleton v-else :rows="1" :line-height="40" />
          <span class="text-sm text-[var(--text-info)]">
            {{ album.titleCn }}
          </span>
        </div>
        <div class="mt-2">
          <a-typography-paragraph
            v-if="album?.intro"
            class="!text-[var(--text-info-2)]"
            :ellipsis="{
              rows: 6,
            }"
          >
            {{ album.intro }}
          </a-typography-paragraph>
          <Skeleton v-else :rows="1" :line-height="140" />
        </div>
      </div>
      <div class="flex gap-2">
        <IconButton text="播放" @click="handlePlay">
          <icon-play-arrow-fill />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { album } = defineProps({
  album: {
    type: Object,
    default: () => ({}),
  },
  transitionName: {
    type: String,
  },
})
const emit = defineEmits(["handlePlay"])
const gameImgSrc = useState("gameImgSrc")
const imgSrc = computed(() => `${ossBaseURL}${gameImgSrc.value || album.cover}`)

const handlePlay = () => {
  emit("handlePlay")
}
</script>

<style scoped></style>
