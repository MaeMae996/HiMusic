// pages/detail-video/index.js
import { getMVDetial, getMVURL, getRelateMV } from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvInfo: {},
    mvURL: {},
    relateMv: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id);
    const id = options.id;
    this.getVideoInfo(id)
  },

  /**
   * 请求视频相关信息数据
   * @param {number} id 
   */
  getVideoInfo: function (id) {
    // 1. 请求播放地址
    getMVURL(id).then(res => {
      this.setData({ mvURL: res.data })
    })
    // 2. 请求视频信息
    getMVDetial(id).then(res => {
      this.setData({ mvInfo: res.data })
    })
    // 3. 请求相关视频
    getRelateMV(id).then(res => {
      this.setData({ relateMv: res.data })
    })
  }
})