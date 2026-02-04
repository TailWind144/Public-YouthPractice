export function useApiIgnore() {
  let cleanFn = null
  return (cb) => {
    cleanFn && cleanFn()
    cleanFn = cb()
  }
}
