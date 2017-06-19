var app = getApp()
Page({
  data: {
    schools: [],
    school_ids: []
  },
  onShow() {
    this.getSchools()
  },
  goToSchoolAdd() {
    wx.navigateTo({
      url: '/pages/school_add/school_add'
    })
  },
  getSchools() {
    var self = this
    wx.request({
      url: app.base_url + '/v1/school/store_schools',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {},
      success(res) {
        if (res.data.message == 'ok') {
          self.setData({
            schools: res.data.data
          })
        }
      }
    })
  },
  checkboxChange(e) {
    var school_ids = e.detail.value
    if (school_ids.length == 0) {
      school_ids.push('0dda6e86-529c-11e7-b114-b2f933d5fe66')
    }
    this.setData({
      school_ids
    })
  },
  reset() {
    wx.navigateBack({
      delta: 1
    })
  },
  submit() {
    var school_ids = this.data.school_ids
    if (school_ids.length == 0) {
      school_ids.push('0dda6e86-529c-11e7-b114-b2f933d5fe66')
    }
    wx.request({
      url: app.base_url + '/v1/recyling/update_school_recyling_state',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        school_ids
      },
      success(res) {
        if (res.data.message == 'ok') {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})
