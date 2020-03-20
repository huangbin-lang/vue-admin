import Vue from "vue";
import Vuex from "vuex";
import Cookie from "cookie_js";
import app from "./app";
import login from "./login";
import common from "./common";
Vue.use(Vuex);

export default new Vuex.Store({
  // /**
  //  * 临时
  //  * sessionStorage： 关闭浏览器之后会把存储的值清掉
  //  * 长久
  //  * localStorage：关闭浏览器存储的值也会存在,必须手动清理
  //  * 
  //  * cookie: 有的开发请求头需要用到
  //  * token、username
  //  * 
  //  * 无论key还是value都需要用""引起来
  //  * JSON.parse: {"name":"xxxxxx","title":"xxxxxx"} 转为 json对象
  //  * JSON.stringify：转成字符串
  //  */
  // state: {
  //   // 获取本地存储
  //   isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
  //   // isCollapse: Cookie.get("isCollapse") || false,
  // },
  // mutations: {  //修改state中的值   必须的  同步  不需要回调处理事情
  //   // 这是header调用的方法
  //   SET_ISCOLLAPSE(state) {
  //     state.isCollapse = !state.isCollapse
  //     // 用cookie的方式存储  需要依赖 npm install cookie_js --save
  //     // Cookie.set("isCollapse", JSON.stringify(state.isCollapse))
  //     // html5 设置本地存储
  //     sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse))
  //   }
  // },
  // getters: {   //相当于computed    计算属性

  // },
  // actions: {  //做异步操作的
  //   /**
  //    * 同步操作：定义一个方法 调用 mutations 里面的方法 
  //    * 
  //    * content 指向 getters  mutations  state
  //    * content.getters
  //    */
  //   // setMenuStatus(content,data) {
  //   //   // content.commit("SET_ISCOLLAPSE")  也可以这样调用mutations修改state中的值
  //   // }
  //   loGin(content, data) {    //通过 root.$store.dispatch
  //     return new Promise((resolve, reject) => {
  //       Login(data).then(response => {
  //         resolve(response)
  //       }).catch(error => {
  //         reject(error)
  //       })
  //     })
  //   }
  // },
  /**
   * 模块化
   */
  modules: {
    app,
    login,
    common
  }
});
