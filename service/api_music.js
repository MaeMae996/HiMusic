import xmRequest from './index'
/**
 * 获取轮播图
 * @param {number} type 资源类型
 * 0 PC
 * 1 android
 * 2 iphone
 * 3 ipad
 */
export function getBannerList() {
  return xmRequest.get('/banner', { type: 2 })
}
/**
 * 获取歌曲榜单
 * @param {number} idx 
 * 0 新歌 
 * 1 热门 
 * 2 原创
 * 3 飙升
 */
export function getRankings(idx) {
  return xmRequest.get('/top/list', { idx })
}

/**
 * 
 * @param {string} cat 类别 "全部"、“华语”、“古风“、”欧美“、“流行“
 * @param {number} limit 取出歌单数量 
 */
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return xmRequest.get('/top/playlist', { cat, limit, offset })
}