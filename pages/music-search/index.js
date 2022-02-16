// pages/music-search/index.js
import { getSearchHot, getSearchSuggest } from '../../service/api_search'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywords: [],
    searchSuggest: [],
    searchVal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
  },
  getPageData: function () {
    getSearchHot().then(res => {
      this.setData({ keywords: res.result.hots })
    })
  },
  handleSearchChange: function (e) {
    const searchVal = e.detail;
    this.setData({ searchVal })

    if (!searchVal.length) {
      this.setData({ searchSuggest: [] })
      return
    }

    getSearchSuggest(searchVal).then(res => {
      this.setData({ searchSuggest: res.result.allMatch })
    })
  }

})