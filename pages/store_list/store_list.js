var app = getApp()
var moment = require('../../libs/moment.js')
Page({
  data: {
    add_store: false,
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
          var stores = res.data.data.map(el => {
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
    var self = this
    wx.request({
      url: app.base_url + '/v1/store/enter_store',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {id},
      success(res) {
        if (res.data.message == 'ok') {
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('store_id', id)
          wx.navigateTo({
            url: '/pages/recycle_list/recycle_list'
          })
        }
      }
    })
  },
  signOut() {
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.reLaunch({
            url: '/pages/login/login?sign_out=1'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  preAddStore() {
    this.setData({
      add_store: true
    })
  },
  confirmAddStore(e) {
    var name = e.detail.value.name
    if (!name) {
      wx.showToast({
        title: '请输入云店铺名称',
        icon: 'loading'
      })
      return
    }
    var self = this
    wx.request({
      url: app.base_url + '/v1/store/add',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {name},
      success(res) {
        if (res.data.message == 'ok') {
          self.cancelAddStore()
          self.getStores()
        }
      }
    })
  },
  cancelAddStore() {
    this.setData({
      add_store: false
    })
  }
})
