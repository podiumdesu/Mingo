//logs.js
const util = require('../../../../utils/util.js')
const formatTimeToDisplay = require('../../../../utils/formatTimeToDisplay.js')
const Clock = require('../../../../utils/Clock.js')
const getSeconds = require('../../../../utils/getSeconds.js')
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
    thisCourseLength: null,   //课程长度
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
        waiting: false
      },
      cbSwitch: {
        start: false,    // 开始
        pause: false,    // 暂停
        stop: false,     // 停止
        restart: false, // 继续
      },
      optionID: option.id,    // 哪一个课程
      classID: option.class,    // 第几节课  从0开始
      curriculumProgress: (wx.getStorageSync('curriculumProgress')),
    })
    this.setData({
      // 设置当前应该学习的音频内容
      thisCourseAudioInfo: this.data.curriculumList[this.data.optionID].audioList[this.data.classID],
    })
    this.setData({
      thisCourseLength: this.data.thisCourseAudioInfo.length
    })
    this.setData({
      temp: {processTime: formatTimeToDisplay(this.data.thisCourseAudioInfo.length)}
    })
    // console.log("这个课程已经学习到第"+this.data.classID+"天了")
    
    // 设置时钟
    app.globalData.processTime = this.data.thisCourseAudioInfo.length
    
    a =  new Clock({
      startTime: this.data.thisCourseAudioInfo.length,
      endTime: '00:00:00',
      completeTask: function () { // 完成后要做的事情
          // console.log('this tick is done')
      },
      temp: {
        temp: this.data.temp.processTime
      }
    })

    console.log(this.data.curriculumList[option.id].name)
    // 设置音频
    app.globalData.audio.innerAudioContext = wx.getBackgroundAudioManager()
    app.globalData.audio.innerAudioContext.autoplay = false
    app.globalData.audio.innerAudioContext.onEnded(() => {   // 当音频完整结束的时候
      app.globalData.allTickTime += getSeconds(this.data.curriculumList[this.data.optionID].audioList[this.data.classID].length)
      wx.showModal({
        title: '提示',
        content: '这节课学习完了～',
        success: function(res) {
        },
        showCancel: false,
      })
      clearInterval(this.intervalID)
      // console.log('完满结束啦～')
      let temp = this.data.curriculumProgress
      // 如果听的是同一节课，不应该更新。
      if (this.data.classID == temp[this.data.optionID]) {
        temp[this.data.optionID]++   // 比如说从0 -> 1，课程总长度为1
      }
      // console.log( temp[this.data.optionID])
      // console.log(this.data.curriculumList[this.data.optionID].audioList.length)
      if (temp[this.data.optionID] === this.data.curriculumList[this.data.optionID].audioList.length) {
        console.log('已经全部学习完了')
        temp[this.data.optionID]--   // 比如说从0 -> 1，课程总长度为1
        app.globalData.curriculumList[this.data.optionID].finished = true
      }
      wx.setStorageSync('curriculumProgress', temp)   // [1,0,0,0,0]，长度总共就是1
      console.log(wx.getStorageSync('curriculumProgress'))
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
            intervalID: setInterval(this.updateTimeToShow.bind(this), 1000)
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
  updateTimeToShow: function() {
    this.setData({
      temp: {
        processTime: formatTimeToDisplay(a.temp())
      }
    })
  },
  clockSwitchStartClick: function () {
    // 设置src用于播放
    app.globalData.audio.innerAudioContext.play()
    app.globalData.audio.innerAudioContext.src = this.data.thisCourseAudioInfo.src
    app.globalData.audio.innerAudioContext.title = this.data.curriculumList[this.data.optionID].name + ' - 第' +  this.data.day[this.data.classID] + '讲'


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
    this.updateTimeToShow.call(this)
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

