Page({
  data: {
    id: ''
  },
  onLoad(options) {
    var id = options.id
    this.setData({
        id: id
    })
  },
  goToSetting() {
    var id = this.data.id
    wx.redirectTo({
      url: '/pages/setting/setting?id=' + id
    })
  }
})
