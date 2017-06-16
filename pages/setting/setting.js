Page({
  data: {
    id: '',
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
    ]
  },
  onLoad(options) {
    var id = options.id
    this.setData({
      id: id
    })
  },
  goToMeets() {
    var id = this.data.id
    wx.redirectTo({
      url: '/pages/meets/meets?id=' + id
    })
  },
  goToSchoolList() {
    wx.navigateTo({
      url: '/pages/school_list/school_list'
    })
  },
  goToExplanation() {
    wx.navigateTo({
      url: '/pages/explanation/explanation'
    })
  },
  goToReservation() {
    wx.navigateTo({
      url: '/pages/reservation/reservation'
    })
  }
})
