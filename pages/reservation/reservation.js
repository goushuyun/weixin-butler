var app = getApp()
Page({
  data: {
    times: [{
        id: '1',
        value: '周一',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      },
      {
        id: '2',
        value: '周二',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      }, {
        id: '3',
        value: '周三',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      }, {
        id: '4',
        value: '周四',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      }, {
        id: '5',
        value: '周五',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      }, {
        id: '6',
        value: '周六',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      }, {
        id: '0',
        value: '周日',
        start_time: 3,
        end_time: 20,
        checked: 'true'
      }
    ],
    time_area: [0,1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24]
    // time_area: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00']
  },
  bindStartTimeChange(e) {
    this.setData({
      // time: e.detail.value
    })
  },
  bindEndTimeChange(e) {
    this.setData({
      // time: e.detail.value
    })
  }
})
