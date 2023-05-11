// pages/submit/submit.js
const db = wx.cloud.database().collection("INFO")
const dbuser = wx.cloud.database().collection("UserInfo")
var openid2wxnn = Array()
var openid2wxsrc = Array()

var app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ID:[], // 每一条消息的唯一id
        openid:[], // 微信用户openid 唯一标识 存一个列表
        title:[],
        progressing:[], // 事件进展
        likes:[],  // 点赞数
        dates:[], // 发布日期
        comments:[], // 所有评论
        content:[], // 用户输入的文本信息描述
        locationname:[], // 用户的位置信息
        checktype:[], // 0所有人可修改，1仅自己可修改
        eventype:[], // 事件类型
        imgurl:[], // 图像
        mp4url:[], // mp4
        wxImage:[], // 微信用户头像的url
        wxname:[], // 微信用户的名称
        longitude:[],//经度
        latitude:[],//维度
    },
    Refresh:function(e){
        console.log(e)
    },
    Getwx(){ // 获取用户的头像和微信昵称
      for(var index in this.data.openid){
        this.setData({
          wxname:this.data.wxname.concat(openid2wxnn[this.data.openid[index]]),
          wxImage:this.data.wxImage.concat(openid2wxsrc[this.data.openid[index]]),
        })
      }
    },

    Showdetail:function(e){
        // 传参
        var idx = e.currentTarget.dataset.idx
        app.globalData.userInfo['openid']=this.data.openid[idx]
        app.globalData.userInfo['wxnn']=this.data.wxname[idx]
        app.globalData.userInfo['wxsrc']=this.data.wxImage[idx]
        app.globalData.userInfo['locationname']=this.data.locationname[idx]
        app.globalData.userInfo['imgurl']=this.data.imgurl[idx]
        app.globalData.userInfo['mp4url']=this.data.mp4url[idx]
        app.globalData.userInfo['eventype']=this.data.eventype[idx]
        app.globalData.userInfo['checktype']=this.data.checktype[idx]
        app.globalData.userInfo['title']=this.data.title[idx]
        app.globalData.userInfo['content']=this.data.content[idx]
        app.globalData.userInfo['likes']=this.data.likes[idx]
        app.globalData.userInfo['date']=this.data.dates[idx]
        app.globalData.userInfo['progressing']=this.data.progressing[idx]
        app.globalData.userInfo['comment']=this.data.comments[idx]
        app.globalData.userInfo['ID']=this.data.ID[idx]
        app.globalData.userInfo['latitude']=this.data.latitude[idx]
        app.globalData.userInfo['longitude']=this.data.longitude[idx]
        wx.navigateTo({ // 跳转至 "个人详细" 的界面
            url: '/pages/Detail/Detail',
        })
    },

    GetInfo:function(){ // 拉取数据
        this.setData({
            ID:[], // 每一条消息的唯一id
            openid:[], // 微信用户openid 唯一标识 存一个列表
            title:[],
            progressing:[], // 事件进展
            likes:[],  // 点赞数
            dates:[], // 发布日期
            comments:[], // 所有评论
            content:[], // 用户输入的文本信息描述
            locationname:[], // 用户的位置信息
            checktype:[], // 0所有人可修改，1仅自己可修改
            eventype:[], // 事件类型
            imgurl:[], // 图像
            mp4url:[], // mp4
            wxImage:[], // 微信用户头像的url
            wxname:[], // 微信用户的名称
            longitude:[],//经度
            latitude:[],//维度
        })
        console.log(app.globalData.loger.openid)
        wx.cloud.database().collection("INFO").where({//查询登录者发布的
          Openid:app.globalData.loger.openid
        }).get({
            success: res=> {
                console.log("查询数据成功", res)
                for(var idx in res.data){
                    this.setData({
                        content:this.data.content.concat(res.data[idx].Content),
                        eventype:this.data.eventype.concat(res.data[idx].EventType),
                        locationname:this.data.locationname.concat(res.data[idx].LocationName),
                        title:this.data.title.concat(res.data[idx].Title),
                        openid:this.data.openid.concat(res.data[idx].Openid),
                        imgurl:this.data.imgurl.concat([res.data[idx].imgpath]),
                        mp4url:this.data.mp4url.concat([res.data[idx].mp4path]),
                        checktype:this.data.checktype.concat(res.data[idx].checkType),
                        progressing:this.data.progressing.concat(res.data[idx].Progressing),
                        likes:this.data.likes.concat(res.data[idx].Likes),
                        dates:this.data.dates.concat(res.data[idx].Date),
                        comments:this.data.comments.concat([res.data[idx].Comment]),
                        ID:this.data.ID.concat(res.data[idx]._id),
                        longitude:this.data.longitude.concat(res.data[idx].Lontitude),
                        latitude:this.data.latitude.concat(res.data[idx].Latitude)
                    })
                }
                this.Getwx(0) // 必须写在里面
                wx.hideNavigationBarLoading()
              },
              fail:res=>{}
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      wx.showNavigationBarLoading()
      dbuser.get({
        success:res=>{
          for(var index in res.data){
            openid2wxnn[res.data[index].openid] = res.data[index].nickname
            openid2wxsrc[res.data[index].openid] = res.data[index].avatarUrl
          }
        },
        fail:err=>{}
      })
      this.GetInfo()
      setTimeout(function(){wx.hideNavigationBarLoading()}, 1000)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      wx.showNavigationBarLoading()
      dbuser.get({
        success:res=>{
          for(var index in res.data){
            openid2wxnn[res.data[index].openid] = res.data[index].nickname
            openid2wxsrc[res.data[index].openid] = res.data[index].avatarUrl
          }
        },
        fail:err=>{}
      })
      this.GetInfo()
      setTimeout(function(){wx.hideNavigationBarLoading()}, 1000)
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
    onPullDownRefresh: function () { // 更新数据
        wx.showNavigationBarLoading()
        wx.showToast({
            title: '刷新中',
            icon: 'loading',
            duration: 3000
          });
        this.GetInfo()
        setTimeout(function(){
            wx.showToast({
              title: '刷新成功',
              icon: 'success',
              duration: 2000
            })
            wx.hideNavigationBarLoading()
        },3000)
        //setTimeout(function(){wx.hideNavigationBarLoading()}, 1000);
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