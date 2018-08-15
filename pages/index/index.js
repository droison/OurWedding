//index.js
//获取应用实例
const app = getApp()
var appid = app.globalData.appid;
const AV = require("../../WxComment/libs/leancloud/av-weapp-min.js");
var Common = require('../../WxComment/libs/scripts/common.js');
// LeanCloud 应用的 ID 和 Key
// AV.init({
//   appId: 'Q7y6ChsRaO66w6DLJ7XR0IF9-gzGzoHsz',
//   appKey: 'tO9g5jhd0ETAx2vrRtR1NLp5',
// });


Page({
  data: {
    userInfo: {},
    music_url: 'http://pcgm4rcvg.bkt.clouddn.com/bgmusic_yudao.mp3',
    isPlayingMusic: true,
    title: '我们结婚啦',
    coverImgUrl: 'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG14.jpeg',


    testimgUrls: [
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG13.jpeg',
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG19.jpeg',
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG18.jpeg',
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG17.jpeg',
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG16.jpeg',
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG15.jpeg',
      'http://7vii9n.com1.z0.glb.clouddn.com/WechatIMG14.jpeg'
    ],
  },
  onLoad: function() {
    var that = this

    wx.getUserInfo({
      success: function(res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })


    var query = new AV.Query('ImageList');
    query.include('src');
    query.find().then(function (imageList) {
      // 将返回结果返回到 data 数据中，以在 wxml 渲染
      var serverImageList = [];
      for (var i = 0, len = imageList.length; i < len; i++) {
        var str = JSON.stringify(imageList[i]);
        var obj = JSON.parse(str);
        serverImageList.push(obj.src);
        console.log('柴淞 看图' + obj.src);//遍历输出
      }
      if (serverImageList.length > 0) {
        that.setData({
          testimgUrls: serverImageList
        })
      }
    }, function (err) {
      console.log(err);
    });



    /**
     * 不支持aac格式
     */
    const backgroundAudioManager = wx.getBackgroundAudioManager()
    player()
    function player() {
      backgroundAudioManager.title = that.data.title,
      backgroundAudioManager.src = that.data.music_url
      backgroundAudioManager.coverImgUrl = that.data.coverImgUrl
      backgroundAudioManager.play();

      backgroundAudioManager.onEnded(() => {
        player()
      })
    }

    // wx.playBackgroundAudio({
    //   dataUrl: this.data.music_url,
    //   title: this.data.title,
    //   coverImgUrl: this.data.coverImgUrl
    // })

  

  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    wx.getBackgroundAudioManager().play();
    this.setData({
      isPlayingMusic: true
    })
  },
  onHide: function() {
    // 页面隐藏
    wx.getBackgroundAudioManager().pause();
    this.setData({
      isPlayingMusic: false
    })
  },

  onUnload: function() {
    // 页面关闭
    wx.getBackgroundAudioManager().pause();
    this.setData({
      isPlayingMusic: false
    })
  },

  onShareAppMessage: function(res) {
    var that = this;
    //console.log(that.data);
    return {
      title: that.data.mainInfo.share,
      imageUrl: that.data.mainInfo.thumb,
      path: 'pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },

  play: function(event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url,
        title: this.data.title,
        coverImgUrl: this.data.coverImgUrl
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
})