<template>
  <a-button class="active:scale-95 scale-100" type="primary" size="small">
    <template #icon>
      <span>
        <slot />
      </span>
    </template>
  </a-button>
</template>

<script setup lang="ts"></script>

<style scoped></style>
