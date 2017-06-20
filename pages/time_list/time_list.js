var app = getApp()
Page({
  data: {
    id: '',
    appoint_times: [],
    checked_list: [],
    pv_show: false,
    time_area: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'
    ],
    start_at_area: [],
    end_at_area: [],
    start_at_str: '00:00',
    end_at_str: '01:00',
    item_index: 0
  },
  onLoad() {
    this.getStoreRecylingInfo()
    const time_area = this.data.time_area
    this.setData({
      start_at_area: time_area.slice(0, time_area.length - 1),
      end_at_area: time_area.slice(1, time_area.length)
    })
  },
  openPicker(e) {
    var item_index = e.currentTarget.dataset.index
    const time_area = this.data.time_area
    this.setData({
      pv_show: true,
      start_at_area: time_area.slice(0, time_area.length - 1),
      end_at_area: time_area.slice(1, time_area.length),
      start_at_str: '00:00',
      end_at_str: '01:00',
      item_index: item_index
    })
  },
  closePicker() {
    this.setData({
      pv_show: false
    })
  },
  setResult() {
    const time_area = this.data.time_area
    var appoint_times = this.data.appoint_times
    var item_index = this.data.item_index
    var start_at_str = this.data.start_at_str
    var end_at_str = this.data.end_at_str

    appoint_times[item_index].start_at_str = start_at_str
    appoint_times[item_index].start_at = time_area.indexOf(start_at_str)
    appoint_times[item_index].end_at_str = end_at_str
    appoint_times[item_index].end_at = time_area.indexOf(end_at_str)
    this.setData({
      appoint_times: appoint_times,
      pv_show: false
    })
  },
  pickerChange(e) {
    var start_index = e.detail.value[0]
    var end_index = e.detail.value[1]
    const time_area = this.data.time_area
    var start_at_area = time_area
    var end_at_area = time_area.slice(start_index + 1, time_area.length)
    var start_at_str = start_at_area[start_index]
    var end_at_str = end_at_area[end_index]
    this.setData({
      end_at_area,
      start_at_str,
      end_at_str
    })
  },
  checkboxChange(e) {
    var appoint_times = this.data.appoint_times
    var checked_list = e.detail.value
    var base_list = ['0', '1', '2', '3', '4', '5', '6']
    for (var i = 0; i < 7; i++) {
      if (checked_list.indexOf(base_list[i]) == -1) {
        appoint_times[i].is_work = false
      } else {
        appoint_times[i].is_work = true
      }
    }
    this.setData({
      checked_list
    })
  },
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
          var id = data.id
          var appoint_times = data.appoint_times.map(el => {
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
