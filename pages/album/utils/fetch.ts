export const getAlbumSongs = (data) => {
  return _fetch("/api/album/album-songs", { query: data })
}

export const getMoreSongs = (data) => {
  return _fetch("/api/album/album-more", { query: data })
}

export const getAlbumLyrics = (data) => {
  return _fetch("/api/album/album-lyrics", { query: data })
}
