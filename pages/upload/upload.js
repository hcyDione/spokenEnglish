//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    title: '',
    matter: [
        { 
            isvideo:true,
            text: '',
        },
        { 
            isvideo:false,
            text: '',
        }
    ],
    logo: '',
    logoExp: '上传封面',
    showlogo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //上传封面
  uploadFile: function () {
      var self = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'], 
          sourceType: ['album', 'camera'],
          success: function (res) {
              var tempFilePaths = res.tempFilePaths
              wx.uploadFile({
                  url: 'http://127.0.0.1:8080/upload', 
                  method: 'POST',
                  filePath: tempFilePaths[0],
                  name: 'file',
                  header: {
                      'Authorization': self.token
                  },
                  success: function(res) {
                      
                  }
              })
          } 
      })
  },
  //获取标题
  titleInput: function (e) {
      this.title = e.detail.value
  },
  //获取内容解释
  summaryInput: function (e) {
      var text = e.detail.value
      var index = e.currentTarget.dataset.index;
      this.matter[index] = text
  },
  //提交
  doSubmit: function () {
      wx.navigateBack()
  },
  onLoad: function () {
      var self = this
      wx.getStorage({
          key: 'token',
          success: function(res) {
              self.token = res.data
              self.setData({
                  token: self.token
              })
          } 
      })
  },
})
