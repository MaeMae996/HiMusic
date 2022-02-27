// app.js
import { getLoginCode, CodeToToken, CheckToken, checkSession } from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    deviceRatio: 0
  },
  onLaunch: async function () {
    // 获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.deviceRatio = info.screenHeight / info.screenWidth;
    // 让用户默认进行登录
    this.handleLogin()
    // 获取用户信息
    
  },

  handleLogin: async function () {
    const token = wx.getStorageSync(TOKEN_KEY)
    // token是否过期
    const checkResult = await CheckToken()
    // 判断session是否过期
    const isSessionExpired = await checkSession()
    // 没有token，token过期，session过期
    if (!token || checkResult.errorCode || !isSessionExpired) {
      this.loginAction()
    }
  },

  loginAction: async function () {
    // 1.获取code
    const code = await getLoginCode()
    // 2.将code发送给服务器
    const result = await CodeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
