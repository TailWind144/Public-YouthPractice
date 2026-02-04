<template>
  <div class="w-full menu">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      :mode
      @menu-item-click="handleClick"
    >
      <a-menu-item v-for="(obj, key) in keyToMenuNames" :key="key">
        {{ obj.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script setup lang="ts">
const { mode } = defineProps(["mode"])

const route = useRoute()
const emit = defineEmits(["menuClick"])
const selectedKeys = ref<any>([])
watchEffect(() => {
  selectedKeys.value[0] = `${route.path}/`.match(/\/[^\/]+(?=\/)/)![0]
})
const handleClick = (key) => {
  navigateTo(keyToMenuNames[key].path)
  emit("menuClick")
}
</script>
<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
.menu .arco-menu {
  background-color: transparent;
}
.menu .arco-menu-horizontal .arco-menu-item {
  background-color: transparent;
}
.menu .arco-menu-horizontal .arco-menu-item:hover {
  background-color: transparent;
}
.menu .arco-menu-horizontal .arco-menu-item:not(.arco-menu-selected):hover {
  background-color: transparent;
  animation: bounce 0.3s cubic-bezier(0, 0, 1, 1) forwards;
}
.menu .arco-menu {
  font-size: 1rem;
}
</style>
