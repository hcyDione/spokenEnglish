//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    title: '',
    matter: [
        { 
            isVideo: false,
            isImg: false,
            isText: true,
            src: '',
            text: '',
        }
    ],
    logo: '',
    logoExp: '上传封面',
    showlogo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //上传封面
  uploadLogo: function () {
      var self = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'], 
          sourceType: ['album', 'camera'],
          success: function (res) {
              var tempFilePaths = res.tempFilePaths
              /*self.setData({
                logo: tempFilePaths[0]
              })*/
              wx.uploadFile({
                  url: 'http://127.0.0.1:8080/upload', 
                  method: 'POST',
                  filePath: tempFilePaths[0],
                  name: 'file',
                  header: {
                      'Authorization': self.token
                  },
                  success: function(res) {
                    if (res.data.code == "0"){
                      var data = res.data.data
                      self.setData({
                        logo: ''
                      })
                    }
                  }
              })
          } 
      })
  },
  //添加文字模块
  addText: function () {
      this.matter.push({
        isVideo: false,
        isImg: false,
        isText: true,
        src: '',
        text: '',
      })
  },
  addImg: function () {
      var self = this
      wx.chooseImage({
          count: 1,
          sizeType: ['compressed'], 
          sourceType: ['album', 'camera'],
          success: function (res) {
              var tempFilePaths = res.tempFilePaths
              /*self.setData({
                logo: tempFilePaths[0]
              })*/
              wx.uploadFile({
                  url: 'http://127.0.0.1:8080/upload', 
                  method: 'POST',
                  filePath: tempFilePaths[0],
                  name: 'file',
                  header: {
                      'Authorization': self.token
                  },
                  success: function(res) {
                    if (res.data.code == "0"){
                      var data = res.data.data
                      self.matter.push({
                        isVideo: false,
                        isImg: true,
                        isText: false,
                        src: '',
                        text: '',
                      })
                      self.setData({
                        matter: self.matter
                      })
                    }
                  }
              })
          } 
      })
  },
  addVideo: function () {
      var self = this
      wx.chooseVideo({
        sourceType: ['album','camera'],
        maxDuration: 60,
        camera: 'back',
        success: function(res) {
          //http://tmp/wxa6bc09066f9bbd18.o6zAJs042vW1WjoZ6FDPa4-UUSkc.jGHzDE5fTjY8230a44533e8edda1f49f39941b9a7840.mp4
          var tempFilePath = res.tempFilePath
          wx.uploadFile({
            url: 'http://127.0.0.1:8080/upload/video', 
            method: 'POST',
            filePath: tempFilePath,
            name: 'file',
            header: {
              'Authorization': self.token
            },
            success: function(res) {
              if (res.data.code == "0"){
                var data = res.data.data
                self.matter.push({
                  isVideo: true,
                  isImg: false,
                  isText: false,
                  src: '',
                  text: '',
                })
                self.setData({
                  matter: self.matter
                })
              }
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
