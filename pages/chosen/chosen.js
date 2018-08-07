//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    content: [{
      title:'lalal',
      logo: 'lalala',
      file: 'bubuubu'
    }],
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
                      self.setData({
                          token: self.data.token,
                          userid: self.data.userid
                      })
                      self.getAlldata(self.data.token)
                  } 
              })
          } 
      })
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
                    title: data.title,
                    logo: data.logo,
                    read: data.readnum + "",
                    good: data.goodnum + "",
                    share: data.sharenum + "",
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
