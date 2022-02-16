import xmRequest from "../service/index"
/**
 * 可获取热门搜索列表
 */
export function getSearchHot() {
  return xmRequest.get('/search/hot')
}

/**
 *  调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单 ,mv 信息
 * @param {*} keywords 
 */
export function getSearchSuggest(keywords) {
  return xmRequest.get('/search/suggest', { keywords, type: "mobile" })
}

/**
 * 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 , 关键词可以多个 , 以空格隔开 , 如 " 周杰伦 搁浅 "( 不需要登录 ), 搜索获取的 mp3url 不能直接用 , 可通过 `/song/url` 接口传入歌曲 id 获取具体的播放链接
 * @param {*} keywords 
 */
export function getSearchResult(keywords) {
  return xmRequest.get('/search', { keywords })
}