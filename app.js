//app.js
App({
  globalData: {
    userInfo: null,
    decrydata: null,
  },
  onLaunch: function () {
    // 展示本地存储能力
    /*var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)*/
    var token = ''
    var code = ''
    var self = this
    // 获取token
    wx.request({
        url: 'http://127.0.0.1:8080/gettoken', 
        data: {
            name: 'Dione',
            psd: 'admin',
            renovate: 'N',
        },
        method: 'POST',
        header: {
            'content-type':'application/x-www-form-urlencoded',
        },
        success: function(res) {
            if (res.data.code == "0"){
                token = res.data.token
                wx.setStorage({
                    key: "token",
                    data: token
                })
                // 登录
                wx.login({
                  success: res => {
                    var code = res.code
                    self.getSessionkey(code,token)
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  }
                })
            }
        }
    })
  },
  getSessionkey (code,token) {
      var sessionkey = ''
      var self = this
      wx.request({
          url: 'http://127.0.0.1:8080/code2session?code='+code, 
          method: 'POST',
          header: { 'Authorization': token},
          success: function(res) {
              if (res.data.code == "0"){
                  sessionkey = res.data.data.sessionkey
                  self.getAuthor(sessionkey,token)
              }
          }
      })
  },
  getAuthor (sessionkey,token){
      var encryptedData = ''
      var iv = ''
      var self = this
      // 获取用户信息
      wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                      success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          self.globalData.userInfo = res.userInfo
                          encryptedData = res.encryptedData
                          iv = res.iv
                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          var data = {
                              "sessionkey": sessionkey,
                              "encrypteddata": encryptedData,
                              "iv": iv
                          }
                          wx.request({
                              url: 'http://127.0.0.1:8080/decryption', 
                              method: 'POST',
                              data: data,
                              header: { 
                                  'content-type':'application/x-www-form-urlencoded',
                                  'Authorization': token
                              },
                              success: function(res) {
                                  if (res.data.code == "0"){
                                      var data = res.data.data
                                      var info = {
                                          "openId" : data.openId,
                                          "nickName" : data.nickName,
                                          "city" : data.city,
                                          "gender" : data.gender,
                                          "province" : data.province,
                                          "country" : data.country,
                                          "avatarUrl" : data.avatarUrl,
                                      }
                                      self.globalData.decrydata = info 
                                      /*wepy.request({
                                          url: 'http://127.0.0.1:8080/loginwx',
                                          data: info,
                                          method: 'POST',
                                          header: { 
                                              'content-type':'application/x-www-form-urlencoded',
                                              'Authorization': token
                                          },
                                          success: function(res){
                      
                                          }
                                      })*/
                                  }
                              }
                          })
                      }
                  })
              } else {
                  wx.navigateTo({
                      url: 'pages/login/login?sessionkey='+sessionkey
                  })
              }
          }
      })
  }
})