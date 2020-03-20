/**
 * 获取验证码
 */
import service from "@/utils/request.js";
// 将数据返回,就能在index.vue中的getsms方法中获取到
export function GetSms(data) {
  return service.request({
    method: "post",
    url: "/getSms/",
    data
    // 左边的data是后台接收的,右边的时data时接收的参数,相同可以只写一个data,这是es6的写法
  })
}

/**
 * 获取用户角色
 */

/**
 * 登陆
 */
export function Login(data) {
  return service.request({
    method: "post",
    url: "/login/",
    data
  })
}

/**
 * 注册
 */
export function Register(data) {
  return service.request({
    method: "post",
    url: "/register/",
    data
  })
}