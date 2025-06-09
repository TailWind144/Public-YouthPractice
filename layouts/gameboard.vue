<template>
  <div class="home min-h-screen bg-[var(--bg-color-d)]">
    <TopNav></TopNav>
    <div class="max-w-[105em] p-4 mx-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
