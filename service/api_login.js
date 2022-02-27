import { xmLoginRequest } from './index'
/**
 * 获取code
 */
export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
/**
 * 将code传到服务端
 * @param {*} code 
 */
export function CodeToToken(code) {
  return xmLoginRequest.post('/login', { code })
}
/**
 * 判断token是否过期
 */
export function CheckToken() {
  return xmLoginRequest.post('/auth', {}, true)
}
/**
 * 判断session是否过期
 */
export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善个人信息',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}