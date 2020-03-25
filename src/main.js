import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import routerEach from "@/router/routerEach";
import ElementUI from 'element-ui';
import VuecompositionApi from "@vue/composition-api";
import 'element-ui/lib/theme-chalk/index.css';
import "./icons";
import confirm from "@/utils/global.js"
//引用编辑器 需要依赖 npm install tinymce -S
// import Tinymce from "tinymce";


Vue.use(confirm)
Vue.use(VuecompositionApi)
Vue.use(ElementUI)
Vue.config.productionTip = false;
// Vue.prototype.$tinymce = Tinymce;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
