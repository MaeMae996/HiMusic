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