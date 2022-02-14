// pages/home-music/index.js
import { getBannerList } from '../../service/api_music'
import getSwiperHeight from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(getSwiperHeight, 1000)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },

  /**
   * 获取页面数据
   */
  getPageData: function () {
    getBannerList().then(res => {
      this.setData({ banners: res.banners })
    })
  },


  /**
   * 事件处理
   */
  handleSearchClick: function () {
    console.log(111);
    wx.navigateTo({
      url: '../music-search/index',
    })
  },
  /**
   * 图片加载完成时触发
   */
  handleSwiperImageLoaded: function () {
    // 获取图片宽高（如何获取某一个组件<image/>的高度）
    throttleQueryRect(".banners-pic").then(res => {
      this.setData({ swiperHeight: res[0].height })
    })
  },

  onUnload: function () {

  }
})