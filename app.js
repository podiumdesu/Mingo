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
    allTickTime: 0,
    audio: {
      innerAudioContext: null,
      isDisplay: false
    },
    processTime: 0,
    curriculumList: [
      {
        id: 0,
        name: '七天冥想基础入门A',
        description: '帮助你入门冥想的最佳经典课程，自发行以来，数百万次播放，成为深受欢迎的线上冥想课程',
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
            src: "https://od.lk/s/NV8xMjI0NTMwODBf/%E4%BA%95%E4%B8%8A%E5%92%8C%E5%BD%A6%20-%20%E3%81%8A%E9%9B%BB%E8%A9%B1.mp3",
            length: "00:00:08"
          },
          {
            src: "https://od.lk/s/NV8xMjI0NTMwODFf/Immediate%20Music%20-%20Orch%20%26%20Choir%20Descent%201.mp3",
            length: "00:00:19"
          },
          // {
          //   src: "https://od.lk/s/NV8xMjI0NTMwNzhf/Immediate%20Music%20-%20Sixty%20Voices%20Rise%203.mp3",
          //   length: "00:00:21"
          // },
          // {
          //   src: "https://od.lk/s/NV8xMjI0NTMwNzVf/%E6%A8%AA%E5%B1%B1%E5%85%8B%20-%20%E8%A8%80%E3%82%8F%E3%81%AA%E3%81%84%E3%81%A3%E3%81%A6%E8%A8%80%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%AB%E3%83%BB%E3%83%BB%E3%83%BB.mp3",
          //   length: "00:00:35"
          // },
        ]
      }, 
      {
        id: 2,
        name: '七天冥想基本入门C',
        description: 'this is C',
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