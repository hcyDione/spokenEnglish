//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    token: '',
    userid: '',
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
                    var data = JSON.parse(res.data)
                    if (data.code == "0"){
                      self.data.logo = data.data
                      self.setData({
                        logo: self.data.logo
                      })
                    }
                  }
              })
          } 
      })
  },
  //添加文字模块
  addText: function () {
      var self = this
      self.data.matter.push({
        isVideo: false,
        isImg: false,
        isText: true,
        src: '',
        text: '',
      })
      self.setData({
        matter: self.data.matter
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
                    var data = JSON.parse(res.data)
                    if (data.code == "0"){
                      self.data.matter.push({
                        isVideo: false,
                        isImg: true,
                        isText: false,
                        src: data.data,
                        text: '',
                      })
                      self.setData({
                        matter: self.data.matter
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
              var data = JSON.parse(res.data)
              if (data.code == "0"){
                self.data.matter.push({
                  isVideo: true,
                  isImg: false,
                  isText: false,
                  src: data.data,
                  text: '',
                })
                self.setData({
                  matter: self.data.matter
                })
              }
            }
          })
        }
    })
  },
  //获取标题
  titleInput: function (e) {
      this.data.title = e.detail.value
  },
  //获取内容解释
  summaryInput: function (e) {
      var text = e.detail.value
      var index = e.currentTarget.dataset.index;
      this.data.matter[index].text = text
  },
  //提交
  doSubmit: function () {
    var self = this
    var content = JSON.stringify(self.data.matter)
    var data = {
      authorId: self.data.userid,
      detail: content,
      title: self.data.title,
      logo: self.data.logo,
    }
    wx.request({
        url: 'http://127.0.0.1:8080/content/add', 
        method: 'POST',
        data: data,
        header: { 'Authorization': self.token},
        success: function(res) {
            if (res.data.code == "0"){
                wx.showToast({
                  title: '发布成功',
                  icon: 'success'
                })
                wx.navigateBack()
            }
        }
    })
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
                  } 
              })
          } 
      })
  },
})
