import Vue from "vue";
import SvgIcon from "./svgIcon"
// 自定义全局组件
Vue.component('svg-icon', SvgIcon);

/**
 * require.context：读取指定目录的所有文件
 * 第一个参数是目录
 * 第二个参数是：是否遍历
 * 第三个参数是：定义遍历文件规则
 * 
 * requireContext.keys() 所有已.svg为结尾的文件
 */
const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext);
}
requireAll(req);