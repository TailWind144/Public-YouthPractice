import { ref, onBeforeUnmount } from "vue"

type PrevStyle = {
  position?: string
  top?: string
  left?: string
  right?: string
  width?: string
  overflow?: string
}

const TOUCH_MOVE_HANDLER = (e: TouchEvent) => {
  if (e.cancelable) e.preventDefault()
}

export function useBodyScrollLock() {
  const isLocked = ref(false)
  let _hasLocked = false

  function _getBody() {
    return document.body
  }

  function lock() {
    const body = _getBody()
    const prevCount = parseInt(body.dataset.scrollLockCount || "0", 10)
    const next = prevCount + 1
    body.dataset.scrollLockCount = String(next)
    // 已经有其他锁在生效，只增加计数并返回
    if (prevCount > 0) {
      isLocked.value = true
      _hasLocked = true
      return
    }

    // 保存原始样式与滚动位置
    const prev: PrevStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    ;(body as any).__prevBodyScrollStyle = prev
    ;(body as any).__prevBodyScrollY = window.scrollY || window.pageYOffset || 0

    // 锁定滚动
    body.style.position = "fixed"
    body.style.top = `-${(body as any).__prevBodyScrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    body.style.overflow = "hidden"

    document.addEventListener("touchmove", TOUCH_MOVE_HANDLER, {
      passive: false,
    })
    isLocked.value = true
    _hasLocked = true
  }

  function unlock() {
    const body = _getBody()
    const prevCount = parseInt(body.dataset.scrollLockCount || "0", 10)
    const next = Math.max(prevCount - 1, 0)
    body.dataset.scrollLockCount = String(next)

    // 仍有其他锁存在，保持锁定但标记本实例已释放
    if (next > 0) {
      isLocked.value = true
      _hasLocked = false
      return
    }

    // 最后一个锁释放，恢复样式与滚动位置
    document.removeEventListener("touchmove", TOUCH_MOVE_HANDLER)
    const prev: PrevStyle = (body as any).__prevBodyScrollStyle || {}
    body.style.position = prev.position || ""
    body.style.top = prev.top || ""
    body.style.left = prev.left || ""
    body.style.right = prev.right || ""
    body.style.width = prev.width || ""
    body.style.overflow = prev.overflow || ""

    const y = (body as any).__prevBodyScrollY || 0
    window.scrollTo(0, y)

    delete (body as any).__prevBodyScrollStyle
    delete (body as any).__prevBodyScrollY

    isLocked.value = false
    _hasLocked = false
  }

  onBeforeUnmount(() => {
    // 如果这个 composable 在生命周期内加了锁，确保释放一次
    if (_hasLocked) unlock()
  })

  return { isLocked, lock, unlock }
}
