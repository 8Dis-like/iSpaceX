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
  
  //云函数ADD
  add(){
    wx.cloud.callFunction({
      name:"add",
      data:{
        a:11,
        b:3
      },
      success(res)
      {console.log("请求成功",res)},
      fail(res)
      {console.log("请求失败",res)}
    })
  }
})
