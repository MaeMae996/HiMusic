import xmRequest from "../service/index"

export function getSongDetail(ids) {
  return xmRequest.get('/song/detail', { ids })
}

export function getSongLyric(id) {
  return xmRequest.get('/lyric', { id })
}
