//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    logo: '',
    name: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
      var userinfo = app.globalData.userInfo
      this.logo = userinfo.avatarUrl
      this.name = userinfo.nickName
      this.setData({
          logo : this.logo,
          name: this.name
      })

  },
})
