// pages/login/login.js
var app=getApp()
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //用户信息  
    wechat_name:'',
    headimgurl:'',
  },

  onLoad: function () {

  },
  //查询并且写入或者更新
  WriteIn:function(){
    wx.cloud.database().collection("UserInfo").where({
      openid:app.globalData.loger.openid
    }).get({
      success:res=>{
        if(res.data.length == 0){ // 新建
          wx.cloud.database().collection("UserInfo").add({
            data:{
              openid:app.globalData.loger.openid,
              nickname:app.globalData.loger.wxnn,
              avatarUrl:app.globalData.loger.wxsrc,
              name:"",
              id:"",
              gender:"",
              country:"",
              province:"",
              city:"",
              job:"",
              phone:"",
              vitalphone:"",
              personalsign:"",
              backimg:"",
            }
          })
        }
        else{ // 更改
          console.log(res.data[0]._id)
          wx.cloud.database().collection("UserInfo").doc(res.data[0]._id).update({
            data:{
              openid:app.globalData.loger.openid,
              nickname:app.globalData.loger.wxnn,
              avatarUrl:app.globalData.loger.wxsrc,
            },
            success:res=>{
              console.log("修改成功")
            }
          })
        }
      },
      fail:res=>{
        console.log(res)
      }
    })
  },

  //点击授权登录
  bindGetUserInfo: function(res) {
  var that = this
  // getUserProfile
  wx.getUserProfile({
          desc: '展示用户信息',    //不能为空
            success:res=>{
              console.log("获取用户信息",res)
              that.setData({
                wechat_name:res.userInfo.nickName,
                headimgurl:res.userInfo.avatarUrl,
                province:res.userInfo.province,
                country:res.userInfo.country,
                gender:res.userInfo.gender,
                city:res.userInfo.city,
              })

              //缓存用户信息
              wx.setStorageSync('wechat_name',that.data.wechat_name)
              wx.setStorageSync('headimgurl',that.data.headimgurl)
              //存入全局变量
              app.globalData.loger.wxnn=that.data.wechat_name
              app.globalData.loger.wxsrc=that.data.headimgurl
              wx.cloud.callFunction({
                name:"getid",
                success:res=>{
                  console.log(res)
                  app.globalData.loger.openid=res.result.openid
                  this.WriteIn()
                },
                fail:res=>{
                  console.log(res)
                },
              })
              wx.switchTab({
                url:'../forum/forum'//跳转到首页即论坛
              })    
            } , 
            fail:err=>{
              console.log(err)
              wx.showToast({//给出提示
                title: '如果拒绝授权可能会导致无法使用小程序！',
                icon: 'none',
                duration: 2500//持续的时间
              })
            }    
  })
 },

  onHide: function () {
    
  }
})

