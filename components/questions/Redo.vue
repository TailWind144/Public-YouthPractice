<template>
  <div>
    <TooltipIconButton :content="'重做'" @click="handleRedo">
      <icon-refresh />
    </TooltipIconButton>
  </div>
</template>

<script setup lang="ts">
const handleRedo = () => {
  useEmit("question-redo")
}
</script>

<style scoped></style>
