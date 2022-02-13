// pages/home-video/index.js
import { getTopMV } from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   * async await
   */
  onLoad: function (options) {
    this.getTopMVData(0)
    // const res = await getTopMV(0);
    // this.setData({ topMVs: res.data })
    /*getTopMV(0).then(res => {
      this.setData({ topMVs: res.data })
    })*/
  },

  /**
   * 封装网络请求的方法
   * @param {number} offset 
   */
  async getTopMVData(offset) {
    // 判断是否可以请求数据
    if (!this.data.hasMore && offset !== 0) return

    // 展示加载动画
    wx.showNavigationBarLoading()

    // 真正请求数据
    const res = await getTopMV(offset);
    let newData = this.data.topMVs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    // 设置数据
    this.setData({ topMVs: newData })
    this.setData({ hasMore: res.hasMore })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  /**
   * 封装事件处理
   * @param {*} event 
   */
  handleVideoItemClick: function (event) {
    // console.log(event);
    const id = event.currentTarget.dataset.item.id;
    // 页面跳转
    wx.navigateTo({
      url: '/pages/detail-video/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getTopMVData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if (!this.data.hasMore) return
    // const res = await getTopMV(this.data.topMVs.length)
    // this.setData({ topMVs: this.data.topMVs.concat(res.data) })
    // this.setData({ hasMore: res.hasMore })
    this.getTopMVData(this.data.topMVs.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})