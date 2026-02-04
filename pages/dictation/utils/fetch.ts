export const planDictationTask = (data) => {
  return _fetch("/api/dictation/plan-dictation-task", {
    method: "post",
    body: data,
  })
}

export const editDictationTask = (data) => {
  return _fetch("/api/dictation/edit-dictation-task", {
    method: "post",
    body: data,
  })
}

export const dictationContent = (data) => {
  return _fetch("/api/dictation/dictation-content", { query: data })
}

export const dictationDetail = (data) => {
  return _fetch("/api/dictation/dictation-detail", { query: data })
}

export const checkAnswers = (data) => {
  return _fetch("/api/dictation/check-answers", { method: "post", body: data })
}
