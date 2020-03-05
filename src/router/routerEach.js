import router from "./index";
import store from "@/store/index";
import { getToken, removeToken, removeUserName } from "@/utils/app.js";

/**
 * 导航守卫
 * 
 * 必须要调用next方法 才能执行
 * to: 去的页面 (不带参数 不会 发生 死循环)
 * from: 上一次的页面
 */
const whiterouter = ['/login'];

router.beforeEach((to, from, next) => {
  if (getToken()) {
    console.log(to)
    // 进入到了index 之后在 地址栏中输入 .login 就清除 token 和 username
    if (to.path === '/login') {
      removeUserName()
      removeToken()
      //清空store里面存的 token 和 username
      store.commit("app/SET_TOKEN", "")
      store.commit("app/SET_USETNAME", "")
      next()
    } else {
      next()
    }
    console.log('存在')
  } else {
    console.log('不存在')
    if (whiterouter.indexOf(to.path) !== -1) { //存在
      next()
    } else {
      next('/login')
    }
  }
})
/**
 * 代码走向
 * 假如进入的是 /index 就会判断 whiterouter.indexOf(to.path) !== -1  这里不匹配
 * 就会执行 next('/login') 之后 在走到 whiterouter.indexOf(to.path) !== -1 匹配 则调转到login
 */