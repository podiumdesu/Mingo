//logs.js
const util = require('../../utils/util.js')
const formatTimeToDisplay = require('../../utils/formatTimeToDisplay.js')

const app = getApp()

let globalTime = null

Page({
  data: {
    logs: [],
    curriculumList: [],
    optionID: null,
    curriculumProgress: [0,0,0,0,0,0,0,0,0,0],    // 记录学习进度
    day: ['一', '二', '三', '四', '五', '六', '七'],
    thisCourseStudyDay: null,
    thisCourseAudioInfo: null,
    processTime: null,    // 设置当前运行时间，用于更新
    clockSwitchInfo: {
      left: '开始',
      right: null,
    },
    continue: false,    // 设置是否继续播放音频
    rippleDisplay: false,    // 设置播放时的涟漪 
    a: null 
  },
  onLoad: function (option) {
    if (app.globalData.curriculumList) {
      this.setData({
        curriculumList: app.globalData.curriculumList
      })
    }
    this.setData({
      optionID: option.id,
      curriculumProgress: (wx.getStorageSync('curriculumProgress')),
    })
    this.setData({
      thisCourseStudyDay: this.data.curriculumProgress[this.data.optionID]
    })
    this.setData({
      // 设置当前应该学习的音频内容
      thisCourseAudioInfo: this.data.curriculumList[this.data.optionID].audioList[this.data.thisCourseStudyDay],
    })
    this.setData({
      processTime: formatTimeToDisplay(this.data.thisCourseAudioInfo.length)
    })
    console.log("这个课程已经学习到第"+this.data.thisCourseStudyDay+"天了")
    
    console.log(this.data.curriculumList[option.id].name)
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })

    // 设置音频
    app.globalData.audio.innerAudioContext = wx.createInnerAudioContext()

    app.globalData.audio.innerAudioContext.autoplay = true
    app.globalData.audio.innerAudioContext.src = ''

    app.globalData.audio.innerAudioContext.onPlay(() => {
      console.log('开始播放')
      console.log(app.globalData.audio.innerAudioContext.duration)
      this.setData({
        a: new Clock({
          startTime: this.data.thisCourseAudioInfo.length,
          endTime: '00:00:00',
          completeTask: function () { // 完成后要做的事情
              console.log('this tick is done')
              alert('dddd')
          },
        })
      })
      this.clockStart()
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

    // 设置数据
    app.globalData.audio.isDisplay = false
    this.setData({
      clockSwitchInfo: {
        left: '开始',
        right: ''
      },
      continue: false,   // 不能继续播放
      rippleDisplay: false
    })
    app.globalData.audio.innerAudioContext.src = ''
  },
  changeIndexInE: function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    console.log(prevPage.data)
    prevPage.setData({
      // 修改全局变量
    })
  },
  dddd: function() {
    console.log('dddd')
  },
  clickToDisplay: function(e) {
    console.log(e)
  },
  clockStart: function() {
    console.log('start')
    return this.data.a.start
  },
  clockPause: function() {
    console.log('pause')
    return this.data.a.pause
  },
  clockStop: function() {
    console.log('stop')
    return this.data.a.stop
  },
  clockRestart: function() {
    console.log('restart')
    return this.data.a.restart
  },

  clockSwitchLeftClick: function() {
    if (app.globalData.audio.isDisplay === false) {   // 判断是开始还是暂停
      console.log(this.data.continue)
      if (this.data.continue) { // 继续播放
        app.globalData.audio.innerAudioContext.play()
        this.clockStart()
        // this.data.a.start.call(this.data.a)
      } else {  // 从头播放
        app.globalData.audio.innerAudioContext.src = this.data.thisCourseAudioInfo.src
        app.globalData.audio.innerAudioContext.play()
        this.clockRestart()
        // this.data.a.restart.call(this.data.a)
      }
      // 设置数据
      app.globalData.audio.isDisplay = true
      this.setData({
        clockSwitchInfo: {
          left: '暂停',
          right: '停止'
        },
        continue: true,
        rippleDisplay: true
      })

    } else {       // 当按钮为 “暂停” 进行的活动
      app.globalData.audio.innerAudioContext.pause()
      console.log('暂停播放')
      this.clockPause()
      // this.data.a.pause.call(this.data.a)
      // 设置数据
      app.globalData.audio.isDisplay = false
      this.setData({
        clockSwitchInfo: {
          left: '继续',
          right: '停止'
        },
        continue: true,    // 左边按钮是继续播放
        rippleDisplay: false
      })
    }
  },
  clockSwitchRightClick: function() {
    app.globalData.audio.innerAudioContext.stop()
    this.clockStop()
    // this.data.a.stop.call(this.data.a)
    // 设置数据
    app.globalData.audio.isDisplay = false
    this.setData({
      clockSwitchInfo: {
        left: '开始',
        right: ''
      },
      continue: false,   // 不能继续播放
      rippleDisplay: false
    })
    app.globalData.audio.innerAudioContext.src = ''
  }
})


// import Clock from './wxTick'
// const Clock = require('./wxTick')
function Clock(init) {
  // 用户设置：
  this.startTime = init.startTime || '00:00:00' // 设置开始时间
  this.endTime = init.endTime || '00:00:00' // 设置结束时间 
  this.completeTask = init.completeTask || null // 设置成功结束后，执行任务
  this.displayEle = init.displayEle || null // 设置展示元素，用于显示当前的运行时间

  // 私有变量：
  this.processingTime = this.startTime // 当前运行时间（用于显示以及每次暂停后开始的时间）
  this.intervalID = null // 循环id，创建=>保存=>销毁

  // 用于返回：
  this.duration = null // 33333 s        // 从开始到结束/暂停，时钟的运行时长
  this.finishOrNot = false //这个倒计时是否完整完成
  // todo
  // this.interval = init.interval // 2s
  // this.intervalFn = init.intervalFn // function() {}
}

function getTime(startTime, endTime) { // 将"00:00:00" 转换为 Date() 型时间
  let _StartArr = startTime.split(':').reduce((init, i) => {
      init.push(parseInt(i));
      return init
  }, [])
  let _ResolveStartTime = new Date(1999, 3, 3, _StartArr[0], _StartArr[1], _StartArr[2])
  let _EndArr = endTime.split(':').reduce((init, i) => {
      init.push(parseInt(i));
      return init
  }, [])
  let _ResolveEndTime = new Date(1999, 3, 3, _EndArr[0], _EndArr[1], _EndArr[2])
  return {
      startTime: _ResolveStartTime,
      endTime: _ResolveEndTime,
  }
}

function convertTimeToDate(time) {
  let arr = time.split(':').reduce((init, i) => {
      init.push(parseInt(i));
      return init
  }, [])
  return {
      time: new Date(1999, 3, 3, arr[0], arr[1], arr[2])
  }
}

Clock.prototype = {
  _begin: function (resolve) { // 用于进行processing时间的维护
      let _this = this
      let time = getTime(_this.processingTime, _this.endTime)
      console.log(_this.processingTime)
      // _this.displayEle.innerHTML = _this.processingTime // 用于赋值
      if (time.startTime - time.endTime > 0) {
          time.startTime -= 1000 // 此时减时间
          _this.processingTime = new Date(time.startTime).toString().substr(16, 8) // 运行了1s， 此时应该更新。
      } else { // 自然结束
          // 此时不需要对_this.processingTime进行处理。
          if (_this.completeTask) {
              _this.completeTask()
          }
          clearInterval(_this.intervalID)
          _this.finishOrNot = true
          resolve(_this._returnValue())
          _this.processingTime = _this.startTime
          console.log('完成啦！！！！！！！！！！！')
      }
  },
  _returnValue: function () {
      let _this = this
      return {
          startTime: _this.startTime,
          plannedEndTime: _this.endTime,
          duration: (new Date('1998-08-08T' + _this.startTime) - new Date('1998-08-08T' + _this.processingTime)) / 1000,
          processingTime: _this.processingTime,
          finishOrNot: _this.finishOrNot
      }
  },
  start: function () {
      let _this = this // 保存this
      _this.finishOrNot = false
      return new Promise((resolve) => {
          _this._begin(resolve)
          _this.intervalID = setInterval(function () {
              _this._begin(resolve)
          }, 1000)
      })
  },
  stop: function () { // 停止。
      console.log('I am called')
      let _this = this
      clearInterval(_this.intervalID)
      return new Promise((resolve) => {
          resolve(_this._returnValue())
          _this.processingTime = _this.startTime
      })
  },
  pause: function () { // 暂停，是不会操作completeTask的。
      let _this = this
      clearInterval(_this.intervalID)
      console.log('Now I am paused')
      let a = convertTimeToDate(_this.processingTime) //  因为shutdown了，所以要处理在begin()中多减去的1000ms
      a.time -= -1000 // why can't plus 1000???????
      _this.processingTime = new Date(a.time).toString().substr(16, 8)
      return new Promise((resolve) => {
          resolve(_this._returnValue())
      })
  },
  restart: function () {
      let _this = this
      // 进行重置
      _this.processingTime = _this.startTime
      _this.finishOrNot = false
      clearInterval(_this.intervalID)

      console.log('now begin from the beginning')
      return new Promise((resolve) => {
          _this._begin(resolve)
          _this.intervalID = setInterval(function () {
              _this._begin(resolve)
          }, 1000)
      })
  }
}
