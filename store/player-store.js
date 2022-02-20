import { HYEventStore } from "hy-event-store";
import { parseLyric } from "../utils/parse-lyric";
import { getSongDetail, getSongLyric } from "../service/api_player"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
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
    isPlaying: false

  },
  actions: {
    playMusicWithSongIdAction: function (ctx, { id }) {
      ctx.id = id
      ctx.isPlaying = true
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
      this.dispatch("setupAudioContextListenerAction")
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
    },

    changeMusicPlayStateAction: function (ctx) {
      ctx.isPlaying = !ctx.isPlaying
      ctx.isPlaying ?audioContext.play():audioContext.pause()
    }
  }
})

export {
  audioContext,
  playerStore
}