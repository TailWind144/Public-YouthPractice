export const getContent = (data) => {
  return _fetch("/api/questions/content", { query: data })
}

export const checkAns = (data) => {
  return _fetch("/api/questions/check-answers", { method: "post", body: data })
}

export const getDetail = (data) => {
  return _fetch("/api/questions/detail", { query: data })
}

export const getHistory = (data) => {
  return _fetch("/api/questions/history", { query: data })
}
