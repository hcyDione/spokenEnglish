//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    userid: '',
    contentid: '',
    logo: '',
    name: '',
    time: '',
    title: '',
    content: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    var self = this
    self.contentid = option.id
      wx.getStorage({
          key: 'token',
          success: function(res) {
              self.data.token = res.data
              wx.getStorage({
                  key: 'userid',
                  success: function(res) {
                      self.data.userid = res.data
                      var userinfo = app.globalData.userInfo
                      self.logo = userinfo.avatarUrl
                      self.name = userinfo.nickName
                      self.setData({
                          token: self.data.token,
                          userid: self.data.userid,
                          logo : self.logo,
                          name: self.name,
                          contentid: self.contentid,
                      })
                      self.getAlldata(self.data.token, self.contentid)
                  } 
              })
          } 
      })
  },
  getAlldata (token, id) {
      var self = this
      wx.request({
        url: 'http://127.0.0.1:8080/content/get?id='+ id, 
        method: 'GET',
        header: { 'Authorization': token},
        success: function(res) {
            if (res.data.code == "0"){
                var data = res.data.data
                self.data.title = data[0].title
                wx.setNavigationBarTitle({
                    title: self.data.title
                })
                self.data.time = data[0].date.substr(0,10)
                self.data.content = JSON.parse(data[0].detail)
                self.setData({
                    title: self.data.title,
                    time: self.data.time,
                    content: self.data.content
                })
            }
        }
    })
  }
})
