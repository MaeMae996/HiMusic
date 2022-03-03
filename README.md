# HiMusic
仿网易云音乐小程序

## 工具
微信小程序开发工具 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

## 小程序开发指南
可参考：https://developers.weixin.qq.com/miniprogram/dev/framework/

## 核心技术：
1. 页面布局：WXML
2. 页面样式：WXSS
3. 页面脚本：JS+WXS
4. UI框架：Vant Weapp https://youzan.github.io/vant-weapp/#/home




# HYMusic接口文档

> baseURL：http://123.207.32.32:9001

## 一. 视频接口

### 1. top mv

说明 : 调用此接口 , 可获取 mv 排行

**可选参数 :** `limit`: 取出数量 , 默认为 30

`area`: 地区,可选值为内地,港台,欧美,日本,韩国,不填则为全部

`offset`: 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0

**接口地址 :** `/top/mv`

**调用例子 :** `/top/mv?limit=10`



### 2. 获取 mv 数据

说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 , 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口

**必选参数 :** `mvid`: mv 的 id

**接口地址 :** `/mv/detail`

**调用例子 :** `/mv/detail?mvid=5436712`



### 3. mv地址

说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址

**必选参数 :** `id`: mv id

**可选参数 :** `r`: 分辨率,默认 1080,可从 `/mv/detail` 接口获取分辨率列表

**接口地址 :** `/mv/url`

**调用例子 :**`/mv/url?id=5436712` `/mv/url?id=10896407&r=1080`



### 4. 相关视频

说明 : 调用此接口 , 可获取相关视频

**必选参数 :** `id`: 视频 的 id

**接口地址 :** `/related/allvideo`

**调用例子 :** `/related/allvideo?id=89ADDE33C0AAE8EC14B99F6750DB954D`



## 二. 音乐接口

### 1. 轮播图

说明 : 调用此接口 , 可获取 banner( 轮播图 ) 数据

**可选参数 :**

`type`:资源类型,对应以下类型,默认为 0 即 PC

>0: pc
>
>1: android
>
>2: iphone
>
>3: ipad

**接口地址 :** `/banner`

**调用例子 :** `/banner`, `/banner?type=2`



### 2. 歌曲排行

说明 : 调用此接口 , 传入榜单 id, 可获取不同排行榜数据(v3.34.0 之后不再支持 idx 参数)

**必选参数 :** `idx`: 榜单 idx,通过所有榜单接口获取

> 0 新歌 
>
> 1 热门 
>
> 2 原创 
>
> 3 飙升

**接口地址 :** `/top/list`

**调用例子 :** `/top/list?idx=0`



### 3. 歌单

说明 : 调用此接口 , 可获取网友精选碟歌单

**可选参数 :** 

`cat`: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)

`limit`: 取出歌单数量 , 默认为 50

`offset`: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值

**接口地址 :** `lhol`

**调用例子 :** `/top/playlist?limit=10`



### 4. 热门歌单分类

说明 : 调用此接口,可获取歌单分类,包含 category 信息

**接口地址 :** `/playlist/hot`

**调用例子 :** `/playlist/hot`



### 5. 歌单详情

说明 : 调用后可获取歌单详情动态部分,如评论数,是否收藏,播放数

**必选参数 :** `id` : 歌单 id

**接口地址 :** `/playlist/detail/dynamic`

**调用例子 :** `/playlist/detail/dynamic?id=6954660951`



## 三. 搜索接口

### 1. 热门搜索

说明 : 调用此接口,可获取热门搜索列表

**接口地址 :** `/search/hot`

**调用例子 :** `/search/hot`



### 2. 搜索建议

说明 : 调用此接口 , 传入搜索关键词可获得搜索建议 , 搜索结果同时包含单曲 , 歌手 , 歌单 ,mv 信息

**必选参数 :** `keywords` : 关键词

**可选参数 :** `type` : 如果传 'mobile' 则返回移动端数据

**接口地址 :** `/search/suggest`

**调用例子 :** `/search/suggest?keywords= 海阔天空` `/search/suggest?keywords= 海阔天空&type=mobile`



### 3. 搜索接口

说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 , 关键词可以多个 , 以空格隔开 , 如 " 周杰伦 搁浅 "( 不需要登录 ), 搜索获取的 mp3url 不能直接用 , 可通过 `/song/url` 接口传入歌曲 id 获取具体的播放链接

**必选参数 :** `keywords` : 关键词

**可选参数 :** `limit` : 返回数量 , 默认为 30 `offset` : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0

`type`: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合

**接口地址 :** `/search` 或者 `/cloudsearch`(更全)

**调用例子 :** `/search?keywords= 海阔天空` `/cloudsearch?keywords= 海阔天空`



## 四. 播放接口

### 1. 歌曲详情

说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 `,` 隔开), 可获得歌曲详情

**必选参数 :** `ids`: 音乐 id, 如 `ids=347230`

**接口地址 :** `/song/detail`

**调用例子 :** `/song/detail?ids=347230`,`/song/detail?ids=347230,347231`



### 2. 歌词信息

说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )

**必选参数 :** `id`: 音乐 id

**接口地址 :** `/lyric`

**调用例子 :** `/lyric?id=33894312`



### 3. 播放接口

> `https://music.163.com/song/media/outer/url?id=${id}.mp3`

# 小程序登录相关API
> LOGIN_BASE_URL = 'http://123.207.32.32:3000'
## 将code传到开发者服务端
**必须参数：** `{code}`
**接口地址 ：** `/login`

## 判断token是否过期
**接口地址：** `/auth`

