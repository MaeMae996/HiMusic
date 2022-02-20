import xmRequest from "../service/index"
/**
 * 传入音乐 id(支持多个 id, 用 `,` 隔开), 可获得歌曲详情
 * @param {number} ids 
 */
export function getSongDetail(ids) {
  return xmRequest.get('/song/detail', { ids })
}

/**
 * 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * @param {number} id 
 */
export function getSongLyric(id) {
  return xmRequest.get('/lyric', { id })
}

/**
 * 播放接口
 * https://music.163.com/song/media/outer/url?id=${id}.mp3
 */