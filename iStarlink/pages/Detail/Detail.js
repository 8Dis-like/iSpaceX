// pages/Detail/Detail.js
var app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo:{},
        presource:[],
        liketype:false, // 是否点赞了
        likesrc:"/images/Prino.png",
        likeholder:"OneHolder",

    },

    Go2There:function(e){ // 跳转至导航；
      let plugin = requirePlugin('routePlan');
      let key = 'YU4BZ-EO3AQ-AKR5L-BZP3C-6XXJH-RSFOJ';  //使用在腾讯位置服务申请的key
      let referer = 'iStarlink';   //调用插件的app的名称
      let endPoint = JSON.stringify({  //终点
        'name': this.data.userinfo.locationname,
        'latitude': this.data.userinfo.latitude,
        'longitude': this.data.userinfo.longitude
      });
      wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint+'&themeColor=#ffcc66'+'&navigation='+1
      });
    },

    Preview(e){//图片预览
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

    ChangeProgressing:function(e){
        var app = getApp()
        if(this.data.userinfo.checktype==1 && this.data.userinfo.openid != app.globalData.loger.openid){
            wx.showToast({
              title: '您没有权限修改',
              icon:"error"
            })
            return
        }
        var ilist = ['尚无进展','进展中','已解决']
        wx.showActionSheet({
            itemList: ilist,
            success:res=>{
                  wx.cloud.database().collection("INFO").doc(this.data.userinfo.ID).update({
                      data:{
                          Progressing:ilist[res.tapIndex]
                      },
                      success:result=>{
                          console.log("更改进展成功", result)
                          wx.cloud.callFunction({//发送消息
                            name:"msg_send",
                            data: {
                              openid: this.data.openid,
                              theme:"事件状态修改",
                              startTime:"2022-04-22",
                              endTime:"2022-04-22",
                              address:userinfo.locationname
                            },
                            success:res=>{
                              console.log("success",res)
                            },
                            fail:res=>{
                              console.log(res)
                            },
                          })
                      },
                      fail:error=>{
                          console.log("更改进展失败", error)
                      }
                  })
                  this.setData({
                      'userinfo.progressing':ilist[res.tapIndex]
                })
            }
        })
    },
    Like:function(e){
        if(this.data.liketype == false){ // 点赞
            this.setData({
                'userinfo.likes':this.data.userinfo.likes + 1,
                likesrc:"/images/Pri.png",
                likeholder:"TwoHolder",
                liketype:true
            })
        }
        else{ // 取消点赞
            this.setData({
                'userinfo.likes':this.data.userinfo.likes - 1,
                likesrc:"/images/Prino.png",
                likeholder:"OneHolder",
                liketype:false
            })
        }
        wx.cloud.database().collection("INFO").doc(this.data.userinfo.ID).update({
            data:{
                Likes:this.data.userinfo.likes
            },
            success:result=>{
                console.log("修改赞数成功", result)
            },
            fail:error=>{
                console.log("修改赞数失败", error)
            }
        })
    },
    WriteComment:function(e){ // 跳转到写评论的界面
        
        wx.navigateTo({ // 跳转至 "写" 的界面
            url: '/pages/WriteC/WriteC',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        userinfo:app.globalData.userInfo,
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
        var app = getApp()
        wx.cloud.database().collection("UserInfo").where({//更新签名
          openid:this.data.userinfo.openid
        }).get({
          success:res=>{
            app.globalData.userInfo.personalsign=res.data[0].personalsign
            if(app.globalData.userInfo.personalsign==""){
              app.globalData.userInfo.personalsign="这个家伙很懒，什么都没写下..."
            }
            this.setData({
              userinfo:app.globalData.userInfo,
            })
          }
        })

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