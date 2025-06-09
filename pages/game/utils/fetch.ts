export const getMediaLibrary = (data) => {
  return _fetch("/api/game/media-library", { query: data })
}
