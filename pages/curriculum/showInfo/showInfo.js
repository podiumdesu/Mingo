const app = getApp()
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
    courseLength: null,  // 课程总天数 7代表共有7天

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
    })


  }
})