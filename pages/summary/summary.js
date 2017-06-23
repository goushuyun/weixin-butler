var app = getApp()
Page({
  data: {
    id: '',
    summary: ''
  },
  onLoad() {
    this.getStoreRecylingSummary()
  },
  getStoreRecylingSummary() {
    wx.showLoading({
      title: '加载中',
    })
    var self = this
    wx.request({
      url: app.base_url + '/v1/recyling/store_recyling_info',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {},
      success(res) {
        if (res.data.message == 'ok') {
          var data = res.data.data
          var id = data.id
          var summary = data.summary
          self.setData({
            id,
            summary
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '请重试',
            icon: 'loading'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: 'Error',
          icon: 'loading'
        })
      }
    })
  },
  reset() {
    wx.navigateBack({
      delta: 1
    })
  },
  saveSummary(e) {
    var id = this.data.id
    var summary = e.detail.value.summary
    wx.request({
      url: app.base_url + '/v1/recyling/update_store_recyling_info',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        id,
        summary
      },
      success(res) {
        if (res.data.message == 'ok') {
          wx.navigateBack({
            delta: 1
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '请重试',
            icon: 'loading'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: 'Error',
          icon: 'loading'
        })
      }
    })
  }
})
