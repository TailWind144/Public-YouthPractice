<template>
  <!-- `background-image: url('/daily-sentence/bg/bg-image-${imgIndex}.jpg');` -->
  <div class="relative">
    <QuoteTopNav @showListModal="showListModal" :time="quoteTime" />
    <div
      ref="sentenceImageRef"
      class="w-screen h-screen bg-cover bg-no-repeat absolute top-0 left-0 bg-center flex justify-center items-center"
      :style="`background-image: url('${imgURL}');`"
    >
      <div :class="wrapperClass">
        <div :class="innerWrapperClass">
          <div ref="imgRef">
            <img :class="imgClass" :src="imgURL" />
            <!-- <img :class="imgClass" :src="imgURL" /> -->
          </div>
          <div ref="cardRef" :class="quoteClass">
            <transition mode="out-in" name="blur">
              <div v-if="!isChinese">
                <div
                  class="sentence text-3xl text-justify relative"
                  ref="quoteRef"
                >
                  <div class="word text-5xl text-left">“</div>
                  <div class="word px-8">
                    {{ currentQuote.content }}
                  </div>
                  <div class="word text-5xl text-right">”</div>
                </div>
                <div class="word text-2xl text-right" ref="authorRef">
                  —— {{ currentQuote.author }}
                </div>
              </div>
              <div v-else>
                <div
                  class="sentence text-3xl text-justify relative"
                  ref="quoteRef"
                >
                  <div class="word text-5xl text-left">“</div>
                  <div class="word px-8">
                    {{ chineseQuote.content }}
                  </div>
                  <div class="word text-5xl text-right">”</div>
                </div>
                <div class="word text-2xl text-right" ref="authorRef">
                  —— {{ chineseQuote.author }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 md:bottom-16" ref="buttonRef">
        <ToolsNav
          :currentQuote
          :cardRef
          :isLove
          @love="handleLove"
          @switchLang="handleSwitch"
        />
      </div>
    </div>
    <QuoteListModal
      ref="quoteModalRef"
      :id="quoteId"
      @handleQuoteChange="handleQuoteChange"
    />
  </div>
</template>

<script setup lang="ts">
import ToolsNav from "@/components/quote/ToolsNav.vue"
import gsap from "gsap"
import { getSentence, LoveSentence } from "./utils/fetch"
import { layouts } from "./utils/const"

const imgURL = ref(imgUrls[getRandomIndex(imgUrls.length)])
const currentQuote = ref({
  content: "",
  author: "",
})
const chineseQuote = ref({
  content: "",
  author: "",
})
const quoteTime = ref()
const quoteId = ref()
const isLove = ref()
const isChinese = ref(false)

const getDailyQuote = async (query?) => {
  const { data } = await getSentence(query)
  initData(data)
}
const initData = (data) => {
  quoteId.value = data.id
  isLove.value = data.isLove
  quoteTime.value = data.publishTime
  currentQuote.value.content = data.en
  currentQuote.value.author = data.originEn || "佚名"
  chineseQuote.value.content = data.cn
  chineseQuote.value.author = data.originCn || "佚名"
  imgURL.value =
    data.link || imgUrls[getRandomIndex(imgUrls.length, data.publishTime)]
  selectedLayout.value =
    layouts[getRandomIndex(layouts.length, data.publishTime)]
}
getDailyQuote()

const sentenceImageRef = ref()
const imgRef = ref()
const cardRef = ref()
const quoteRef = ref()
const authorRef = ref()
const buttonRef = ref()

const selectedLayout = ref(layouts[getRandomIndex(layouts.length)])
const wrapperClass = computed(() => selectedLayout.value.wrapperClass)
const innerWrapperClass = computed(() => selectedLayout.value.innerWrapperClass)
const imgClass = computed(() => selectedLayout.value.imgClass)
const quoteClass = computed(() => selectedLayout.value.quoteClass)

const handleLove = async () => {
  await LoveSentence({ id: quoteId.value })
  isLove.value = !isLove.value
}

const handleSwitch = () => {
  isChinese.value = !isChinese.value
}

const quoteModalRef = ref()
const showListModal = async () => {
  quoteModalRef.value.visible = true
}
const handleQuoteChange = async (id) => {
  await getDailyQuote({ id })
  timeline.play("init")
}

const initRem = () => {
  const sentenceBoundingRect = cardRef.value.getBoundingClientRect()
  const html = document.querySelector("html")
  if (sentenceBoundingRect.height > window.innerHeight * 0.8)
    html!.style.fontSize = "8px"
  else if (sentenceBoundingRect.height > window.innerHeight * 0.55)
    html!.style.fontSize = "12px"
}

let timeline: gsap.core.Timeline
const animateQuote = () => {
  timeline = gsap.timeline()

  timeline
    .from(
      imgRef.value,
      {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power2.out",
      },
      "init"
    )
    .from(
      quoteRef.value,
      { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
    .from(
      authorRef.value,
      { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
    .from(
      buttonRef.value,
      { opacity: 0, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
}

onMounted(() => {
  imgRef.value.style.viewTransitionName = "full-embed"
  document.body.setAttribute("arco-theme", "dark")

  initRem()
  animateQuote()
})
onUnmounted(() => {
  document.body.removeAttribute("arco-theme")
})
useHead({
  title: "每日一句",
})
</script>

<style scoped></style>
