// pages/Write/Write.js

const db = wx.cloud.database().collection("INFO")
//连接到数据库
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo:[], // 评论的是谁？
        openid:"", // 微信用户openid 唯一标识
        wxnn:"", // 微信名
        wxsrc:"", // 微信头像src
        InputInfo:"", // 用户输入的评论信息
        Imglist:[], // 用户选择的照片
        MP4list:[], // 用户选择的视频
        imgup:[], // 用户选择的照片在云端的路径
        mp4up:[], // 用户选择的照片在云端的路径
        presource:[], // 预览资源
        maxMedia:9, // 最大上传数，保证总上传数不超过9
        showView:true, // 当到达是否最大上传数时，关闭打开图像的接口，否则启用
        Notice:true, // 当用户第一次点击打开图像接口，显示提示窗口
    },

    GetInputInfo(e){ // 获取用户输入的文本信息
        this.setData({
            InputInfo: e.detail.value
        })
    },

    OpenMedia(e){ // 打开图片或视频
      if(this.data.Notice){ // 第一次点击，出现提示窗口
        wx.showModal({
          title: '仅作本次提示',
          content: '长按以删除图片或视频',
          success : res=> {
            if (res.confirm) {
              console.log('用户点击确定')
              this.setData({Notice:false})
              this.GetRES()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else{
        this.GetRES()
      }
  },

  GetRES(){ // 用户选择图片或视频
    wx.chooseMedia({
      count: this.data.maxMedia, // 最大上传数
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      //这个接口如果ios端使用了，就不能规定maxDuration，否则会出错，这个官方错误至今未解决
      //maxDuration: 300, //视频最大时长 单位为秒 注意这个值当直接拍摄的时长不允许超过60s
      camera: 'back',// 用后置摄像头
      success:res=> {
          if(res.type == "image"){ // 图片
            for(var index in res.tempFiles){
                  this.setData({
                      Imglist:this.data.Imglist.concat(res.tempFiles[index].tempFilePath),
                      lastname:'.png'
                  })
            }
            this.Uploadfile('image', 0, res.tempFiles) // 递归上传
          }
          else{ // 视频数据
            for(var index in res.tempFiles){
                this.setData({
                    MP4list:this.data.MP4list.concat(res.tempFiles[index].tempFilePath),
                    lastname:'.mp4'
                })
            }
            this.Uploadfile('video', 0, res.tempFiles) // 递归上传
          }
          this.setData({ // 修改下最大上传数，保证用户只能上传9张照片或视频
             maxMedia:9-this.data.mp4up.length-this.data.imgup.length
          })
          if(this.data.maxMedia == 0){ // 不能再上传了，不再显示添加图像标志
            this.setData({
              showView:false
            })
          }
      }
    })
  },

/**type::image-图片 video-视频 */
  Uploadfile(type, idx, files){ // 将图片和视频上传到云存储中，并记录下返回的云端路径
    if(idx == files.length)return
    var Filepath = files[idx].tempFilePath
    wx.cloud.uploadFile({ // 上传到云端
        cloudPath: Date.now() + this.data.lastname, // 为防止重复，直接取当前时间戳作为文件名
        filePath: Filepath, // 文件路径
        success: res => {
          // get resource ID
          console.log("上传成功", res.fileID)
          if(type == "image"){
            this.setData({
                imgup:this.data.imgup.concat(res.fileID)
            })
          }
          else{
            this.setData({
                mp4up:this.data.mp4up.concat(res.fileID)
            })
          }
          // 递归上传
          this.Uploadfile(type, idx + 1, files)
        },
        fail: err => {}
      })
  },

  Preview(e){//图片视频预览
    this.setData({presource:[]}) // 先清一下
    for(var index in e.target.dataset.imglist){// 先把图片的排上去
        this.setData({
            presource:this.data.presource.concat({url: e.target.dataset.imglist[index], type: "image"})
        })
    }
    for(var index in e.target.dataset.mp4list){// 再把视频也排上去
        this.setData({
            presource:this.data.presource.concat({url: e.target.dataset.mp4list[index], type: "video"})
        })
    }
    wx.previewMedia({
      sources: this.data.presource,
      current: e.target.dataset.idx,
      showmenu:true
    })
  },
   
  DeleteImg(e){//删除图片 
    console.log(e)
    console.log(e.target.dataset.idx)
    wx.showActionSheet({
      itemList: ['确认删除'],
      success: res=> {
        console.log(res.tapIndex)
        wx.cloud.deleteFile({ // 同时在云端删除
          fileList: [this.data.imgup[e.target.dataset.idx]],
          success: res=>{
              console.log("删除成功")
          },
          fail: res=>{
            console.log(res)
          }
        })
        this.data.Imglist.splice(e.target.dataset.idx, 1)
        this.data.imgup.splice(e.target.dataset.idx, 1)
        this.setData({
          showView:true,
          maxMedia:9-this.data.MP4list.length-this.data.Imglist.length,
          Imglist:this.data.Imglist,
          imgup:this.data.imgup
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  DeleteMP4(e){//删除视频
    console.log(e)
    wx.showActionSheet({
      itemList: ['确认删除'],
      success: res=> {
        console.log(res.tapIndex)
        wx.cloud.deleteFile({ // 同时在云端删除
          fileList: [this.data.mp4up[e.target.dataset.index]],
          success: res=>{
              console.log("删除成功")
          },
          fail: res=>{}
        })
        this.data.mp4up.splice(e.target.dataset.index, 1)
        this.data.MP4list.splice(e.target.dataset.index, 1)
        this.setData({ 
          showView:true,
          maxMedia:9-this.data.MP4list.length-this.data.Imglist.length,
          MP4list:this.data.MP4list
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  Upload(e){ // 上传所有数据
    if(this.data.InputInfo == ""){
      wx.showToast({
        title: '请先填写内容',
        icon:'error',
        duration:1500
      })
      return
    }

    var app = getApp()
    //获取评论时间
    var date = new Date()
    var utils=require("../../utils/util.js")
    // 赋值要写入的一条评论
    var commentone = {date:utils.formatTime(date), openid:this.data.openid, wxnn:app.globalData.loger.wxnn, wxsrc:app.globalData.loger.wxsrc, content:this.data.InputInfo, imgsrc:this.data.imgup, mp4src:this.data.mp4up}
    console.log(commentone)
    this.setData({
      'userinfo.comment':this.data.userinfo.comment.concat(commentone)
    })
    // 更新数据
    wx.cloud.database().collection("INFO").doc(this.data.userinfo.ID).update({
      data:{
        Comment:this.data.userinfo.comment
      },
      success:result=>{
          console.log("评论成功", result)
          // 更新数据
          app.globalData.userInfo['comment']=this.data.userinfo.comment
          wx.navigateBack({ // 跳回上层页面
            delta: 1,
            success: res=>{
              wx.showToast({ // 提示弹窗
                title: '评论成功',
                icon:'success',
                duration:2000
              })
            }
          })
      },
      fail:error=>{
          console.log("评论失败", error)
      }
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var app = getApp()
        this.setData({
            userinfo:app.globalData.userInfo,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //在渲染完页面后自动获取用户openid
      wx.cloud.callFunction({ // 用事先写好的云函数套取用户openid 
        name:"getid",
        success: res=> {
            this.setData({
                openid: res.result.openid
            })
        },
        fail: res=>{}
      })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})