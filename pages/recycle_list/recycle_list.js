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
    appoint_start_date: '2017-06-17',
    appoint_start_at: '18:55'
  },
  onLoad() {
    this.getSchools()
  },
  goToPage(e) {
    var currentPage = e.target.dataset.index
    var state = currentPage + 1
    var school_id = this.data.schools[this.data.currentSchool].id
    // 每次切换tab 都要重置 sort_by
    var sort_by = 'appoint_start_at'
    var sort_by_name = '按预约时间排序'

    var data = {
      school_id: school_id, //required
      sort_by: sort_by, //appoint_start_at || update_at
      sequence_by: "desc", //asc || desc
      page: 1,
      size: 15,
      state: state //1待处理  2 搁置中 3 已完成
    }

    this.setData({
      currentPage,
      state,
      sort_by,
      sort_by_name
    })
    this.getOrderList(data)
  },
  changeSortBy() {
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
          sort_by: sort_by,
          sort_by_name: itemList[res.tapIndex]
        })
        self.getOrderList(data)
      }
    })
  },
  goToSetting() {
    var id = this.data.id
    wx.redirectTo({
      url: '/pages/setting/setting'
    })
  },
  changeStore() {
    wx.navigateBack({
      delta: 1
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
    var self = this
    self.setData({
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
            el.create_time = moment.unix(el.appoint_start_at).format('YYYY-MM-DD hh:mm')
            return el
          })
          if (more) {
            var orderList = self.data.orders.concat(orders)
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
    console.log(e.currentTarget.dataset);
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
    this.setData({
      id,
      index,
      hold_on
    })
  },
  holdOn(e) {
    var self = this
    var id = self.data.id
    var seller_remark = e.detail.value.seller_remark
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
          self.setData({
            hold_on: false
          })
          if (self.data.state == 1) {
            var orders = self.data.orders
            orders.splice(self.data.index, 1)
            setTimeout(() => {
              self.setData({
                orders
              })
            }, 1000)
          }
        }
      }
    })
  }
})
