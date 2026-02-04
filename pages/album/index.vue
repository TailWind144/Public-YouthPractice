<template>
  <transition name="scale-fade" mode="out-in">
    <div
      :key="$route.query.id"
      class="max-w-[75em] min-h-[80vh] flex flex-col gap-10 items-center mx-auto p-6 pb-24"
    >
      <AlbumInfo
        :album
        :transitionName="transitionName"
        @handlePlay="handlePlayFirst"
      />
      <SongList
        :songs
        :activeId="currentSong?.id"
        @handleClick="handleChangeSong"
      />
      <div class="flex flex-col gap-2 w-full">
        <div class="text-base font-bold text-[var(--text-h1)]">更多</div>
        <div class="grid md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-5">
          <ClientOnly>
            <MediaListItem
              v-for="(item, index) in list"
              :key="index"
              :data="item"
              @click="handleMoreClick(item)"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </transition>
  <MusicPlayer
    v-if="currentSong"
    :cover="album?.cover"
    :song="currentSong"
    @handlePrevious="handlePrevious"
    @handleNext="handleNext"
    @handleExpan="handleExpan"
  />
</template>

<script setup lang="ts">
import MediaListItem from "~/components/game/MediaListItem.vue"
import AlbumInfo from "~/components/album/AlbumInfo.vue"
import SongList from "~/components/album/SongList.vue"
import MusicPlayer from "~/components/album/MusicPlayer.vue"
import { getAlbumSongs, getMoreSongs } from "./utils/fetch"
const route = useRoute()

const album = ref()
const list = ref()
const songs = ref([])
const currentSong = computed(() => songs.value[currentSongIndex.value])
const currentSongIndex = ref(-1)
const transitionName = ref("full-image")
const initData = async (id) => {
  const { data } = await getAlbumSongs({ id })
  album.value = data.album
  songs.value = data.songs
  currentSongIndex.value = -1
}
const initMore = async () => {
  const { data } = await getMoreSongs({ id: route.query.id })
  list.value = data
}
watch(
  () => route.query.id,
  () => {
    initData(route.query.id)
    initMore()
  },
  { immediate: true }
)

const handleChangeSong = (item) => {
  currentSongIndex.value = item.index
}

const handleMoreClick = (item) => {
  const gameImgSrc = useState("gameImgSrc")
  gameImgSrc.value = ""
  initData(item.id)
  navigateTo({ path: "/album", query: { id: item.id } })
  scrollTo({ top: 0, behavior: "smooth" })
}

const handlePlayFirst = () => {
  currentSongIndex.value = 0
}

const handlePrevious = () => {
  const length = songs.value.length
  currentSongIndex.value = (currentSongIndex.value - 1 + length) % length
}
const handleNext = () => {
  const length = songs.value.length
  currentSongIndex.value = (currentSongIndex.value + 1) % length
}

const handleExpan = () => {
  transitionName.value = ""
}

definePageMeta({
  layout: "musicboard",
})
useHead({
  title: "专辑详情",
})
</script>
