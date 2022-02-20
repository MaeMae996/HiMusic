import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/parse-lyric";
import { getSongDetail, getSongLyric } from "../service/api_player"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,
    // 歌曲信息
    id: 0,
    songDetail: {},
    currentTime: 0,
    durationTime: 0,
    // 歌词
    songLyric: [],
    currentLyricText: '',
    currentLyricIndex: 0,

    playModeIndex: 0, //0 循环播放 1 单曲循环 2 随机播放
    isPlaying: false,

    // 上/下一首
    playListSongs: [],//记录歌曲列表
    playListIndex: 0,//当前播放歌曲的索引,
    currentSong: ''
  },
  actions: {
    playMusicWithSongIdAction: function (ctx, { id }) {
      if (ctx.id == id) {
        this.dispatch("changeMusicPlayStateAction", true)
        return
      }
      ctx.id = id
      ctx.isPlaying = true
      // 消除上一首歌的信息，防止在切换歌曲时出现残影
      ctx.songDetail = {}
      ctx.currentTime = 0
      ctx.durationTime = 0
      ctx.songLyric = []
      ctx.currentTime = 0
      ctx.currentLyricText = ''
      ctx.currentLyricIndex = 0
      // 1. 请求歌曲数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.songDetail = res.songs[0];
        ctx.durationTime = res.songs[0].dt
      })
      // 请求歌词信息
      getSongLyric(id).then(res => {
        ctx.songLyric = parseLyric(res.lrc.lyric)
      })

      // 2. 播放对应id的歌曲
      // audioContext播放歌曲
      audioContext.stop()
      // 音频流-》解码-》播放
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      // 3. 监听AudioContext一些事件
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },

    setupAudioContextListenerAction: function (ctx) {
      // 1.监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 2.监听音频当前播放时间
      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000

        // 2. 设置当前事件
        ctx.currentTime = currentTime

        // 3.根据当前时间查找播放的歌词
        if (!ctx.songLyric.length) return
        let i = 0
        for (; i < ctx.songLyric.length; i++) {
          const lyricInfo = ctx.songLyric[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        // 设置当前歌词索引
        const currentIndex = i - 1
        // 当在某时间段内是同一句歌词时，不需要重新设置一次currentLyricText
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.songLyric[currentIndex]
          // console.log(currentIndex, currentLyricInfo.text);
          // this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex, lyricScrollTop: currentIndex * 35 })
          ctx.currentLyricText = currentLyricInfo.text;
          ctx.currentLyricIndex = currentIndex

        }
      })

      // 3. 监听歌曲播放完成
      // 自动播放下一首
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })
    },

    changeMusicPlayStateAction: function (ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },

    changeNewMusicAction: function (ctx, isNext = true) {
      // 获取索引
      let index = ctx.playListIndex

      // 根据不同播放模式，获取下一首歌的索引
      switch (ctx.playModeIndex) {
        case 0: //顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break
        case 1: //单曲循环
          break
        case 2: //随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }
      // 获取歌曲
      let songDetail = ctx.playListSongs[index]
      if (!songDetail) {
        songDetail = ctx.songDetail
      } else {
        ctx.playListIndex = index
      }
      this.dispatch("playMusicWithSongIdAction", { id: songDetail.id })
    }
  }
})

export {
  audioContext,
  playerStore
}