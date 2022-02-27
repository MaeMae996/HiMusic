// pages/home-profile/index.js
import { getUserInfo } from '../../service/api_login'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  handleGetUser: async function () {
    const res = await getUserInfo()
    this.setData({ userInfo: res.userInfo })
  },
  handleGetPhoneNumber: function (e) {
    console.log(e);
  }

})