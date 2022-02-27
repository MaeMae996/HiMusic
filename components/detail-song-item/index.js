import { playerStore } from "../../store/player-store"

// components/detail-song-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemInfo: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleSongItemClick: function () {
      const id = this.properties.itemInfo.id
      // 页面跳转
      wx.navigateTo({
        url: '/packagePlayer/pages/music-player/index?id=' + id,
      })
      // 对歌曲的数据请求和其他操作
      playerStore.dispatch("playMusicWithSongIdAction", { id })
    }
  }
})
