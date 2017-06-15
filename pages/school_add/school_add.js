var app = getApp()
Page({
  data: {
    markers: [{
      latitude: 0,
      longitude: 0,
      width: 50,
      height: 50
    }],
    location: {
      longitude: 0,
      latitude: 0,
      address: '',
      name: ''
    }
  },
  onLoad() {
    var self = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        self.setData({
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50
          }]
        })
      }
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },
  choAddress() {
    var self = this
    wx.chooseLocation({
      success(res) {
        self.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
            address: res.address,
            name: res.name
          },
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50
          }]
        })
      }
    })
  }
})
