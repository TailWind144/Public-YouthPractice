<template>
  <div
    class="border-gradient rounded-lg"
    :class="{
      disabled: disabled,
      success: isCorrect && disabled,
      wrong: !isCorrect && disabled,
    }"
  >
    <input
      :disabled
      :value
      ref="inputElement"
      class="dictation-input text-center w-full bg-[var(--bg-color-d)] backdrop-blur rounded-lg px-6 py-4 text-neutral-700 font-medium text-shadow border-none border-neutral-200 outline-none transition-all duration-300"
      placeholder="输入答案..."
      autocomplete="off"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
const { value, disabled, isCorrect } = defineProps([
  "value",
  "disabled",
  "isCorrect",
])
const emit = defineEmits(["submit", "input"])

const inputElement = ref<HTMLInputElement | null>(null)

const rafId = ref<number | null>(null)
const animStart = ref<number | null>(null)
const animDuration = 500
const isAnimating = ref(false)

onBeforeUnmount(() => {
  if (rafId.value !== null) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
  if (inputElement.value) {
    inputElement.value.style.transform = ""
    inputElement.value.style.boxShadow = ""
  }
})

const applyFrame = (progress: number) => {
  if (!inputElement.value) return

  const eased = Math.sin(progress * Math.PI)
  const translateY = -6 * eased
  const scale = 1 + 0.02 * eased
  const shadowIntensity = 0.12 * eased

  const hasFocus = document.activeElement === inputElement.value
  const focusOffset = hasFocus ? -2 : 0

  inputElement.value.style.transform = `translateY(${
    focusOffset + translateY
  }px) scale(${scale})`
  inputElement.value.style.boxShadow = `0 6px 18px rgba(22,93,255,${shadowIntensity})`
}

const animateBounce = (duration = animDuration) => {
  if (!inputElement.value) return

  const now = performance.now()

  if (isAnimating.value && animStart.value !== null) {
    animStart.value = now
    return
  }

  isAnimating.value = true
  animStart.value = now

  const loop = (t: number) => {
    if (animStart.value === null) {
      isAnimating.value = false
      return
    }
    const elapsed = t - animStart.value
    const progress = Math.min(1, Math.max(0, elapsed / duration))
    applyFrame(progress)

    if (progress >= 1) {
      if (inputElement.value) {
        inputElement.value.style.transform =
          document.activeElement === inputElement.value
            ? "translateY(-2px)"
            : ""
        inputElement.value.style.boxShadow = ""
      }
      isAnimating.value = false
      animStart.value = null
      rafId.value = null
      return
    }

    rafId.value = requestAnimationFrame(loop)
  }

  rafId.value = requestAnimationFrame(loop)
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit("input", value)
  animateBounce(animDuration)
}
</script>

<style scoped>
.dictation-input {
  font-size: 2.5rem;
  height: 80px;
  transition: all 0.3s ease;
}

.dictation-input::placeholder {
  color: rgba(78, 89, 105, 0.4);
  transition: all 0.3s ease;
}

.dictation-input:focus::placeholder {
  color: rgba(78, 89, 105, 0.2);
}

.backdrop-blur {
  backdrop-filter: blur(8px);
}
.border-gradient {
  position: relative;
}
.border-gradient::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--text-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.border-gradient:focus-within::after,
.border-gradient.disabled::after {
  transform: scaleX(1);
}
.border-gradient.success::after {
  background-color: var(--success-color);
}
.border-gradient.success > input {
  color: var(--success-color);
}
.border-gradient.wrong::after {
  background-color: var(--error-color);
}
.border-gradient.wrong > input {
  color: var(--wrong-color);
}

.input-glow {
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.2);
}

.animate-bounce-light {
  animation: bounce-light 0.5s ease;
}

@keyframes bounce-light {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
