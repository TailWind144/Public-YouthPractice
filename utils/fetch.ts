export const getCheck = () => {
  return s_fetch("/api/check", { method: "get" })
}

export const getIsCheckin = () => {
  return _fetch("/api/is-checkin")
}

export const postCheckin = () => {
  return _fetch("/api/checkin", { method: "post" })
}

export const getCheckinList = (data) => {
  return _fetch("/api/checkin-list", { query: data })
}

export const checkItem = (data) => {
  return _fetch("/api/item/check-item", { query: data })
}

export const useItem = (data) => {
  return _fetch("/api/item/use-item", { method: "post", body: data })
}

export const searchWord = (data) => {
  return _fetch("/api/search/word", { query: data })
}
