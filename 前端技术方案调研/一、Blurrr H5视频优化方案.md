# 一、Blurrr H5视频优化方案

## 1. 背景

随着Blurrr用户群的增长，视频创作质量达到了一个新高度，目前H5播放器已经不能很好满足此类视频播放需求。此前对视频播放增加loading效果，但是对于高码率的视频已经没啥效果了。因此提出本次优化方案！！！

视频的三要素：分辨率、帧率、码率。

| 分辨率          | 码率      | 帧率    | 编码格式 |
| ------------ | ------- | ----- | ---- |
| 高清(640\*480) | 500kbps | 30fps | H264 |
| 标清(480\*360) | 350kbps | 30fps | H264 |
| 流畅(320\*240) | 250kbps | 30fps | H264 |

## 2.  码率优化

### 2.1码率介绍

码率，也称比特率 Bit Rate，或叫位速率，是单位时间内视频（或音频）的数据量，通俗一点的理解：是视频编码中画面质量控制中最重要的部分，单位是 bps (bit per second，位每秒），一般使用 kbps（千位每秒）或Mbps（百万位每秒）。一般来说同样分辨率下，视频文件的码率越大，压缩比就越小，画面质量就越高。码率越大，说明单位时间内取样率越大，数据流，精度就越高，处理出来的文件就越接近原始文件，图像质量越好，画质越清晰，要求播放设备的解码能力也越高。

### 2.2**码率的作用**

码率越大，说明单位时间内取样率越大，数据流精度就越高，这样表现出来的的效果就是，视频画面更清晰画质更高。 视频在经过编码压缩时可能会降低码率，过低的码率会造成画面中出现马赛克，既画面中一些区域的色阶劣化，而造成颜色混乱导致看不清细节的情况（如新闻中犯罪嫌疑人的头像经常使用）。这是因为每个像素都需要保留相应的信息，而降低码率后也相应的降低了其保留的信息，而没有信息的像素只能向周围的像素共享信息，这样就会显得颜色混乱，画面惨不忍睹。但是在码率恒定的情况下，我们可以通过降低分辨率也就是每帧画面中像素数量来规避马赛克，因为像素越少，就越不需要共享像素来渲染。

> **码率的计算方法**：码率(kbps)=文件大小(KB) \* 8 / 时间(秒)，本例中取视频文件的容量为 3.446G，视频长度100 分钟（6000 秒），计算结果：码率约等于 4818kbps(3.446 \* 1024 \* 1024 \* 8 / 6000 = 4817.857)

### 2.3 优化效果

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008749.png)

视频地址：

[https://video-beats-api-qa.camera360.com/ugc-h5/#/home?devtool=true](https://video-beats-api-qa.camera360.com/ugc-h5/#/home?devtool=true "https://video-beats-api-qa.camera360.com/ugc-h5/#/home?devtool=true")

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008908.png)

### 2.3优化方案

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008903.png)

注意事项：

- 机审需要额外增加转码成功校验。
- 旧数据需要写脚本触发。
- 七牛占用空间会增加一点，但相应流量会减少。

## 3. 分辨率优化

在一些人的认知里，会误以为分辨率就是决定清晰度的参数，其实不是的，**分辨率并不能决定视频清晰度。**

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008678.png)

比如说分辨率比较低（也就是纸张比较小）的，如果你用手机看，手机屏幕小，它看起来就很清晰，大一点它也是很清晰，总之差别不大。那在更大尺寸的屏幕上去播放这些分辨率太低的，它本身纸张就这么小，你去把它放到大屏幕上纸张就会被拉大，就和我们图片放大会模糊同样的一个道理。

只是在手机上播放观看的，一般720p是够的。现在的某音、某手这些视频平台上，720p优化反而更好，看起来也更清晰，**所以分辨率720p就足够适用于手机**。

### 3.1 优化效果

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008745.png)

注：压缩分辨率时，同步修改了码率大小。通过在视频剪辑师那里了解到，视频码率和分辨率有个最优的推荐配置表，因此同步做了修改。

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008174.png)

视频地址：

[https://video-beats-api-qa.camera360.com/ugc-h5/#/home?devtool=true](https://video-beats-api-qa.camera360.com/ugc-h5/#/home?devtool=true "https://video-beats-api-qa.camera360.com/ugc-h5/#/home?devtool=true")

### 3.2优化方案

1. 对于高分辨率的视频进行等比缩放，如：1k、2k、4k、自定义比例等视频。
2. 低分辨率不做处理。
3. 保留原视频，单独存储一份压缩后的视频。
4. 命名规则：原视频名称@720p

## 4. HLS

### 4.1背景

[HLS](https://link.juejin.cn/?target=https://developer.apple.com/streaming/ "HLS")为HTTP Live Streaming的缩写，是由苹果公司提出的基于HTTP的流媒体网络传输协议，它可以同时支持直播和点播，还支持多清晰度、音视频双轨、字幕等功能。它的原理是将一整条视频分成多段小的视频，完整的播放是由这一个个片段拼接而成的。

HLS在移动端使用很广泛，当前支持HLS协议的客户端有：

- iOS 3.0及以上，AVPlayer原生支持HLS
- Android 3.0及以上
- Adobe Flash Player 11.0及以上

它的大致原理是这样的：

![  ](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280008893.png "  ")

1、采集音视频

2、在服务器编码音视频

3、编码后以MPEG-2的传输串流形式交由切片器（Stream Segmenter）

4、切片器创建索引文件和ts播放列表，索引文件用于指示音视频位置，ts为真实的多媒体片段

5、将上一步资源放到HTTP服务器上

6、客户端请求该索引文件进行播放，可以通过索引文件找到播放内容

### 4.2 M3U8

实现HLS的一个关键步骤是上面的第四步，即索引文件和ts播放列表的组织。这里用到的就是M3U8格式。M3U8是Unicode版本的[M3U](https://link.juejin.cn/?target=https://zh.wikipedia.org/wiki/M3U "M3U")，8代表使用的是UTF-8编码，M3U和M3U8都是多媒体列表的文件格式。

播放页面为：[https://www.helloweba.net/demo/2018/hls/](https://www.helloweba.net/demo/2018/hls/ "https://www.helloweba.net/demo/2018/hls/")，我们可以得到视频播放过程中的M3U8文件。

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280009184.png)

### 4.3优化方案

![](https://noteimagebuket.oss-cn-hangzhou.aliyuncs.com/typora/202508280009869.png)

转码规则：

- m3u8文件的 第一个ts片段长度为1\~3秒
- m3u8文件的 第二个ts片段长度为3\~5秒
- m3u8文件的 第三个ts片段长度为10秒左右
- m3u8文件的 第四个ts片段以上长度为30秒左右
- m3u8文件 最长ts片段不超过35秒

> 优点：

1. 视频播放`秒开率`相较`mp4播放格式`，相信会有一个质的提升。
2. 对于长视频拖动播放体验较好。

> 缺点：

1. 对于高码率视频，首次下载还是会很卡。

## 5. 上传限制优化

目前限制了时长在一分钟以内的。目前看来没啥很大的用处。

[基于React的UI框架调研报告](https://www.wolai.com/qW7ktEuC8eLQxVTLX4nuA2 "基于React的UI框架调研报告")
