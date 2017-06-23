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

    mobile: '',
    password: '',
    validate: {
      message: '',
      mobile: false,
      message_code: false,
      password: false,
      username: false
    }
  },
  onLoad(option) {
    var mobile = wx.getStorageSync('mobile')
    var password = wx.getStorageSync('password')
    if (!mobile || !password) {
      return
    }
    this.setData({
      mobile,
      password
    })
    if (option.sign_out) {
      return
    } else {
      var formData = {
        mobile: mobile,
        password: password
      }
      this.login(formData)
    }
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
  inputMobile(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  signIn(e) {
    var self = this
    var formData = e.detail.value ? e.detail.value : e
    if (!self.checkSignData(formData)) {
      return
    }
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
            self.login(formData)
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
    } else {
      self.login(formData)
    }
  },
  login(formData) {
    wx.showLoading({
      title: '登录中...',
    })
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
          wx.setStorageSync('mobile', formData.mobile)
          wx.setStorageSync('password', formData.password)
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/store_list/store_list'
          })
        } else {
          wx.showToast({
            title: '用户名或密码错误',
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
  signUp(e) {
    var self = this
    var formData = e.detail.value
    if (self.checkSignData(formData)) {
      return
    }
    wx.showLoading({
      title: '注册中...',
    })
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
        if (res.data.message == 'ok') {
          self.login(formData)
        } else if (res.data.message == 'exist') {
          wx.showToast({
            title: '用户名已存在',
            icon: 'loading'
          })
          self.setData({
            currentPage: 0
          })
        } else if (res.data.message == 'codeErr') {
          wx.showToast({
            title: '验证码错误',
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
  checkSignData(formData) {
    var valid = true

    let telReg = /^1\d{10}$/
    if (!telReg.test(formData.mobile)) {
      valid = false
      this.setData({
        validate: {
          message: '请输正确的手机号码',
          mobile: true,
          message_code: false,
          password: false,
          username: false
        }
      })
      return valid
    }

    if (formData.message_code != undefined) {
      let msgCodeReg = /\d{4}/
      if (!msgCodeReg.test(formData.message_code)) {
        valid = false
        this.setData({
          validate: {
            message: '验证码格式不正确',
            mobile: false,
            message_code: true,
            password: false,
            username: false
          }
        })
        return valid
      }
    }

    let pwdReg = /^[A-Za-z0-9]{6,20}$/
    if (!pwdReg.test(formData.password)) {
      valid = false
      this.setData({
        validate: {
          message: '请输入6-20英文字母或数字组合',
          mobile: false,
          message_code: false,
          password: true,
          username: false
        }
      })
      return valid
    }

    if (formData.username != undefined) {
      if (formData.username != '') {
        valid = false
        this.setData({
          validate: {
            message: '请输入姓名',
            mobile: false,
            message_code: false,
            password: false,
            username: true
          }
        })
        return valid
      }
    }

    this.setData({
      validate: {
        message: '',
        mobile: false,
        message_code: false,
        password: false,
        username: false
      }
    })
    return valid
  },
  getRegisterMessageCode() {
    this.getMessageCode('register')
  },
  getUpdateMessageCode() {
    this.getMessageCode('update_pwd')
  },
  getMessageCode(type) {
    var self = this
    let telReg = /^1\d{10}$/
    if (!telReg.test(this.data.mobile)) {
      this.setData({
        validate: {
          message: '请输正确的手机号码',
          mobile: true,
          message_code: false,
          password: false,
          username: false
        }
      })
      return
    }
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
              title: '获取验证码失败，请重试',
              icon: 'loading'
            })
          }
          if (res.data.message == 'exist') {
            wx.showToast({
              title: '该用户已被注册',
              icon: 'success'
            })
            self.setData({
              currentPage: 0
            })
          }
          if (res.data.message == 'ok') {
            wx.showToast({
              title: '已发送，请查收短信',
              icon: 'success'
            })
            self.setData({
              registe_timer_disabled: true
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
          if (res.data.code != '00000') {
            wx.showToast({
              title: '获取验证码失败，请重试',
              icon: 'loading'
            })
          }
          if (res.data.message == 'needRegister') {
            wx.showToast({
              title: '用户名不存在，请注册',
              icon: 'loading'
            })
            self.setData({
              currentPage: 1
            })
          }
          if (res.data.message == 'ok') {
            wx.showToast({
              title: '已发送，请查收短信',
              icon: 'success'
            })
            self.setData({
              update_pwd_timer_disabled: true
            })
            self.timer(type)
          }
        }
      })
    }
  },
  timer(type) {
    var self = this
    if (type == 'register') {
      if (self.data.register_timer_second > 0) {
        let register_timer_second = self.data.register_timer_second - 1
        self.setData({
          register_timer_second
        })
        setTimeout(function() {
          self.timer(type)
        }, 1000);
      } else {
        self.setData({
          registe_timer_disabled: false,
          register_timer_second: 60
        })
      }
    }
    if (type == 'update_pwd') {
      if (self.data.update_pwd_timer_second > 0) {
        let update_pwd_timer_second = self.data.update_pwd_timer_second - 1
        self.setData({
          update_pwd_timer_second
        })
        setTimeout(function() {
          self.timer(type)
        }, 1000);
      } else {
        self.setData({
          update_pwd_timer_disabled: false,
          update_pwd_timer_second: 60
        })
      }
    }
  }
})
