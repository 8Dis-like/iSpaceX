// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {

  },
  
  onLoad() {
    
    wx.showToast({
      
      title: '成功',
      icon: 'success',
      duration: 700//持续的时间
    })

  },

  to_letter(e){
    wx.navigateTo({
      url:'/pages/letter/letter?id=1'
    })
  },

  to_instruction(e){
    wx.navigateTo({
      url:'/pages/instruction/instruction?id=1'
    })
  },

  to_sos(e){
    wx.cloud.database().collection("UserInfo").where({//拉取登录者信息
      openid:app.globalData.loger.openid
    }).get({
      success: res=> {
        console.log("查询数据成功", res)
        app.globalData.loger.vitalphone=res.data[0].vitalphone
        console.log(app.globalData.loger.vitalphone)
        if(app.globalData.loger.vitalphone==""){
          wx.showToast({
            title: '未设置紧急联系人',
            icon:'error',
            duration:800,
          })
        }else{
          wx.makePhoneCall({
            phoneNumber: app.globalData.loger.vitalphone,
            success(){},
            fail(){}
          })
        }
      }
    })
    
  }
})
