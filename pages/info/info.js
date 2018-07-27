const app = getApp()


// let _this = this
// let tempSwitch = (app.globalData.audio.isDisplay && (this.data.clockSwitchInfo.waiting === true)) 
// tempSwitch && (
// this.setData({
//   intervalID: setInterval(this.ddd.bind(this), 1000)
// }))
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    innerAudioContext: null
  },
  onLoad: function() {
    app.globalData.audio.innerAudioContext = wx.createInnerAudioContext()
    this.setData({
      innerAudioContext: app.globalData.audio.innerAudioContext
    })
    app.globalData.audio.innerAudioContext.autoplay = false
    app.globalData.audio.innerAudioContext.src = 'https://od.lk/s/NV8xMjIyMTUxMzVf/1-1.mp3'
    app.globalData.audio.innerAudioContext.onPlay(() => {
        console.log('开始播放')
    })
    app.globalData.audio.innerAudioContext.onStop(() => {
      console.log('停止播放')
    })
    app.globalData.audio.innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
    })
    if (app.globalData.hasUserInfo) {    // 如果有全局的data
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 没有open-type = getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  clickToListen: function() {
    if (app.globalData.audio.isDisplay) {
      app.globalData.audio.isDisplay = false
      app.globalData.audio.innerAudioContext.stop()
    } else {
      app.globalData.audio.isDisplay = true
      app.globalData.audio.innerAudioContext.play()
     }
   },
  // onHide: function() {
  //   app.globalData.audio.innerAudioContext.src = null
  // },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
