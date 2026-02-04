<template>
  <div class="fixed left-0 top-0 z-[999] w-screen h-screen">
    <div
      ref="modalRef"
      class="bg-[var(--bg-mask-color)] w-full h-full z-[999] absolute"
      @click="closeModal($event)"
    >
      <div
        class="mx-auto h-12 duration-500 my-16 bg-[var(--bg-color-d)] border flex flex-col focus:outline-none w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg overflow-hidden sm:max-w-3xl"
        :class="{
          'max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] h-[28rem]':
            search,
        }"
      >
        <div class="relative inline-flex items-center [&>input]:h-12 border-b">
          <search-input @input="handleInput" />
          <span
            class="absolute inset-y-0 start-0 flex items-center ps-2.5 text-xl text-[var(--text-info)]"
          >
            <icon-search />
          </span>
          <span class="absolute inset-y-0 end-0 flex items-center pe-2.5">
            <a-button
              class="active:scale-95 scale-100"
              type="text"
              @click="() => emit('closed')"
            >
              <template #icon>
                <span class="text-xl text-[var(--text-p)]">
                  <icon-close />
                </span>
              </template>
            </a-button>
          </span>
        </div>
        <div class="overflow-hidden flex flex-col relative">
          <search-list
            @item-click="handleItemClick"
            :class="{ 'mb-[40px]': isMore }"
            :list
            :search
          />
          <a-alert class="absolute bottom-0 left-0" v-if="isMore">
            <span class="text-[var(--text-info-2)] overflow-hidden text-nowrap">
              最多展示 50 条结果，如需更多结果，请使用更精确的搜索词
            </span>
          </a-alert>
        </div>
      </div>
    </div>
    <vocabulary-add-or-edit-modal
      ref="addModalRef"
      :isEdit="false"
      :form
      :rules
      :formItems
      @handle-add-or-edit-before-ok="handleBeforeOk"
    >
    </vocabulary-add-or-edit-modal>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue"
import { addCustomWord, getBookOptions } from "~/pages/vocabulary/utils/fetch"
const emit = defineEmits(["closed"])

const addModalRef = ref()
const form = ref({ id: "" })
const rules = {
  id: [{ required: true, message: "请选择你要添加到的单词本" }],
}
const customBooks = ref([])
const formItems = computed(() => [
  {
    name: "id",
    label: "你的单词本",
    type: "select",
    span: 24,
    props: {
      placeholder: "请选择你的单词本",
      "field-names": { value: "id", label: "title" },
      options: customBooks,
    },
  },
  {
    name: "word",
    label: "单词",
    type: "input",
    span: 12,
    props: {
      disabled: true,
      placeholder: "请输入单词",
    },
  },
  {
    name: "symbol",
    label: "音标",
    type: "input",
    span: 12,
    props: {
      disabled: true,
      placeholder: "请输入音标",
    },
  },
  {
    name: "bookMeaning",
    label: "释义",
    type: "input",
    span: 24,
    props: {
      disabled: true,
      placeholder: "请输入释义",
    },
  },
  {
    name: "example",
    label: "例子（可选）",
    type: "textarea",
    span: 24,
    props: {
      placeholder: "请输入单词的例子",
    },
  },
])
const handleItemClick = async (item) => {
  form.value = {
    word: item.word,
    symbol: item.symbol,
    example: item.example,
    bookMeaning: item.bookMeaning,
  }
  addModalRef.value.visible = true
  const { data } = await getBookOptions({ isUser: true })
  customBooks.value = data
  form.value.id = customBooks.value[0]?.id
}
const handleBeforeOk = async (resolve, formRef, preTitle) => {
  await formRef.value.validate().then(async (err) => {
    if (err) {
      resolve(false)
      return false
    } else {
      await addCustomWord(form.value)
      resolve(true)
      Message.success(`${preTitle.value}成功`)
    }
  })
}

const search = ref("")
const list = ref([])
const apiIgnore = useApiIgnore()

const modalRef = ref()
const closeModal = (e) => {
  if (e.target === modalRef.value) emit("closed")
}

const isMore = ref(false)
const handleInput = debounce((e) => {
  search.value = e.target.value
  if (search.value !== "")
    apiIgnore(() => {
      let flag = true
      searchWord({ search: e.target.value }).then(({ data }) => {
        if (flag) {
          list.value = data.groups
          isMore.value = data.searchInfo.hasMore
        }
      })
      return () => (flag = false)
    })
  else list.value = []
}, 500)

const { lock, unlock } = useBodyScrollLock()
onMounted(() => {
  lock()
})
onBeforeUnmount(() => {
  unlock()
})
</script>

<style scoped></style>
