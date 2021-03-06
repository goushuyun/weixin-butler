var app = getApp()
Page({
  data: {
    markers: [{
      latitude: 0,
      longitude: 0,
      width: 50,
      height: 50
    }],
    location: {
      longitude: 0,
      latitude: 0,
      address: '',
      name: ''
    },
    validate: {
      message: '',
      name: false,
      tel: false,
      express_fee: false
    }
  },
  onLoad() {
    // var self = this
    // wx.getLocation({
    //   success(res) {
    //     self.setData({
    //       location: {
    //         latitude: res.latitude,
    //         longitude: res.longitude,
    //         address: res.address,
    //         name: res.name
    //       },
    //       markers: [{
    //         latitude: res.latitude,
    //         longitude: res.longitude,
    //         width: 50,
    //         height: 50
    //       }]
    //     })
    //   }
    // })
  },
  checkData(formData) {
    var valid = true

    if (!formData.name) {
      valid = false
      this.setData({
        validate: {
          message: '请输入正确的学校名',
          name: true,
          tel: false,
          express_fee: false
        }
      })
      return valid
    }

    let telReg = /^1\d{10}$/
    if (!telReg.test(formData.tel)) {
      valid = false
      this.setData({
        validate: {
          message: '请输入正确的手机号码',
          name: false,
          tel: true,
          express_fee: false
        }
      })
      return valid
    }

    let feeCodeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    if (!feeCodeReg.test(formData.express_fee)) {
      valid = false
      this.setData({
        validate: {
          message: '请输入正确的金额',
          name: false,
          tel: false,
          express_fee: true
        }
      })
      return valid
    }

    this.setData({
      validate: {
        message: '',
        name: false,
        tel: false,
        express_fee: false
      }
    })
    return valid
  },
  choAddress() {
    var self = this
    wx.chooseLocation({
      success(res) {
        self.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
            address: res.address,
            name: res.name
          },
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50
          }]
        })
      }
    })
  },
  reset() {
    wx.navigateBack({
      delta: 1
    })
  },
  addSchool(e) {
    var location = this.data.location
    var value = e.detail.value

    var name = value.name
    var tel = value.tel
    var express_fee = value.express_fee
    var lat = parseFloat(location.latitude)
    var lng = parseFloat(location.longitude)
    var formData = {
      name,
      tel,
      express_fee
    }
    if (!this.checkData(formData)) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    express_fee = parseInt(express_fee * 100)
    var data = {
      name,
      tel,
      express_fee,
      lat,
      lng
    }
    wx.request({
      url: app.base_url + '/v1/school/add',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      method: 'POST',
      data: data,
      success(res) {
        console.log(res);
        if (res.data.message == 'ok') {
          wx.navigateBack({
            delta: 1
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
  }
})
