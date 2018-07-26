//app.js
const app = getApp()
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    if (!wx.getStorageSync('curriculumProgress')) {   // 初始化课程进度
      wx.setStorageSync('curriculumProgress', [0,0,0,0,0,0,0,0,0,0])
    }
    
    // 播放音频


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    tickTime: null,
    audio: {
      innerAudioContext: null,
      isDisplay: false
    },
    curriculumList: [
      {
        id: 0,
        name: '七天冥想基础入门A',
        description: 'this is A',
        cardImg: "http://pcfgv46cm.bkt.clouddn.com/card0.png",
        bgImg: "http://pcfgv46cm.bkt.clouddn.com/course0-bg.png",
        audioList: [
          {
            src: "https://od.lk/s/NV8xMjIyMTUxMzVf/1-1.mp3",
            length: "00:09:56"
          },
          {
            src: "https://od.lk/s/NV8xMjIzNjgyMDBf/1-2.mp3",
            length: "00:10:09"
          },
          {
            src: "https://od.lk/s/NV8xMjIzNjgzNDlf/1-3.mp3",
            length: "00:08:37"
          }
        ]
      },
      {
        id: 1,
        name: '七天冥想基础入门B',
        description: 'this is B',
        cardImg: "http://pcfgv46cm.bkt.clouddn.com/card1.png",
        bgImg: "http://pcfgv46cm.bkt.clouddn.com/course2-bg.png",
        audioList: [
          {
            src: "https://od.lk/s/NV8xMjIyMTUxMzVf/1-1.mp3",
            length: "00:02:56"
          },
          {
            src: "https://od.lk/s/NV8xMjIzNjgyMDBf/1-2.mp3",
            length: "00:10:09"
          },
          {
            src: "https://od.lk/s/NV8xMjIzNjgzNDlf/1-3.mp3",
            length: "00:08:37"
          }
        ]
      }, 
      {
        id: 2,
        name: '七天冥想基本入门C',
        description: 'this is B',
        cardImg: "http://pcfgv46cm.bkt.clouddn.com/card2.png",
        bgImg: "http://pcfgv46cm.bkt.clouddn.com/course1-bg.png",
        audioList: [
          {
            src: "https://od.lk/s/NV8xMjIyMTUxMzVf/1-1.mp3",
            length: "00:03:56"
          },
          {
            src: "https://od.lk/s/NV8xMjIzNjgyMDBf/1-2.mp3",
            length: "00:10:09"
          },
          {
            src: "https://od.lk/s/NV8xMjIzNjgzNDlf/1-3.mp3",
            length: "00:08:37"
          }
        ]
      },
    ]
  }
})