//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    userid: '',
    logo: '',
    name: '',
    content: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    
  },
  onLoad: function () {
    var self = this
      wx.getStorage({
          key: 'token',
          success: function(res) {
              self.data.token = res.data
              wx.getStorage({
                  key: 'userid',
                  success: function(res) {
                      self.data.userid = res.data
                      var userinfo = app.globalData.userInfo
                      if (userinfo == null) {
                        setTimeout(function () {
                            self.getUserInfo(self.data.token,self.data.userid)
                        },1000)
                      } else {
                          self.logo = userinfo.avatarUrl
                          self.name = userinfo.nickName
                          self.setData({
                              token: self.data.token,
                              userid: self.data.userid,
                              logo : self.logo,
                              name: self.name,
                          })
                          self.getAlldata(self.data.token)
                      }
                  } 
              })
          } 
      })
  },
  getUserInfo (token,userid) {
    var self = this
    var userinfo = app.globalData.userInfo
    if (userinfo == null) {
        setTimeout(function () {
            self.getUserInfo(token,userid)
        },1000)
    } else {
        self.logo = userinfo.avatarUrl
        self.name = userinfo.nickName
        self.setData({
            token: token,
            userid: userid,
            logo : self.logo,
            name: self.name,
        })
        self.getAlldata(token)
    }
  },
  getAlldata (token) {
      var self = this
      wx.request({
        url: 'http://127.0.0.1:8080/content/get', 
        method: 'GET',
        header: { 'Authorization': token},
        success: function(res) {
            if (res.data.code == "0"){
                var data = res.data.data
                for (var i=0 ;i<data.length; i++){
                  self.data.content.push({
                    id:  data[i].workid+'',
                    title: data[i].title,
                    logo: data[i].logo,
                    atval: self.logo,
                    name: self.name,
                    read: data[i].readnum + "",
                    good: data[i].goodnum + "",
                    share: data[i].sharenum + "",
                    time: data[i].date.substr(0,10)
                  })
                }
                self.setData({
                    content: self.data.content
                })
            }
        }
    })
  }
})
