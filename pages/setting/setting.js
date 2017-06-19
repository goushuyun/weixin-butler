var app = getApp()
Page({
  data: {
    qrcode_url: '',
    schools: [],
    summary: '', //收书说明
    appoint_times: []
  },
  onShow() {
    this.getSchools()
    this.getStoreRecylingInfo()
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
          var schools = res.data.data.filter(el => {
            return el.is_recyling == true
          })
          self.setData({
            schools
          })
          console.log(schools);
        }
      }
    })
  },
  // 店铺回收信息
  getStoreRecylingInfo() {
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
          var qrcode_url = data.qrcode_url
          var summary = data.summary
          var appoint_times = data.appoint_times.filter(el => {
            return el.is_work == true
          })
          console.log('appoint_times');
          console.log(appoint_times);
          appoint_times.map(el => {
            if (el.start_at < 10) {
              el.start_at = '0' + el.start_at
            } else {
              el.start_at = '' + el.start_at
            }
            if (el.end_at < 10) {
              el.end_at = '0' + el.end_at
            } else {
              el.end_at = '' + el.end_at
            }
            switch (el.week) {
              case 'mon':
                el.week_ch = '星期一'
                break;
              case 'tues':
                el.week_ch = '星期二'
                break;
              case 'wed':
                el.week_ch = '星期三'
                break;
              case 'thur':
                el.week_ch = '星期四'
                break;
              case 'fri':
                el.week_ch = '星期五'
                break;
              case 'sat':
                el.week_ch = '星期六'
                break;
              case 'sun':
                el.week_ch = '星期日'
                break;
              default:
            }
            return el
          })
          self.setData({
            qrcode_url,
            summary,
            appoint_times
          })
        }
      }
    })
  },
  goToMeets() {
    var id = this.data.id
    wx.redirectTo({
      url: '/pages/recycle_list/recycle_list'
    })
  },
  copyUrl() {
    var qrcode_url = this.data.qrcode_url
    wx.setClipboardData({
      data: qrcode_url,
      success: function(res) {
        wx.showToast({
          title: '已复制到剪切板',
          icon: 'success'
        })
      }
    })
  },
  goToSchoolList() {
    wx.navigateTo({
      url: '/pages/school_list/school_list'
    })
  },
  goToExplanation() {
    wx.navigateTo({
      url: '/pages/summary/summary'
    })
  },
  goToReservation() {
    wx.navigateTo({
      url: '/pages/time_list/time_list'
    })
  }
})
