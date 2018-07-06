//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    sessionkey: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo (e) {
      var self = this
      var issuccess = e.detail.errMsg
      if (issuccess.indexOf('ok') < 0){
          wx.showToast({
              title: '需要您的授权哦',
          })
          return false
      }
      app.globalData.userInfo = e.detail.userInfo
      var encryptedData = e.detail.encryptedData
      var iv = e.detail.encryptedData
      var data = {
          "sessionkey": this.sessionkey,
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
  },
  onLoad: function (option) {
    this.sessionkey = option.query.sessionkey
    wx.getStorage({
        key: 'token',
        success: function(res) {
            this.token = res.data
            this.setdata({
                token: this.token,
                sessionkey: this.sessionkey,
            })
        } 
    })
  },
  
})
