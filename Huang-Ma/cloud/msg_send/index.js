// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

//msg_send函数入口
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": event.openid,
        "page": 'login',
        "lang": 'zh_CN',
        "data": {
          thing1: {value: event.theme},
          date2: {value: event.startTime},
          date3: {value: event.endTime},
          thing4: {value: event.address}
        },
        "templateId": 'B43Xy25SJfhebP1MNaxnbqxy0opbYULjxhAlrMAAkww',
        "miniprogramState": 'developer'
      })
    return result
  } catch (err) {return err}}