<template>
  <div class="flex flex-col gap-4 book-type-select">
    <a-select
      size="large"
      :options="typeOptions"
      :default-value="0"
      :style="{ width: '100px' }"
      :field-names="{ value: 'value', label: 'label' }"
      :bordered="false"
      @change="(val) => emit('changType', val)"
    >
    </a-select>
    <transition name="scale-fade" mode="out-in">
      <div :key="type">
        <div
          class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative"
        >
          <transition-group name="scale-fade">
            <BookItem
              v-for="item in list"
              :key="item.id"
              :data="item"
              @handle-click="() => emit('handleClick', item)"
            />
          </transition-group>
          <a-skeleton v-show="!isBottom" animation>
            <a-skeleton-line :line-height="384" />
          </a-skeleton>
        </div>
        <a-empty v-if="!list.length"></a-empty>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import BookItem from "./BookItem.vue"
const { list, isBottom, type } = defineProps(["list", "isBottom", "type"])
const emit = defineEmits(["handleClick", "changType"])

const typeOptions = ref([
  {
    label: "全部",
    value: 0,
  },
  {
    label: "小学",
    value: 1,
  },
  {
    label: "中学",
    value: 2,
  },
  {
    label: "高中",
    value: 3,
  },
  {
    label: "其他",
    value: 4,
  },
])
</script>

<style scoped></style>
