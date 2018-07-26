Page({
  data: {
    startTime: null,
    endTime: null,
    duration: null
  },
  clickToStart: function() {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
      })
  }
  
})