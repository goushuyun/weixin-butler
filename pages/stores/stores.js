var app = getApp()
var moment = require('../../libs/moment.js')
Page({
  data: {
    stores: []
  },
  onShow() {
    this.getStores()
  },
  getStores() {
    var self = this
    var today = moment().format('YYYY-MM-DD');
    // get seller's stores
    wx.request({
      url: app.base_url + '/v1/seller/self_stores',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {},
      success(res) {
        if (res.data.message == 'ok') {
          var stores = res.data.data.map(el=>{
            el.expire_at = moment.unix(el.expire_at).format('YYYY-MM-DD')
            // 判断店铺是否已过期，以截止日期的24点为准
            if (el.expire_at < today) {
              el.is_expire = true
            } else {
              el.is_expire = false
            }
            return el
          })
          console.log(stores);
          self.setData({
            stores
          })
        }
      }
    })
  },
  goToSetting(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/meets/meets?id=' + id
    })
  }
})
