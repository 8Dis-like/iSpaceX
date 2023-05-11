// pages/forum/forum.js
const db = wx.cloud.database().collection("INFO")
const dbuser = wx.cloud.database().collection("UserInfo")

var openid2wxnn = Array()
var openid2wxsrc = Array()
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

        isPopping: false,
        animPlus: {},
        animCollect: {},
        animTranspond: {},
        animInput: {},
        animCloud:{},
        aninWrite:{},
        // 以上为动画弹窗所需要的变量
        alltypes:['全部类型', '寻物启事', '寻人启事', '社区闲聊', '管理维修'], // 所有的事件类型
        typechosen:"", //用户需要查找的哪类事件 
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

    AddInfo:function(e){
      this.takeback(); // 收回动画
      this.setData({
          isPopping: true
      })
      wx.navigateTo({ // 跳转至 "写" 的界面
          url: '/pages/Write/Write',
      })
  },


//点击弹出
  plus: function () {
  if (this.data.isPopping) {
    //缩回动画
    this.popp();
    this.setData({
      isPopping: false
    })
  } else if (!this.data.isPopping) {
    //弹出动画
    this.takeback();
    this.setData({
      isPopping: true
    })
  }
  },

//弹出动画
popp: function () {
  //us顺时针旋转
  var animationPlus = wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  })
  var animationcollect = wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  })
  var animationTranspond = wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  })
  var animationInput = wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  })
  var animationCloud = wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  })
  var animationWrite = wx.createAnimation({
    duration: 400,
    timingFunction: 'ease-out'
  })
  animationPlus.rotateZ(180).step();
  animationcollect.translate(-90, -100).rotateZ(180).opacity(1).step();
  animationTranspond.translate(-140, 0).rotateZ(180).opacity(1).step();
  animationInput.translate(-90, 100).rotateZ(180).opacity(1).step();
  animationCloud.translate(0, 135).rotateZ(180).opacity(1).step();
  animationWrite.translate(0, -135).rotateZ(180).opacity(1).step();
  this.setData({
    animPlus: animationPlus.export(),
    animCollect: animationcollect.export(),
    animTranspond: animationTranspond.export(),
    animInput: animationInput.export(),
    animCloud: animationCloud.export(),
    animWrite: animationWrite.export(),
  })
},
  //收回动画
  takeback: function () {
    //us逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationCloud = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    var animationWrite = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    animationCloud.translate(0, 0).rotateZ(0).opacity(0).step();
    animationWrite.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
      animCloud: animationCloud.export(),
      animWrite: animationWrite.export(),
    })
  },

  Search:function(e){
      this.takeback(); // 收回动画
      this.setData({
          isPopping: true
      })
      wx.showActionSheet({
          itemList: this.data.alltypes,
          success: res=>{
            wx.showNavigationBarLoading()
            wx.showToast({
                title: '搜索中',
                icon: 'loading',
                duration: 2000
            });
            console.log(this.data.alltypes[res.tapIndex])
            this.setData({
              typechosen:this.data.alltypes[res.tapIndex],
            })
            if(res.tapIndex == 0){
                this.GetInfo()
            }
            else {
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
              db.where({
                EventType:this.data.typechosen
              }).get({
                  success:res=>{
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
                          })
                      }
                      this.Getwx(0) // 必须写在里面
                      wx.hideNavigationBarLoading()
                  },
                  fail:err=>{
                      console.log(err)
                  }
              })
            }
            setTimeout(function(){
                wx.showToast({
                  title: '搜索成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.hideNavigationBarLoading()
            },2000)
          },
          fail:res=>{
            console.log(res)
          }
      })
  },

    Showdetail:function(e){
        // 传参
        var idx = e.currentTarget.dataset.idx
        var app=getApp()
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
        db.get({
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
                this.Getwx() // 必须写在里面
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
          console.log("here", res)
          for(var index in res.data){
            openid2wxnn[res.data[index].openid] = res.data[index].nickname
            openid2wxsrc[res.data[index].openid] = res.data[index].avatarUrl
          }
        },
        fail:err=>{
          console.log("here", err)
        }
      })
      console.log(openid2wxnn['oo7bN5NUeZB9BvASSh0JtOSU34Wg'])
      console.log(openid2wxsrc)
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