import { HYEventStore } from "hy-event-store";
import { getRankings } from '../service/api_music'

// 优化：用map代替switch遍历
const rankingMap = { 0: "newRanking", 1: "hotRanking", 2: "originRanking", 3: "upRanking" }

const rankingStore = new HYEventStore({
  state: {
    // 0 新歌榜
    newRanking: {},
    // 2 原创榜
    originRanking: {},
    // 1 热歌榜
    hotRanking: {},
    // 3 飙升榜
    upRanking: {}
  },
  actions: {
    getRankingDataAction(ctx) {
      // getRankings(0).then(res => {
      //   ctx.upRanking = res.playlist
      // })
      //  0 新歌 1 热门 2 原创 3 飙升
      for (let i = 0; i < 4; i++) {
        getRankings(i).then(res => {
          const rankingName = rankingMap[i];
          ctx[rankingName] = res.playlist
          // switch (i) {
          //   case 0:
          //     ctx.newRanking = res.playlist
          //     break;
          //   case 1:
          //     ctx.hotRanking = res.playlist
          //     break;
          //   case 2:
          //     ctx.originRanking = res.playlist
          //     break;
          //   case 3:
          //     ctx.upRanking = res.playlist
          //     break;
          // }
        })
      }
    }
  }
})

export {
  rankingStore
}