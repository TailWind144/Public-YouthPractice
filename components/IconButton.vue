<template>
  <a-button :type :size :status :shape>
    <template #icon>
      <span>
        <slot />
      </span>
    </template>
    <template v-if="text" #default>
      {{ text }}
    </template>
  </a-button>
</template>

<script setup lang="ts">
const { text, size, status, type, shape } = defineProps({
  text: {
    type: String,
    default: "",
  },
  size: {
    type: String as PropType<"small" | "mini" | "medium" | "large">,
    default: "small",
  },
  status: {
    type: String as PropType<"normal" | "success" | "warning" | "danger">,
    default: "normal",
  },
  type: {
    type: String as PropType<
      "primary" | "secondary" | "dashed" | "outline" | "text"
    >,
    default: "primary",
  },
  shape: {
    type: String as PropType<"round" | "circle" | "square">,
    default: "square",
  },
})
</script>

<style scoped></style>
