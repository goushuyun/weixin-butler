var app = getApp()
Page({
  data: {
    schools: [{
        id: 'USA',
        value: '上海应用技术大学（奉贤校区）',
        checked: 'true'
      },
      {
        id: 'CHN',
        value: '上海师范大学（奉贤校区）',
        checked: 'true'
      }
    ]
  },
  goToSchoolAdd() {
    wx.navigateTo({
      url: '/pages/school_add/school_add'
    })
  }
})
