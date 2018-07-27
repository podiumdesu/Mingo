//logs.js
const util = require('../../../../utils/util.js')
const formatTimeToDisplay = require('../../../../utils/formatTimeToDisplay.js')
const Clock = require('../../../../utils/Clock.js')

const app = getApp()

let globalTime = null

let a   // 全局clock

Page({
  data: {
    logs: [],
    curriculumList: [],
    optionID: null,
    curriculumProgress: [0,0,0,0,0,0,0,0,0,0],    // 记录学习进度
    day: ['一', '二', '三', '四', '五', '六', '七'],
    classID: null,     // 设置第几次课程
    thisCourseAudioInfo: null,
    thisCourseLength: null,
    temp: {
      processTime: null,    // 设置当前运行时间，用于更新
    },
    clockSwitchInfo: {
      start: null,    // 开始
      pause: null,    // 暂停
      stop: null,     // 停止
      continue: null, // 继续
      waiting: null
    },
    continue: false,    // 设置是否继续播放音频
    rippleDisplay: false,    // 设置播放时的涟漪 
    a: null,
    cbSwitch: {
      start: null,    // 开始
      pause: null,    // 暂停
      stop: null,     // 停止
      continue: null, // 继续
    },
    intervalID: null
  },
  onLoad: function (option) {
    if (app.globalData.curriculumList) {
      this.setData({
        curriculumList: app.globalData.curriculumList
      })
    }
    this.setData({
      clockSwitchInfo: {
        start: true,    // 开始
        pause: false,    // 暂停
        stop: false,     // 停止
        continue: false, // 继续
        waiting: null
      },
      cbSwitch: {
        start: false,    // 开始
        pause: false,    // 暂停
        stop: false,     // 停止
        restart: false, // 继续
      },
      optionID: option.id,    // 哪一个课程
      classID: option.class,    // 第几节课
      curriculumProgress: (wx.getStorageSync('curriculumProgress')),
    })
    this.setData({
      // 设置当前应该学习的音频内容
      thisCourseAudioInfo: this.data.curriculumList[this.data.optionID].audioList[this.data.classID],      thisCourseLength: this
    })
    this.setData({
      thisCourseLength: this.data.thisCourseAudioInfo.length
    })
    this.setData({
      temp: {processTime: formatTimeToDisplay(this.data.thisCourseAudioInfo.length)}
    })
    console.log("这个课程已经学习到第"+this.data.classID+"天了")
    
    // 设置时钟
    app.globalData.processTime = this.data.thisCourseAudioInfo.length
    
        a =  new Clock({
          startTime: this.data.thisCourseAudioInfo.length,
          endTime: '00:00:00',
          completeTask: function () { // 完成后要做的事情
              console.log('this tick is done')
          },
          temp: {
            temp: this.data.temp.processTime
          }
        })

    console.log(this.data.curriculumList[option.id].name)
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })

    // 设置音频
    app.globalData.audio.innerAudioContext = wx.createInnerAudioContext()

    app.globalData.audio.innerAudioContext.autoplay = false
    app.globalData.audio.innerAudioContext.src = ''
    app.globalData.audio.innerAudioContext.onEnded(() => {
      wx.showModal({
        title: '提示',
        content: '学习完啦',
        success: function(res) {
        },
        showCancel: false,
      })
      clearInterval(this.intervalID)
      console.log('完满结束啦～')
      let temp = this.data.curriculumProgress
      if (temp <= this.data.thisCourseLength) temp[this.data.optionID]++
      wx.setStorageSync('curriculumProgress', temp)

      app.globalData.audio.isDisplay = false
      this.setData({
        clockSwitchInfo: {
          start: true,
          pause: false,
          stop: false,
          continue: false,
          waiting: null
        },
        rippleDisplay: false
      })
      app.globalData.audio.innerAudioContext.src = ''
    })


    app.globalData.audio.innerAudioContext.onPlay(() => {
      console.log('开始播放')
      console.log(app.globalData.audio.innerAudioContext.duration)
      app.globalData.audio.isDisplay = true
      this.setData({
        clockSwitchInfo: {
          start: false,    // 开始
          pause: true,    // 暂停
          stop: true,     // 停止
          continue: false, // 继续
          waiting: false   // 不在等待了
        },
        rippleDisplay: true
        // 设置时钟启动
      })
      let _this = this
      let tempSwitch = (app.globalData.audio.isDisplay === true && (this.data.clockSwitchInfo.waiting === false)) 
      console.log('tempSwitch' + tempSwitch)

      tempSwitch && (
        function() {
          this.setData({
            intervalID: setInterval(this.ddd.bind(this), 1000)
          })
          a.start()
        }.call(this)
    )

      // this.data.a.start.call(this.data.a)
    })
    app.globalData.audio.innerAudioContext.onStop(() => {
      console.log('停止播放')
    })
    app.globalData.audio.innerAudioContext.onWaiting(() => {
      console.log('正在缓存')
    })
    app.globalData.audio.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  onUnload: function() {
    app.globalData.audio.innerAudioContext.stop()
    clearInterval(this.intervalID)
    // 设置数据
    app.globalData.audio.isDisplay = false
    this.setData({
      clockSwitchInfo: {   // 全部重置
        start: null,
        pause: null,
        stop: null,
        continue: null,
      },
      continue: false,   // 不能继续播放
      rippleDisplay: false
    })

    this.setData({
      cbSwitch: {
        start: true,
      }
    })
    this.data.cbSwitch.start && a.stop()
    this.setData({
      cbSwitch: {
        start: null
      }
    })

    app.globalData.audio.innerAudioContext.src = ''
  },
  ddd: function() {
    this.setData({
      temp: {
        processTime: formatTimeToDisplay(a.temp())
      }
    })
  },
  onShow: function() {

  },
  changeIndexInE: function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    console.log(prevPage.data)
    prevPage.setData({
      // 修改全局变量
    })
  },


  clockSwitchStartClick: function () {
    // 设置src用于播放
    app.globalData.audio.innerAudioContext.src = this.data.thisCourseAudioInfo.src
    app.globalData.audio.innerAudioContext.play()

    // 设置数据
    app.globalData.audio.isDisplay = false
    this.setData({
      clockSwitchInfo: {
        start: false,
        pause: true,
        stop: true,
        continue: false,
        waiting: true
      },
    })
  },



  clockSwitchContinueClick: function() {
    app.globalData.audio.innerAudioContext.play()
    // 设置数据
    app.globalData.audio.isDisplay = true
    this.setData({
      clockSwitchInfo: {
        start: false,
        pause: true,
        stop: true,
        continue: false,
        waiting: null
      },
      rippleDisplay: true
    })
  },

  clockSwitchPauseClick: function() {
    app.globalData.audio.innerAudioContext.pause()
    console.log('暂停播放')

    this.setData({
      cbSwitch: {
        pause: true
      }
    })
    this.data.cbSwitch.pause === true && a.pause()
    this.setData({
      cbSwitch: {
        pause: false
      }
    })

    // this.data.a.pause.call(this.data.a)
    // 设置数据
    app.globalData.audio.isDisplay = false
    this.setData({
      clockSwitchInfo: {
        start: false,
        pause: false,
        stop: true,
        continue: true,
        waiting: null,
      },
      rippleDisplay: false
    })
  },

  clockSwitchStopClick: function() {
    app.globalData.audio.innerAudioContext.stop()
    this.setData({
      cbSwitch: {
        start: true
      }
    })
    this.data.cbSwitch.start && a.stop()
    this.setData({
      cbSwitch: {
        stop: false
      }
    })
    // 设置数据
    app.globalData.audio.isDisplay = false
    this.setData({
      clockSwitchInfo: {
        start: true,
        pause: false,
        stop: false,
        continue: false,
        waiting: null
      },
      rippleDisplay: false
    })
    app.globalData.audio.innerAudioContext.src = ''
  }
})

