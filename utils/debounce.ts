export default function (callback: (...args: any[]) => void, time: number) {
  let timeout: NodeJS.Timeout | null = null
  return function (...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, time)
  }
}
