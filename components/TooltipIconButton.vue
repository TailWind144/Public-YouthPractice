<template>
  <a-tooltip
    :content="content"
    mini
    :position="position"
    background-color="var(--text-primary)"
  >
    <a-button class="active:scale-95 scale-100" type="text">
      <template #icon>
        <span :class="`text-xl ${iconColor}`">
          <slot />
        </span>
      </template>
    </a-button>
  </a-tooltip>
</template>

<script setup lang="ts">
const { content, position, iconColor } = defineProps({
  content: {
    type: String,
  },
  position: {
    type: String,
    default: "bottom",
  },
  iconColor: {
    type: String,
    default: "text-[var(--text-primary)]",
  },
})
</script>

<style scoped></style>
