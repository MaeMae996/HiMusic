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
 * 0 飙升
 * 1 热门
 * 2 新歌
 * 3 原创
 */
export function getTopList(idx) {
  return xmRequest.get('/top/list', { idx })
}

/**
 * 
 * @param {string} cat 类别 "全部"、“华语”、“古风“、”欧美“、“流行“
 * @param {number} limit 取出歌单数量 
 */
export function getSongMenu(cat = "全部", limit = 6) {
  return xmRequest.get('/top/playlist', { cat, limit })
}
