// pages/map/map.ts   由ChatGPT转换
Page({
  data: {
  index: 0,
  destination: '',
  markers: [] as Array<any>,
  latitude: 0.0,
  longitude: 0.0,
  address: [] as Array<any>,
  },
  
  onLoad() {
  const that = this;
  wx.getLocation({
  type: 'gcj02',
  success(res: any) {
  that.setData({ // 更新经纬度
  latitude: res.latitude,
  longitude: res.longitude
  });
  },
  });
  },
  
  // markers点击事件
  markertap(e: any) {
  const id = e.detail.markerId;
  const markers = this.data.markers;
  for (let i = 0; i < markers.length; i++) {
  if (markers[i].id === id) {
  markers[i].iconPath = "/images/icon/address_selected.png";
  } else {
  markers[i].iconPath = "/images/icon/address.png";
  }
  }
  this.setData({
  markers,
  index: id
  });
  },
  
  //导航按钮
  nav(e: any) {
  const plugin = requirePlugin('routePlan');
  const key = 'I5UBZ-VEAK4-SEPUZ-DBRNI-2YSOH-RGFOO'; //使用在腾讯位置服务申请的key
  const referer = 'iShare@iCare'; //调用插件的app的名称
  const endPoint = JSON.stringify({ //终点
  'name': this.data.address[this.data.index].title,
  'latitude': this.data.markers[this.data.index].latitude,
  'longitude': this.data.markers[this.data.index].longitude
  });
  wx.navigateTo({
  url: plugin://routePlan/index?key=${key}&referer=${referer}&endPoint=${endPoint}&themeColor=#ffcc66&navigation=1,
  });
  },
  
  //获取终点信息
  destination(e: any) {
  this.setData({
  destination: e.detail.value //获取当前输入信息
  });
  if (this.data.destination !== '') {
  wx.request({
  url: https://apis.map.qq.com/ws/place/v1/search?keyword=${this.data.destination}&boundary=nearby(${this.data.latitude},${this.data.longitude},1000)&key=I5UBZ-VEAK4-SEPUZ-DBRNI-2YSOH-RGFOO,
  success: (res: any) => {
  console.log(this.data.destination);
  const arr = res.data.data;
  console.log(arr);
  const markers = [];
  const address = [];
  console.log(arr.length);
  for (let i = 0; i < arr.length; i++) {
  markers.push({
  iconPath: "/images/icon/address.png",
  id: i,
  latitude: arr[i].location.lat,
  longitude: arr[i].location.lng,
  width: 32,
  height: 32
  });
  address.push({
  title: arr[i].title,
  address: arr[i].address
  });
  }
  markers[0].iconPath = "/images/icon/address_selected.png"; //将第一位设置为选中
  this.setData({
  markers,
  address
  });
  }
  });
  }
  }
  });