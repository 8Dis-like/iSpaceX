// pages/personalInfo/personalInfo.js
var app=getApp()
Page({


  data: {
    personalsign:'',
    Name:'',
    gender:'',
    city:'',
    phone:'',
  },


  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.showToast({
      title: '请如实填写个人信息',
      icon: 'none',
      duration: 1000//持续的时间
    })
    wx.cloud.database().collection("UserInfo").where({//拉取登录者信息
      openid:app.globalData.loger.openid
    }).get({
      success: res=> {
        console.log("查询数据成功", res)
        app.globalData.loger.personalsign=res.data[0].personalsign
        app.globalData.loger.name=res.data[0].name
        app.globalData.loger.gender=res.data[0].gender
        app.globalData.loger.city=res.data[0].city
        app.globalData.loger.phone=res.data[0].phone
        this.setData({//初值
          sign:app.globalData.loger.personalsign,
          Name:app.globalData.loger.name,
          gender:app.globalData.loger.gender,
          city:app.globalData.loger.city,
          phone:app.globalData.loger.phone,
        })
     }
    })
  },

   // 生命周期函数--监听页面初次渲染完成
  onReady() {

  },


  //生命周期函数--监听页面显示
  onShow() {

  },

  //生命周期函数--监听页面隐藏
  onHide() {

  },


  //生命周期函数--监听页面卸载
  onUnload() {
    
  },


  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {

  },


  //页面上拉触底事件的处理函数
  onReachBottom() {

  },

  //用户点击右上角分享
  onShareAppMessage() {

  },
  //选择背景图片
  choose_bki(e){
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
                //success:res=>{
                 // console.log("修改成功")
                //}
              })
            }
          })
        }
      })
    },

 //修改函数
 modify_sign(e){
     this.setData({
         sign:e.detail.value
     })
 },
  modify_name(e){
    this.setData({
      Name:e.detail.value
    })
  },
  modify_gender(e){
    this.setData({
      gender:e.detail.value
    })
  },
  modify_city(e){
    this.setData({
      city:e.detail.value
    })
  },
  modify_phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  //保存修改
  save(e){
    console.log(this.data.Name)
    //修改全局变量
    app.globalData.loger.personalsign=this.data.personalsign
    app.globalData.loger.name=this.data.Name
    app.globalData.loger.gender=this.data.gender
    app.globalData.loger.city=this.data.city
    app.globalData.loger.phone=this.data.phone
    console.log(app.globalData.loger)
    //更新数据库
    wx.cloud.database().collection("UserInfo").where({
      openid:app.globalData.loger.openid
    }).get({
      success:res=>{
        wx.cloud.database().collection("UserInfo").doc(res.data[0]._id).update({
          data:{
            personalsign:app.globalData.loger.personalsign,
            name:app.globalData.loger.name,
            gender:app.globalData.loger.gender,
            city:app.globalData.loger.city,
            phone:app.globalData.loger.phone,
          },
          success:res=>{
            console.log("修改成功")
          }
        })
      }
    })
    //提示成功
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 700//持续的时间
    })
  }

})