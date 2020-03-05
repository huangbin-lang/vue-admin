import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import routerEach from "@/router/routerEach";
import ElementUI from 'element-ui';
import VuecompositionApi from "@vue/composition-api";
import 'element-ui/lib/theme-chalk/index.css';
import "./icons";


Vue.use(VuecompositionApi)
Vue.use(ElementUI)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
