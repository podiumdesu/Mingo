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
    // 设置冥想钟的音频
    let bgmMap = new Map()
    bgmMap.set('1', 'http://pcfgv46cm.bkt.clouddn.com/Forest_1mins.mp3')
    bgmMap.set('3', 'http://pcfgv46cm.bkt.clouddn.com/low-quality/Forest_3mins_lq.mp3')
    bgmMap.set('5', 'http://pcfgv46cm.bkt.clouddn.com/low-quality/Forest_5mins_lq.mp3')
    bgmMap.set('10', 'http://pcfgv46cm.bkt.clouddn.com/low-quality/Forest_10mins_lq.mp3')
    bgmMap.set('full', 'http://pcfgv46cm.bkt.clouddn.com/Forest_full_dropblank.mp3')
    this.globalData.tickClockBGM = {
      'forest': bgmMap
    }
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
    tickClockBGM: {},
    processTime: 0,
    curriculumList: [
      {
        id: 0,
        name: '七天冥想基础入门',
        description: '帮助你入门冥想的最佳经典课程，自发行以来，数百万次播放，成为深受欢迎的线上冥想课程',
        cardImg: "http://pcfgv46cm.bkt.clouddn.com/card0.png",
        bgImg: "http://pcfgv46cm.bkt.clouddn.com/course0-bg.png",
        finished: false,
        hasShowInfo: false,
        audioList: [
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/Mingo_course_01_lq.mp3",
            length: "00:09:56"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/Mingo_course_02_lq.mp3",
            length: "00:10:09"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/Mingo_course_03_lq.mp3",
            length: "00:08:37"
          }
        ]
      },
      {
        id: 1,
        name: '冥想方法课',
        description: '这个课程介绍不同的冥想方法，帮助你找到心里的那份平静，降低焦虑与压力。',
        cardImg: "http://pcfgv46cm.bkt.clouddn.com/card1.png",
        bgImg: "http://pcfgv46cm.bkt.clouddn.com/course2-bg.png",
        finished: false,
        hasShowInfo: false,
        audioList: [
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE01%E3%80%91%20%E5%88%9D%E5%AD%A6%E5%86%A5%E6%83%B3%E4%BA%94%E5%88%86%E9%92%9F_lq.mp3",
            length: "00:04:58"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE02%E3%80%91%E2%80%9C%E5%AE%9A%E2%80%9D%E7%9A%84%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:10:40"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE03%E3%80%91%E6%95%B0%E5%91%BC%E5%90%B8%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:07:37"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE04%E3%80%91%E7%94%9C%E8%9C%9C%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:07:45"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE05%E3%80%91%E5%BC%BA%E5%8C%96%E5%86%85%E5%BF%83%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:09:13"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE06%E3%80%91%E5%AE%87%E5%AE%99%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:09:08"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE07%E3%80%91%E8%87%AA%E6%88%91%E5%90%8C%E6%83%85%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:04:44"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E5%86%A5%E6%83%B3%E8%AF%BE/%E3%80%90%E5%86%A5%E6%83%B3%E8%AF%BE08%E3%80%91%E5%96%84%E6%84%8F%E5%9B%9E%E5%BD%92%E5%86%A5%E6%83%B3%E6%B3%95_lq.mp3",
            length: "00:08:55"
          },
        ]
      },
      {
        id: 2,
        name: '舒缓情绪系列',
        description: '这个课程细致地引导你如何平息焦虑、放松情绪，帮助你更好的管理情绪与压力。',
        cardImg: "http://pcfgv46cm.bkt.clouddn.com/card2.png",
        bgImg: "http://pcfgv46cm.bkt.clouddn.com/course1-bg.png",
        finished: false,
        hasShowInfo: false,
        audioList: [
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E8%88%92%E7%BC%93%E6%83%85%E7%BB%AA_lq.mp3",
            length: "00:05:00"
          },
          {
            src: "http://pcfgv46cm.bkt.clouddn.com/%E8%88%92%E7%BC%93%E6%83%85%E7%BB%AA2_lq.mp3",
            length: "00:14:51"
          },
        ]
      }
      // {
      //   id: 1,
      //   name: '七天冥想基础入门B',
      //   description: 'this is B',
      //   cardImg: "http://pcfgv46cm.bkt.clouddn.com/card1.png",
      //   bgImg: "http://pcfgv46cm.bkt.clouddn.com/course2-bg.png",
      //   finished: false,
      //   hasShowInfo: false,
      //   audioList: [
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //     {
      //       src: " ",
      //       length: " "
      //     },
      //   ]
      // }
      // {
      //   id: 1,
      //   name: '七天冥想基础入门B',
      //   description: 'this is B',
      //   cardImg: "http://pcfgv46cm.bkt.clouddn.com/card1.png",
      //   bgImg: "http://pcfgv46cm.bkt.clouddn.com/course2-bg.png",
      //   finished: false,
      //   hasShowInfo: false,
      //   audioList: [
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     // {
      //     //   src: "https://od.lk/s/NV8xMjI0NTMwODFf/Immediate%20Music%20-%20Orch%20%26%20Choir%20Descent%201.mp3",
      //     //   length: "00:00:19"
      //     // },
      //     // {
      //     //   src: "https://od.lk/s/NV8xMjI0NTMwNzhf/Immediate%20Music%20-%20Sixty%20Voices%20Rise%203.mp3",
      //     //   length: "00:00:21"
      //     // },
      //     // {
      //     //   src: "https://od.lk/s/NV8xMjI0NTMwNzVf/%E6%A8%AA%E5%B1%B1%E5%85%8B%20-%20%E8%A8%80%E3%82%8F%E3%81%AA%E3%81%84%E3%81%A3%E3%81%A6%E8%A8%80%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%AB%E3%83%BB%E3%83%BB%E3%83%BB.mp3",
      //     //   length: "00:00:35"
      //     // },
      //   ]
      // }, 
      // {
      //   id: 2,
      //   name: '七天冥想基本入门C',
      //   description: 'this is C',
      //   cardImg: "http://pcfgv46cm.bkt.clouddn.com/card2.png",
      //   bgImg: "http://pcfgv46cm.bkt.clouddn.com/course1-bg.png",
      //   finished: false,
      //   hasShowInfo: false,
      //   audioList: [
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //     {
      //       src: "http://pcfgv46cm.bkt.clouddn.com/test.mp3",
      //       length: "00:00:08"
      //     },
      //   ]
      // },
    ]
  }
})