Page({
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