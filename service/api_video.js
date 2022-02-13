import xmRequest from './index'

export function getTopMV(offset, limit = 10) {
  return xmRequest.get('/top/mv', { offset, limit })
}

/**
 * 获取视频详情
 * @param {number} mvid 
 */
export function getMVDetial(mvid) {
  return xmRequest.get('/mv/detail', { mvid })
}
/**
 * 获取视频播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id) {
  return xmRequest.get('/mv/url', { id })
}
/**
 * 获取相关视频
 * @param {number} id 
 */
export function getRelateMV(id) {
  return xmRequest.get('/related/allvideo', { id })
}