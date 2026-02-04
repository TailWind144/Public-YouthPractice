import { Message, Modal } from "@arco-design/web-vue"

let itemNums = 0
export const handleItemUseModal = async (name, content, cb) => {
  const { data } = await checkItem({ name })
  itemNums = data.nums
  Modal.warning({
    title: "注意",
    content: `${content}（当前拥有${itemNums}个）`,
    hideCancel: false,
    simple: false,
    onBeforeOk: async () => {
      const res = await cb(itemNums)
      return res
    },
  })
}

export const handleItemUseOk = (name, cb) => {
  return async function (nums) {
    if (nums) {
      await useItem({ name })
      cb()
      return true
    } else {
      Message.error(`你的${name}不足，无法使用`)
      return false
    }
  }
}
