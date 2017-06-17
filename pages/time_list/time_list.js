var app = getApp()
Page({
  data: {
    id: '',
    appoint_times: [],
    checked_list: [],
    time_area: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
    ]
  },
  onLoad() {
    this.getStoreRecylingInfo()
  },
  bindStartAtChange(e) {
    var item_index = e.currentTarget.dataset.index
    var time_index = e.detail.value
    var appoint_times = this.data.appoint_times
    if (time_index >= appoint_times[item_index].end_at) {
      wx.showToast({
        title: '请选择合理的时间范围',
        icon: 'loading'
      })
      return
    }
    appoint_times[item_index].start_at = time_index
    if (time_index < 10) {
      appoint_times[item_index].start_at_str = '0' + time_index
    } else {
      appoint_times[item_index].start_at_str = '' + time_index
    }
    this.setData({
      appoint_times
    })
  },
  bindEndAtChange(e) {
    var item_index = e.currentTarget.dataset.index
    var time_index = e.detail.value
    var appoint_times = this.data.appoint_times
    if (time_index <= appoint_times[item_index].start_at) {
      wx.showToast({
        title: '请选择合理的时间范围',
        icon: 'loading'
      })
      return
    }
    appoint_times[item_index].end_at = time_index
    if (time_index < 10) {
      appoint_times[item_index].end_at_str = '0' + time_index
    } else {
      appoint_times[item_index].end_at_str = '' + time_index
    }
    this.setData({
      appoint_times
    })
  },
  checkboxChange(e) {
    this.setData({
      checked_list: e.detail.value
    })
  },
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
          var id = data.id
          var appoint_times = data.appoint_times.map(el => {
            if (el.start_at < 10) {
              el.start_at_str = '0' + el.start_at
            } else {
              el.start_at_str = '' + el.start_at
            }
            if (el.end_at < 10) {
              el.end_at_str = '0' + el.end_at
            } else {
              el.end_at_str = '' + el.end_at
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
          var checked_list = []
          for (var i = 0; i < appoint_times.length; i++) {
            if (appoint_times[i].is_work) {
              checked_list.push(i + '')
            }
          }
          self.setData({
            id,
            checked_list,
            appoint_times
          })
        }
      }
    })
  },
  reset() {
    wx.navigateBack({
      delta: 1
    })
  },
  submit() {
    var id = this.data.id
    var appoint_times = this.data.appoint_times
    var checked_list = this.data.checked_list
    var base_list = ['0', '1', '2', '3', '4', '5', '6']
    for (var i = 0; i < 7; i++) {
      if (checked_list.indexOf(base_list[i]) == -1) {
        appoint_times[i].is_work = false
      } else {
        appoint_times[i].is_work = true
      }
    }
    console.log(appoint_times);
    wx.request({
      url: app.base_url + '/v1/recyling/update_store_recyling_info',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        id,
        appoint_times
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
