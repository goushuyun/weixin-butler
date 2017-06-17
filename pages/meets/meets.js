Page({
  data: {
  },
  onLoad() {
  },
  goToSetting() {
    var id = this.data.id
    wx.redirectTo({
      url: '/pages/setting/setting'
    })
  }
})
