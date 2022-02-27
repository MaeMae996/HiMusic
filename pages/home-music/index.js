// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index'
import { getBannerList, getSongMenu } from '../../service/api_music'
import getSwiperHeight from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(getSwiperHeight, 1000, { trailing: true })
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
    },
    songDetail: {},
    isPlaying: false
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
    this.setupPlayerStoreListener()
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
      url: '/packageDetail/pages/music-search/index',
    })
  },
  /**
   * 图片加载完成时触发
   */
  handleSwiperImageLoaded: function () {
    // 获取图片宽高（如何获取某一个组件<image/>的高度）
    throttleQueryRect(".banners-pic").then(res => {
      this.setData({ swiperHeight: res[0]?.height })
    })
  },

  /**
   * 点击推荐歌曲的”更多“跳转歌单详情页
   */
  handleMoreClick: function () {
    this.navigateToDetailSongPage('hotRanking')
  },
  /**
   * 点击榜单item，跳转到对应的榜单详情
   * @param {*} event 
   */
  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongPage(rankingName)

  },
  navigateToDetailSongPage: function (rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-song/index?ranking=${rankingName}&type=rank`,
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

  // 获取播放歌曲列表
  handleSongItemClick: function (e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },

  // 播放工具栏之播放/暂停
  handlePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStateAction", !this.data.isPlaying)
  },
  // 点击播放工具栏跳转至歌曲播放页
  handlePlayBarClick: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/packagePlayer/pages/music-player/index?id=' + id,
    })
  },
  setupPlayerStoreListener: function () {
    rankingStore.onState("hotRanking", (res) => {
      if (!res.tracks) return
      const recommendSongs = res.tracks?.slice(0, 6)
      this.setData({ recommendSongs })
    })
    // rankingStore.onState("newRanking", this.getNewRankingHandler)
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

    playerStore.onStates(["songDetail", "isPlaying"], ({ songDetail, isPlaying }) => {
      if (songDetail) this.setData({ songDetail })
      if (isPlaying !== undefined) this.setData({ isPlaying })
    })
  }
})