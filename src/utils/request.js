/**
 * 点击login请求,就会来到api中的login,在来到utils中的request中对应的拦截器
 * 
 * 放拦截器的文件
 */
import axios from "axios"
import { Message } from "element-ui";
import { getToken, getUsername } from "@/utils/app.js"

/**
 * 这是浏览器中network中的请求：Request URL: http://localhost:8066/devapi/getSms/
 * 跨域时会遇到 /api 而 /api 会被替换成 http://www.web-jshtml.cn/productapi
 * 而/devapi 如果config.js文件中设置为空 那么就不会替换什么 如果设置了值 就会再http://www.web-jshtml.cn/productapi 添加上设置的值
 */
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devapi'

const service = axios.create({
  baseURL: BASEURL,
  timeout: 10000
});

// 必须重启项目才能打印出来
// console.log(process.env.VUE_APP_ABC)

/**
 * 每次请求接口都会拦截一次,都会同意添加一些东西
 * 根据业务需求添加东西
 * ['Tokey'] : 后台给的 key
 */
// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在请求发出前做申明
  config.headers['Tokey'] = getToken()
  config.headers['UserName'] = getUsername()
  return config
}), function (error) {
  // 对请求出错做什么
  return Promise.reject(error)
}

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let data = response.data
  if (data.resCode !== 0) {
    Message.error(data.message)
    // 还要将promise返回到了login.js中 而 login.js 又将数据返回到  index.vue中的getsms方法中
    return Promise.reject(data)
  } else {
    return response
  }
}), function (error) {
  // 响应错误做什么
  return Promise.reject(error)
}

export default service;