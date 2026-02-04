<template>
  <a-menu
    class="youth-pop-menu"
    mode="popButton"
    :tooltipProps="{ popupVisible: false }"
  >
    <a-popover trigger="click" position="lb">
      <a-menu-item
        key="1"
        class="!bg-[var(--success-color)] duration-300 flex justify-center items-center active:scale-95"
      >
        <template #icon>
          <icon-calendar class="!text-white text-xl" />
        </template>
      </a-menu-item>

      <template #content>
        <Calendar class="!shadow-none" />
      </template>
    </a-popover>
    <a-menu-item
      key="2"
      class="!bg-[var(--text-primary)] duration-300 flex justify-center items-center active:scale-95"
      @click="
        navigateTo('http://quote.kcct144.work/', {
          external: true,
          open: {
            target: '_blank',
          },
        })
      "
    >
      <template #icon>
        <icon-english-fill class="!text-white text-xl" />
      </template>
      每日一句
    </a-menu-item>
  </a-menu>
</template>

<script setup lang="ts"></script>

<style scoped></style>
