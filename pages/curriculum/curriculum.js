const app = getApp()

Page({
  data: {
    selectedId: null,
    curriculumList: null
  },
  onLoad: function() {
    if (app.globalData.curriculumList) {
      this.setData({
        curriculumList: app.globalData.curriculumList
      })
    }
  },
})