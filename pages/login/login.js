var app = getApp()
Page({
  data: {
    tabs: ['登录', '注册'],
    currentPage: 0,
    forgetPwd: false,
    /* 倒计时 */
    register_timer_second: 60,
    registe_timer_disabled: false,
    update_pwd_timer_second: 60,
    update_pwd_timer_disabled: false,

    mobile: ''
  },
  goToPage(e) {
    this.setData({
      currentPage: e.target.dataset.index
    })
  },
  forgetBtn() {
    var forgetPwd = !this.data.forgetPwd
    this.setData({
      forgetPwd
    })
  },
  signIn(e) {
    var self = this
    var formData = e.detail.value
    console.log(formData);
    if (self.data.forgetPwd) {
      wx.request({
        url: app.base_url + '/v1/seller/update_password',
        method: 'POST',
        data: {
          mobile: formData.mobile,
          password: formData.password,
          message_code: formData.message_code
        },
        success(res) {
          if (res.data.message == 'ok') {
            wx.showToast({
              title: '密码已更改',
              icon: 'success'
            })
            self.setData({
              forgetPwd: false
            })
          } else {
            wx.showToast({
              title: '密码更改失败',
              icon: 'loading'
            })
            return
          }
        }
      })
    }
    wx.request({
      url: app.base_url + '/v1/seller/login',
      method: 'POST',
      data: {
        mobile: formData.mobile,
        password: formData.password
      },
      success(res) {
        if (res.data.message == 'ok') {
          wx.setStorageSync('token', res.data.data.token)
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
        } else if (resp.data.message == 'notFound') {
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'loading'
          })
        }
      }
    })
  },
  signUp(e) {
    var self = this
    var formData = e.detail.value
    wx.request({
      url: app.base_url + '/v1/seller/register',
      method: 'POST',
      data: {
        mobile: formData.mobile,
        password: formData.password,
        message_code: formData.message_code,
        username: formData.username
      },
      success(res) {
        if (resp.data.message == 'ok') {
          this.signIn(formName)
        } else if (resp.data.message == 'exist') {
          wx.showToast({
            title: '用户名已存在',
            icon: 'loading'
          })
        } else if (resp.data.message == 'codeErr') {
          wx.showToast({
            title: '验证码错误',
            icon: 'loading'
          })
        }
      }
    })
  },
  checkSignData(formData) {
    var result = {
      message: 'ok',
      valid: false
    }
    if (!formData.mobile) {
      result.message = '手机号码不能为空'
    }
    let telReg = /^1\d{10}$/
    if (!telReg.test(value)) {
      result.message = '请输正确的手机号码'
    } else {
      result.valid = true
    }
    return result
  },
  getMessageCode(type) {
    var self = this
    if (!/^1\d{10}$/.test(this.data.mobile)) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'loading'
      })
      return
    }
    console.log(type);
    if (type == 'register') {
      wx.request({
        url: app.base_url + '/v1/seller/get_sms',
        method: 'POST',
        data: {
          mobile: self.data.mobile
        },
        success(res) {
          if (res.data.code != '00000') {
            wx.showToast({
              title: '获取验证码失败，请重试！',
              icon: 'loading'
            })
          }
          if (res.data.message == 'exist') {
            wx.showToast({
              title: '该用户已被注册！',
              icon: 'success'
            })
          }
          if (res.data.message == 'ok') {
            wx.showToast({
              title: '已发送，请查收短信！',
              icon: 'success'
            })
            wx.setData({
              update_pwd_timer_disabled: true
            })
            self.timer(type)
          }
        }
      })
    }

    if (type == 'update_pwd') {
      wx.request({
        url: app.base_url + '/v1/seller/get_update_sms',
        method: 'POST',
        data: {
          mobile: self.data.mobile
        },
        success(res) {
          if (resp.data.code != '00000') {
            wx.showToast({
              title: '获取验证码失败，请重试！',
              icon: 'loading'
            })
          }
          if (resp.data.message == 'needRegister') {
            wx.showToast({
              title: '用户名不存在，请注册！',
              icon: 'loading'
            })
            wx.setData({
              currentPage: 1
            })
          }
          if (resp.data.message == 'ok') {
            wx.showToast({
              title: '已发送，请查收短信！',
              icon: 'success'
            })
            wx.setData({
              update_pwd_timer_disabled: true
            })
            this.timer(type)
          }
        }
      })
    }
  },
  timer(type) {
    var self = this
    if (type == 'register') {
      if (self.data.register_timer_second > 0) {
        let register_timer_second = self.data.register_timer_second--
          wx.setData({
            register_timer_second
          })
        setTimeout(function() {
          self.timer(type)
        }, 1000);
      } else {
        wx.setData({
          registe_timer_disabled: false
        })
      }
    }
    if (type == 'update_pwd') {
      if (self.data.update_pwd_timer_second > 0) {
        let update_pwd_timer_second = self.update_pwd_timer_second--
          wx.setData({
            update_pwd_timer_second
          })
        setTimeout(function() {
          self.timer(type)
        }, 1000);
      } else {
        wx.setData({
          update_pwd_timer_disabled: false
        })
      }
    }
  }
})
