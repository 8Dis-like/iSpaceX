// pages/Write/Write.js

const db = wx.cloud.database().collection("INFO")
//连接到数据库
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:"", // 微信用户openid 唯一标识
        InputInfo:"", // 用户输入的文本信息
        Title:"",
        LocationName:"所在位置",// 用户选的位置名称
        lonti:0.0, // 用户选的位置经度
        lati:0.0, // 用户选的位置纬度
        classname:"LocateDes",
        CheckIcon:"user.png",
        LocaIcon:"Loca.png",
        alltypes:['寻物启事', '寻人启事', '社区闲聊', '管理维修'], // 所有的事件类型
        typeclass:"TypeHolder",
        typechosen:"选择事件类型(必选)", //用户需要选择一个事件类型
        allchecks:["任何人可更改事件进展", "仅我可以更改事件进展"], // 所有的权限类型
        checkchosen:0, // "任何人可更改事件进展"0 or "仅我可以更改事件进展"1
        Imglist:[], // 用户选择的照片
        MP4list:[], // 用户选择的视频
        imgup:[], // 用户选择的照片在云端的路径
        mp4up:[], // 用户选择的照片在云端的路径
        presource:[], // 预览资源
        maxMedia:9, // 最大上传数，保证总上传数不超过9
        showView:true, // 当到达是否最大上传数时，关闭打开图像的接口，否则启用
        Notice:true, // 当用户第一次点击打开图像接口，显示提示窗口
    },

    titleinput:function(e){
      this.setData({
        Title:e.detail.value
      })
    },

    GetInputInfo(e){ // 获取用户输入的文本信息
        this.setData({
            InputInfo: e.detail.value
        })
    },

    GetLocation:function (e) { // 获取用户地理位置
        console.log(e)
        wx.getSetting({ // 拉取用户授权
          withSubscriptions: true,
          success: res=>{
            console.log('res是否开启授权', res)
            if (!res.authSetting['scope.userLocation']){
                wx.authorize({
                    scope: 'scope.userLocation',  
                    success: res=>{
                        wx.chooseLocation({
                            success: res=> {
                                console.log(res)
                                this.ChangeLocaInfo(res.name, res.longitude, res.latitude)
                            },
                            fail:function (error) {
                                console.log(error)
                            }
                          })
                    },
                    fail: res=>{
                        console.log(res)
                        // 注意：这里有坑，详见https://blog.csdn.net/qq_41357391/article/details/102783290?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_aa&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1.pc_relevant_aa&utm_relevant_index=2
                        this.fetchAgainLocation()
                    }
                })
            }
            else{
              // 如果用户第一次取消了授权，那么不会再次自动出现弹窗，需要手写一个弹窗获得用户授权
                wx.chooseLocation({
                    success: res=> {
                        console.log(res)
                        this.ChangeLocaInfo(res.name, res.longitude, res.latitude)
                    },
                    fail:function (error) {
                        console.log(error)
                    }
                  })
            }
        },
          fail:res =>{
            console.log('打开地图选择位置取消', res)
          }
        })
    },

    fetchAgainLocation() {
      
        wx.getSetting({
          success: (res) => {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: (tip) => {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: (data) => {
                        if (data.authSetting["scope.userLocation"] === true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          wx.chooseLocation({
                            success: res => {
                              console.log('打开地图选择确定', res)
                              this.ChangeLocaInfo(res.name, res.longitude, res.latitude)
                            }
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        }
                      },
                      fail: () => {},
                      complete: () => {}
                    });
                  }
                }
              })
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        })
      },

    ChangeLocaInfo:function(LocaName, lonti, lati){ // 用户选择完了地点后改变信息
      this.setData({
        classname:"LocateDes2",
        LocationName:LocaName,
        LocaIcon:"Loca2.png",
        lonti:lonti,
        lati:lati
      })
    },

    OpenMedia(e){ // 打开图片或视频
      if(this.data.Notice){ // 第一次点击，出现提示窗口
        wx.showModal({
          title: '仅作本次提示',
          content: '长按以删除图片或视频',
          success : res=> {
            if (res.confirm) {
              console.log('用户点击确定')
              this.setData({Notice:false})
              this.GetRES()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      else{
        this.GetRES()
      }
  },

  GetRES(){ // 用户选择图片或视频
    wx.chooseMedia({
      count: this.data.maxMedia, // 最大上传数
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      //这个接口如果ios端使用了，就不能规定maxDuration，否则会出错，这个官方错误至今未解决
      //maxDuration: 300, //视频最大时长 单位为秒 注意这个值当直接拍摄的时长不允许超过60s
      camera: 'back',// 用后置摄像头
      success:res=> {
          if(res.type == "image"){ // 图片
            for(var index in res.tempFiles){
                  this.setData({
                      Imglist:this.data.Imglist.concat(res.tempFiles[index].tempFilePath),
                      lastname:'.png'
                  })
            }
            this.Uploadfile('image', 0, res.tempFiles) // 递归上传
          }
          else{ // 视频数据
            for(var index in res.tempFiles){
                this.setData({
                    MP4list:this.data.MP4list.concat(res.tempFiles[index].tempFilePath),
                    lastname:'.mp4'
                })
            }
            this.Uploadfile('video', 0, res.tempFiles) // 递归上传
          }
          this.setData({ // 修改下最大上传数，保证用户只能上传9张照片或视频
             maxMedia:9-this.data.mp4up.length-this.data.imgup.length
          })
          if(this.data.maxMedia == 0){ // 不能再上传了，不再显示添加图像标志
            this.setData({
              showView:false
            })
          }
      }
    })
  },

/**type::image-图片 video-视频 */
  Uploadfile(type, idx, files){ // 将图片和视频上传到云存储中，并记录下返回的云端路径
    if(idx == files.length)return
    var Filepath = files[idx].tempFilePath
    wx.cloud.uploadFile({ // 上传到云端
        cloudPath: Date.now() + this.data.lastname, // 为防止重复，直接取当前时间戳作为文件名
        filePath: Filepath, // 文件路径
        success: res => {
          // get resource ID
          console.log("上传成功", res.fileID)
          if(type == "image"){
            this.setData({
                imgup:this.data.imgup.concat(res.fileID)
            })
          }
          else{
            this.setData({
                mp4up:this.data.mp4up.concat(res.fileID)
            })
          }
          // 递归上传
          this.Uploadfile(type, idx + 1, files)
        },
        fail: err => {}
      })
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
   
  DeleteImg(e){//删除图片 
    console.log(e)
    console.log(e.target.dataset.idx)
    wx.showActionSheet({
      itemList: ['确认删除'],
      success: res=> {
        console.log(res.tapIndex)
        wx.cloud.deleteFile({ // 同时在云端删除
          fileList: [this.data.imgup[e.target.dataset.idx]],
          success: res=>{
              console.log("删除成功")
          },
          fail: res=>{
            console.log(res)
          }
        })
        this.data.Imglist.splice(e.target.dataset.idx, 1)
        this.data.imgup.splice(e.target.dataset.idx, 1)
        this.setData({
          showView:true,
          maxMedia:9-this.data.MP4list.length-this.data.Imglist.length,
          Imglist:this.data.Imglist,
          imgup:this.data.imgup
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  DeleteMP4(e){//删除视频
    console.log(e)
    wx.showActionSheet({
      itemList: ['确认删除'],
      success: res=> {
        console.log(res.tapIndex)
        wx.cloud.deleteFile({ // 同时在云端删除
          fileList: [this.data.mp4up[e.target.dataset.index]],
          success: res=>{
              console.log("删除成功")
          },
          fail: res=>{}
        })
        this.data.mp4up.splice(e.target.dataset.index, 1)
        this.data.MP4list.splice(e.target.dataset.index, 1)
        this.setData({ 
          showView:true,
          maxMedia:9-this.data.MP4list.length-this.data.Imglist.length,
          MP4list:this.data.MP4list
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },

  GetTypechosen(e){ // 获取用户输入的事件类型
     this.setData({
        typechosen:e.detail.value
     })
  },

  Upload(e){ // 上传所有数据
    //获取上传时间
    var date = new Date()
    var utils=require("../../utils/util.js")


    if(this.data.typechosen == "选择事件类型(必选)"){
      wx.showToast({
        title: '未选择事件类型',
        icon:'error',
        duration:1500
      })
      return
    }
    if(this.data.LocationName == "所在位置"){
      wx.showToast({
        title: '未选择位置',
        icon:'error',
        duration:1500
      })
      return
    }
    db.add({ // 将数据写入云端数据库中
        data:{
            Openid: this.data.openid, // 微信用户唯一标识符openid
            LocationName: this.data.LocationName, // 地址
            Latitude: this.data.lati,
            Lontitude:this.data.lonti,
            EventType: this.data.typechosen, // 事件类型
            checkType:this.data.checkchosen,// 是0否1允许别人更改事件进展
            Content: this.data.InputInfo, // 用户输入的描述信息
            imgpath: this.data.imgup, // 用户上传图片在云储存中的路径,是个列表
            mp4path: this.data.mp4up, // 用户上传视频在云储存中的路径,是个列表
            //没有就为空
            Likes:0, // 点赞数
            Progressing:"尚无进展",
            Comment:[],
            Title:this.data.Title,
            Date:utils.formatTime(date), // 获取当前时间
        },
        success: res=> {
            wx.navigateBack({ // 跳回上层页面
              delta: 1,
              success: res=>{
                wx.showToast({ // 提示弹窗
                  title: '成功发布',
                  icon:'success',
                  duration:2000
                })
              }
            })
        },
        fail: res=>{}
    })
  },

  ChooseType(e){ // 选择事件类型
    wx.showActionSheet({
      itemList: this.data.alltypes,
      success: res=>{
        console.log(this.data.alltypes[res.tapIndex])
        this.setData({
          typechosen:this.data.alltypes[res.tapIndex],
          typeclass:"TypeHolder2"
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },

  GetCheckchosen(e){ // 选择更改事件进展权限设置
    wx.showActionSheet({
      itemList: this.data.allchecks,
      success: res=>{
        console.log(this.data.alltypes[res.tapIndex])
        this.setData({
          checkchosen:res.tapIndex,
          CheckIcon:res.tapIndex ? "userno.png" : "user.png"
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //在渲染完页面后自动获取用户openid
      wx.cloud.callFunction({ // 用事先写好的云函数套取用户openid 
        name:"getid",
        success: res=> {
            this.setData({
                openid: res.result.openid
            })
        },
        fail: res=>{}
      })
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