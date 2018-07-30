const app = getApp()
const formatTimeToDisplay = require('../../utils/formatTimeToDisplay.js')
const Clock = require('../../utils/Clock.js')
const getSeconds = require('../../utils/getSeconds.js')
let tickTick   // 全局clock


Page({
  data: {
    startTime: null,
    endTime: null,
    duration: null,
    index: null,
    timeChoice: ['1','3','5','10'],
    timeChoiceShow: ['1 分钟','3 分钟','5 分钟','10 分钟'],
    clockSwitchInfo: {
      start: null,    // 开始
      pause: null,    // 暂停
      stop: null,     // 停止
      continue: null // 继续
    },
    rippleDisplay: null,
    temp: {
      processTime: null
    },
    pickerTips: null,
    intervalID: null    // 保存更新时钟的intervalID
  },
  onLoad: function() {

    // 设置显示森林
    this.setData({
      temp: {
        processTime: '森林'
      }
    })
    this.setData({
      pickerTips: '选择时长',
      clockSwitchInfo: {
        start: true,
        pause: false,
        stop: false,
        continue: false,
      }
    })
    rippleDisplay: false
    this.setData({
      startTime: '00:00:10' //设定初始值
    })
  },

  onUnload: function() {
    this.setData({
      clockSwitchInfo: {
        start: true,
        pause: false,
        stop: false,
        continue: false,
      }
    })
  },

  bindPickerChange: function(e) {
    let chooseTime = this.data.timeChoice[e.detail.value]
    this.setData({
      index: e.detail.value
    })
    this.setData({
      pickerTips: this.data.timeChoice[this.data.index] + ' 分钟'
    })

    if (chooseTime < 10) {
      this.setData({
        startTime: '00:0'+chooseTime+':00'
      })
    } else {
      this.setData({
        startTime: '00:'+chooseTime+':00'
      })
    }
    this.setData({
      temp: {
        processTime: formatTimeToDisplay(this.data.startTime)
      }
    })

  },
  completeTask: function() {
    app.globalData.allTickTime += getSeconds(this.data.startTime)
    wx.showToast({
      title: '冥想结束',
      icon: 'success',
      duration: 2000
    })
    this.setData({   // 设置按钮
      clockSwitchInfo: {
        start: true,
        pause: false,
        stop: false,
        continue: false,
      },
      rippleDisplay: false
    })
    this.setData({   // 重置显示
      temp: {
        processTime: formatTimeToDisplay(this.data.startTime)
      },
      pickerTips: this.data.timeChoice[this.data.index] + ' 分钟'
    })
    clearInterval(this.data.intervalID)
  },
  clickToStart: function() {
    if (this.data.index === null) {
      wx.showToast({
        title: '请先选择时间哦～',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({   // 设置按钮
        clockSwitchInfo: {
          start: false,
          pause: true,
          stop: false,
          continue: false,
        },
        rippleDisplay: true,
      })
      tickTick = new Clock({
        startTime: this.data.startTime,
        endTime: '00:00:00',
        completeTask: this.completeTask,
        temp: {
          temp: this.data.temp.processTime
        }
      })
  

      this.setData({
        temp: {
          processTime: formatTimeToDisplay(this.data.startTime)
        }
      })
      this.data.index !== null && this.upDateTimeToShow.bind(this)
      this.data.index !== null && this.setData({
        intervalID: setInterval(this.upDateTimeToShow.bind(this), 1000)   // 开始计算啦
      })
       this.data.index !== null && tickTick.start()
    }

  },
  clickToStop: function() {
    this.setData({   // 设置按钮
      clockSwitchInfo: {
        start: true,
        pause: false,
        stop: false,
        continue: false,
      },
      rippleDisplay: false
    })
    this.setData({
      temp: {
        processTime: formatTimeToDisplay(this.data.startTime)
      },
      pickerTips: this.data.timeChoice[this.data.index] + ' 分钟'
    })
    tickTick.stop()
    clearInterval(this.data.intervalID)
  },


  clickToPause: function() {
    this.setData({   // 设置按钮
      clockSwitchInfo: {
        start: false,
        pause: false,
        stop: true,
        continue: true,
      },
      rippleDisplay: false
    })
    this.upDateTimeToShow.call(this)   // 此处用于实时更新数据，避免由于event loop导致的数据在下一秒才进行更新的显示问题
    tickTick.pause()
  },
  clickToContinue: function() {
    this.setData({   // 设置按钮
      clockSwitchInfo: {
        start: false,
        pause: true,
        stop: false,
        continue: false,
      },
      rippleDisplay: true,
    })
    tickTick.start()
  },
  upDateTimeToShow: function() {
    this.setData({
      temp: {
        processTime: formatTimeToDisplay(tickTick.temp())
      }
    })
  },
  
})