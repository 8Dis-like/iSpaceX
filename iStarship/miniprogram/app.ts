// app.ts
App<IAppOption>({
  
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch() {
    //云开发环境初始化
    wx.cloud.init({env:"cloud1-0g77urib208cb8d9"})
      },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  globalData: { 
    userInfo:{ID:"", openid:"", wxnn:"", wxsrc:"", locationname:"", eventype:"", checktype:0,imgurl:[],mp4url:[], title:"", content:"", likes:0 , date:"", progressing:"", comment:[], personalsign:"这个家伙很懒，什么都没写下...",latitude:"",longitude:""},
    loger:{openid:"", wxnn:"", wxsrc:"",personalsign:"",backimg:"",country:"",province:"",city:"",gender:"",job:"",phone:"",vitalphone:"",id:"",name:""},},
    })
