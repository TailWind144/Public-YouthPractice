<template>
  <Teleport to="body">
    <Transition name="fade-scale">
      <div
        v-show="visible"
        ref="menuRef"
        class="fixed z-50 bg-[var(--bg-color-d)] border rounded-lg shadow-lg"
        :style="menuStyle"
        @click.stop
      >
        <div class="py-2">
          <div
            v-for="(item, index) in menuItems"
            :key="index"
            class="px-4 py-2 text-sm text-[var(--text-p)] hover:bg-[var(--bg-info-color-3)] cursor-pointer transition-colors duration-200 flex items-center gap-3"
            @click="handleMenuItemClick(item, index)"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>()

const { menuItems, offset } = defineProps({
  menuItems: Array,
  offset: {
    type: Object,
    default: () => ({ x: 10, y: 10 }),
  },
})

const emit = defineEmits(["menu-item-click"])

const menuRef = ref<HTMLElement>()
const menuStyle = ref({})
const mousePosition = ref({ x: 0, y: 0 })

const getMousePosition = (event) => {
  mousePosition.value = {
    x: event.clientX,
    y: event.clientY,
  }
}

const calculatePosition = () => {
  if (!menuRef.value) return

  const menuRect = menuRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let x = mousePosition.value.x + offset.x
  let y = mousePosition.value.y + offset.y

  if (x + menuRect.width > viewportWidth) {
    x = mousePosition.value.x - menuRect.width - offset.x
  }

  if (y + menuRect.height > viewportHeight) {
    y = mousePosition.value.y - menuRect.height - offset.y
  }

  if (x < 0) {
    x = offset.x
  }

  if (y < 0) {
    y = offset.y
  }

  menuStyle.value = {
    left: `${x}px`,
    top: `${y}px`,
  }
}

watch(
  () => visible.value,
  async (newVisible) => {
    if (newVisible) {
      await nextTick()
      calculatePosition()
    }
  }
)

const handleMenuItemClick = (item, index) => {
  emit("menu-item-click", item, index)
  visible.value = false
}

const handleClickOutside = (event) => {
  if (
    visible.value &&
    menuRef.value &&
    !menuRef.value.contains(event.target as Node)
  ) {
    visible.value = false
  }
}

const handleKeydown = (event) => {
  if (event.key === "Escape" && visible.value) {
    visible.value = false
  }
}

defineExpose({
  showMenu: async (event) => {
    if (visible.value) {
      visible.value = false
      await sleep(240)
    }
    getMousePosition(event)
    visible.value = true
  },
})

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
  document.addEventListener("keydown", handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
  document.removeEventListener("keydown", handleKeydown)
})
</script>

<style scoped>
.fade-scale-enter-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.fade-scale-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.fixed {
  will-change: transform;
}
</style>
