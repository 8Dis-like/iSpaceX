// pages/client/client.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starYesNum1:0,       //点亮的星星数量
    starNoNum1:5,        //不点亮的星星数量
    starYesNum2:0,       //点亮的星星数量
    starNoNum2:5,        //不点亮的星星数量
    starYesNum3:0,       //点亮的星星数量
    starNoNum3:5,        //不点亮的星星数量
    starYesNum4:0,       //点亮的星星数量
    starNoNum4:5,        //不点亮的星星数量
    starYesNum5:0,       //点亮的星星数量
    starNoNum5:5,        //不点亮的星星数量
  },

  selectStar1:function(e){
    console.log(e.target.id);
    console.log(e.currentTarget.dataset.in);
 
    //判断点击的星星是亮的星星还是不亮的星星,并进行设置
    if(e.currentTarget.dataset.in == 'selectStarNo'){
      this.setData({
        starYesNum1: Number(e.target.id) + Number(this.data.starYesNum1), 
        starNoNum1:5-Number(e.target.id) - Number(this.data.starYesNum1)
      })
    }else{
      this.setData({
        starYesNum1:Number(e.target.id ),
        starNoNum1:Number(5-e.target.id)
      })
    }
  },

  selectStar2:function(e){
    console.log(e.target.id);
    console.log(e.currentTarget.dataset.in);
 
    //判断点击的星星是亮的星星还是不亮的星星,并进行设置
    if(e.currentTarget.dataset.in == 'selectStarNo'){
      this.setData({
        starYesNum2: Number(e.target.id) + Number(this.data.starYesNum2), 
        starNoNum2:5-Number(e.target.id) - Number(this.data.starYesNum2)
      })
    }else{
      this.setData({
        starYesNum2:Number(e.target.id ),
        starNoNum2:Number(5-e.target.id)
      })
    }
  },

  selectStar3:function(e){
    console.log(e.target.id);
    console.log(e.currentTarget.dataset.in);
 
    //判断点击的星星是亮的星星还是不亮的星星,并进行设置
    if(e.currentTarget.dataset.in == 'selectStarNo'){
      this.setData({
        starYesNum3: Number(e.target.id) + Number(this.data.starYesNum3), 
        starNoNum3:5-Number(e.target.id) - Number(this.data.starYesNum3)
      })
    }else{
      this.setData({
        starYesNum3:Number(e.target.id ),
        starNoNum3:Number(5-e.target.id)
      })
    }
  },

  selectStar4:function(e){
    console.log(e.target.id);
    console.log(e.currentTarget.dataset.in);
 
    //判断点击的星星是亮的星星还是不亮的星星,并进行设置
    if(e.currentTarget.dataset.in == 'selectStarNo'){
      this.setData({
        starYesNum4: Number(e.target.id) + Number(this.data.starYesNum4), 
        starNoNum4:5-Number(e.target.id) - Number(this.data.starYesNum4)
      })
    }else{
      this.setData({
        starYesNum4:Number(e.target.id ),
        starNoNum4:Number(5-e.target.id)
      })
    }
  },

  selectStar5:function(e){
    console.log(e.target.id);
    console.log(e.currentTarget.dataset.in);
 
    //判断点击的星星是亮的星星还是不亮的星星,并进行设置
    if(e.currentTarget.dataset.in == 'selectStarNo'){
      this.setData({
        starYesNum5: Number(e.target.id) + Number(this.data.starYesNum5), 
        starNoNum5:5-Number(e.target.id) - Number(this.data.starYesNum5)
      })
    }else{
      this.setData({
        starYesNum5:Number(e.target.id ),
        starNoNum5:Number(5-e.target.id)
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})