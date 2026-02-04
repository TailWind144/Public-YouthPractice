export const stageToName = { 1: "小学", 2: "中考", 3: "高考" }

export const addOrEditFormItems = [
  {
    name: "word",
    label: "单词",
    type: "textarea",
    span: 24,
    props: {
      placeholder: "请输入单词",
      allowClear: true,
      maxLength: 500,
      showWordLimit: true,
    },
  },
  {
    name: "bookMeaning",
    label: "释义",
    type: "textarea",
    span: 24,
    props: {
      placeholder: "请输入单词释义",
      allowClear: true,
      maxLength: 500,
      showWordLimit: true,
    },
  },
  {
    name: "example",
    label: "例子（可选）",
    type: "textarea",
    span: 24,
    props: {
      placeholder: "请输入单词的例子",
      allowClear: true,
      maxLength: 500,
      showWordLimit: true,
    },
  },
]
