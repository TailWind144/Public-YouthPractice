<template>
  <div class="flex flex-col gap-6 overflow-y-auto px-6 py-4">
    <div class="flex flex-col gap-1" v-for="(book, index) in list" :key="index">
      <div class="text-base text-[var(--text-primary)] font-medium">
        {{ book.title }}
      </div>
      <div class="flex flex-col gap-2">
        <transition-group appear name="scale-fade">
          <div
            class="flex px-3 py-2 items-center group cursor-pointer duration-300 hover:bg-[var(--bg-info-color-3)] rounded-lg bg-[#f8fafc]"
            v-for="(item, index) in book.list"
            :key="item.id"
            @click="() => $emit('item-click', item)"
          >
            <div class="text-base pr-3 group-hover:text-[var(--text-primary)]">
              <icon-plus
                class="group-hover:scale-125 duration-500"
                style="stroke-width: 8"
              />
            </div>
            <div
              class="flex flex-1 flex-col text-[var(--text-info-2)] text-base overflow-hidden"
            >
              <div class="flex justify-between items-center">
                <span
                  class="text-xl text-[var(--text-info)] text-ellipsis overflow-hidden text-nowrap"
                >
                  <span class="duration-300 text-[var(--text-h1)]">
                    {{ item.word }}
                  </span>
                  <span class="text-xs ml-1">
                    {{ item.symbol }}
                  </span>
                </span>
                <span class="min-w-7 text-sm">{{ item.class }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-ellipsis overflow-hidden text-nowrap">
                  {{ item.bookMeaning }}
                </span>
                <span class="min-w-[70px] text-sm">{{ item.bookTitle }}</span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <transition appear name="slide-fade">
      <div v-if="!list.length && search">
        <a-empty>无法找到与 "{{ search }}" 相关的结果</a-empty>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue"
const emit = defineEmits(["item-click"])
const { list, search } = defineProps(["list", "search"])

// function escapeHtml(s: string) {
//   return s
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#39;")
// }

// function escapeRegExp(s: string) {
//   return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
// }

// function highlight(text: string, query: string | undefined) {
//   if (!query) return escapeHtml(text)
//   const q = String(query).trim()
//   if (!q) return escapeHtml(text)

//   const escapedQ = escapeRegExp(q)
//   const re = new RegExp(escapedQ, "ig")

//   let result = ""
//   let lastIndex = 0
//   let match: RegExpExecArray | null

//   // 使用 exec 循环以保留原始片段并进行安全转义
//   while ((match = re.exec(text)) !== null) {
//     const idx = match.index
//     // 非匹配片段
//     if (idx > lastIndex) {
//       result += escapeHtml(text.slice(lastIndex, idx))
//     }
//     // 匹配片段
//     result += `<mark class="match">${escapeHtml(match[0])}</mark>`
//     lastIndex = idx + match[0].length
//     // 防止空串匹配导致无限循环
//     if (match[0].length === 0) break
//   }

//   if (lastIndex < text.length) {
//     result += escapeHtml(text.slice(lastIndex))
//   }

//   // 如果没有任何匹配，返回转义后的原文
//   return result || escapeHtml(text)
// }
</script>

<style scoped></style>
