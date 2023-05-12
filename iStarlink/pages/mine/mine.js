// pages/mine/mine.js
var app=getApp()
Page({

  data: {
    //用户个人信息
      wechat_name:'',//昵称
      headimgurl:'',//头像
      backimg:'',//背景图
      signature:'',//个性签名
      //初始化隐藏模态输入框
      hiddenmodalput: true,
      hiddenmodalput_:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.database().collection("UserInfo").where({//拉取登录者信息
      openid:app.globalData.loger.openid
    }).get({
      success: res=> {
        console.log("查询数据成功", res)
        app.globalData.loger.personalsign=res.data[0].personalsign
        app.globalData.loger.backimg=res.data[0].backimg
        app.globalData.loger.country=res.data[0].country
        app.globalData.loger.province=res.data[0].province
        app.globalData.loger.city=res.data[0].city
        app.globalData.loger.gender=res.data[0].gender
        app.globalData.loger.id=res.data[0].id
        app.globalData.loger.phone=res.data[0].phone
        app.globalData.loger.vitalphone=res.data[0].vitalphone
        app.globalData.loger.backimg=res.data[0].backimg
        this.setData({//设置初值
          wechat_name:app.globalData.loger.wxnn,
          headimgurl:app.globalData.loger.wxsrc,
          signature:app.globalData.loger.personalsign,
          backimg:app.globalData.loger.backimg,
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  //上传记录
  record_submit(e){
    wx.navigateTo({//跳转到上传记录界面
      url: '/pages/submit/submit?id=1',
    })
  },

  //志愿记录
  record_volunteer(e){
    wx.navigateTo({//跳转到志愿记录界面
      url: '/pages/volunteer/volunteer?id=1',
    })
  },
  //消息通知
  msg(e){
    wx.requestSubscribeMessage({
      tmplIds: ['B43Xy25SJfhebP1MNaxnbqxy0opbYULjxhAlrMAAkww'],
      success (res) {
        console.log(res)
        
      }
    })
  },

  //咨询客服
  ask_client(e){
    wx.navigateTo({//跳转到客服界面
      url: '/pages/client/client?id=1',
    })
  },

  //跳转到个人信息界面
  personal_information(e){
    wx.navigateTo({
      url: '/pages/personalInfo/personalInfo?id=1',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },

  //个性化
  individuation(e){
    wx.showActionSheet({
      itemList: ['更换背景', '更换签名'],
      success:res=>{
        console.log(res.tapIndex)
        if(res.tapIndex==0){//选择更换背景
          wx.chooseMedia({//选择图片
            count: 1,//只能选择1张
            mediaType: ['image'],//图片类型
            sourceType: ['album', 'camera'],//拍照或者相册
            camera:'back',//后置
            success:res=>{
              this.setData({
                backimg:res.tempFiles[0].tempFilePath//存储路径
              })
              wx.cloud.database().collection("UserInfo").where({//上传到数据库
                openid:app.globalData.loger.openid
              }).get({
                success:res=>{
                  wx.cloud.database().collection("UserInfo").doc(res.data[0]._id).update({
                    data:{
                      backimg:this.data.backimg
                    },
                    success:res=>{
                      console.log("修改成功")
                    }
                  })
                }
              })
            }
          })
        }
        if(res.tapIndex==1){//选择更换签名
          this.setData({
            hiddenmodalput:!this.data.hiddenmodalput//显示输入框
          })
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  //隐藏对话框取消事件处理
  modalfail: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput//隐藏对话框
    })
  },
  //隐藏对话框提交事件处理
  modalconfirm:function(e){
    this.setData({
      signature:app.globalData.loger.personalsign,//更新签名
      hiddenmodalput: !this.data.hiddenmodalput,//隐藏对话框
    })
    wx.cloud.database().collection("UserInfo").where({//上传到数据库
      openid:app.globalData.loger.openid
    }).get({
      success:res=>{
        wx.cloud.database().collection("UserInfo").doc(res.data[0]._id).update({
          data:{
            personalsign:this.data.signature
          },
          success:res=>{
            console.log("修改成功")
          }
        })
      }
    })
  },
  //隐藏对话框输入获取
  input(e){
    app.globalData.loger.personalsign=e.detail.value
  },

  //账号管理
  account_manage(e){
    wx.showActionSheet({
      itemList: ['注销账号'],
      success:res=>{
        console.log(res.tapIndex)
        if(res.tapIndex==0){//注销账号
          wx.showModal({
            title: "温馨提示", // 提示的标题
            content: "如果注销账号，则个人信息、记录、个性化内容均会清空", // 提示的内容
            showCancel: true, // 是否显示取消按钮
            cancelText: "取消", // 取消按钮的文字
            confirmText: "确定", // 确认按钮的文字
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.cloud.database().collection("UserInfo").where({
                      openid:app.globalData.loger.openid
                    }).get({
                      success:res=>{
                        wx.cloud.database().collection("UserInfo").doc(res.data[0]._id).remove({
                          success:res=>{
                            console.log(res.data)
                            wx.showToast({
                              title: '注销成功',
                              icon:"success",
                              duration:700,
                            })
                          }
                        })
                      },
                      fail:res=>{
                        console.log(res.data)
                        wx.showToast({
                          title: '账号已注销',
                          icon:"erro",
                          duration:700,
                        })
                      }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
          })
        }
      }
    })
  },

  //关于
  about(e){
    wx.showActionSheet({
      itemList: ['版本信息','问题反馈'],
      success:res=>{
        console.log(res.tapIndex)
        if(res.tapIndex==0){//版本信息
          wx.showModal({
            title: "版本信息", // 提示的标题
            content: "小程序：iStarship\r\n版本：1.0\r\n开发者： \r\n客服电话：", // 提示的内容
            showCancel: false, // 是否显示取消按钮
            confirmText: "确定", // 确认按钮的文字
          })
        }
        if(res.tapIndex==1){//问题反馈
          this.setData({
            hiddenmodalput_:!this.data.hiddenmodalput_
          })
        }
      }
    })
  },
  //隐藏对话框确认事件
  modalconfirm_(e){
    this.setData({
      hiddenmodalput_:!this.data.hiddenmodalput_
    })
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 700//持续的时间
    })
  },
  //隐藏对话框取消事件
  modalfail_(e){
    this.setData({
      hiddenmodalput_:!this.data.hiddenmodalput_
    })
  },

  //消息通知
  message_send(e){
    wx.navigateTo({
      url: '/pages/message/message?id=2',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }

})