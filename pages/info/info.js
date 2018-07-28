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
    firstDay: null,    // 第一次使用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    howLongDay: null,
    howLongMin: null,
    timeTips: null,
  },
  onShow: function() {
    let a = wx.getStorageSync('logs')
    let firstDay = a[a.length-1] - 1000;
    let now = a[0]
    this.setData({
      howLongDay: Math.ceil((now-firstDay) / 60 / 60 / 24 / 1000),
    })


    let tempHowLongTime =  app.globalData.allTickTime  // 得到的是秒
    if (tempHowLongTime === 0) {
      this.setData({
        timeTips: '您还没有任何冥想体验',
        howLongMin: 0,
      })
    } else if (tempHowLongTime < 60 && tempHowLongTime > 0) {   // 不足一分钟
      this.setData({
        timeTips: '您已冥想',
        howLongMinTip: tempHowLongTime+' Seconds',
        howLongMin: tempHowLongTime
      })
    } else {
      tempHowLongTime = Math.floor(tempHowLongTime / 60)   // 获取分钟
      this.setData({
        timeTips: '您已冥想',
        howLongMinTip: tempHowLongTime+' Mins',
        howLongMin: tempHowLongTime
      })
    }
  },
  onLoad: function() {
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
    let a = wx.getStorageSync('logs')
    let firstDay = a[a.length-1] - 1000;
    let now = a[0]
    this.setData({
      howLongDay: Math.ceil((now-firstDay) / 60 / 60 / 24 / 1000),
    })

    let tempHowLongTime =  app.globalData.allTickTime  // 得到的是秒
    console.log(tempHowLongTime === 0)
    if (tempHowLongTime === 0) {
      this.setData({
        timeTips: '您还没有任何冥想体验',
        howLongMin: 0,
      })
    } else if (tempHowLongTime < 60 && tempHowLongTime > 0) {   // 不足一分钟
      this.setData({
        timeTips: '您已冥想',
        howLongMinTip: tempHowLongTime+' Seconds',
        howLongMin: tempHowLongTime
      })
    } else {
      tempHowLongTime = Math.floor(tempHowLongTime / 60)   // 获取分钟
      this.setData({
        timeTips: '您已冥想',
        howLongMinTip: tempHowLongTime+' Mins',
        howLongMin: tempHowLongTime
      })
    }
  },
  clickToFindClasses: function() {
    console.log('gg')
    wx.switchTab({
      url: '/pages/curriculum/curriculum'
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
