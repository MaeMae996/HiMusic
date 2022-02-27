// pages/music-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../../service/api_search'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'
const debounceSearchSuggest = debounce(getSearchSuggest, 100)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    searchSuggest: [],
    searchVal: '',
    suggestNodes: [],
    resultSongs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取页面数据
    this.getPageData()
  },
  // 网络请求
  getPageData: function () {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  handleSearchChange: function (e) {
    // 1. 获取搜索框值
    const searchVal = e.detail;
    // 2. 设置关键字
    this.setData({ searchVal })
    // 3. 判断关键字为空字符的处理逻辑
    if (!searchVal.length) {
      this.setData({ searchSuggest: [], resultSongs: [] })
      debounceSearchSuggest.cancel()
      return
    }
    // 4. 请求搜索建议数据
    debounceSearchSuggest(searchVal).then(res => {
      const searchSuggest = res.result.allMatch
      this.setData({ searchSuggest })

      // ->转化成nodes
      const suggestKeywords = searchSuggest.map(item => item.keyword)
      const suggestNodes = []
      for (const keywords of suggestKeywords) {
        const nodes = stringToNodes(keywords, searchVal)
        suggestNodes.push(nodes)
      }
      this.setData({ suggestNodes })
    })
  },

  handleSearchAction: function () {
    const searchVal = this.data.searchVal;
    getSearchResult(searchVal).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },

  handleKeywordItemClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    // 将关键字填充到搜索框中
    this.setData({ searchVal: keyword })
    // 发送网络请求
    this.handleSearchAction()
  }
})