var app = getApp()
var moment = require('../../libs/moment.js')
var timeago = require('../../libs/timeago.js')
Page({
  data: {
    tabs: ['预约中', '暂搁置', '已完成'],
    currentPage: 0, // 当前选中的tab的索引
    schools: [],
    currentSchool: 0, //当前选中的学校的索引

    orders: [],
    sort_by: 'appoint_start_at',
    sort_by_list: ['appoint_start_at', 'update_at'],
    sort_by_name: '按预约时间排序',
    sequence_by: '',
    page: 0,
    size: 15,
    state: 1,

    hold_on: false,
    id: '',
    appoint_start_date: '',
    appoint_start_at: '',

    remarks: ['修改预约时间','未联系到用户','临时有事','其他原因'],
    currentRemark: 0
  },
  onLoad () {
    this.getSchools()
  },
  changeRemark(e) {
    this.setData({
      currentRemark: e.detail.value
    })
  },
  showBigPic(e) {
    var urls = []
    this.data.orders[e.currentTarget.dataset.index].images.forEach(el => {
      urls.push('http://images.goushuyun.cn/' + el.url)
    })
    var current_url = 'http://images.goushuyun.cn/' + e.currentTarget.dataset.url
    wx.previewImage({
        current: current_url, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
    })
  },
  goToPage(e) {
    if (this.data.schools == 0) {
      wx.showToast({
        title: '请添先加学校',
        icon: 'loading'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/school_add/school_add'
        })
      }, 1000)
    }
    var currentPage = e.target.dataset.index
    var state = currentPage + 1
    var school_id = this.data.schools[this.data.currentSchool].id
    // 每次切换tab 都要重置 sort_by
    var sort_by = 'appoint_start_at'
    var sort_by_name = '按预约时间排序'

    var page = 1

    var data = {
      school_id: school_id, //required
      sort_by: sort_by, //appoint_start_at || update_at
      sequence_by: "desc", //asc || desc
      page: 1,
      size: 15,
      state: state //1待处理  2 搁置中 3 已完成
    }

    this.setData({
      page,
      currentPage,
      state,
      sort_by,
      sort_by_name
    })
    this.getOrderList(data)
  },
  changeSortBy() {
    if (this.data.schools == 0) {
      wx.showToast({
        title: '请添先加学校',
        icon: 'loading'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/school_add/school_add'
        })
      }, 1000)
    } else {
      var self = this
      var state1 = ['按预约时间排序', '按发布时间排序']
      var state2 = ['按预约时间排序', '按搁置时间排序']
      var state3 = ['按预约时间排序', '按完成时间排序']
      var itemList = []
      var state = self.data.state
      switch (state) {
        case 1:
          itemList = state1
          break;
        case 2:
          itemList = state2
          break;
        case 3:
          itemList = state3
          break;
        default:
      }
      wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
          var school_id = self.data.schools[self.data.currentSchool].id
          var sort_by = self.data.sort_by_list[res.tapIndex]
          var data = {
            school_id: school_id, //required
            sort_by: sort_by, //appoint_start_at || update_at
            sequence_by: "desc", //asc || desc
            page: 1,
            size: 15,
            state: state //1待处理  2 搁置中 3 已完成
          }
          self.setData({
            page: 1,
            sort_by: sort_by,
            sort_by_name: itemList[res.tapIndex]
          })
          self.getOrderList(data)
        }
      })
    }
  },
  changeStore() {
    wx.redirectTo({
      url: '/pages/store_list/store_list'
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
          var schools = res.data.data
          schools.unshift({
            id: '',
            name: '全部学校'
          })
          self.setData({
            schools
          })
          if (res.data.data == 0) {
            wx.showToast({
              title: '请添先加学校',
              icon: 'loading'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/school_add/school_add'
              })
            }, 1000)
            return
          }
          var data = {
            school_id: res.data.data[0].id, //required
            sort_by: "appoint_start_at", //appoint_start_at || update_at
            sequence_by: "desc", //asc || desc
            page: 1,
            size: 15,
            state: 1 //1待处理  2 搁置中 3 已完成
          }
          self.getOrderList(data)
        }
      }
    })
  },
  changeSchool(e) {
    if (this.data.schools == 0) {
      wx.showToast({
        title: '请添先加学校',
        icon: 'loading'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/school_add/school_add'
        })
      }, 1000)
    }
    var self = this
    self.setData({
      page: 1,
      currentSchool: e.detail.value
    })
    var school_id = self.data.schools[e.detail.value].id
    var state = self.data.state
    var data = {
      school_id: school_id, //required
      sort_by: self.data.sort_by, //appoint_start_at || update_at
      sequence_by: "desc", //asc || desc
      page: 1,
      size: 15,
      state: state //1待处理  2 搁置中 3 已完成
    }
    self.getOrderList(data)
  },
  getOrderList(data, more) {
    var self = this
    wx.request({
      url: app.base_url + '/v1/recyling/recyling_order_list',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: data,
      success(res) {
        if (res.data.message == 'ok') {
          var orders = res.data.data.map(el => {
            el.time_ago = timeago(null, 'zh_CN').format(el.create_at * 1000)
            el.create_time = moment.unix(el.appoint_start_at).format('YYYY-MM-DD HH:mm')
            return el
          })
          if (more) {
            orders = self.data.orders.concat(orders)
          }
          self.setData({
            orders
          })
        }
      }
    })
  },
  getMoreOrders() {
    var page = this.data.page + 1
    this.setData({
      page
    })
    var school_id = this.data.schools[this.data.currentSchool].id
    var state = this.data.state
    var data = {
      school_id: school_id, //required
      sort_by: this.data.sort_by, //appoint_start_at || update_at
      sequence_by: "desc", //asc || desc
      page: page,
      size: 15,
      state: state //1待处理  2 搁置中 3 已完成
    }
    this.getOrderList(data, true)
  },
  accomplish(e) {
    var self = this
    var data = e.currentTarget.dataset
    wx.request({
      url: app.base_url + '/v1/recyling/update_recyling_order',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        id: data.id,
        state: 3
      },
      success(res) {
        if (res.data.message == 'ok') {
          wx.showToast({
            title: '已完成',
            icon: 'success'
          })
          var orders = self.data.orders
          orders.splice(data.index, 1)
          setTimeout(() => {
            self.setData({
              orders
            })
          }, 1000)
        }
      }
    })
  },
  bindDateChange(e) {
    this.setData({
      appoint_start_date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      appoint_start_at: e.detail.value
    })
  },
  preHoldOn(e) {
    var data = e.currentTarget.dataset
    var id = data.id
    var index = data.index
    var hold_on = true
    var data_time = this.data.orders[index].create_time.split(' ')
    var appoint_start_date = data_time[0]
    var appoint_start_at = data_time[1]
    this.setData({
      id,
      index,
      hold_on,
      appoint_start_date,
      appoint_start_at
    })
  },
  holdOn(e) {
    var self = this
    var id = self.data.id
    var seller_remark = ''
    if (self.data.currentRemark < self.data.remarks.length - 1) {
      seller_remark = self.data.remarks[self.data.currentRemark]
    } else {
      seller_remark = e.detail.value.seller_remark
    }
    var appoint_start_at = moment(self.data.appoint_start_date + ' ' + self.data.appoint_start_at).format('X')
    var appoint_end_at = appoint_start_at
    var state = 2
    wx.request({
      url: app.base_url + '/v1/recyling/update_recyling_order',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: {
        id,
        seller_remark,
        appoint_start_at,
        appoint_end_at,
        state
      },
      success(res) {
        if (res.data.message == 'ok') {
          wx.showToast({
            title: '已完成',
            icon: 'success'
          })
          var orders = self.data.orders
          if (self.data.state == 2) {
            orders[self.data.index].create_time = self.data.appoint_start_date + ' ' + self.data.appoint_start_at
            orders[self.data.index].seller_remark = seller_remark
          } else if (self.data.state == 1) {
            orders.splice(self.data.index, 1)
          }
          self.setData({
            orders: orders,
            hold_on: false
          })
        }
      }
    })
  },
  cancelSubmit() {
    this.setData({
      hold_on: false,
      currentRemark: 0
    })
  }
})
