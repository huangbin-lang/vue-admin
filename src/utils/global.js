/**
 *单独但如element-ui的一个方法
 *还需要在main.js中 进行全局注入 
 */
import { MessageBox } from 'element-ui';
export default {
  install(Vue, options) {
    Vue.prototype.confirm = (params) => {
      MessageBox.confirm(params.content, params.tip || '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // icon类型
        type: params.type||"warning",
        // 居中
        center: true
      }).then(() => {
        params.fn && params.fn(params.id)
        // if(params.fn) {
        //   params.fn()
        // }
      }).catch(() => {
        // root.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      })
    }
  }
}