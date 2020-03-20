/**
 *单独但如element-ui的一个方法
 *还需要在main.js中 进行全局注入 
 *可以监听到数据的变化,从来拿来使用,返回到页面所需要的地方使用
 */
import { MessageBox } from 'element-ui';
import { ref } from "@vue/composition-api";
export function global() {
  const str = ref('');
  const confirm = (params) => {
    MessageBox.confirm(params.content, params.tip || '提示', {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      // icon类型
      type: params.type || "warning",
      // 居中
      center: true
    }).then(() => {
      str.value = params.id || '';
      params.thenfn && params.thenfn(params.id || '')
    }).catch(() => {
      params.catchfn && params.catchfn()
    })
  }
  return {
    str,
    confirm
  }
}