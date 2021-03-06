var app = getApp()
Page({
  data: {
    qrcode_url: '',
    schools: [],
    summary: '', //收书说明
    appoint_times: [],
    time_area: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
    ]
  },
  onShow() {
    this.getSchools()
    this.getStoreRecylingInfo()
  },
  getSchools() {
    wx.showLoading({
      title: '加载中',
    })
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
  // 店铺回收信息
  getStoreRecylingInfo() {
    var self = this
    const time_area = self.data.time_area
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
          var qrcode_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6d36779ce4dd3dfa&redirect_uri=https%3a%2f%2fapp.goushuyun.com%2fone%2ftwo%2findex.html%23%2frecycling_order&response_type=code&scope=snsapi_base&state=' + wx.getStorageSync('store_id') + '&component_appid=wx1c2695469ae47724#wechat_redirect'
          var summary = data.summary
          var appoint_times = data.appoint_times.filter(el => {
            return el.is_work == true
          })
          appoint_times.map(el => {
            el.start_at_str = time_area[el.start_at]
            el.end_at_str = time_area[el.end_at]
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
