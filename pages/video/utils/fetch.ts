export const getVideoChapters = (data) => {
  return _fetch("/api/video/video-chapters", { query: data })
}

export const getMediaWords = (data) => {
  return _fetch("/api/game/media-words", { query: data })
}

export const getMediaExercise = (data) => {
  return _fetch("/api/game/media-exercises", { query: data })
}

export const getMediaExerciseDetail = (data) => {
  return _fetch("/api/game/media-exercises-detail", { query: data })
}

export const checkMediaAnswers = (data) => {
  return _fetch("/api/game/media-check-answers", { method: "post", body: data })
}
