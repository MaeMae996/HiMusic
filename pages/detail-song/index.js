// pages/detail-song/index.js
import { rankingStore } from '../../store/index'
import { getMenuDetail } from '../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    ranking: "",
    rankingInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({ type })
    if (type === 'menu') {
      const id = options.id
      getMenuDetail(id).then(res => {
        this.setData({
          rankingInfo: res.playlist
        })
      })
    } else if (type === 'rank') {
      const ranking = options.ranking
      this.setData({ ranking })
      // get data
      rankingStore.onState(ranking, this.getRankingDataHandler)
    }

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  getRankingDataHandler: function (res) {
    this.setData({ rankingInfo: res })
  },
})