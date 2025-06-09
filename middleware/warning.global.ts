import { Modal } from "@arco-design/web-vue"

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return
  const userState = useState<{ uid: string; nickname: string }>("userState")
  const isFinish = useState("isFinish")
  if (
    userState.value &&
    !isFinish.value &&
    from.path === "/questions" &&
    to.path !== "/questions"
  ) {
    return await new Promise((resolve) => {
      Modal.warning({
        title: "注意",
        content: "你确定要离开吗？当前做题进度不会保留。",
        hideCancel: false,
        simple: false,
        onOk() {
          resolve(false)
        },
        onCancel() {
          resolve(true)
        },
      })
    }).then((res) => {
      if (res) {
        return abortNavigation()
      } else return
    })
  }
})
