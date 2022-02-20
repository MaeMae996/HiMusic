const timePattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString) {
  const lyricStrings = lyricString.split('\n')
  const lyricInfos = []
  for (const lineString of lyricStrings) {
    // [00:00.000] 作词 : 唐恬
    const timeRes = timePattern.exec(lineString)
    // get time
    if (!timeRes) continue
    const min = timeRes[1] * 60 * 1000
    const sec = timeRes[2] * 1000
    const millsec = timeRes[3].length === 3 ? timeRes[3] * 1 : timeRes[3] * 10
    const time = min + sec + millsec

    // get text
    const text = lineString.replace(timePattern, "")
    const lyricInfo = {
      time,
      text
    }
    lyricInfos.push(lyricInfo)
  }
  return lyricInfos
}