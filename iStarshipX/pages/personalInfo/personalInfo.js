// pages/personalInfo/personalInfo.js
var app=getApp()
Page({


  data: {
    Name:'',
    idnumber:'',
    gender:'',
    country:'',
    province:'',
    city:'',
    job:'',
    phone:'',
    vitalphone:'',
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
        app.globalData.loger.name=res.data[0].name
        app.globalData.loger.id=res.data[0].id
        app.globalData.loger.gender=res.data[0].gender
        app.globalData.loger.country=res.data[0].country
        app.globalData.loger.province=res.data[0].province
        app.globalData.loger.city=res.data[0].city
        app.globalData.loger.job=res.data[0].job
        app.globalData.loger.phone=res.data[0].phone
        app.globalData.loger.vitalphone=res.data[0].vitalphone
        this.setData({//初值
          Name:app.globalData.loger.name,
          idnumber:app.globalData.loger.id,
          gender:app.globalData.loger.gender,
          country:app.globalData.loger.country,
          province:app.globalData.loger.province,
          city:app.globalData.loger.city,
          job:app.globalData.loger.job,
          phone:app.globalData.loger.phone,
          vitalphone:app.globalData.loger.vitalphone,
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

 //修改函数
  modify_name(e){
    this.setData({
      Name:e.detail.value
    })
  },
  modify_id(e){
    this.setData({
      idnumber:e.detail.value
    })
  },
  modify_gender(e){
    this.setData({
      gender:e.detail.value
    })
  },
  modify_country(e){
    this.setData({
      country:e.detail.value
    })
  },
  modify_province(e){
    this.setData({
      province:e.detail.value
    })
  },
  modify_city(e){
    this.setData({
      city:e.detail.value
    })
  },
  modify_job(e){
    this.setData({
      job:e.detail.value
    })
  },
  modify_phone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  modify_vitalphone(e){
    this.setData({
      vitalphone:e.detail.value
    })
  },
  //保存修改
  save(e){
    console.log(this.data.Name)
    //修改全局变量
    app.globalData.loger.name=this.data.Name
    app.globalData.loger.id=this.data.idnumber
    app.globalData.loger.gender=this.data.gender
    app.globalData.loger.country=this.data.country
    app.globalData.loger.province=this.data.province
    app.globalData.loger.city=this.data.city
    app.globalData.loger.job=this.data.job
    app.globalData.loger.phone=this.data.phone
    app.globalData.loger.vitalphone=this.data.vitalphone
    console.log(app.globalData.loger)
    //更新数据库
    wx.cloud.database().collection("UserInfo").where({
      openid:app.globalData.loger.openid
    }).get({
      success:res=>{
        wx.cloud.database().collection("UserInfo").doc(res.data[0]._id).update({
          data:{
            name:app.globalData.loger.name,
            id:app.globalData.loger.id,
            gender:app.globalData.loger.gender,
            country:app.globalData.loger.country,
            province:app.globalData.loger.province,
            city:app.globalData.loger.city,
            job:app.globalData.loger.job,
            phone:app.globalData.loger.phone,
            vitalphone:app.globalData.loger.vitalphone,
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