// pages/detail-song/index.js
import { playerStore, rankingStore } from '../../../store/index'
import { getMenuDetail } from '../../../service/api_music'
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
  handleSongItemClick: function (e) {
    const index = e.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.rankingInfo.tracks)
    playerStore.setState("playListIndex", index)
  },

  getRankingDataHandler: function (res) {
    this.setData({ rankingInfo: res })
  },
})