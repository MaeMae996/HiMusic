// pages/music-player/index.js
import { audioContext, playerStore } from '../../../store/index'
const playModeNames = ["order", "repeat", "random"]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 共享歌曲信息数据
    id: '',
    songDetail: {},
    songLyric: [],
    durationTime: 0,
    currentTime: 0,
    currentLyricText: '',
    currentLyricIndex: 0,

    currentPage: 0,
    contentHeight: 0,
    isMusicLyric: true,
    // 进度条
    sliderValue: 0,
    isSliderChanging: false,

    lyricScrollTop: 0,

    playModeIndex: 0,
    playModeName: 'order',
    isPlaying: false,
    playingName: 'pause',


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取id
    const id = options.id
    this.setData({ id })
    // 2.根据id获取歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const contentHeight = screenHeight - statusBarHeight - 44
    const deviceRatio = globalData.deviceRatio
    this.setData({ contentHeight, isMusicLyric: deviceRatio >= 2 })

    // // audioContext播放歌曲
    // audioContext.stop()
    // // 音频流-》解码-》播放
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true

    // 4.audioContext的事件监听
    // this.setupAudioContextListener()

  },
  // ============================网络请求============================
  // getPageData: function (id) {
  //   // 请求歌曲详情
  //   getSongDetail(id).then(res => {
  //     this.setData({ songDetail: res.songs[0], durationTime: res.songs[0].dt })
  //   })
  //   // 获取歌词
  //   getSongLyric(id).then(res => {
  //     this.setData({ songLyric: parseLyric(res.lrc.lyric) })
  //   })
  // },

  // ============================audioContext的事件监听============================
  // setupAudioContextListener: function () {
  //   // 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
  //   audioContext.onCanplay(() => {
  //     audioContext.play()
  //   })
  //   // 监听音频当前播放时间
  //   audioContext.onTimeUpdate(() => {
  //     const currentTime = audioContext.currentTime * 1000
  //     // 设置进度条跟随歌曲播放自动前进
  //     // 进度条正在改变的时候，不能设置进度条的值，否则会出现拖拽问题
  //     if (!this.data.isSliderChanging) {
  //       const sliderValue = currentTime / this.data.durationTime * 100
  //       this.setData({ currentTime, sliderValue })
  //     }
  //     // 3.根据当前时间查找播放的歌词
  //     if (!this.data.songLyric.length) return
  //     let i = 0
  //     for (; i < this.data.songLyric.length; i++) {
  //       const lyricInfo = this.data.songLyric[i]
  //       if (currentTime < lyricInfo.time) {
  //         break
  //       }
  //     }
  //     // 设置当前歌词索引
  //     const currentIndex = i - 1
  //     // 当在某时间段内是同一句歌词时，不需要重新设置一次currentLyricText
  //     if (this.data.currentLyricIndex !== currentIndex) {
  //       const currentLyricInfo = this.data.songLyric[currentIndex]
  //       // console.log(currentIndex, currentLyricInfo.text);
  //       this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex, lyricScrollTop: currentIndex * 35 })
  //     }
  //   })
  // },

  /* ============================事件处理============================*/
  /**
   * 
   * @param {*} e 
   */
  handleSwiperChange: function (e) {
    const currentPage = e.detail.current
    this.setData({ currentPage })
  },

  /**
   * 进度条正在改变
   * @param {} e 
   */
  handleSliderChanging: function (e) {
    // 1. 获取slider变化的值
    const val = e.detail.value
    // 2. 希望播放的currentTime
    const currentTime = this.data.durationTime * val / 100
    this.setData({ isSliderChanging: true, currentTime })
  },

  /**
   * 监听拖拽进度条变化
   */
  handleSliderChange: function (e) {
    // 1. 获取slider变化的值
    const val = e.detail.value
    // 2. 希望播放的currentTime
    const currentTime = this.data.durationTime * val / 100
    // 3. 设置audioContext播放currentTime位置的音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    // 4. 记录最新sliderValue，并且需要将isSliderChanging设置为false
    this.setData({ sliderValue: val, isSliderChanging: false })
  },

  handleBackClick: function () {
    wx.navigateBack()
  },

  // 播放操作
  handleModeClick: function () {
    // 0 1 2
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0
    // 设置最新的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },

  /**
   * 播放/暂停
   */
  handlePlayingClick: function () {
    // 这个只是修改了播放状态，并没有暂停/播放歌曲。要通过audioContext调用API实现
    // playerStore.setState("isPlaying", !this.data.isPlaying)
    playerStore.dispatch("changeMusicPlayStateAction", !this.data.isPlaying)
  },
  /**
   * 上一首
   */
  handlePrevBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  /**
   * 下一首
   */
  handleNextBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction", true)
  },

  // ============================数据监听============================
  setupPlayerStoreListener: function () {
    // 1.监听songDetail/durationTime/songLyric
    playerStore.onStates(["songDetail", "durationTime", "songLyric"], ({
      songDetail,
      durationTime,
      songLyric
    }) => {
      if (songDetail) this.setData({ songDetail })
      if (durationTime) this.setData({ durationTime })
      if (songLyric) this.setData({ songLyric })
    })
    // 2.监听currentTime/currentLyricText/currentLyricIndex
    playerStore.onStates(["currentTime", "currentLyricText", "currentLyricIndex"], ({
      currentTime,
      currentLyricText,
      currentLyricIndex
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    // 3. 
    playerStore.onStates(["playModeIndex", "isPlaying"], ({ playModeIndex, isPlaying }) => {
      if (playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }
      if (isPlaying !== undefined) {
        this.setData({ isPlaying, playingName: isPlaying ? 'pause' : 'resume' })
      }
    })
  }
})