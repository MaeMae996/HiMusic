// pages/home-music/index.js
import { rankingStore } from '../../store/index'
import { getBannerList, getSongMenu } from '../../service/api_music'
import getSwiperHeight from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(getSwiperHeight, 1000)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    // 0 新歌 1 热门 2 原创 3 飙升
    // 不能设置为数组，因为顺序有可能乱
    rankings: {
      0: {},
      2: {},
      3: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData()

    // 发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")

    // 从store获取共享的数据  
    rankingStore.onState("hotRanking", (res) => {
      const recommendSongs = res.tracks?.slice(0, 6)
      this.setData({ recommendSongs })
    })
    // rankingStore.onState("newRanking", this.getNewRankingHandler)
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))
  },

  /**
   * 获取页面数据
   */
  getPageData: function () {
    getBannerList().then(res => {
      this.setData({ banners: res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })
    getSongMenu('华语').then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },


  /**
   * 事件处理
   */
  handleSearchClick: function () {
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

  getRankingHandler: function (idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name;
      const cover = res.coverImgUrl;
      const count = res.playCount;
      const songList = res.tracks.slice(0, 3)
      const rankingObj = { name, cover, count, songList }
      this.setData({
        rankings: {
          ...this.data.rankings,
          [idx]: rankingObj
        }
      })
    }
  },

  onUnload: function () {

  }
})