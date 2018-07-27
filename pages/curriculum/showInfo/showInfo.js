const app = getApp()
const formatTimeToDisplay = require('../../../utils/formatTimeToDisplay.js')
Page({
  data: {
    optionID: null,
    courseList: null,   // 课程详细内容
    // {
    //   id: 0,
    //   name: '七天冥想基础入门A',
    //   description: 'this is A',
    //   cardImg: "http://pcfgv46cm.bkt.clouddn.com/card0.png",
    //   bgImg: "http://pcfgv46cm.bkt.clouddn.com/course0-bg.png",
    //   audioList: [
    //     {
    //       src: "https://od.lk/s/NV8xMjIyMTUxMzVf/1-1.mp3",
    //       length: "00:09:56"
    //     },
    //     {
    //       src: "https://od.lk/s/NV8xMjIzNjgyMDBf/1-2.mp3",
    //       length: "00:10:09"
    //     },
    //     {
    //       src: "https://od.lk/s/NV8xMjIzNjgzNDlf/1-3.mp3",
    //       length: "00:08:37"
    //     }
    //   ]
    // },

    courseProgress: null,    // 课程进度，数字。 0代表第一天。
    des: null,      // 描述
    selectClassDisplayInfo: {
      name: null,
      length: null,
    },
    courseLength: null,  // 课程总天数 7代表共有7天
    // 维护2个数组和一个变量
    setClass: false,
    unlockedClass: null,
    lockedClass: null,
    
    currentClickClassID: null,   // 当前选择的课程
    changeBtnStyleID: null,
    finish: null,
  },
  // 1 8
  // [0], [2,3,4,5,6,7]
  setUnlockedClass: function(courseProgress) {
    let result = []
    for (let i = 0; i < courseProgress; i++) {
      result[i] = {
        id: i
      }
    }
    return result
  },
  setLockedClass: function(courseProgress, courseLength) {
    let result = []
    for (let i = courseProgress+1, j = 0; i < courseLength; i++, j++ ) {
      result[j] = {
        id: i
      }
    }
    return result
  },
  returnDay: function(courseID) {
    let temp = ['一','二','三','四','五','六','七','八','九','十']
    return '第'+temp[courseID]+'课'
  },
  returnCurrentClassTime: function(courseID) {
    return formatTimeToDisplay(this.data.courseList.audioList[courseID].length)
  },

  // ################################ 加载中 ################################
  onShow() {
    this.setData({
      courseProgress: wx.getStorageSync('curriculumProgress')[this.data.optionID]
    })

    if (this.data.courseProgress === this.data.courseLength) {   // 已经全部完成了
      wx.showToast({
        title: '你已经成功完成所有练习啦',
        content: '学习完啦',
        duration: 2000,
      })
    } else {
      this.setData({
        setClass: true,
        currentClickClassID: this.data.courseProgress,
        changeBtnStyleID: this.data.courseProgress
      })
  
      // 设置展示课程信息+时长
      this.setData({
        selectClassDisplayInfo: {
          name: this.returnDay(this.data.courseProgress),
          length: this.returnCurrentClassTime(this.data.courseProgress)
        }
      })
      // 维护用于button点击的两个数组
      this.data.setClass && this.setData({
        unlockedClass: this.setUnlockedClass(this.data.courseProgress),
        lockedClass: this.setLockedClass(this.data.courseProgress,this.data.courseLength)
      })
      this.setData({
        setClass: false
      })
    }
  },
  onLoad(option) {
    console.log("这是课程详情页面")
    console.log(option.id)
    this.setData({
      // 设置当前选择的课程的id
      optionID: option.id,
      // 然后设置将课程的信息传入进去
      // 课程天数根据 app.globalData.curriculumList.audioList.length 决定
      // 课程描述根据 app.globalData.curriculumList.description 决定
      // 当前天数根据本地信息决定： wx.getStorageSync('curriculumProgress') 根据optionID决定是哪一天 [0,0,0,0,0,0,0,0,0,0]这是初始值。 
      // curriculumProgress 决定解锁了多少课程。
      // 页面展示变量
    })
    this.setData({
      courseList: app.globalData.curriculumList[this.data.optionID],
      courseProgress: wx.getStorageSync('curriculumProgress')[this.data.optionID]
    })
    this.setData({
      des: this.data.courseList.description,
      courseLength: this.data.courseList.audioList.length,
      setClass: true,
      currentClickClassID: this.data.courseProgress,
      changeBtnStyleID: this.data.courseProgress
    })

    // 设置展示课程信息+时长
    this.setData({
      selectClassDisplayInfo: {
        name: this.returnDay(this.data.courseProgress),
        length: this.returnCurrentClassTime(this.data.courseProgress)
      }
    })
    // 维护用于button点击的两个数组
    this.data.setClass && this.setData({
      unlockedClass: this.setUnlockedClass(this.data.courseProgress),
      lockedClass: this.setLockedClass(this.data.courseProgress,this.data.courseLength)
    })
    this.setData({
      setClass: false
    })

  },
  // 课程按钮点击
  clickToShowInfo: function(e) {
    console.log(e.currentTarget.dataset.id) //打印可以看到，此处已获取到了对应的id)
    console.log(this.data.courseProgress)
    
    this.setData({
      currentClickClassID: e.currentTarget.dataset.id
    })
    if (this.data.currentClickClassID <= this.data.courseProgress) {
      this.setData({
        changeBtnStyleID: e.currentTarget.dataset.id
      })
    }
    this.setData({
      selectClassDisplayInfo: {
        name: this.returnDay(this.data.currentClickClassID),
        length: this.returnCurrentClassTime(this.data.currentClickClassID)
      }
    })
  },
  clickToStartAudio: function() {
    let targetUrl = `/pages/curriculum/showInfo/playAudio/playAudio?id=${this.data.optionID}&class=${this.data.currentClickClassID}`
    if (this.data.currentClickClassID <= this.data.courseProgress) {
      wx.navigateTo({
        url: targetUrl
      })
    } else {
      wx.showToast({
        title: '你还没有学习到这里哦～',
        icon: 'none',
        duration: 1000,
        mask:true
      })
    }

  }
})